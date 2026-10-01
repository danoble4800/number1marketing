'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, RefreshCw } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import type { CardPage, CardRow, Plan } from '@/lib/cards/types';
import { PLANS } from '@/lib/cards/plans';
import StatsTab from '@/components/cards/editor/StatsTab';
import ChipUrl from '@/components/cards/ChipUrl';

// From rep_tap_cards(): the cards given to this rep, the pages they're on, and tap counts.
type PageRow = Pick<CardPage, 'id' | 'slug' | 'display_name' | 'plan' | 'published' | 'created_at' | 'links' | 'review'>;
type Counts = { taps: number; views?: number; taps_all: number; last_tap: string | null };
type RepCards = { cards: CardRow[]; pages: PageRow[]; stats: { pages: Record<string, Counts>; cards: Record<string, Counts> } };

const NO_COUNTS: Counts = { taps: 0, views: 0, taps_all: 0, last_tap: null };
const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';

// The Tap Cards tab of /team: like the admin one, but only the cards Dan has given this
// rep (Admin → Tap Cards → Rep) and read-only. `repId` is set when an admin views a rep.
export default function TapCardsTeam({ repId }: { repId?: string }) {
  const [data, setData] = useState<RepCards | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unclaimed' | 'claimed'>('all');
  const [openPage, setOpenPage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: json, error: err } = await getSupabase().rpc('rep_tap_cards', { p_days: 30, p_rep: repId ?? null });
    if (err) setError('Couldn’t load your tap cards. Try again in a minute.');
    else {
      setError('');
      setData(json as RepCards);
    }
    setLoading(false);
  }, [repId]);

  useEffect(() => { load(); }, [load]);

  const cards = data?.cards ?? [];
  const pages = data?.pages ?? [];
  const pageById = new Map(pages.map((p) => [p.id, p]));
  const pageCounts = (id: string) => data?.stats.pages[id] ?? NO_COUNTS;
  const cardCounts = (id: string) => data?.stats.cards[id] ?? NO_COUNTS;
  const shown = cards.filter((c) => (filter === 'all' ? true : filter === 'claimed' ? !!c.page_id : !c.page_id));
  const taps30 = Object.values(data?.stats.pages ?? {}).reduce((n, c) => n + c.taps, 0);
  const sortedPages = [...pages].sort((a, b) => pageCounts(b.id).taps - pageCounts(a.id).taps);

  return (
    <div className="space-y-8 pb-16 text-brand-offwhite">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-brand-light1 mb-1.5">My</p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight leading-none text-brand-white">Tap Cards</h1>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/en/cards" target="_blank" className="text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white">Sales page ↗</Link>
          <Link href="/card/edit?demo=pizza" target="_blank" className="text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white">Demo editor ↗</Link>
          <button type="button" onClick={load} disabled={loading} aria-label="Refresh" className="text-brand-light1 hover:text-brand-white">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {error && <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-px bg-brand-dark2 sm:grid-cols-5">
        {[
          ['Taps · 30 days', taps30],
          ['My cards', cards.length],
          ['Claimed', cards.filter((c) => c.page_id).length],
          ['Pages', pages.length],
          ['Paid pages', pages.filter((p) => p.plan !== 'free').length],
        ].map(([k, v]) => (
          <div key={k} className="bg-brand-dark1 p-4">
            <p className="text-2xl font-semibold tabular-nums text-brand-white">{loading && !data ? '–' : v}</p>
            <p className="mt-1 text-xs text-brand-light1">{k}</p>
          </div>
        ))}
      </div>

      {!loading && !error && cards.length === 0 && (
        <p className="border border-dashed border-brand-dark2 px-4 py-8 text-center text-sm text-brand-mid">
          No cards are assigned to you yet. Dan assigns them in Admin → Tap Cards.
        </p>
      )}

      {cards.length > 0 && (
        <section className="border border-brand-dark2 bg-brand-dark1">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-dark2 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-white">Cards</h2>
            <div className="flex gap-1 text-xs">
              {(['all', 'unclaimed', 'claimed'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} className={`px-2.5 py-1 uppercase tracking-wider ${filter === f ? 'bg-brand-white text-brand-black' : 'text-brand-light1'}`}>{f}</button>
              ))}
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-brand-mid">
                <tr><th className="px-5 py-2">Card</th><th className="py-2">Chip URL</th><th className="py-2">Business page</th><th className="py-2">Label</th><th className="py-2">Taps · 30d / all</th><th className="px-5 py-2 text-right">Status</th></tr>
              </thead>
              <tbody>
                {shown.map((c) => {
                  const p = c.page_id ? pageById.get(c.page_id) : null;
                  return (
                    <tr key={c.id} className="border-t border-brand-dark2">
                      <td className="px-5 py-2.5 font-mono text-brand-white">{c.id}</td>
                      <td className="py-2.5 pr-4"><ChipUrl id={c.id} /></td>
                      <td className="py-2.5">{p ? <a href={`/c/${p.slug}`} target="_blank" rel="noopener noreferrer" className="underline">{p.display_name || p.slug}</a> : <span className="text-brand-mid">Not claimed yet</span>}</td>
                      <td className="py-2.5 text-brand-light1">{c.label}</td>
                      <td className="py-2.5 tabular-nums text-brand-light1">
                        {c.page_id ? <><span className="text-brand-white">{cardCounts(c.id).taps}</span> / {cardCounts(c.id).taps_all}</> : '—'}
                      </td>
                      <td className={`px-5 py-2.5 text-right text-xs ${c.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{c.status}</td>
                    </tr>
                  );
                })}
                {shown.length === 0 && <tr><td colSpan={6} className="px-5 py-6 text-center text-brand-mid">No cards.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {pages.length > 0 && (
        <section className="border border-brand-dark2 bg-brand-dark1">
          <h2 className="border-b border-brand-dark2 px-5 py-4 text-sm font-semibold uppercase tracking-widest text-brand-white">Business pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-brand-mid">
                <tr>
                  <th className="px-5 py-2">Page</th><th className="py-2">Created</th><th className="py-2">Cards</th>
                  <th className="py-2">Taps · 30d</th><th className="py-2">Views · 30d</th><th className="py-2">Taps · all</th>
                  <th className="py-2">Last tap</th><th className="py-2" /><th className="px-5 py-2 text-right">Plan</th>
                </tr>
              </thead>
              <tbody>
                {sortedPages.map((p) => (
                  <Fragment key={p.id}>
                    <tr className="border-t border-brand-dark2">
                      <td className="px-5 py-2.5">
                        <a href={`/c/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-brand-white underline">{p.display_name || p.slug}</a>
                        {!p.published && <span className="ml-2 text-xs text-brand-mid">hidden</span>}
                      </td>
                      <td className="py-2.5 text-brand-light1">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5 text-brand-light1">{cards.filter((c) => c.page_id === p.id).length}</td>
                      <td className="py-2.5 tabular-nums text-brand-white">{pageCounts(p.id).taps}</td>
                      <td className="py-2.5 tabular-nums text-brand-light1">{pageCounts(p.id).views ?? 0}</td>
                      <td className="py-2.5 tabular-nums text-brand-light1">{pageCounts(p.id).taps_all}</td>
                      <td className="py-2.5 text-brand-light1">{shortDate(pageCounts(p.id).last_tap)}</td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => setOpenPage(openPage === p.id ? null : p.id)}
                          aria-expanded={openPage === p.id}
                          className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest ${openPage === p.id ? 'text-brand-white' : 'text-brand-light1 hover:text-brand-white'}`}
                        >
                          <BarChart3 size={13} /> Stats
                        </button>
                      </td>
                      <td className="px-5 py-2.5 text-right text-xs text-brand-light2">{PLANS[p.plan as Plan]?.name ?? p.plan}</td>
                    </tr>
                    {openPage === p.id && (
                      <tr className="border-t border-brand-dark2 bg-brand-near-black">
                        <td colSpan={9} className="px-5 py-5">
                          <StatsTab page={p as CardPage} demo={false} onUpgrade={() => {}} admin />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
