import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { serviceClient } from '@/lib/cards/server';
import { CAMPAIGN_TYPES, FOLLOWER_RANGES, NICHES } from '@/content/creators/plans';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (val: string) =>
  val.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

type Application = {
  full_name: string;
  email: string;
  instagram: string;
  tiktok: string;
  followers: string;
  niche: string;
  campaign_types: string[];
  rate: string;
  location: string;
  links: string;
  about: string;
  locale: string;
};

// Emails the owner when a creator applies. Skipped unless RESEND_API_KEY and
// LEAD_ALERT_EMAIL are set; failures are logged but never fail the application.
async function sendApplicationAlert(app: Application) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ALERT_EMAIL;
  if (!apiKey || !to) {
    console.warn(`Creator alert email skipped: ${!apiKey ? 'RESEND_API_KEY' : 'LEAD_ALERT_EMAIL'} is not set`);
    return;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const e = escapeHtml;
  const followers = FOLLOWER_RANGES[app.followers as keyof typeof FOLLOWER_RANGES] ?? app.followers;
  const niche = NICHES[app.niche as keyof typeof NICHES] ?? app.niche;
  const types = app.campaign_types.map((t) => CAMPAIGN_TYPES[t as keyof typeof CAMPAIGN_TYPES] ?? t).join(', ');
  const handles = [app.instagram && `IG ${app.instagram}`, app.tiktok && `TikTok ${app.tiktok}`].filter(Boolean).join(' · ');
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${value}</td></tr>`;

  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px">
  <h2 style="margin:0 0 4px">New creator application: ${e(app.full_name)}</h2>
  <p style="margin:0 0 16px;color:#6b6b6b">${e(niche)} · ${e(followers)} followers · ${e(app.location || '—')}</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row('Email', `<a href="mailto:${e(app.email)}">${e(app.email)}</a>`)}
    ${row('Handles', e(handles))}
    ${row('Campaigns', e(types || '—'))}
    ${row('Rate / video', e(app.rate || '—'))}
    ${row('Video links', e(app.links).replace(/\n/g, '<br>'))}
    ${row('About', e(app.about || '—'))}
  </table>
  <p style="margin:20px 0 0"><a href="${site}/en/admin?tab=creators" style="background:#0e0e10;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600">Review in Admin</a></p>
</div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.LEAD_ALERT_FROM || 'Number 1 Leads <onboarding@resend.dev>',
      to,
      replyTo: app.email,
      subject: `🎬 Creator application: ${app.full_name} (${niche}, ${followers})`,
      html,
      text: [
        `New creator application: ${app.full_name}`,
        `Email: ${app.email}`, `Handles: ${handles}`, `Followers: ${followers}`, `Niche: ${niche}`,
        `Campaigns: ${types || '—'}`, `Rate: ${app.rate || '—'}`, `Links: ${app.links}`,
        `Review: ${site}/en/admin?tab=creators`,
      ].join('\n'),
    });
    if (error) console.error('Creator alert email error:', error);
  } catch (err) {
    console.error('Creator alert email error:', err);
  }
}

// Creator application from the /creators page. Saved for review in the admin Creators tab.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  // Hidden field people never see; bots fill it in. Pretend it worked.
  if (typeof body.company === 'string' && body.company.trim()) return NextResponse.json({ ok: true });

  const str = (k: string, max = 200) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '');
  const handle = (k: string) => {
    const v = str(k, 100);
    return v && !v.startsWith('@') && !v.includes('/') ? `@${v}` : v;
  };
  const types = Array.isArray(body.campaignTypes)
    ? body.campaignTypes.filter((t): t is string => typeof t === 'string' && t in CAMPAIGN_TYPES)
    : [];

  const app: Application = {
    full_name: str('fullName'),
    email: str('email').toLowerCase(),
    instagram: handle('instagram'),
    tiktok: handle('tiktok'),
    followers: str('followers', 20),
    niche: str('niche', 20),
    campaign_types: Array.from(new Set(types)),
    rate: str('rate', 60),
    location: str('location'),
    links: str('links', 2000),
    about: str('about', 2000),
    locale: ['en', 'es', 'pt'].includes(str('locale', 5)) ? str('locale', 5) : 'en',
  };

  if (!app.full_name || !EMAIL_RE.test(app.email)) {
    return NextResponse.json({ error: 'missingContact' }, { status: 400 });
  }
  if (!app.instagram && !app.tiktok) return NextResponse.json({ error: 'missingHandle' }, { status: 400 });
  if (!(app.followers in FOLLOWER_RANGES) || !(app.niche in NICHES) || !app.campaign_types.length || !app.links) {
    return NextResponse.json({ error: 'missingDetails' }, { status: 400 });
  }
  if (body.consent !== true) return NextResponse.json({ error: 'missingConsent' }, { status: 400 });

  const db = serviceClient();
  if (!db) {
    console.error('Creators: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }

  // One open application per email: a second submit while we're reviewing is a no-op.
  const { data: pending } = await db
    .from('creator_applications')
    .select('id')
    .ilike('email', app.email.replace(/[\\%_]/g, '\\$&'))
    .eq('status', 'new')
    .limit(1);
  if (pending?.length) return NextResponse.json({ ok: true, duplicate: true });

  const { error } = await db.from('creator_applications').insert(app);
  if (error) {
    console.error('Creators: could not save application:', error);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }

  await sendApplicationAlert(app);
  return NextResponse.json({ ok: true });
}
