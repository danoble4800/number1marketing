'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import type { CardPage, PageStats, ReportFrequency } from '@/lib/cards/types';
import { can } from '@/lib/cards/plans';
import { demoStats } from '@/lib/cards/demo';
import { linkNames } from '@/lib/cards/links';
import { getSupabase } from '@/lib/supabase';
import { authHeader } from '@/lib/cards/client';
import { Section } from './ui';

// admin: opened from the admin Tap Cards tab, so every stat shows whatever the plan
// and the audit pitch meant for the customer is left out.
type Props = { page: CardPage; set?: (patch: Partial<CardPage>) => void; demo: boolean; onUpgrade: () => void; admin?: boolean };

// Loads card_page_stats once per page / period (not on every keystroke in the editor).
export function usePageStats(page: CardPage, demo: boolean, days: number) {
  const [stats, setStats] = useState<PageStats | null>(null);
  const [error, setError] = useState('');
  const latest = useRef(page);
  latest.current = page;

  useEffect(() => {
    if (demo) { setStats(demoStats(latest.current)); return; }
    let live = true;
    setStats(null);
    setError('');
    getSupabase()
      .rpc('card_page_stats', { p_page: page.id, p_days: days })
      .then(({ data, error: err }) => {
        if (!live) return;
        if (err) setError('Couldn’t load stats.');
        else setStats(data as PageStats);
      });
    return () => { live = false; };
  }, [page.id, demo, days]);

  return { stats, error };
}

