import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

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
    const { firstName, lastName, phone, email, businessName, industry, location, services, consent, source } = body;

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const servicesList = Array.isArray(services)
      ? services.map((s: string) => SERVICE_LABELS[s] ?? s).join(', ')
      : '';
    const leadSource = LEAD_SOURCES.includes(source) ? source : 'Website';
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
