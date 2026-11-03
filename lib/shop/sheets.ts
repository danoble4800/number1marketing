import { google } from 'googleapis';

// Writes shop orders to the "NUMBER1MARKETING LEADS" spreadsheet (GOOGLE_SHEET_ID).
// Paid orders go to the "Shop Orders" tab, created with headers on first use. Every
// buyer (and every abandoned checkout) also goes to "Website Leads" so they show up
// alongside the other leads.

export const ORDERS_TAB = 'Shop Orders';
export const ORDER_HEADERS = [
  'Ordered',
  'Status',
  'Order ID',
  'Business',
  'Contact',
  'Phone',
  'Email',
  'Items',
  'Total',
  'Designs',
  'Links',
  'Notes',
  'Ship To',
  'Stripe Session',
  'Links Confirmed',
  'Shipped',
  'Tracking',
];

// Prefix values that start with + = - so Google Sheets won't treat them as formulas
export function safeCell(val: string): string {
  return val && (val.startsWith('+') || val.startsWith('=') || val.startsWith('-')) ? `'${val}` : val;
}

export function nowNewYork() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' });
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

// Adds the tab with a frozen header row the first time it's needed.
async function ensureTab(sheets: ReturnType<typeof sheetsClient>, title: string, headers: string[]) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const meta = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties.title' });
  if (meta.data.sheets?.some((s) => s.properties?.title === title)) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } }],
    },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${title}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [headers] },
  });
}

export async function appendOrder(values: string[]) {
  const sheets = sheetsClient();
  await ensureTab(sheets, ORDERS_TAB, ORDER_HEADERS);
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${ORDERS_TAB}'!A:Q`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}

// Same column order as app/api/contact/route.ts:
// Submitted | Status | First | Last | Business | Industry | Location | Phone | Email | Services | Lead Source | Consent
export async function appendWebsiteLead(values: string[]) {
  await sheetsClient().spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'Website Leads'!A:L`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}

// Mac Assistant sales (lib/macAssistant.ts), one row per paid order. Commission is what
// the referring rep is owed; "Commission Paid" and "Setup Done" are filled in by hand.
export const ASSISTANT_SALES_TAB = 'Mac Assistant Sales';
export const ASSISTANT_SALES_HEADERS = [
  'Ordered',
  'Order ID',
  'Plan',
  'Name',
  'Phone',
  'Email',
  'Total',
  'Referred By',
  'Commission',
  'Commission Paid',
  'Setup Done',
  'Stripe Session',
];

export async function appendAssistantSale(values: string[]) {
  const sheets = sheetsClient();
  await ensureTab(sheets, ASSISTANT_SALES_TAB, ASSISTANT_SALES_HEADERS);
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `'${ASSISTANT_SALES_TAB}'!A:L`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}

// Paid sales with the rep who referred them, for the admin Team tab. Empty until the
// first sale creates the tab.
export async function assistantSales(): Promise<{ referredBy: string; total: number; commission: number }[]> {
  const res = await sheetsClient()
    .spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `'${ASSISTANT_SALES_TAB}'!A2:L`,
      valueRenderOption: 'UNFORMATTED_VALUE',
    })
    .catch((err) => {
      if (/Unable to parse range/i.test(String(err?.message))) return null;
      throw err;
    });
  const money = (v: unknown) => Number(String(v ?? '').replace(/[^\d.]/g, '')) || 0;
  return (res?.data.values ?? []).map((r) => ({
    referredBy: String(r[7] ?? '').trim(),
    total: money(r[6]),
    commission: money(r[8]),
  }));
}
