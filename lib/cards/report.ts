import type { CardLink, CardReview, Plan, ReportFrequency } from './types';
import { can } from './plans';
import { linkNames } from './links';

// The stats email owners get weekly (Mondays) or monthly (the 1st). Periods follow
// New York time, like the admin digest. Sent by /api/cards/report.

export type ReportPage = {
  id: string;
  slug: string;
  plan: Plan;
  display_name: string;
  links: CardLink[];
  review: CardReview;
  report_frequency: ReportFrequency;
  report_token: string;
};

// One period's counts, from card_report_counts().
export type Counts = {
  kinds: Record<string, number>;
  links: Record<string, number>;
  ratings: Record<string, number>;
};

export type CountRow = { page_id: string; kind: string; link_id: string | null; rating: number | null; n: number };

export function emptyCounts(): Counts {
  return { kinds: {}, links: {}, ratings: {} };
}

export function groupCounts(rows: CountRow[]): Map<string, Counts> {
  const byPage = new Map<string, Counts>();
  for (const r of rows) {
    const c = byPage.get(r.page_id) ?? emptyCounts();
    const n = Number(r.n);
    c.kinds[r.kind] = (c.kinds[r.kind] ?? 0) + n;
    if (r.kind === 'click' && r.link_id) c.links[r.link_id] = (c.links[r.link_id] ?? 0) + n;
    if (r.kind === 'review' && r.rating) c.ratings[r.rating] = (c.ratings[r.rating] ?? 0) + n;
    byPage.set(r.page_id, c);
  }
  return byPage;
}

export const hasActivity = (c: Counts) => !!(c.kinds.tap || c.kinds.view || c.kinds.click);

// ---- Periods ----

const TZ = 'America/New_York';

// "2026-10-12" in New York for a moment in time.
export const nyDate = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ });

// Midnight in New York on a YYYY-MM-DD day, as a UTC instant.
function nyMidnight(day: string) {
  const [y, m, d] = day.split('-').map(Number);
  const noon = new Date(Date.UTC(y, m - 1, d, 12));
  const off = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' })
    .formatToParts(noon).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-5';
  const [, sign, hh, mm] = off.match(/GMT([+-])(\d+)(?::(\d+))?/) ?? ['', '-', '5', '0'];
  const minutes = (sign === '-' ? -1 : 1) * (Number(hh) * 60 + Number(mm ?? 0));
  return new Date(Date.UTC(y, m - 1, d) - minutes * 60000);
}

const addDays = (day: string, n: number) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
const addMonths = (day: string, n: number) => {
  const [y, m] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 10);
};

// partial: a period still in progress ("October so far"), so there's no fair comparison.
export type Period = { since: Date; until: Date; prevSince: Date; label: string; noun: 'week' | 'month'; partial?: boolean };

