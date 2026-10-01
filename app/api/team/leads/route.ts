import { NextRequest, NextResponse } from 'next/server';
import { CONTACT_METHODS, inPersonLeads, looksLikeTest } from '@/lib/crmSheets';
import { updateLead } from '@/lib/crmUpdate';
import { nfcFormKey } from '@/lib/nfcLead';
import { isRepsLead, splitNames, teamMember } from '@/lib/teamAuth';

export const dynamic = 'force-dynamic';

// A sales rep's own leads: rows of the in-person tracker whose "Sales Rep Name" is them.
// An admin passes ?rep=<name> to see a rep's dashboard; without it they get the list of reps.
export async function GET(req: NextRequest) {
  const who = await teamMember(req);
  if (who instanceof NextResponse) return who;

  let names = who.repNames;
  if (who.role === 'admin') {
    const { data } = await who.db.from('profiles').select('*').eq('role', 'rep');
    const reps = (data ?? [])
      .map((p) => splitNames(p.rep_name || p.full_name || '')[0] ?? '')
      .filter(Boolean)
      .sort();
    const asked = req.nextUrl.searchParams.get('rep')?.trim() ?? '';
    if (!asked) return NextResponse.json({ role: 'admin', reps, leads: [] });
    const match = (data ?? []).find((p) => splitNames(p.rep_name || p.full_name || '')[0] === asked);
    names = match ? splitNames(match.rep_name || match.full_name || '') : [asked];
  }
  if (!names.length) {
    return NextResponse.json({ error: 'Your account has no rep name yet. Ask Dan to add it.' }, { status: 400 });
  }

  try {
    const leads = (await inPersonLeads())
      .filter((l) => !looksLikeTest(`${l.name} ${l.business}`) && isRepsLead(l.rep ?? '', names))
      .map((l) => ({ ...l, sheetUrl: '' }));
    const key = nfcFormKey();
    const site = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    return NextResponse.json({
      role: who.role,
      name: names[0],
      leads,
      contactMethods: CONTACT_METHODS,
      cardsSold: leads.reduce((n, l) => n + (l.cardsSold ?? 0), 0),
      formUrl: key ? `${site}/en/nfc-lead?k=${encodeURIComponent(key)}&rep=${encodeURIComponent(names[0])}` : '',
      errors: [],
    });
  } catch (err) {
    console.error('Team CRM: couldn’t read the in-person tracker:', err);
    return NextResponse.json({ leads: [], errors: ['Couldn’t load your leads. Try again in a minute.'] });
  }
}

// Reps can update status, follow-up and notes on their own in-person leads.
export async function PATCH(req: NextRequest) {
  const who = await teamMember(req);
  if (who instanceof NextResponse) return who;

  try {
    const body = await req.json();
    const names = who.role === 'rep' ? who.repNames : splitNames(String(body?.rep ?? ''));
    if (!names.length) return NextResponse.json({ error: 'Your account has no rep name yet' }, { status: 400 });
    return await updateLead(body, {
      sources: ['inperson'],
      ownsRow: (rep) => isRepsLead(rep, names),
      logSuffix: who.role === 'rep' ? ` · ${names[0].split(/\s+/)[0]}` : '',
    });
  } catch (err) {
    console.error('Team CRM update error:', err);
    return NextResponse.json({ error: 'Couldn’t save to the sheet' }, { status: 500 });
  }
}
