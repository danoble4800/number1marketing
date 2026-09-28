import { google, type sheets_v4 } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// The admin CRM reads and writes the lead sheets directly. The sheets stay the
// master copy; this route only touches the status/follow-up columns listed in COLS.
//
// Website Leads (GOOGLE_SHEET_ID): A:L come from /api/contact, M:P are follow-up columns.
// NFC tracker (Google Form): A:O belong to the form and are never written; P:T are tracking.
// Client Contacts (GOOGLE_SHEET_ID): written by /api/onboarding, read-only here.
const IN_PERSON_SHEET_ID = process.env.IN_PERSON_SHEET_ID ?? '1G1Lx_Ep2zOXSN9hOW1dwiPwF40yUKwGN2bJqEzCU7Ks';
const WEBSITE_TAB = 'Website Leads';
const IN_PERSON_TAB = 'Form Responses 1';
const CLIENTS_TAB = 'Client Contacts';

type Source = 'website' | 'inperson';
type Field = 'status' | 'lastContacted' | 'contactedVia' | 'nextFollowUp' | 'notes';

// Must match the dropdowns (data validation) in each sheet.
const STATUSES: Record<Source, string[]> = {
  website: ['New', 'Contacted', 'Audit Booked', 'Client', 'Not a Fit'],
  inperson: ['New', 'Contacted', 'Replied', 'Audit Booked', 'Audit Done', 'Client', 'Not Interested'],
};
const CONTACT_METHODS = ['Text', 'Email', 'Text + Email', 'Call', 'In person'];

const COLS: Record<Source, Record<Field, string>> = {
  website: { status: 'B', nextFollowUp: 'M', notes: 'N', lastContacted: 'O', contactedVia: 'P' },
  inperson: { status: 'P', lastContacted: 'Q', contactedVia: 'R', nextFollowUp: 'S', notes: 'T' },
};

const DATE_FIELDS: Field[] = ['lastContacted', 'nextFollowUp'];

export type Lead = {
  key: string;
  source: Source | 'client';
  row: number;
  check: string; // column A as shown in the sheet; confirms the row hasn't moved before a write
  submitted: string;
  submittedSort: number;
  name: string;
  business: string;
  industry: string;
  location: string;
  phone: string;
  email: string;
  status: string;
  statuses: string[];
  lastContacted: string; // YYYY-MM-DD, or '' if blank or not a real date
  contactedVia: string;
  nextFollowUp: string;
  followUpText: string; // what the sheet shows when the follow-up cell isn't a real date
  notes: string;
  details: [string, string][];
  sheetUrl: string;
};

let sheetsClient: sheets_v4.Sheets | null = null;
function getSheets() {
  if (!sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheetsClient = google.sheets({ version: 'v4', auth });
  }
  return sheetsClient;
}

function spreadsheetId(source: Source) {
  return source === 'website' ? process.env.GOOGLE_SHEET_ID! : IN_PERSON_SHEET_ID;
}

// Google Sheets date serials count days from 1899-12-30.
function serialToDate(v: unknown): string {
  if (typeof v !== 'number' || !isFinite(v) || v < 1) return '';
  return new Date(Math.round((v - 25569) * 86400000)).toISOString().slice(0, 10);
}

function safeCell(val: string): string {
  return /^[+=\-@]/.test(val) ? `'${val}` : val;
}

const cell = (row: unknown[] | undefined, i: number) => String(row?.[i] ?? '').trim();

async function readTab(id: string, range: string) {
  const sheets = getSheets();
  const [shown, raw] = await Promise.all([
    sheets.spreadsheets.values.get({ spreadsheetId: id, range, valueRenderOption: 'FORMATTED_VALUE' }),
    sheets.spreadsheets.values.get({
      spreadsheetId: id, range, valueRenderOption: 'UNFORMATTED_VALUE', dateTimeRenderOption: 'SERIAL_NUMBER',
    }),
  ]);
  return { shown: shown.data.values ?? [], raw: raw.data.values ?? [] };
}

async function tabIds(id: string) {
  const meta = await getSheets().spreadsheets.get({ spreadsheetId: id, fields: 'sheets.properties(title,sheetId)' });
  return Object.fromEntries((meta.data.sheets ?? []).map((s) => [s.properties?.title, s.properties?.sheetId]));
}

const rowUrl = (id: string, gid: number | undefined, row: number) =>
  `https://docs.google.com/spreadsheets/d/${id}/edit#gid=${gid ?? 0}&range=A${row}`;