// The full week (Mon–Sun) or calendar month that ended before `today` (YYYY-MM-DD).
export function reportPeriod(freq: 'weekly' | 'monthly', today: string): Period {
  const fmt = (day: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(day + 'T12:00:00Z').toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
  if (freq === 'weekly') {
    const dow = (new Date(today + 'T12:00:00Z').getUTCDay() + 6) % 7; // Monday = 0
    const end = addDays(today, -dow); // this Monday
    const start = addDays(end, -7);
    const last = addDays(end, -1);
    return {
      since: nyMidnight(start),
      until: nyMidnight(end),
      prevSince: nyMidnight(addDays(start, -7)),
      label: `${fmt(start, { month: 'short', day: 'numeric' })} – ${fmt(last, { month: 'short', day: 'numeric' })}`,
      noun: 'week',
    };
  }
  const end = addMonths(today, 0); // 1st of this month
  const start = addMonths(today, -1);
  return {
    since: nyMidnight(start),
    until: nyMidnight(end),
    prevSince: nyMidnight(addMonths(today, -2)),
    label: fmt(start, { month: 'long', year: 'numeric' }),
    noun: 'month',
  };
}

// This month up to now, for the owner's "Email me my stats now" button.
export function monthToDate(now: Date): Period {
  const today = nyDate(now);
  const start = addMonths(today, 0);
  const month = new Date(start + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  return { since: nyMidnight(start), until: now, prevSince: nyMidnight(addMonths(today, -1)), label: `${month} so far`, noun: 'month', partial: true };
}

// Which reports go out on a New York day: weekly on Mondays, monthly on the 1st.
export function dueFrequencies(today: string): ReportFrequency[] {
  const due: ReportFrequency[] = [];
  if (new Date(today + 'T12:00:00Z').getUTCDay() === 1) due.push('weekly');
  if (today.endsWith('-01')) due.push('monthly');
  return due;
}

// ---- Email ----

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const fmtN = (n: number) => n.toLocaleString('en-US');
const plural = (n: number, w: string) => `${fmtN(n)} ${w}${n === 1 ? '' : 's'}`;

function change(now: number, before: number, noun: string) {
  if (!before) return now ? `up from none the ${noun} before` : '';
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return `same as the ${noun} before`;
  return `${pct > 0 ? 'up' : 'down'} ${Math.abs(pct)}% from the ${noun} before`;
}

export function buildReport(opts: {
  page: ReportPage;
  period: Period;
  now: Counts;
  prev: Counts;
  allTimeTaps: number;
  site: string;
}) {
  const { page, period, now, prev, allTimeTaps, site } = opts;
  const full = can(page.plan, 'fullStats');
  const n = (k: string) => now.kinds[k] ?? 0;
  const taps = n('tap');
  const views = n('view');
  const name = page.display_name || `/c/${page.slug}`;
  const month = period.label.split(' ')[0];
  const thisNoun = period.noun === 'week' ? 'last week' : period.partial ? `so far in ${month}` : `in ${month}`;

  const subject = `Your card ${thisNoun}: ${plural(taps, 'tap')}${full && views ? `, ${plural(views, 'page view')}` : ''}`;

  const diff = (a: number, b: number) => (period.partial ? '' : change(a, b, period.noun));
  const tapChange = diff(taps, prev.kinds.tap ?? 0);
  const tile = (label: string, value: number, note = '') => `
    <td style="padding:14px 12px;border:1px solid #e7e7ea;vertical-align:top;width:33%">
      <div style="font-size:26px;font-weight:700;color:#0e0e10;line-height:1.1">${fmtN(value)}</div>
      <div style="font-size:13px;color:#6b6b70;margin-top:4px">${label}</div>
      ${note ? `<div style="font-size:12px;color:#8c8c91;margin-top:2px">${esc(note)}</div>` : ''}
    </td>`;

  let body: string;
  if (full) {
    const named = linkNames(page.links ?? []);
    const top = Object.entries(now.links).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topRows = top.map(([id, c]) => `
      <tr><td style="padding:8px 0;border-top:1px solid #eee;color:#111">${esc(named[id] ?? 'Removed button')}</td>
      <td style="padding:8px 0;border-top:1px solid #eee;text-align:right;color:#111;font-weight:600">${fmtN(c)}</td></tr>`).join('');
    const ratingCount = Object.values(now.ratings).reduce((a, b) => a + b, 0);
    const avg = ratingCount
      ? Object.entries(now.ratings).reduce((s, [r, c]) => s + Number(r) * c, 0) / ratingCount
      : 0;
    const showRatings = can(page.plan, 'reviewFunnel') && page.review?.funnel && ratingCount > 0;

    body = `
      <table style="border-collapse:collapse;width:100%;margin-top:20px">
        <tr>${tile('Card taps', taps, tapChange)}${tile('Page views', views, diff(views, prev.kinds.view ?? 0))}${tile('Button clicks', n('click'))}</tr>
        <tr>${tile('Contacts saved', n('save_contact'))}${tile('Contacts shared', n('lead'))}${tile('Google review taps', now.links.review ?? 0)}</tr>
      </table>
      ${topRows ? `
      <h3 style="margin:28px 0 4px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#6b6b70">Most-clicked buttons</h3>
      <table style="border-collapse:collapse;width:100%;font-size:15px">${topRows}</table>` : ''}
      ${showRatings ? `
      <p style="margin:24px 0 0;font-size:15px;color:#111"><strong>${avg.toFixed(1)}★</strong> average from ${plural(ratingCount, 'star rating')} on your page.</p>` : ''}`;
  } else {
    body = `
      <table style="border-collapse:collapse;width:100%;margin-top:20px">
        <tr>${tile('Card taps', taps, tapChange)}${tile('Taps all time', allTimeTaps)}</tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#f4f4f5;border-radius:12px">
        <div style="font-weight:600;color:#111">See what people do after they tap</div>
        <div style="font-size:14px;color:#55555a;margin-top:4px">Pro shows your page views, which buttons get clicked, and lets visitors share their contact info with you. $10 a month.</div>
        <a href="${site}/card/edit?tab=plan" style="display:inline-block;margin-top:12px;color:#0e0e10;font-weight:600">Upgrade to Pro →</a>
      </div>`;
  }

  const settings = `${site}/card/edit?tab=stats`;
  const unsubscribe = `${site}/api/cards/report/unsubscribe?p=${page.id}&t=${page.report_token}`;
  const often = page.report_frequency === 'weekly' ? 'every Monday' : 'once a month';

  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#111">
  <p style="margin:0;color:#6b6b70;font-size:13px;letter-spacing:1px;text-transform:uppercase">N°1 Tap Cards · ${esc(period.label)}</p>
  <h2 style="margin:6px 0 0;font-size:22px">${esc(name)}: ${plural(taps, 'tap')} ${esc(thisNoun)}</h2>
  ${body}
  <p style="margin:28px 0 0"><a href="${settings}" style="background:#0e0e10;color:#fff;padding:11px 18px;text-decoration:none;font-weight:600;border-radius:999px">See your full stats</a></p>
  <p style="margin:32px 0 0;color:#8c8c91;font-size:12px;line-height:1.6">
    You get this email ${often} for ${esc(name)}.
    <a href="${settings}" style="color:#8c8c91">Change how often</a> ·
    <a href="${unsubscribe}" style="color:#8c8c91">Unsubscribe</a><br>
    Sent by N°1 Tap Cards · number1digitalmarketing.com
  </p>
</div>`;

  const text = [
    `N°1 Tap Cards · ${period.label}`,
    `${name}: ${plural(taps, 'tap')} ${thisNoun}${tapChange ? ` (${tapChange})` : ''}`,
    full ? `${plural(views, 'page view')} · ${plural(n('click'), 'button click')} · ${plural(n('lead'), 'contact')} shared` : `${fmtN(allTimeTaps)} taps all time`,
    '',
    `See your full stats: ${settings}`,
    `Change how often: ${settings}`,
    `Unsubscribe: ${unsubscribe}`,
  ].join('\n');

  return { subject, html, text, unsubscribe };
}
