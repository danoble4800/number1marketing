import { NextRequest, NextResponse } from 'next/server';
import { serviceClient, siteUrl } from '@/lib/cards/server';

export const dynamic = 'force-dynamic';

// Unsubscribe link in the stats email (?p=<page id>&t=<report_token>). GET shows a
// confirm button so link scanners in mail apps can't unsubscribe anyone by opening it;
// POST turns the email off (also what Gmail's one-click "Unsubscribe" sends).

const UUID = /^[0-9a-f-]{36}$/i;

function page(body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stats email</title></head>
<body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#fafafa;color:#111;margin:0;padding:64px 16px">
<div style="max-width:420px;margin:0 auto;background:#fff;border:1px solid #e7e7ea;border-radius:16px;padding:28px">${body}</div>
</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

const settings = () => `<a href="${siteUrl()}/card/edit?tab=stats" style="color:#111">Change it in your Stats tab</a>`;

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get('p') ?? '';
  const t = req.nextUrl.searchParams.get('t') ?? '';
  if (!UUID.test(p) || !UUID.test(t)) return page('<p>This link isn’t valid.</p>');
  return page(`
<h2 style="margin:0 0 8px;font-size:20px">Stop your stats email?</h2>
<p style="margin:0 0 20px;color:#55555a">You won’t get your tap card numbers by email anymore. They stay in your Stats tab.</p>
<form method="post"><button style="background:#0e0e10;color:#fff;border:0;padding:11px 18px;border-radius:999px;font-weight:600;font-size:15px;cursor:pointer">Unsubscribe</button></form>
<p style="margin:20px 0 0;font-size:14px;color:#55555a">Want it less often instead? ${settings()}.</p>`);
}

export async function POST(req: NextRequest) {
  const p = req.nextUrl.searchParams.get('p') ?? '';
  const t = req.nextUrl.searchParams.get('t') ?? '';
  const admin = serviceClient();
  if (!UUID.test(p) || !UUID.test(t) || !admin) return page('<p>This link isn’t valid.</p>');
  const { data, error } = await admin
    .from('card_pages')
    .update({ report_frequency: 'off' })
    .eq('id', p)
    .eq('report_token', t)
    .select('id');
  if (error || !data?.length) return page('<p>This link isn’t valid.</p>');
  return page(`
<h2 style="margin:0 0 8px;font-size:20px">You’re unsubscribed</h2>
<p style="margin:0;color:#55555a">No more stats emails for this page. ${settings()} to turn them back on.</p>`);
}
