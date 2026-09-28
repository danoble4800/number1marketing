import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Prefix values that start with + or = so Google Sheets won't treat them as formulas
function safeCell(val: string): string {
  return val && (val.startsWith('+') || val.startsWith('=') || val.startsWith('-'))
    ? `'${val}`
    : val;
}

// Tab and column order must match the "Website Leads" tab in the leads spreadsheet:
// Submitted | Status | First | Last | Business | Industry | Location | Phone | Email | Services | Lead Source | Consent
// (Follow-up Date and Notes after that are filled in by hand.)
const SHEET_TAB = 'Website Leads';

const SERVICE_LABELS: Record<string, string> = {
  simpleAI: 'Starter Growth System',
  professionalAI: 'Advanced Growth System',
  webDesign: 'Website Design & Support',
  consulting: 'Strategy Consulting',
};

const LEAD_SOURCES = ['Audit Page', 'Contact Page'];

interface Lead {
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
async function sendLeadAlert(lead: Lead) {
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

async function appendToSheet(values: string[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${SHEET_TAB}'!A:L`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, businessName, industry, location, services, consent, source, inPersonRef } = body;

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const servicesList = Array.isArray(services)
      ? services.map((s: string) => SERVICE_LABELS[s] ?? s).join(', ')
      : '';
    // QR codes on the in-person follow-up PDFs tag the visit with the business they were made for
    const ref = typeof inPersonRef === 'string' && /^[a-z0-9-]{1,40}$/.test(inPersonRef) ? inPersonRef : '';
    const leadSource = ref ? `In-Person QR (${ref})` : LEAD_SOURCES.includes(source) ? source : 'Website';
    // "YYYY-MM-DD HH:MM:SS" in New York time so Sheets stores a real, sortable date
    const submittedAt = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' });

    await appendToSheet([
      submittedAt,
      'New',
      safeCell(firstName),
      safeCell(lastName),
      safeCell(businessName ?? ''),
      safeCell(industry ?? ''),
      safeCell(location ?? ''),
      safeCell(phone),
      safeCell(email),
      servicesList,
      leadSource,
      consent ? 'Yes' : 'No',
    ]);

    await sendLeadAlert({
      firstName: String(firstName),
      lastName: String(lastName),
      businessName: String(businessName ?? ''),
      industry: String(industry ?? ''),
      location: String(location ?? ''),
      phone: String(phone),
      email: String(email),
      services: servicesList,
      source: leadSource,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
