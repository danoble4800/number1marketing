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
  'Tap Opens',
  'Link',
  'Notes',
  'Ship To',
  'Stripe Session',
  'Proof Sent',
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

async function ensureOrdersTab(sheets: ReturnType<typeof sheetsClient>) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const meta = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties.title' });
  if (meta.data.sheets?.some((s) => s.properties?.title === ORDERS_TAB)) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addSheet: { properties: { title: ORDERS_TAB, gridProperties: { frozenRowCount: 1 } } } }],
    },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${ORDERS_TAB}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [ORDER_HEADERS] },
  });
}

export async function appendOrder(values: string[]) {
  const sheets = sheetsClient();
  await ensureOrdersTab(sheets);
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
