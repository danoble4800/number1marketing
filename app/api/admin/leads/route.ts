import type { sheets_v4 } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import {
  COLS, CONTACT_METHODS, MANUAL_SOURCES, MANUAL_TAB, STATUSES, TABS,
  getSheets, loadLeads, nowInNewYork, safeCell, spreadsheetId,
  type Field, type Source,
} from '@/lib/crmSheets';

export const dynamic = 'force-dynamic';

const DATE_FIELDS: Field[] = ['lastContacted', 'nextFollowUp'];
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { leads, errors } = await loadLeads();
  return NextResponse.json({ leads, contactMethods: CONTACT_METHODS, manualSources: MANUAL_SOURCES, errors });
}

// Adds a lead by hand (referral, phone call, walk-in…) to the Other Leads tab.
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const str = (k: string, max = 200) => (typeof body[k] === 'string' ? body[k].trim().slice(0, max) : '');
    const lead = {
      firstName: str('firstName'), lastName: str('lastName'), business: str('business'),
      industry: str('industry'), location: str('location'), phone: str('phone', 40), email: str('email'),
      howMet: str('howMet', 1000), source: str('source'), notes: str('notes', 2000), nextFollowUp: str('nextFollowUp', 10),
    };
    if (!lead.firstName && !lead.business) {
      return NextResponse.json({ error: 'Add a name or a business' }, { status: 400 });
    }
    if (!MANUAL_SOURCES.includes(lead.source)) lead.source = 'Other';
    if (lead.nextFollowUp && !isDate(lead.nextFollowUp)) {
      return NextResponse.json({ error: 'Dates must be YYYY-MM-DD' }, { status: 400 });
    }

    // Same layout as Website Leads: A:L details, M Follow-up Date, N Notes, O Last Contacted, P Contacted Via
    await getSheets().spreadsheets.values.append({
      spreadsheetId: spreadsheetId('manual'),
      range: `'${MANUAL_TAB}'!A:P`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          nowInNewYork(), 'New',
          safeCell(lead.firstName), safeCell(lead.lastName), safeCell(lead.business), safeCell(lead.industry),
          safeCell(lead.location), safeCell(lead.phone), safeCell(lead.email), safeCell(lead.howMet),
          lead.source, 'Admin CRM', lead.nextFollowUp, safeCell(lead.notes), '', '',
        ]],
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin CRM add lead error:', err);
    return NextResponse.json({ error: 'Couldn’t add the lead to the sheet' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { source: rawSource, row, check, changes } = await req.json();
    if (!Object.hasOwn(TABS, String(rawSource))) {
      return NextResponse.json({ error: 'This record is read-only' }, { status: 400 });
    }
    if (!Number.isInteger(row) || row < 2 || typeof check !== 'string' || !changes || typeof changes !== 'object') {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const source = rawSource as Source;
    const tab = TABS[source];
    const data: sheets_v4.Schema$ValueRange[] = [];
    for (const [field, value] of Object.entries(changes as Record<string, unknown>)) {
      const col = COLS[source][field as Field];
      if (!col || typeof value !== 'string') {
        return NextResponse.json({ error: `Can't update ${field}` }, { status: 400 });
      }
      if (field === 'status' && !STATUSES[source].includes(value)) {
        return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
      }
      if (field === 'contactedVia' && value && !CONTACT_METHODS.includes(value)) {
        return NextResponse.json({ error: 'Unknown contact method' }, { status: 400 });
      }
      if (DATE_FIELDS.includes(field as Field) && value && !isDate(value)) {
        return NextResponse.json({ error: 'Dates must be YYYY-MM-DD' }, { status: 400 });
      }
      if (value.length > 2000) {
        return NextResponse.json({ error: 'Notes are too long' }, { status: 400 });
      }
      data.push({ range: `'${tab}'!${col}${row}`, values: [[field === 'notes' ? safeCell(value) : value]] });
    }
    if (!data.length) return NextResponse.json({ ok: true });

    // Someone may have sorted or edited the sheet since the page loaded. Only write
    // if the row still holds the same lead.
    const sheets = getSheets();
    const id = spreadsheetId(source);
    const current = await sheets.spreadsheets.values.get({ spreadsheetId: id, range: `'${tab}'!A${row}` });
    if (String(current.data.values?.[0]?.[0] ?? '').trim() !== check) {
      return NextResponse.json({ error: 'The sheet changed since this page loaded. Refresh and try again.' }, { status: 409 });
    }

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: id,
      requestBody: { valueInputOption: 'USER_ENTERED', data },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin CRM update error:', err);
    return NextResponse.json({ error: 'Couldn’t save to the sheet' }, { status: 500 });
  }
}
