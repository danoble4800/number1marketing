import { NextRequest, NextResponse } from 'next/server';
import { IN_PERSON_TAB, getSheets, nowInNewYork, safeCell, spreadsheetId } from '@/lib/crmSheets';
import { isNfcFormKey } from '@/lib/nfcLead';
import { FOLLOW_UP, OPEN_TO_AUDIT, PURCHASED } from '@/lib/nfcLeadChoices';

export const dynamic = 'force-dynamic';

// Lets the form check its link before anyone fills it out.
export async function GET(req: NextRequest) {
  const ok = isNfcFormKey(req.nextUrl.searchParams.get('k'));
  return NextResponse.json({ ok }, { status: ok ? 200 : 403 });
}

// Adds a row to the NFC tracker exactly as the Google Form would (columns A:O),
// so the admin CRM picks it up as an in-person lead.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  if (!isNfcFormKey(body.k)) {
    return NextResponse.json({ error: 'This form link is not valid. Ask for a new one.' }, { status: 403 });
  }

  const str = (k: string, max = 200) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '');
  const f = {
    rep: str('rep'), date: str('date', 10), owner: str('owner'), business: str('business'),
    industry: str('industry'), location: str('location', 300), phone: str('phone', 40), email: str('email'),
    purchased: str('purchased'), cards: str('cards'), audit: str('audit'), auditTime: str('auditTime'),
    followUp: str('followUp'), notes: str('notes', 3000),
  };

  const dateMatch = f.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!f.rep || !dateMatch || !f.owner || !f.business || !f.location) {
    return NextResponse.json({ error: 'Fill in every required field.' }, { status: 400 });
  }
  if (!PURCHASED.includes(f.purchased) || !OPEN_TO_AUDIT.includes(f.audit) || (f.followUp && !FOLLOW_UP.includes(f.followUp))) {
    return NextResponse.json({ error: 'Pick an answer for every required question.' }, { status: 400 });
  }
  // M/D/YYYY so Sheets stores a real date, like the form's date question does
  const date = `${Number(dateMatch[2])}/${Number(dateMatch[3])}/${dateMatch[1]}`;

  try {
    await getSheets().spreadsheets.values.append({
      spreadsheetId: spreadsheetId('inperson'),
      range: `'${IN_PERSON_TAB}'!A:O`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          nowInNewYork(), safeCell(f.rep), date, safeCell(f.owner), safeCell(f.business),
          safeCell(f.industry), safeCell(f.location), safeCell(f.phone), safeCell(f.email),
          f.purchased, safeCell(f.cards), f.audit, safeCell(f.auditTime), f.followUp, safeCell(f.notes),
        ]],
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('NFC lead form error:', err);
    return NextResponse.json({ error: 'Could not save. Try again in a moment.' }, { status: 500 });
  }
}
