import { NextRequest, NextResponse } from 'next/server';
import { IN_PERSON_TAB, getSheets, loadLeads, nowInNewYork, safeCell, spreadsheetId } from '@/lib/crmSheets';
import { isNfcFormKey } from '@/lib/nfcLead';
import { FOLLOW_UP, OPEN_TO_AUDIT, PURCHASED, VISIT_RESULTS } from '@/lib/nfcLeadChoices';

export const dynamic = 'force-dynamic';

export type KnownBusiness = { business: string; who: string; date: string; status: string };

// Lets the form check its link before anyone fills it out, and sends the businesses
// already on the lead lists so the form can warn about a repeat visit.
export async function GET(req: NextRequest) {
  if (!isNfcFormKey(req.nextUrl.searchParams.get('k'))) return NextResponse.json({ ok: false }, { status: 403 });

  // A sheet that fails to load just means fewer warnings; the form still opens.
  const known: KnownBusiness[] = await loadLeads()
    .then(({ leads }) => leads.flatMap((l) => (l.business ? [{
      business: l.business,
      who: l.source === 'inperson' ? l.rep || 'In person' : l.origin,
      date: l.submittedSort ? new Date(Math.round((l.submittedSort - 25569) * 86400000)).toISOString().slice(0, 10) : '',
      status: l.status,
    }] : [])))
    .catch(() => []);
  return NextResponse.json({ ok: true, known });
}

// "2026-10-02" (+ days) → "10/2/2026", which Sheets stores as a real date
function sheetDate(iso: string, plusDays = 0) {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + plusDays));
  return `${t.getUTCMonth() + 1}/${t.getUTCDate()}/${t.getUTCFullYear()}`;
}

// Adds a row to the NFC tracker: A:O in the Google Form's layout, plus the tracking
// columns (P status, Q last contacted, R via, S next follow-up, U history) set from
// the visit result, so the admin CRM picks it up as an in-person lead.
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
    followUp: str('followUp'), notes: str('notes', 3000), result: str('result'),
  };

  if (!f.rep || !/^\d{4}-\d{2}-\d{2}$/.test(f.date) || !f.business) {
    return NextResponse.json({ error: 'Add your name and the business name.' }, { status: 400 });
  }
  if (!VISIT_RESULTS.includes(f.result)) {
    return NextResponse.json({ error: 'Pick how the visit went.' }, { status: 400 });
  }
  if ((f.purchased && !PURCHASED.includes(f.purchased)) || (f.audit && !OPEN_TO_AUDIT.includes(f.audit))
    || (f.followUp && !FOLLOW_UP.includes(f.followUp))) {
    return NextResponse.json({ error: 'Pick a listed answer for each question.' }, { status: 400 });
  }

  // Talked to owner: follow up in 2 days. Owner not in: stop back tomorrow. Not interested: closed.
  const notInterested = f.result === 'Not interested';
  const talked = f.result === 'Talked to owner';
  const status = notInterested ? 'Not Interested' : 'New';
  const nextFollowUp = notInterested ? '' : sheetDate(f.date, talked ? 2 : 1);
  const followUp = f.followUp || (notInterested ? 'No' : 'Yes');
  const history = `${f.date} · Visit by ${f.rep}: ${f.result.toLowerCase()}${f.purchased === 'Yes' ? ', bought NFC cards' : ''}`;

  try {
    await getSheets().spreadsheets.values.append({
      spreadsheetId: spreadsheetId('inperson'),
      range: `'${IN_PERSON_TAB}'!A:U`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          nowInNewYork(), safeCell(f.rep), sheetDate(f.date), safeCell(f.owner), safeCell(f.business),
          safeCell(f.industry), safeCell(f.location), safeCell(f.phone), safeCell(f.email),
          f.purchased, safeCell(f.cards), f.audit, safeCell(f.auditTime), followUp, safeCell(f.notes),
          status, talked || notInterested ? sheetDate(f.date) : '', talked || notInterested ? 'In person' : '',
          nextFollowUp, '', safeCell(history),
        ]],
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('NFC lead form error:', err);
    return NextResponse.json({ error: 'Could not save. Try again in a moment.' }, { status: 500 });
  }
}
