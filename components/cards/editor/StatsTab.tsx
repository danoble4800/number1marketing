'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { CardPage, PageStats } from '@/lib/cards/types';
import { can } from '@/lib/cards/plans';
import { demoStats } from '@/lib/cards/demo';
import { linkNames } from '@/lib/cards/links';
import { getSupabase } from '@/lib/supabase';
import { Section } from './ui';

// admin: opened from the admin Tap Cards tab, so every stat shows whatever the plan
// and the audit pitch meant for the customer is left out.
type Props = { page: CardPage; demo: boolean; onUpgrade: () => void; admin?: boolean };

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

export default function StatsTab({ page, demo, onUpgrade, admin = false }: Props) {
  const [days, setDays] = useState(30);
  const { stats: real, error } = usePageStats(page, demo, days);
  const [sample, setSample] = useState(false);

  const full = admin || can(page.plan, 'fullStats');

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!real) return <p className="text-sm text-brand-light1">Loading stats…</p>;

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
        <div className="flex flex-wrap items-center justify-between gap-3 border border-brand-dark2 bg-brand-dark1 px-5 py-4 text-sm">
          <span className="text-brand-light1">
            {sample ? 'Showing sample data. These aren’t your real numbers.' : 'No taps yet. Your numbers show up here after the first tap.'}
          </span>
          <button
            type="button"
            onClick={() => setSample(!sample)}
            className="border border-brand-mid px-3 py-1.5 text-xs uppercase tracking-widest text-brand-offwhite hover:border-brand-white"
          >
            {sample ? 'Hide sample' : 'Show sample data'}
          </button>
        </div>
      )}

      {full && (
        <div className="flex items-start gap-3 border border-brand-dark2 bg-brand-dark1 px-5 py-4">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-brand-light1" />
          <p className="text-base leading-relaxed text-brand-white">{insight(page, stats, days)}</p>
        </div>
      )}

      {!full && (
        <Section title="Your card so far">
          <p className="font-display text-6xl text-brand-white">{stats.all_time.tap ?? 0}</p>
          <p className="mt-1 text-sm text-brand-light1">total taps, all time</p>
        </Section>
      )}

      <Section
        title="Last days"
        locked={full ? null : 'pro'}
        onUpgrade={onUpgrade}
        right={
          full && (
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="border border-brand-dark2 bg-brand-black px-2 py-1 text-xs text-brand-offwhite">
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          )
        }
      >
        <div className="grid grid-cols-2 gap-px bg-brand-dark2 sm:grid-cols-5">
          {tiles.map((t) => (
            <div key={t.label} className="bg-brand-dark1 p-4">
              <p className="text-2xl font-semibold tabular-nums text-brand-white">{t.value.toLocaleString()}</p>
              <p className="mt-1 text-xs text-brand-light1">{t.label}</p>
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
                  <span className="w-8 text-brand-light1">{r}★</span>
                  <div className="h-2.5 flex-1 bg-brand-black">
                    <div className="h-full rounded-r bg-brand-offwhite" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums text-brand-offwhite">{count}</span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {!admin && (
        <a
          href={`/en/audit?utm_source=tapcard&utm_medium=dashboard&utm_campaign=${encodeURIComponent(page.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 border border-brand-light1 bg-brand-white p-5 text-brand-black"
        >
          <span>
            <span className="block text-sm font-semibold uppercase tracking-widest">
              {n('tap') > 0 ? `${n('tap')} taps. How many became customers?` : 'Turn taps into customers'}
            </span>
            <span className="mt-1 block text-sm text-brand-mid">
              Book a free 30-minute audit. We’ll show you how to turn your card, reviews and website into more bookings.
            </span>
          </span>
          <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
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
      <p className="mb-3 text-xs text-brand-light1">Taps per day</p>
      <div className="relative">
        <div className="flex h-36 items-end gap-[2px] border-b border-brand-dark2">
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
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap border border-brand-dark2 bg-brand-black px-2.5 py-1.5 text-xs text-brand-offwhite shadow-lg"
            style={{ left: `${((hover + 0.5) / series.length) * 100}%` }}
          >
            <span className="text-brand-light1">{fmt(series[hover].day)}</span> · {series[hover].taps} taps · {series[hover].views} views
          </div>
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-brand-mid">
        <span>{fmt(series[0].day)}</span>
        <span>{fmt(series[series.length - 1].day)}</span>
      </div>
    </div>
  );
}

function LinkTable({ page, stats }: { page: CardPage; stats: PageStats }) {
  const named = linkNames(page.links ?? []);
  const rows = Object.entries(stats.links).sort((a, b) => b[1] - a[1]);
  if (rows.length === 0) return <p className="text-sm text-brand-mid">No clicks yet.</p>;
  const max = rows[0][1];
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([id, count]) => (
          <tr key={id} className="border-b border-brand-dark2 last:border-0">
            <td className="py-2.5 pr-3 text-brand-offwhite">{named[id] ?? 'Removed link'}</td>
            <td className="w-1/3 py-2.5">
              <div className="h-2 bg-brand-black"><div className="h-full rounded-r bg-brand-light2" style={{ width: `${(count / max) * 100}%` }} /></div>
            </td>
            <td className="w-14 py-2.5 text-right tabular-nums text-brand-white">{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
