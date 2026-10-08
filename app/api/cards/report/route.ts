import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { SupabaseClient } from '@supabase/supabase-js';
import { serviceClient, siteUrl } from '@/lib/cards/server';
import { buildReport, dueFrequencies, hasActivity, nyDate, reportPeriod } from '@/lib/cards/report';
import { REPORT_COLUMNS, loadCounts, ownerEmail, sendReport, type ReportRow } from '@/lib/cards/reportSend';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Stats email to tap-card owners. Vercel Cron calls this every morning (see vercel.json)
// with "Authorization: Bearer $CRON_SECRET"; weekly reports go out on Mondays, monthly
// ones on the 1st. Pages with no taps, views or clicks in the period get nothing.
//   ?dry=1                  count who would get one, send nothing
//   ?date=2026-11-01        pretend it's that New York day
//   ?page=<slug>&to=<email> send one test report now, whatever the day or activity
//                           (&freq=weekly|monthly picks the period; default: the page's setting)

const CHUNK = 200;
// A retry or second run the same day never re-sends.
const RESEND_GAP_MS = 2 * 86400000;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('Card report: CRON_SECRET is not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = serviceClient();
  const apiKey = process.env.RESEND_API_KEY;
  if (!admin || !apiKey) {
    console.error('Card report: SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }
  const q = req.nextUrl.searchParams;
  const dry = q.get('dry') === '1';
  const today = q.get('date') || nyDate(new Date());
  const resend = new Resend(apiKey);

  const testSlug = q.get('page');
  if (testSlug) return sendTest(admin, resend, testSlug, q.get('to'), q.get('freq'), today, dry);

  const due = dueFrequencies(today);
  if (!due.length) return NextResponse.json({ sent: 0, reason: `No reports due on ${today}` });

  const result = { sent: 0, quiet: 0, skipped: 0, errors: 0 };
  for (const freq of due as ('weekly' | 'monthly')[]) {
    const period = reportPeriod(freq, today);
    for (let from = 0; ; from += CHUNK) {
      const { data, error } = await admin
        .from('card_pages')
        .select(REPORT_COLUMNS)
        .eq('published', true)
        .eq('report_frequency', freq)
        .order('created_at')
        .range(from, from + CHUNK - 1);
      if (error) {
        console.error('Card report: page load failed', error);
        return NextResponse.json({ ...result, error: 'Page load failed' }, { status: 500 });
      }
      const pages = (data ?? []) as ReportRow[];
      if (!pages.length) break;

      const fresh = pages.filter((p) => !p.report_sent_at || Date.now() - Date.parse(p.report_sent_at) > RESEND_GAP_MS);
      result.skipped += pages.length - fresh.length;
      const counts = await loadCounts(admin, fresh, period);

      for (const page of fresh) {
        const c = counts.get(page.id)!;
        if (!hasActivity(c.now)) { result.quiet++; continue; }
        if (dry) { result.sent++; continue; }
        const to = await ownerEmail(admin, page);
        if (!to) { result.skipped++; continue; }
        const ok = await sendReport(resend, to, buildReport({ page, period, ...c, site: siteUrl() }));
        if (ok) {
          result.sent++;
          await admin.from('card_pages').update({ report_sent_at: new Date().toISOString() }).eq('id', page.id);
        } else {
          result.errors++;
        }
      }
      if (pages.length < CHUNK) break;
    }
  }
  console.log('Card report:', today, due, result);
  return NextResponse.json({ date: today, due, dry, ...result });
}

async function sendTest(
  admin: SupabaseClient, resend: Resend, slug: string, to: string | null, freq: string | null, today: string, dry: boolean,
) {
  const { data } = await admin.from('card_pages').select(REPORT_COLUMNS).eq('slug', slug.toLowerCase()).maybeSingle();
  const page = data as ReportRow | null;
  if (!page) return NextResponse.json({ error: `No page /c/${slug}` }, { status: 404 });
  const f = freq === 'weekly' || freq === 'monthly' ? freq : page.report_frequency === 'weekly' ? 'weekly' : 'monthly';
  const period = reportPeriod(f, today);
  const c = (await loadCounts(admin, [page], period)).get(page.id)!;
  const report = buildReport({ page: { ...page, report_frequency: f }, period, ...c, site: siteUrl() });
  if (dry) return NextResponse.json({ dry: true, period: period.label, ...report });
  const recipient = to || (await ownerEmail(admin, page));
  if (!recipient) return NextResponse.json({ error: 'No email for this page' }, { status: 400 });
  const ok = await sendReport(resend, recipient, { ...report, subject: `[Test] ${report.subject}` });
  return NextResponse.json({ sent: ok, to: recipient, period: period.label, subject: report.subject });
}