async function websiteLeads(): Promise<Lead[]> {
  const id = spreadsheetId('website');
  const [{ shown, raw }, gids] = await Promise.all([readTab(id, `'${WEBSITE_TAB}'!A2:P`), tabIds(id)]);
  return shown.flatMap((r, i) => {
    const row = i + 2;
    if (!cell(r, 0) && !cell(r, 2) && !cell(r, 4)) return [];
    const x = raw[i] ?? [];
    return [{
      key: `website:${row}`,
      source: 'website' as const,
      row,
      check: cell(r, 0),
      submitted: cell(r, 0),
      submittedSort: typeof x[0] === 'number' ? x[0] : 0,
      name: [cell(r, 2), cell(r, 3)].filter(Boolean).join(' '),
      business: cell(r, 4),
      industry: cell(r, 5),
      location: cell(r, 6),
      phone: cell(r, 7),
      email: cell(r, 8),
      status: cell(r, 1) || 'New',
      statuses: STATUSES.website,
      lastContacted: serialToDate(x[14]),
      contactedVia: cell(r, 15),
      nextFollowUp: serialToDate(x[12]),
      followUpText: typeof x[12] === 'number' ? '' : cell(r, 12),
      notes: cell(r, 13),
      details: [
        ['Services', cell(r, 9)],
        ['Lead source', cell(r, 10)],
        ['Texting consent', cell(r, 11)],
      ].filter(([, v]) => v) as [string, string][],
      sheetUrl: rowUrl(id, gids[WEBSITE_TAB], row),
    }];
  });
}

async function inPersonLeads(): Promise<Lead[]> {
  const id = spreadsheetId('inperson');
  const [{ shown, raw }, gids] = await Promise.all([readTab(id, `'${IN_PERSON_TAB}'!A2:T`), tabIds(id)]);
  return shown.flatMap((r, i) => {
    const row = i + 2;
    if (!cell(r, 0) && !cell(r, 3) && !cell(r, 4)) return [];
    const x = raw[i] ?? [];
    const cards = cell(r, 9) === 'Yes' ? `Yes, ${cell(r, 10)}` : cell(r, 9);
    return [{
      key: `inperson:${row}`,
      source: 'inperson' as const,
      row,
      check: cell(r, 0),
      submitted: cell(r, 0),
      submittedSort: typeof x[0] === 'number' ? x[0] : 0,
      name: cell(r, 3),
      business: cell(r, 4),
      industry: cell(r, 5),
      location: cell(r, 6),
      phone: cell(r, 7),
      email: cell(r, 8),
      status: cell(r, 15) || 'New',
      statuses: STATUSES.inperson,
      lastContacted: serialToDate(x[16]),
      contactedVia: cell(r, 17),
      nextFollowUp: serialToDate(x[18]),
      followUpText: typeof x[18] === 'number' ? '' : cell(r, 18),
      notes: cell(r, 19),
      details: [
        ['Met', [cell(r, 2), cell(r, 1) && `by ${cell(r, 1)}`].filter(Boolean).join(' ')],
        ['Bought NFC cards', cards],
        ['Open to audit', cell(r, 11)],
        ['Preferred audit time', cell(r, 12)],
        ['Follow-up needed', cell(r, 13)],
        ['Notes from the visit', cell(r, 14)],
      ].filter(([, v]) => v) as [string, string][],
      sheetUrl: rowUrl(id, gids[IN_PERSON_TAB], row),
    }];
  });
}

async function clients(): Promise<Lead[]> {
  const id = spreadsheetId('website');
  const [{ shown, raw }, gids] = await Promise.all([readTab(id, `'${CLIENTS_TAB}'!A2:H`), tabIds(id)]);
  return shown.flatMap((r, i) => {
    const row = i + 2;
    if (!cell(r, 1) && !cell(r, 2)) return [];
    const phone = cell(r, 4);
    return [{
      key: `client:${row}`,
      source: 'client' as const,
      row,
      check: cell(r, 0),
      submitted: cell(r, 0),
      submittedSort: typeof raw[i]?.[0] === 'number' ? (raw[i][0] as number) : Date.parse(cell(r, 0)) / 86400000 + 25569 || 0,
      name: cell(r, 2),
      business: cell(r, 1),
      industry: cell(r, 6),
      location: cell(r, 7),
      phone: phone.startsWith('#') ? '' : phone,
      email: cell(r, 3),
      status: 'Client',
      statuses: ['Client'],
      lastContacted: '',
      contactedVia: '',
      nextFollowUp: '',
      followUpText: '',
      notes: '',
      details: [['Website', cell(r, 5)]].filter(([, v]) => v) as [string, string][],
      sheetUrl: rowUrl(id, gids[CLIENTS_TAB], row),
    }];
  });
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const results = await Promise.allSettled([websiteLeads(), inPersonLeads(), clients()]);
  const names = ['Website Leads', 'In-person tracker', 'Client Contacts'];
  const errors = results.flatMap((r, i) => {
    if (r.status === 'fulfilled') return [];
    console.error(`Admin CRM: couldn't read ${names[i]}:`, r.reason);
    return [`Couldn't load ${names[i]}.`];
  });
  const leads = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  return NextResponse.json({ leads, contactMethods: CONTACT_METHODS, errors });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { source: rawSource, row, check, changes } = await req.json();
    if (rawSource !== 'website' && rawSource !== 'inperson') {
      return NextResponse.json({ error: 'This record is read-only' }, { status: 400 });
    }
    if (!Number.isInteger(row) || row < 2 || typeof check !== 'string' || !changes || typeof changes !== 'object') {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const source: Source = rawSource;
    const data: sheets_v4.Schema$ValueRange[] = [];
    const tab = source === 'website' ? WEBSITE_TAB : IN_PERSON_TAB;
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
      if (DATE_FIELDS.includes(field as Field) && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
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
