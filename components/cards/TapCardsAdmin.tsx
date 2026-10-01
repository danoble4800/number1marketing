'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Copy, Download, Power } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import type { CardPage, CardRow, Plan } from '@/lib/cards/types';
import { PLAN_ORDER, PLANS } from '@/lib/cards/plans';
import { inputCls } from '@/components/cards/editor/ui';
import StatsTab from '@/components/cards/editor/StatsTab';

type PageRow = Pick<CardPage, 'id' | 'slug' | 'display_name' | 'plan' | 'published' | 'created_at' | 'stripe_subscription_id'>;

// From admin_card_stats(): counts for the last 30 days plus all time. No visitor details.
type Counts = { taps: number; views?: number; taps_all: number; last_tap: string | null };
type AdminStats = { pages: Record<string, Counts>; cards: Record<string, Counts> };
type SortKey = 'created' | 'taps' | 'views' | 'taps_all' | 'last_tap';

const NO_COUNTS: Counts = { taps: 0, views: 0, taps_all: 0, last_tap: null };
const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';

// The Tap Cards section of the admin CRM (/[locale]/admin → Tap Cards tab).
// AdminDashboard has already checked that the viewer is an admin; RLS enforces it too.
export default function TapCardsAdmin() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [count, setCount] = useState(10);
  const [label, setLabel] = useState('');
  const [redirect, setRedirect] = useState('/en/audit?utm_source=nfc');
  const [useRedirect, setUseRedirect] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'unclaimed' | 'claimed' | 'disabled'>('all');
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState('');
  const [sort, setSort] = useState<SortKey>('taps');
  const [openPage, setOpenPage] = useState<CardPage | null>(null);
  const [reps, setReps] = useState<{ id: string; name: string }[]>([]);
  const [mintRep, setMintRep] = useState('');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const load = useCallback(async () => {
    const supabase = getSupabase();
    const [c, p, r] = await Promise.all([
      supabase.from('cards').select('*').order('created_at', { ascending: false }).limit(1000),
      supabase.from('card_pages').select('id, slug, display_name, plan, published, created_at, stripe_subscription_id').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('role', 'rep'),
    ]);
    setCards((c.data as CardRow[]) ?? []);
    setPages((p.data as PageRow[]) ?? []);
    // Sales reps, by the first name in rep_name ("Sergi, Sergy" → "Sergi").
    setReps(((r.data ?? []) as { id: string; rep_name?: string; full_name?: string }[])
      .map((x) => ({ id: x.id, name: (x.rep_name || x.full_name || '').split(',')[0].trim() || 'Rep' }))
      .sort((a, b) => a.name.localeCompare(b.name)));
    const { data, error } = await supabase.rpc('admin_card_stats', { p_days: 30 });
    if (error) {
      // PGRST202: the function hasn't been added in Supabase yet
      setStatsError(error.code === 'PGRST202'
        ? 'Tap stats need a one-time database update: run admin_card_stats from supabase/cards.sql in the Supabase SQL editor.'
        : 'Couldn’t load tap stats.');
    } else {
      setStatsError('');
      setStats(data as AdminStats);
    }
  }, []);

  // Full stats for one page, the same view its owner sees, with every section unlocked.
  async function toggleStats(id: string) {
    if (openPage?.id === id) { setOpenPage(null); return; }
    const { data } = await getSupabase().from('card_pages').select('*').eq('id', id).single();
    if (data) setOpenPage(data as CardPage);
  }

  useEffect(() => { load(); }, [load]);

  async function mint(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    const { data, error } = await getSupabase().rpc('create_cards', {
      p_count: count,
      p_label: label,
      p_redirect: useRedirect ? redirect : null,
      p_rep: mintRep || null,
    });
    if (error) { setMsg(error.message); return; }
    setFresh(data as string[]);
    load();
  }

  async function setStatus(c: CardRow, status: 'active' | 'disabled') {
    await getSupabase().rpc('set_card_status', { p_card: c.id, p_status: status });
    load();
  }

  async function setCardRedirect(c: CardRow) {
    const v = prompt('Where should this card go until someone claims it? Leave blank for the claim screen.', c.redirect_url ?? '');
    if (v === null) return;
    setMsg('');
    const { error } = await getSupabase().from('cards').update({ redirect_url: v.trim() || null }).eq('id', c.id);
    if (error) { setMsg(`Couldn’t update the redirect: ${error.message}`); return; }
    load();
  }

  // Which sales rep a card belongs to; it then shows on their /team Tap Cards tab.
  async function setCardRep(c: CardRow, repId: string) {
    setMsg('');
    const { error } = await getSupabase().from('cards').update({ rep_id: repId || null }).eq('id', c.id);
    if (error) { setMsg(`Couldn’t change the rep: ${error.message}`); return; }
    load();
  }

  async function setPlan(p: PageRow, plan: Plan) {
    if (p.stripe_subscription_id && !confirm('This page has a Stripe subscription. Stripe may change the plan back. Continue?')) return;
    setMsg('');
    const { error } = await getSupabase().from('card_pages').update({ plan }).eq('id', p.id);
    if (error) { setMsg(`Couldn’t change the plan: ${error.message}`); return; }
    load();
  }

  function csv(ids: string[]) {
    const rows = [['Card ID', 'Chip URL', 'QR URL'], ...ids.map((id) => [id, `${origin}/t/${id}`, `${origin}/t/${id}?src=qr`])];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tap-cards-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const pageById = new Map(pages.map((p) => [p.id, p]));
  const shown = cards.filter((c) =>
    filter === 'all' ? true : filter === 'disabled' ? c.status === 'disabled' : filter === 'claimed' ? !!c.page_id : !c.page_id,
  );
  const pageCounts = (id: string) => stats?.pages[id] ?? NO_COUNTS;
  const cardCounts = (id: string) => stats?.cards[id] ?? NO_COUNTS;
  const sortedPages = [...pages].sort((a, b) => {
    if (sort === 'created') return b.created_at.localeCompare(a.created_at);
    if (sort === 'last_tap') return (pageCounts(b.id).last_tap ?? '').localeCompare(pageCounts(a.id).last_tap ?? '');
    return (pageCounts(b.id)[sort] ?? 0) - (pageCounts(a.id)[sort] ?? 0);
  });
  const taps30 = Object.values(stats?.pages ?? {}).reduce((n, c) => n + c.taps, 0);
  const sortHeader = (key: SortKey, label: string, className = 'py-2') => (
    <th className={className}>
      <button
        type="button"
        onClick={() => setSort(key)}
        className={`uppercase tracking-widest ${sort === key ? 'text-brand-white' : 'hover:text-brand-light2'}`}
      >
        {label}{sort === key ? ' ↓' : ''}
      </button>
    </th>
  );
  const mrr = pages.reduce((n, p) => n + (p.plan === 'pro' ? 10 : p.plan === 'business' ? 30 : 0), 0);

  return (
    <div className="text-brand-offwhite">
      <div className="space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl uppercase tracking-tight text-brand-white">Tap Cards</h1>
          <div className="flex flex-wrap gap-5">
            <Link href="/en/cards" target="_blank" className="text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white">Sales page ↗</Link>
            <Link href="/card/edit?demo=pizza" target="_blank" className="text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white">Demo editor ↗</Link>
            <Link href="/card/edit" target="_blank" className="text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white">My pages ↗</Link>
          </div>
        </header>

        {msg && <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">{msg}</p>}

        <div className="grid grid-cols-2 gap-px bg-brand-dark2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Taps · 30 days', stats ? taps30 : '—'],
            ['Cards made', cards.length],
            ['Claimed', cards.filter((c) => c.page_id).length],
            ['Pages', pages.length],
            ['Paid pages', pages.filter((p) => p.plan !== 'free').length],
            ['Est. MRR', `$${mrr}`],
          ].map(([k, v]) => (
            <div key={k} className="bg-brand-dark1 p-4">
              <p className="text-2xl font-semibold tabular-nums text-brand-white">{v}</p>
              <p className="mt-1 text-xs text-brand-light1">{k}</p>
            </div>
          ))}
        </div>

        <section className="border border-brand-dark2 bg-brand-dark1 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-white">Make new cards</h2>
          <p className="mt-1 text-xs text-brand-light1">
            Each card gets a permanent chip URL. Write it to the NFC chip (NFC Tools app → Write → URL). Print the QR URL on the back.
          </p>
          <form onSubmit={mint} className="mt-4 grid gap-3 sm:grid-cols-[100px_1fr_auto]">
            <input className={inputCls} type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="How many" />
            <input className={inputCls} placeholder="Batch label, e.g. “Matte black · Oct 2026”" value={label} onChange={(e) => setLabel(e.target.value)} />
            <button type="submit" className="bg-brand-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-black">Create</button>
          </form>
          <label className="mt-3 flex flex-wrap items-center gap-2 text-sm text-brand-light2">
            <input type="checkbox" checked={useRedirect} onChange={(e) => setUseRedirect(e.target.checked)} />
            Until claimed, send taps to
            <input className={`${inputCls} max-w-xs`} value={redirect} onChange={(e) => setRedirect(e.target.value)} disabled={!useRedirect} />
          </label>
          {reps.length > 0 && (
            <label className="mt-3 flex flex-wrap items-center gap-2 text-sm text-brand-light2">
              Give these cards to
              <select className={`${inputCls} max-w-[12rem]`} value={mintRep} onChange={(e) => setMintRep(e.target.value)}>
                <option value="">No rep</option>
                {reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </label>
          )}
          {fresh.length > 0 && (
            <div className="mt-4 border border-brand-dark2 bg-brand-black p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-brand-white">{fresh.length} new cards</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => navigator.clipboard.writeText(fresh.map((id) => `${origin}/t/${id}`).join('\n'))} className="flex items-center gap-1.5 border border-brand-mid px-2.5 py-1 text-xs"><Copy size={12} /> Copy URLs</button>
                  <button type="button" onClick={() => csv(fresh)} className="flex items-center gap-1.5 border border-brand-mid px-2.5 py-1 text-xs"><Download size={12} /> CSV</button>
                </div>
              </div>
              <pre className="max-h-48 overflow-auto font-mono text-xs text-brand-light2">{fresh.map((id) => `${origin}/t/${id}`).join('\n')}</pre>
            </div>
          )}
        </section>

        <section className="border border-brand-dark2 bg-brand-dark1">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-dark2 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-white">Cards</h2>
            <div className="flex gap-1 text-xs">
              {(['all', 'unclaimed', 'claimed', 'disabled'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} className={`px-2.5 py-1 uppercase tracking-wider ${filter === f ? 'bg-brand-white text-brand-black' : 'text-brand-light1'}`}>{f}</button>
              ))}
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-brand-mid">
                <tr><th className="px-5 py-2">Card</th><th className="py-2">Page</th><th className="py-2">Label</th><th className="py-2">Rep</th><th className="py-2">Taps · 30d / all</th><th className="py-2">Unclaimed goes to</th><th className="px-5 py-2 text-right">Status</th></tr>
              </thead>
              <tbody>
                {shown.map((c) => {
                  const p = c.page_id ? pageById.get(c.page_id) : null;
                  return (
                    <tr key={c.id} className="border-t border-brand-dark2">
                      <td className="px-5 py-2.5 font-mono text-brand-white">{c.id}</td>
                      <td className="py-2.5">{p ? <a href={`/c/${p.slug}`} target="_blank" rel="noopener noreferrer" className="underline">{p.display_name || p.slug}</a> : <span className="text-brand-mid">Unclaimed</span>}</td>
                      <td className="py-2.5 text-brand-light1">{c.label}</td>
                      <td className="py-2.5">
                        <select
                          value={c.rep_id ?? ''}
                          onChange={(e) => setCardRep(c, e.target.value)}
                          aria-label={`Rep for card ${c.id}`}
                          className="border border-brand-dark2 bg-brand-black px-2 py-1 text-xs"
                        >
                          <option value="">—</option>
                          {reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </td>
                      <td className="py-2.5 tabular-nums text-brand-light1">
                        {c.page_id ? <><span className="text-brand-white">{cardCounts(c.id).taps}</span> / {cardCounts(c.id).taps_all}</> : '—'}
                      </td>
                      <td className="py-2.5">
                        {!c.page_id && (
                          <button type="button" onClick={() => setCardRedirect(c)} className="text-xs text-brand-light1 underline">{c.redirect_url || 'Claim screen'}</button>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setStatus(c, c.status === 'active' ? 'disabled' : 'active')}
                          className={`inline-flex items-center gap-1 text-xs ${c.status === 'active' ? 'text-green-400' : 'text-red-400'}`}
                        >
                          <Power size={12} /> {c.status}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {shown.length === 0 && <tr><td colSpan={7} className="px-5 py-6 text-center text-brand-mid">No cards.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-brand-dark2 bg-brand-dark1">
          <h2 className="border-b border-brand-dark2 px-5 py-4 text-sm font-semibold uppercase tracking-widest text-brand-white">Pages</h2>
          {statsError && <p className="border-b border-brand-dark2 px-5 py-3 text-sm text-red-400">{statsError}</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-brand-mid">
                <tr>
                  <th className="px-5 py-2">Page</th>
                  {sortHeader('created', 'Created')}
                  <th className="py-2">Cards</th>
                  {sortHeader('taps', 'Taps · 30d')}
                  {sortHeader('views', 'Views · 30d')}
                  {sortHeader('taps_all', 'Taps · all')}
                  {sortHeader('last_tap', 'Last tap')}
                  <th className="py-2" />
                  <th className="px-5 py-2 text-right">Plan</th>
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
                      <td className="py-2.5 tabular-nums text-brand-white">{stats ? pageCounts(p.id).taps : '—'}</td>
                      <td className="py-2.5 tabular-nums text-brand-light1">{stats ? pageCounts(p.id).views ?? 0 : '—'}</td>
                      <td className="py-2.5 tabular-nums text-brand-light1">{stats ? pageCounts(p.id).taps_all : '—'}</td>
                      <td className="py-2.5 text-brand-light1">{stats ? shortDate(pageCounts(p.id).last_tap) : '—'}</td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => toggleStats(p.id)}
                          aria-expanded={openPage?.id === p.id}
                          className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest ${openPage?.id === p.id ? 'text-brand-white' : 'text-brand-light1 hover:text-brand-white'}`}
                        >
                          <BarChart3 size={13} /> Stats
                        </button>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <select value={p.plan} onChange={(e) => setPlan(p, e.target.value as Plan)} className="border border-brand-dark2 bg-brand-black px-2 py-1 text-xs">
                          {PLAN_ORDER.map((pl) => <option key={pl} value={pl}>{PLANS[pl].name}</option>)}
                        </select>
                      </td>
                    </tr>
                    {openPage?.id === p.id && (
                      <tr className="border-t border-brand-dark2 bg-brand-near-black">
                        <td colSpan={9} className="px-5 py-5">
                          <StatsTab page={openPage} demo={false} onUpgrade={() => {}} admin />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {pages.length === 0 && <tr><td colSpan={9} className="px-5 py-6 text-center text-brand-mid">No pages yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