export default function StatsTab({ page, set, demo, onUpgrade, admin = false }: Props) {
  const [days, setDays] = useState(30);
  const { stats: real, error } = usePageStats(page, demo, days);
  const [sample, setSample] = useState(false);

  const full = admin || can(page.plan, 'fullStats');

  if (error) return <p className="text-sm text-ed-err">{error}</p>;
  if (!real) return <p className="text-sm text-ed-muted">Loading stats…</p>;

  const empty = !demo && Object.values(real.all_time).every((v) => !v);
  const stats = sample && empty ? demoStats(page) : real;

  const n = (k: string) => stats.totals[k] ?? 0;
  const tiles = [
    { label: 'Card taps', value: n('tap') },
    { label: 'Page views', value: n('view') },
    { label: 'Link clicks', value: n('click') },
    { label: 'Contacts saved', value: n('save_contact') },
    { label: 'Contacts shared', value: n('lead') },
  ];

  return (
    <div className="space-y-5">
      {full && !admin && empty && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ed-line bg-ed-surface px-5 py-4 text-sm">
          <span className="text-ed-muted">
            {sample ? 'Showing sample data. These aren’t your real numbers.' : 'No taps yet. Your numbers show up here after the first tap.'}
          </span>
          <button
            type="button"
            onClick={() => setSample(!sample)}
            className="rounded-full border border-ed-line px-3 py-1.5 text-sm font-medium text-ed-fg hover:border-ed-ink"
          >
            {sample ? 'Hide sample' : 'Show sample data'}
          </button>
        </div>
      )}

      {full && (
        <div className="flex items-start gap-3 rounded-2xl border border-ed-line bg-ed-surface px-5 py-4">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-ed-muted" />
          <p className="text-base leading-relaxed text-ed-ink">{insight(page, stats, days)}</p>
        </div>
      )}

      {!full && (
        <Section title="Your card so far">
          <p className="font-display text-6xl text-ed-ink">{stats.all_time.tap ?? 0}</p>
          <p className="mt-1 text-sm text-ed-muted">total taps, all time</p>
        </Section>
      )}

      <Section
        title="Last days"
        locked={full ? null : 'pro'}
        onUpgrade={onUpgrade}
        right={
          full && (
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-xl border border-ed-line bg-ed-field px-2 py-1 text-xs text-ed-fg">
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          )
        }
      >
        <div className="grid grid-cols-2 gap-px bg-ed-line sm:grid-cols-5">
          {tiles.map((t) => (
            <div key={t.label} className="bg-ed-surface p-4">
              <p className="text-2xl font-semibold tabular-nums text-ed-ink">{t.value.toLocaleString()}</p>
              <p className="mt-1 text-xs text-ed-muted">{t.label}</p>
            </div>
          ))}
        </div>
        <DailyBars daily={stats.daily} days={days} />
      </Section>

      <Section title="Clicks by button" locked={full ? null : 'pro'} onUpgrade={onUpgrade}>
        <LinkTable page={page} stats={stats} />
      </Section>

      {(admin || can(page.plan, 'reviewFunnel')) && page.review?.funnel && (
        <Section title="Star ratings" hint="From the rating step on your page.">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = stats.ratings[r] ?? 0;
              const max = Math.max(1, ...Object.values(stats.ratings));
              return (
                <div key={r} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-ed-muted">{r}★</span>
                  <div className="h-2.5 flex-1 bg-ed-field">
                    <div className="h-full rounded-r bg-ed-fg" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums text-ed-fg">{count}</span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {!admin && set && <ReportSetting page={page} set={set} demo={demo} />}

      {!admin && (
        <a
          href={`/en/audit?utm_source=tapcard&utm_medium=dashboard&utm_campaign=${encodeURIComponent(page.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-ed-muted bg-ed-ink p-5 text-ed-field"
        >
          <span>
            <span className="block text-sm font-semibold">
              {n('tap') > 0 ? `${n('tap')} taps. How many became customers?` : 'Turn taps into customers'}
            </span>
            <span className="mt-1 block text-sm text-ed-faint">
              Book a free 30-minute audit. We’ll show you how to turn your card, reviews and website into more bookings.
            </span>
          </span>
          <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}

const FREQUENCIES: { id: ReportFrequency; name: string }[] = [
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'off', name: 'Off' },
];

// How often the stats email goes out (sent by /api/cards/report).
function ReportSetting({ page, set, demo }: { page: CardPage; set: (patch: Partial<CardPage>) => void; demo: boolean }) {
  const freq = page.report_frequency ?? 'monthly';
  const [sending, setSending] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sentTo, setSentTo] = useState('');

  async function sendNow() {
    if (demo) { setSending('sent'); setSentTo('your email'); return; }
    setSending('sending');
    try {
      const res = await fetch('/api/cards/report/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
        body: JSON.stringify({ page_id: page.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSentTo(json.to);
      setSending('sent');
    } catch {
      setSending('error');
    }
  }
  const when = freq === 'weekly' ? 'every Monday morning' : freq === 'monthly' ? 'on the 1st of each month' : null;
  return (
    <Section
      title="Stats email"
      icon={<Mail size={18} />}
      hint={when
        ? `Your taps and clicks, emailed ${when} to ${page.lead_notify_email || 'your sign-in email'}.`
        : 'Off. Turn it on to get your numbers by email.'}
    >
      <div role="radiogroup" aria-label="How often" className="inline-flex rounded-full border border-ed-line bg-ed-field p-1">
        {FREQUENCIES.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={freq === f.id}
            onClick={() => set({ report_frequency: f.id })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${freq === f.id ? 'bg-ed-ink text-ed-field' : 'text-ed-muted hover:text-ed-ink'}`}
          >
            {f.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ed-muted">No email is sent when nobody tapped or visited your page.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ed-line pt-4">
        <button
          type="button"
          onClick={sendNow}
          disabled={sending === 'sending'}
          className="rounded-full border border-ed-line px-3.5 py-1.5 text-sm font-medium text-ed-fg hover:border-ed-ink disabled:opacity-50"
        >
          {sending === 'sending' ? 'Sending…' : 'Email me my stats now'}
        </button>
        <span className="text-xs text-ed-muted" aria-live="polite">
          {sending === 'sent' && `Sent this month so far to ${sentTo}.`}
          {sending === 'error' && <span className="text-ed-err">Couldn’t send. Try again in a minute.</span>}
        </span>
      </div>
    </Section>
  );
}

// One entry per day for the last `days` days, ending today (missing days are 0).
function daySeries(daily: PageStats['daily'], days: number) {
  const byDay = new Map(daily.map((d) => [d.day, d]));
  const last = daily.length ? new Date(daily[daily.length - 1].day + 'T00:00:00Z') : new Date();
  const end = new Date(Math.max(last.getTime(), Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())));
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(end.getTime() - (days - 1 - i) * 86400000).toISOString().slice(0, 10);
    const row = byDay.get(d);
    return { day: d, taps: row?.taps ?? 0, views: row?.views ?? 0 };
  });
}

// "37 taps this week, up 12% from last week. The most-clicked button is “Call button” (18 clicks)."
function insight(page: CardPage, stats: PageStats, days: number) {
  const series = daySeries(stats.daily, Math.max(days, 14));
  const sum = (from: number, to: number, k: 'taps' | 'views') => series.slice(from, to).reduce((n, d) => n + d[k], 0);
  const len = series.length;
  const week = sum(len - 7, len, 'taps');
  const prev = sum(len - 14, len - 7, 'taps');
  const views = sum(len - 7, len, 'views');
  const plural = (n: number, w: string) => `${n.toLocaleString()} ${w}${n === 1 ? '' : 's'}`;

  let first: string;
  if (week === 0 && prev === 0) {
    first = views > 0
      ? `No card taps this week, but ${views.toLocaleString()} ${views === 1 ? 'person' : 'people'} viewed your page.`
      : 'No taps in the last two weeks. Hand out a card or put your QR code by the register.';
  } else if (days < 14) {
    first = `${plural(week, 'tap')} this week.`;
  } else if (prev === 0) {
    first = `${plural(week, 'tap')} this week, up from none the week before.`;
  } else {
    const pct = Math.round(((week - prev) / prev) * 100);
    first = pct === 0
      ? `${plural(week, 'tap')} this week, the same as last week.`
      : `${plural(week, 'tap')} this week, ${pct > 0 ? 'up' : 'down'} ${Math.abs(pct)}% from last week.`;
  }

  const top = Object.entries(stats.links).sort((a, b) => b[1] - a[1])[0];
  if (!top) return first;
  const name = linkNames(page.links ?? [])[top[0]];
  return name ? `${first} The most-clicked button is “${name}” (${plural(top[1], 'click')}).` : first;
}

// Single series (taps per day), one hue, hover tooltip on each bar.
function DailyBars({ daily, days }: { daily: PageStats['daily']; days: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const series = daySeries(daily, days);
  const max = Math.max(1, ...series.map((s) => s.taps));
  const fmt = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs text-ed-muted">Taps per day</p>
      <div className="relative">
        <div className="flex h-36 items-end gap-[2px] border-b border-ed-line">
          {series.map((s, i) => (
            <div
              key={s.day}
              className="relative flex h-full flex-1 items-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                className="w-full rounded-t-[4px] transition-opacity"
                style={{
                  height: `${(s.taps / max) * 100}%`,
                  minHeight: s.taps ? 2 : 0,
                  background: '#F5F5F6',
                  opacity: hover === null || hover === i ? 1 : 0.35,
                }}
              />
            </div>
          ))}
        </div>
        {hover !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl border border-ed-line bg-ed-field px-2.5 py-1.5 text-xs text-ed-fg shadow-lg"
            style={{ left: `${((hover + 0.5) / series.length) * 100}%` }}
          >
            <span className="text-ed-muted">{fmt(series[hover].day)}</span> · {series[hover].taps} taps · {series[hover].views} views
          </div>
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-ed-faint">
        <span>{fmt(series[0].day)}</span>
        <span>{fmt(series[series.length - 1].day)}</span>
      </div>
    </div>
  );
}

function LinkTable({ page, stats }: { page: CardPage; stats: PageStats }) {
  const named = linkNames(page.links ?? []);
  const rows = Object.entries(stats.links).sort((a, b) => b[1] - a[1]);
  if (rows.length === 0) return <p className="text-sm text-ed-faint">No clicks yet.</p>;
  const max = rows[0][1];
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([id, count]) => (
          <tr key={id} className="border-b border-ed-line last:border-0">
            <td className="py-2.5 pr-3 text-ed-fg">{named[id] ?? 'Removed link'}</td>
            <td className="w-1/3 py-2.5">
              <div className="h-2 bg-ed-field"><div className="h-full rounded-r bg-ed-soft" style={{ width: `${(count / max) * 100}%` }} /></div>
            </td>
            <td className="w-14 py-2.5 text-right tabular-nums text-ed-ink">{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
