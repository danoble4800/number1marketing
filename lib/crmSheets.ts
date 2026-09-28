import { google, type sheets_v4 } from 'googleapis';

// The admin CRM reads and writes the lead sheets directly. The sheets stay the
// master copy; only the status/follow-up columns listed in COLS are ever updated.
//
// Website Leads (GOOGLE_SHEET_ID): A:L come from /api/contact, M:P are follow-up columns.
// Other Leads (GOOGLE_SHEET_ID): leads added by hand in the CRM, same column layout as Website Leads.
// NFC tracker (Google Form): A:O belong to the form and are never written; P:T are tracking.
// Client Contacts (GOOGLE_SHEET_ID): written by /api/onboarding, read-only here.
const IN_PERSON_SHEET_ID = process.env.IN_PERSON_SHEET_ID ?? '1G1Lx_Ep2zOXSN9hOW1dwiPwF40yUKwGN2bJqEzCU7Ks';
export const WEBSITE_TAB = 'Website Leads';
export const MANUAL_TAB = 'Other Leads';
export const IN_PERSON_TAB = 'Form Responses 1';
export const CLIENTS_TAB = 'Client Contacts';
export const DIGEST_TAB = 'Daily Digest';

export type Source = 'website' | 'manual' | 'inperson';
export type Field = 'status' | 'lastContacted' | 'contactedVia' | 'nextFollowUp' | 'notes';

// Must match the dropdowns (data validation) in each sheet.
export const STATUSES: Record<Source, string[]> = {
  website: ['New', 'Contacted', 'Audit Booked', 'Client', 'Not a Fit'],
  manual: ['New', 'Contacted', 'Replied', 'Audit Booked', 'Audit Done', 'Client', 'Not Interested'],
  inperson: ['New', 'Contacted', 'Replied', 'Audit Booked', 'Audit Done', 'Client', 'Not Interested'],
};
export const CONTACT_METHODS = ['Text', 'Email', 'Text + Email', 'Call', 'In person'];
export const MANUAL_SOURCES = ['Referral', 'Phone call', 'Walk-in', 'Event', 'Social media', 'Other'];

export const COLS: Record<Source, Record<Field, string>> = {
  website: { status: 'B', nextFollowUp: 'M', notes: 'N', lastContacted: 'O', contactedVia: 'P' },
  manual: { status: 'B', nextFollowUp: 'M', notes: 'N', lastContacted: 'O', contactedVia: 'P' },
  inperson: { status: 'P', lastContacted: 'Q', contactedVia: 'R', nextFollowUp: 'S', notes: 'T' },
};
export const TABS: Record<Source, string> = { website: WEBSITE_TAB, manual: MANUAL_TAB, inperson: IN_PERSON_TAB };

export type Lead = {
  key: string;
  source: Source | 'client';
  origin: string; // where the lead came from, as shown in the list
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
export function getSheets() {
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

export function spreadsheetId(source: Source) {
  return source === 'inperson' ? IN_PERSON_SHEET_ID : process.env.GOOGLE_SHEET_ID!;
}

// Google Sheets date serials count days from 1899-12-30.
function serialToDate(v: unknown): string {
  if (typeof v !== 'number' || !isFinite(v) || v < 1) return '';
  return new Date(Math.round((v - 25569) * 86400000)).toISOString().slice(0, 10);
}

export function safeCell(val: string): string {
  return /^[+=\-@]/.test(val) ? `'${val}` : val;
}

// "YYYY-MM-DD HH:MM:SS" in New York time so Sheets stores a real, sortable date
export const nowInNewYork = () => new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' });
export const todayInNewYork = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const cell = (row: unknown[] | undefined, i: number) => String(row?.[i] ?? '').trim();

// Test submissions ("TEST", "Test Client Co.") stay in the sheets but never show in the CRM.
const isTest = (l: Lead) => /\btest\b/i.test(`${l.name} ${l.business}`);

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

// Website Leads and Other Leads share one layout.
async function sheetLeads(source: 'website' | 'manual'): Promise<Lead[]> {
  const id = spreadsheetId(source);
  const tab = TABS[source];
  const [{ shown, raw }, gids] = await Promise.all([readTab(id, `'${tab}'!A2:P`), tabIds(id)]);
  return shown.flatMap((r, i) => {
    const row = i + 2;
    if (!cell(r, 0) && !cell(r, 2) && !cell(r, 4)) return [];
    const x = raw[i] ?? [];
    return [{
      key: `${source}:${row}`,
      source,
      origin: source === 'website' ? 'Website' : cell(r, 10) || 'Added by hand',
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
      statuses: STATUSES[source],
      lastContacted: serialToDate(x[14]),
      contactedVia: cell(r, 15),
      nextFollowUp: serialToDate(x[12]),
      followUpText: typeof x[12] === 'number' ? '' : cell(r, 12),
      notes: cell(r, 13),
      details: (source === 'website'
        ? [['Services', cell(r, 9)], ['Came in from', cell(r, 10)], ['Texting consent', cell(r, 11)]]
        : [['How you met', cell(r, 9)], ['Source', cell(r, 10)]]
      ).filter(([, v]) => v) as [string, string][],
      sheetUrl: rowUrl(id, gids[tab], row),
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
      origin: 'In person',
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
  const id = process.env.GOOGLE_SHEET_ID!;
  const [{ shown, raw }, gids] = await Promise.all([readTab(id, `'${CLIENTS_TAB}'!A2:H`), tabIds(id)]);
  return shown.flatMap((r, i) => {
    const row = i + 2;
    if (!cell(r, 1) && !cell(r, 2)) return [];
    const phone = cell(r, 4);
    return [{
      key: `client:${row}`,
      source: 'client' as const,
      origin: 'Client',
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

// Reads every sheet. A sheet that fails to load is reported in `errors` instead of failing the rest.
export async function loadLeads(): Promise<{ leads: Lead[]; errors: string[] }> {
  const sources: [string, () => Promise<Lead[]>][] = [
    ['Website Leads', () => sheetLeads('website')],
    ['Other Leads', () => sheetLeads('manual')],
    ['In-person tracker', inPersonLeads],
    ['Client Contacts', clients],
  ];
  const results = await Promise.allSettled(sources.map(([, load]) => load()));
  const errors = results.flatMap((r, i) => {
    if (r.status === 'fulfilled') return [];
    console.error(`Admin CRM: couldn't read ${sources[i][0]}:`, r.reason);
    return [`Couldn't load ${sources[i][0]}.`];
  });
  const leads = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : [])).filter((l) => !isTest(l));
  return { leads, errors };
}

const CLOSED = ['Client', 'Not a Fit', 'Not Interested'];
export const isOpenStatus = (status: string) => !CLOSED.includes(status);
