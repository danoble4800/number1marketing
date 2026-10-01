import type { sheets_v4 } from 'googleapis';
import { NextResponse } from 'next/server';
import {
  COLS, CONTACT_METHODS, HISTORY_COL, STATUSES, TABS,
  getSheets, safeCell, spreadsheetId, todayInNewYork,
  type Field, type Source,
} from '@/lib/crmSheets';

// Saves follow-up changes to one lead row. Shared by the admin CRM and the team dashboard.

const DATE_FIELDS: Field[] = ['lastContacted', 'nextFollowUp'];
export const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

type Options = {
  sources?: Source[]; // which sheets the caller may write to (default: all)
  ownsRow?: (columnB: string) => boolean; // extra check on the row before writing
  logSuffix?: string; // appended to the history line, e.g. " · Laquan"
};

export async function updateLead(body: unknown, opts: Options = {}): Promise<NextResponse> {
  const { source: rawSource, row, check, changes, logEntry } = (body ?? {}) as Record<string, unknown>;
  const allowed = opts.sources ?? (Object.keys(TABS) as Source[]);
  if (!allowed.includes(rawSource as Source)) {
    return NextResponse.json({ error: 'This record is read-only' }, { status: 400 });
  }
  if (!Number.isInteger(row) || (row as number) < 2 || typeof check !== 'string' || !changes || typeof changes !== 'object') {
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
  const text = typeof logEntry === 'string' ? logEntry.trim().slice(0, 200) : '';
  const entry = text && `${text}${opts.logSuffix ?? ''}`;
  if (!data.length && !entry) return NextResponse.json({ ok: true });

  // Someone may have sorted or edited the sheet since the page loaded. Only write
  // if the row still holds the same lead.
  const sheets = getSheets();
  const id = spreadsheetId(source);
  const histCol = HISTORY_COL[source];
  const current = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: id, ranges: [`'${tab}'!A${row}:B${row}`, `'${tab}'!${histCol}${row}`],
  });
  const [checkRange, historyRange] = current.data.valueRanges ?? [];
  const [a, b] = (checkRange?.values?.[0] ?? []).map((v) => String(v ?? '').trim());
  if ((a ?? '') !== check) {
    return NextResponse.json({ error: 'The sheet changed since this page loaded. Refresh and try again.' }, { status: 409 });
  }
  if (opts.ownsRow && !opts.ownsRow(b ?? '')) {
    return NextResponse.json({ error: 'That lead isn’t yours' }, { status: 400 });
  }

  // Contact history: one dated line per entry, appended to what's already in the cell.
  let history: string[] | undefined;
  if (entry) {
    const existing = String(historyRange?.values?.[0]?.[0] ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
    history = [...existing, `${todayInNewYork()} · ${entry}`];
    data.push({ range: `'${tab}'!${histCol}${row}`, values: [[safeCell(history.join('\n'))]] });
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: id,
    requestBody: { valueInputOption: 'USER_ENTERED', data },
  });
  return NextResponse.json({ ok: true, history });
}
