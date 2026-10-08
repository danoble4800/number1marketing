import type { SupabaseClient } from '@supabase/supabase-js';
import type { Resend } from 'resend';
import { buildReport, emptyCounts, groupCounts, type CountRow, type Period, type ReportPage } from './report';

// Server-side pieces of the stats email shared by the daily cron (/api/cards/report)
// and the owner's "Email me my stats now" button (/api/cards/report/send).

export const REPORT_COLUMNS =
  'id, slug, plan, display_name, links, review, report_frequency, report_token, owner_id, lead_notify_email, report_sent_at';
export type ReportRow = ReportPage & { owner_id: string; lead_notify_email: string | null; report_sent_at: string | null };

// This period, the one before (for "up 20%"), and all-time taps (free plan's headline number).
export async function loadCounts(admin: SupabaseClient, pages: ReportRow[], period: Period) {
  const ids = pages.map((p) => p.id);
  const out = new Map(ids.map((id) => [id, { now: emptyCounts(), prev: emptyCounts(), allTimeTaps: 0 }]));
  if (!ids.length) return out;
  const range = async (since: Date, until: Date) => {
    const { data, error } = await admin.rpc('card_report_counts', {
      p_pages: ids, p_since: since.toISOString(), p_until: until.toISOString(),
    });
    if (error) throw error;
    return groupCounts((data ?? []) as CountRow[]);
  };
  const [now, prev, all] = await Promise.all([
    range(period.since, period.until),
    range(period.prevSince, period.since),
    range(new Date(0), period.until),
  ]);
  for (const id of ids) {
    const o = out.get(id)!;
    o.now = now.get(id) ?? o.now;
    o.prev = prev.get(id) ?? o.prev;
    o.allTimeTaps = all.get(id)?.kinds.tap ?? 0;
  }
  return out;
}

export async function ownerEmail(admin: SupabaseClient, page: ReportRow) {
  if (page.lead_notify_email) return page.lead_notify_email;
  const { data } = await admin.auth.admin.getUserById(page.owner_id);
  return data.user?.email ?? null;
}

export async function sendReport(resend: Resend, to: string, r: ReturnType<typeof buildReport>) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.CARD_EMAIL_FROM || 'N°1 Tap Cards <cards@number1digitalmarketing.com>',
      to,
      subject: r.subject,
      html: r.html,
      text: r.text,
      headers: {
        'List-Unsubscribe': `<${r.unsubscribe}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
    if (error) console.error('Card report email error:', error);
    return !error;
  } catch (err) {
    console.error('Card report email error:', err);
    return false;
  }
}
