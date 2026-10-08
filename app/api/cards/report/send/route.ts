import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { serviceClient, siteUrl, userClient } from '@/lib/cards/server';
import { buildReport, monthToDate } from '@/lib/cards/report';
import { REPORT_COLUMNS, loadCounts, ownerEmail, sendReport, type ReportRow } from '@/lib/cards/reportSend';

export const dynamic = 'force-dynamic';

// "Email me my stats now" in the Stats tab: this month so far, sent to the page's
// usual address (never one from the request). Only the page's owner or an admin
// can see the row through RLS, so that read is the permission check.
export async function POST(req: Request) {
  const user = userClient(req);
  const admin = serviceClient();
  const apiKey = process.env.RESEND_API_KEY;
  if (!user) return NextResponse.json({ error: 'Sign in first' }, { status: 401 });
  if (!admin || !apiKey) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

  let pageId = '';
  try {
    pageId = String((await req.json()).page_id ?? '');
  } catch {}
  const { data: mine } = await user.from('card_pages').select('id').eq('id', pageId).maybeSingle();
  if (!mine) return NextResponse.json({ error: 'Not your page' }, { status: 403 });

  const { data } = await admin.from('card_pages').select(REPORT_COLUMNS).eq('id', pageId).single();
  const page = data as ReportRow | null;
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const period = monthToDate(new Date());
  const counts = (await loadCounts(admin, [page], period)).get(page.id)!;
  const to = await ownerEmail(admin, page);
  if (!to) return NextResponse.json({ error: 'No email on this page' }, { status: 400 });
  const ok = await sendReport(new Resend(apiKey), to, buildReport({ page, period, ...counts, site: siteUrl() }));
  return ok ? NextResponse.json({ sent: true, to }) : NextResponse.json({ error: 'Couldn’t send' }, { status: 502 });
}
