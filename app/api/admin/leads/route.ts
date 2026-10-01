import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import {
  CONTACT_METHODS, MANUAL_SOURCES, MANUAL_TAB,
  getSheets, loadLeads, nowInNewYork, safeCell, spreadsheetId,
} from '@/lib/crmSheets';
import { isDate, updateLead } from '@/lib/crmUpdate';

export const dynamic = 'force-dynamic';

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
    return await updateLead(await req.json());
  } catch (err) {
    console.error('Admin CRM update error:', err);
    return NextResponse.json({ error: 'Couldn’t save to the sheet' }, { status: 500 });
  }
}
