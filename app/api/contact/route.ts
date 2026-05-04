import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

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
    range: 'Sheet1!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, services, consent } = body;

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const servicesList = Array.isArray(services) ? services.join(', ') : '';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    await appendToSheet([
      firstName,
      lastName,
      phone,
      email,
      servicesList,
      consent ? 'Yes' : 'No',
      submittedAt,
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
