import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { anonClient, serviceClient, isDemoId, siteUrl } from '@/lib/cards/server';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Body = {
  page_id?: string;
  kind?: 'lead' | 'feedback';
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  rating?: number;
};

// Contact exchange / private feedback from a customer's page. The database decides
// whether the page's plan allows it; the email to the owner is best effort.
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { page_id, kind = 'lead', name = '', email = '', phone = '', note = '', rating } = body;
  if (!page_id || isDemoId(page_id)) return NextResponse.json({ ok: true });

  const supabase = anonClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 500 });

  const { data: ok, error } = await supabase.rpc('submit_card_lead', {
    p_page: page_id,
    p_kind: kind,
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_note: note,
    p_rating: typeof rating === 'number' ? rating : null,
  });
  if (error || !ok) return NextResponse.json({ ok: false }, { status: 400 });

  await notifyOwner(page_id, { kind, name, email, phone, note, rating });
  return NextResponse.json({ ok: true });
}

async function notifyOwner(pageId: string, lead: Required<Omit<Body, 'page_id' | 'rating'>> & { rating?: number }) {
  const apiKey = process.env.RESEND_API_KEY;
  const admin = serviceClient();
  if (!apiKey || !admin) {
    console.warn('Card lead email skipped: RESEND_API_KEY or SUPABASE_SERVICE_ROLE_KEY is not set');
    return;
  }
  const { data: page } = await admin
    .from('card_pages')
    .select('display_name, owner_id, lead_notify_email')
    .eq('id', pageId)
    .single();
  if (!page) return;

  let to = page.lead_notify_email as string | null;
  if (!to) {
    const { data } = await admin.auth.admin.getUserById(page.owner_id);
    to = data.user?.email ?? null;
  }
  if (!to) return;

  const e = escapeHtml;
  const feedback = lead.kind === 'feedback';
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${value}</td></tr>`
      : '';
  const subject = feedback
    ? `Private feedback (${lead.rating ?? '?'}★) from your tap card`
    : `New contact from your tap card: ${lead.name || lead.email || lead.phone}`;
  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px">
  <h2 style="margin:0 0 4px">${feedback ? 'Someone left private feedback' : 'Someone shared their contact with you'}</h2>
  <p style="margin:0 0 16px;color:#6b6b6b">From your page: ${e(page.display_name)}</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row('Rating', lead.rating ? '★'.repeat(lead.rating) : '')}
    ${row('Name', e(lead.name))}
    ${row('Phone', lead.phone ? `<a href="tel:${e(lead.phone.replace(/[^\d+]/g, ''))}">${e(lead.phone)}</a>` : '')}
    ${row('Email', lead.email ? `<a href="mailto:${e(lead.email)}">${e(lead.email)}</a>` : '')}
    ${row(feedback ? 'Feedback' : 'Message', e(lead.note).replace(/\n/g, '<br>'))}
  </table>
  <p style="margin:20px 0 0"><a href="${siteUrl()}/card/edit?tab=leads" style="background:#0e0e10;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600">See all contacts</a></p>
  <p style="margin:24px 0 0;color:#8c8c91;font-size:12px">Sent by N°1 Tap Cards · number1digitalmarketing.com</p>
</div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CARD_EMAIL_FROM || 'N°1 Tap Cards <cards@number1digitalmarketing.com>',
      to,
      replyTo: lead.email || undefined,
      subject,
      html,
    });
    if (error) console.error('Card lead email error:', error);
  } catch (err) {
    console.error('Card lead email error:', err);
  }
}
