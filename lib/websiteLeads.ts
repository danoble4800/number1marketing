import { google } from 'googleapis';
import { Resend } from 'resend';

// Shared by /api/contact and /api/free-audit: both write to the "Website Leads" tab
// and email the owner when a lead comes in.

// Prefix values that start with + or = so Google Sheets won't treat them as formulas
export function safeCell(val: string): string {
  return val && (val.startsWith('+') || val.startsWith('=') || val.startsWith('-'))
    ? `'${val}`
    : val;
}

// Tab and column order must match the "Website Leads" tab in the leads spreadsheet:
// Submitted | Status | First | Last | Business | Industry | Location | Phone | Email | Services | Lead Source | Consent
// (Follow-up Date and Notes after that are filled in by hand.)
export const SHEET_TAB = 'Website Leads';

export interface Lead {
  firstName: string;
  lastName: string;
  businessName: string;
  industry: string;
  location: string;
  phone: string;
  email: string;
  services: string;
  source: string;
}

function escapeHtml(val: string): string {
  return val.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

// Emails the owner the moment a lead comes in. Skipped unless RESEND_API_KEY and
// LEAD_ALERT_EMAIL are set; failures are logged but never fail the form submission.
export async function sendLeadAlert(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ALERT_EMAIL;
  if (!apiKey || !to) {
    console.warn(`Lead alert email skipped: ${!apiKey ? 'RESEND_API_KEY' : 'LEAD_ALERT_EMAIL'} is not set`);
    return;
  }

  const from = process.env.LEAD_ALERT_FROM || 'Number 1 Leads <onboarding@resend.dev>';
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit`;
  const name = `${lead.firstName} ${lead.lastName}`.trim();
  const tel = lead.phone.replace(/[^\d+]/g, '');
  const e = escapeHtml;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${value}</td></tr>`;

  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px">
  <h2 style="margin:0 0 4px">New lead: ${e(lead.businessName)}</h2>
  <p style="margin:0 0 16px;color:#6b6b6b">${e(lead.industry)} · ${e(lead.location)} · via ${e(lead.source)}</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row('Name', e(name))}
    ${row('Phone', `<a href="tel:${e(tel)}">${e(lead.phone)}</a>`)}
    ${row('Email', `<a href="mailto:${e(lead.email)}">${e(lead.email)}</a>`)}
    ${row('Business', e(lead.businessName))}
    ${row('Industry', e(lead.industry))}
    ${row('Location', e(lead.location))}
    ${row('Services', e(lead.services) || '—')}
    ${row('Source', e(lead.source))}
  </table>
  <p style="margin:20px 0 0"><a href="${sheetUrl}" style="background:#0e0e10;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600">Open Leads Sheet</a></p>
</div>`;

  const text = [
    `New lead: ${lead.businessName} (${lead.industry}, ${lead.location}) via ${lead.source}`,
    `Name: ${name}`, `Phone: ${lead.phone}`, `Email: ${lead.email}`, `Services: ${lead.services || '—'}`,
    `Leads sheet: ${sheetUrl}`,
  ].join('\n');

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `🔥 New lead: ${lead.businessName} — ${lead.industry}, ${lead.location}`,
      html,
      text,
    });
    if (error) console.error('Lead alert email error:', error);
    else console.log('Lead alert email sent:', data?.id);
  } catch (err) {
    console.error('Lead alert email error:', err);
  }
}

function sheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// Adds a row and returns its row number (null if Sheets didn't say).
export async function appendToSheet(values: string[]): Promise<number | null> {
  const res = await sheetsClient().spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${SHEET_TAB}'!A:L`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
  const match = res.data.updates?.updatedRange?.match(/![A-Z]+(\d+)/);
  return match ? Number(match[1]) : null;
}

// Overwrites cells in one row, e.g. updateRow(57, 'J', ['…', '…']) fills J57:K57.
export async function updateRow(row: number, startCol: string, values: string[]) {
  await sheetsClient().spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${SHEET_TAB}'!${startCol}${row}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}
