import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DIGEST_TAB, getSheets, isOpenStatus, loadLeads, nowInNewYork, todayInNewYork, type Lead } from '@/lib/crmSheets';
import { showDate, showPhone, tidy } from '@/lib/crmFormat';

export const dynamic = 'force-dynamic';

// Morning follow-up digest. Vercel Cron calls this once a day (see vercel.json) with
// "Authorization: Bearer $CRON_SECRET". It emails the list through Resend. With
// TEXT_VIA_SHEET on, it also adds a row to the Daily Digest tab of the leads sheet for a
// Zapier "new row → SMS by Zapier" Zap to text to your phone.
// Nothing is sent on days with nothing due. Add ?dry=1 to preview without sending.

// Texts are off for now; flip this once the Zapier Zap is set up.
const TEXT_VIA_SHEET = false;

const MAX_NAMES_IN_TEXT = 4;

const label = (l: Lead) => tidy(l.business || l.name || 'No name');

function textList(title: string, leads: Lead[]) {
  if (!leads.length) return [];
  const names = leads.slice(0, MAX_NAMES_IN_TEXT).map(label);
  const more = leads.length > MAX_NAMES_IN_TEXT ? ` +${leads.length - MAX_NAMES_IN_TEXT} more` : '';
  return [`${title} (${leads.length}): ${names.join(', ')}${more}`];
}

function escapeHtml(val: string): string {
  return val.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function emailSection(title: string, color: string, leads: Lead[]) {
  if (!leads.length) return '';
  const e = escapeHtml;
  const rows = leads.map((l) => {
    const who = [l.business ? tidy(l.name) : '', l.origin].filter(Boolean).join(' · ');
    const contact = [
      l.phone && `<a href="tel:${e(l.phone.replace(/[^\d+]/g, ''))}" style="color:#111">${e(showPhone(l.phone))}</a>`,
      l.email && `<a href="mailto:${e(l.email)}" style="color:#111">${e(l.email)}</a>`,
    ].filter(Boolean).join(' · ') || '<span style="color:#b42318">No phone or email</span>';
    const last = l.lastContacted ? `Last contacted ${e(showDate(l.lastContacted))}` : 'Not contacted yet';
    return `<tr><td style="padding:10px 0;border-top:1px solid #eee">
      <div style="font-weight:600;color:#111">${e(label(l))}</div>
      <div style="color:#6b6b6b;font-size:13px">${e(who)}</div>
      <div style="font-size:14px;margin-top:2px">${contact}</div>
      <div style="color:#6b6b6b;font-size:13px">${last}${l.nextFollowUp ? ` · follow-up ${e(showDate(l.nextFollowUp))}` : ''}</div>
    </td></tr>`;
  }).join('');
  return `<h3 style="margin:24px 0 4px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${color}">${title} (${leads.length})</h3>
    <table style="border-collapse:collapse;width:100%">${rows}</table>`;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('Digest: CRON_SECRET is not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const dry = req.nextUrl.searchParams.get('dry') === '1';

  const { leads, errors } = await loadLeads();
  const today = todayInNewYork();
  const open = leads.filter((l) => l.source !== 'client' && isOpenStatus(l.status));
  const byDate = (a: Lead, b: Lead) => a.nextFollowUp.localeCompare(b.nextFollowUp);
  const overdue = open.filter((l) => l.nextFollowUp && l.nextFollowUp < today).sort(byDate);
  const dueToday = open.filter((l) => l.nextFollowUp === today);
  const fresh = open.filter((l) => l.status === 'New' && (!l.nextFollowUp || l.nextFollowUp > today));

  if (!overdue.length && !dueToday.length && !fresh.length) {
    console.log('Digest: nothing due today, nothing sent');
    return NextResponse.json({ sent: false, reason: 'Nothing due', errors });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const crmUrl = `${siteUrl}/en/admin`;
  const day = showDate(today);
  const total = overdue.length + dueToday.length;

  const text = [
    `N°1 follow-ups · ${day}`,
    ...textList('Overdue', overdue),
    ...textList('Due today', dueToday),
    ...textList('New, not contacted', fresh),
    crmUrl.replace(/^https?:\/\//, ''),
  ].join('\n');

  const subject = total
    ? `${total} follow-up${total === 1 ? '' : 's'} due today${overdue.length ? ` (${overdue.length} overdue)` : ''}`
    : `${fresh.length} new lead${fresh.length === 1 ? '' : 's'} to contact`;

  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px">
  <p style="margin:0;color:#6b6b6b;font-size:13px;letter-spacing:1px;text-transform:uppercase">N°1 morning digest · ${escapeHtml(day)}</p>
  <h2 style="margin:4px 0 0">${escapeHtml(subject)}</h2>
  ${emailSection('Overdue', '#b42318', overdue)}
  ${emailSection('Due today', '#9a6700', dueToday)}
  ${emailSection('New, not contacted yet', '#111', fresh)}
  <p style="margin:24px 0 0"><a href="${crmUrl}" style="background:#0e0e10;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600">Open the CRM</a></p>
</div>`;

  if (dry) return NextResponse.json({ dry: true, subject, text, html, errors });

  const result = { email: 'skipped', text: 'skipped' };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ALERT_EMAIL;
  if (apiKey && to) {
    try {
      const { error } = await new Resend(apiKey).emails.send({
        from: process.env.LEAD_ALERT_FROM || 'Number 1 Leads <onboarding@resend.dev>',
        to,
        subject: `☀️ ${subject}`,
        html,
        text: `${text}\n`,
      });
      result.email = error ? 'error' : 'sent';
      if (error) console.error('Digest email error:', error);
    } catch (err) {
      result.email = 'error';
      console.error('Digest email error:', err);
    }
  } else {
    console.warn('Digest email skipped: RESEND_API_KEY or LEAD_ALERT_EMAIL is not set');
  }

  if (TEXT_VIA_SHEET) {
    try {
      await getSheets().spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `'${DIGEST_TAB}'!A:C`,
        valueInputOption: 'RAW',
        requestBody: { values: [[nowInNewYork(), text, subject]] },
      });
      result.text = 'queued';
    } catch (err) {
      result.text = 'error';
      console.error('Digest sheet row error:', err);
    }
  }

  console.log('Digest:', result);
  return NextResponse.json({ sent: true, ...result, errors });
}
