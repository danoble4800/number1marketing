import { NextRequest, NextResponse } from 'next/server';
import { loadLeads, todayInNewYork, type Source } from '@/lib/crmSheets';
import { SENT_NUDGE, logHistory, needsNudge, nudge, sendLeadEmail } from '@/lib/leadReplies';

export const dynamic = 'force-dynamic';

// Daily reminder emails (see vercel.json). A lead gets one if its automatic email went out
// 3+ days ago and nobody has contacted it or changed its status since; see needsNudge().
// Called by Vercel Cron with "Authorization: Bearer $CRON_SECRET". Add ?dry=1 to list who
// would get one without sending.

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('Lead reminders: CRON_SECRET is not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const dry = req.nextUrl.searchParams.get('dry') === '1';

  const { leads, errors } = await loadLeads();
  const today = todayInNewYork();
  const due = leads.filter((l) => needsNudge(l, today));
  if (dry) return NextResponse.json({ dry: true, due: due.map((l) => l.business || l.name), errors });

  const sent: string[] = [];
  for (const l of due) {
    const source = l.source as Source;
    const email = nudge({ name: l.name, business: l.business, inPerson: source === 'inperson', rep: l.rep ?? '' });
    if (await sendLeadEmail(l.email, email, 'reminder', `reminder/${source}/${l.row}/${l.email}`)) {
      await logHistory(source, l.row, SENT_NUDGE);
      sent.push(l.business || l.name);
    }
  }
  console.log(`Lead reminders: sent ${sent.length} of ${due.length}`);
  return NextResponse.json({ sent, errors });
}
