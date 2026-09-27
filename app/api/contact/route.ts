import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Prefix values that start with + or = so Google Sheets won't treat them as formulas
function safeCell(val: string): string {
  return val && (val.startsWith('+') || val.startsWith('=') || val.startsWith('-'))
    ? `'${val}`
    : val;
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
    range: 'Sheet1!A:J',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, businessName, industry, location, services, consent } = body;

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const servicesList = Array.isArray(services) ? services.join(', ') : '';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    await appendToSheet([
      safeCell(firstName),
      safeCell(lastName),
      safeCell(phone),
      safeCell(email),
      servicesList,
      consent ? 'Yes' : 'No',
      submittedAt,
      safeCell(businessName ?? ''),
      safeCell(industry ?? ''),
      safeCell(location ?? ''),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
