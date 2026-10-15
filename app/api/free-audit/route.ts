import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet, safeCell, sendLeadAlert, updateRow } from '@/lib/websiteLeads';

// The step-by-step free audit application on /free-audit (linked from Instagram).
// It saves in two stages so a lead who quits halfway still reaches the leads sheet:
//   stage "start"  – after the contact step: adds the row and returns a signed token for it
//   stage "finish" – after the last question: fills in the rest of that row (Services, Lead Source…)
//                    and emails the owner. With no valid token it adds a full row instead.

const SOURCE = 'Instagram Free Audit';

// Answer keys come from components/free-audit/AuditApplication.tsx; the sheet always gets English.
const BUSINESS: Record<string, string> = {
  home: 'Home services', food: 'Restaurant / food', beauty: 'Beauty / barber / salon',
  health: 'Health / fitness', auto: 'Auto', retail: 'Shop / retail', realestate: 'Real estate',
};
const GOAL: Record<string, string> = {
  calls: 'More calls', customers: 'More customers', followers: 'More followers', all: 'All of it',
};
const RUN: Record<string, string> = {
  self: 'Wants to run it themselves', us: 'Wants us to run it', unsure: 'Not sure who runs it',
};
const BUDGET: Record<string, string> = {
  under300: 'Under $300/mo', '300to750': '$300–$750/mo', '750to1500': '$750–$1,500/mo',
  over1500: '$1,500+/mo', unsure: 'Budget not sure',
};
const TIMING: Record<string, string> = {
  now: 'Start right away', month: 'Start within a month', looking: 'Just looking',
};

// Who to call first: real budget and ready soon = Hot; small budget and just looking = Cold.
function score(budget: string, timing: string): 'HOT' | 'WARM' | 'COLD' {
  const bigBudget = budget === '750to1500' || budget === 'over1500';
  const soon = timing === 'now' || timing === 'month';
  if (bigBudget && soon) return 'HOT';
  if (budget === 'under300' && timing === 'looking') return 'COLD';
  return 'WARM';
}

function sign(row: number) {
  return createHmac('sha256', process.env.GOOGLE_PRIVATE_KEY ?? 'free-audit').update(`free-audit:${row}`).digest('hex');
}

function rowFromToken(token: unknown): number | null {
  if (typeof token !== 'string') return null;
  const [rowText, sig] = token.split('.');
  const row = Number(rowText);
  if (!Number.isInteger(row) || row < 2 || !sig) return null;
  const expected = Buffer.from(sign(row));
  const given = Buffer.from(sig);
  return given.length === expected.length && timingSafeEqual(given, expected) ? row : null;
}

const str = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function businessLabel(business: string, businessOther: string) {
  return business === 'other' ? businessOther || 'Other' : BUSINESS[business] ?? '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const firstName = str(body.firstName);
    const lastName = str(body.lastName);
    const phone = str(body.phone, 40);
    const email = str(body.email, 200);
    const businessName = str(body.businessName);
    const industry = businessLabel(str(body.business, 20), str(body.businessOther));
    const goal = GOAL[str(body.goal, 20)] ?? '';

    if (!firstName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' });
    const baseRow = (services: string, source: string) => [
      submittedAt,
      'New',
      safeCell(firstName),
      safeCell(lastName),
      safeCell(businessName),
      safeCell(industry),
      '',
      safeCell(phone),
      safeCell(email),
      safeCell(services),
      source,
      body.consent ? 'Yes' : 'No',
    ];

    if (body.stage === 'start') {
      // Marked unfinished until the last step comes in; the CRM shows this in "Services".
      const row = await appendToSheet(baseRow(`${goal} · Didn't finish the form`, `${SOURCE} (started)`));
      return NextResponse.json({ success: true, token: row ? `${row}.${sign(row)}` : null });
    }

    const budget = str(body.budget, 20);
    const timing = str(body.timing, 20);
    const tier = score(budget, timing);
    const services = [tier, goal, RUN[str(body.run, 20)], BUDGET[budget], TIMING[timing]].filter(Boolean).join(' · ');
    const source = `${SOURCE} · ${tier}`;

    const row = rowFromToken(body.token);
    // Rewrites C:L, not just J:K, in case they went back and fixed their details.
    if (row) await updateRow(row, 'C', baseRow(services, source).slice(2));
    else await appendToSheet(baseRow(services, source));

    await sendLeadAlert({
      firstName,
      lastName,
      businessName: businessName || '(no business name)',
      industry: industry || '—',
      location: 'Instagram',
      phone,
      email,
      services,
      source,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Free audit form error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
