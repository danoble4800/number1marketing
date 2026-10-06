'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ExternalLink, Home, LogOut, Plus, Smartphone, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import type { CardLink, CardPage, Plan } from '@/lib/cards/types';
import { DEMO_PAGES } from '@/lib/cards/demo';
import { planAtLeast } from '@/lib/cards/plans';
import { createPage, listMyPages, slugAvailable, slugify, slugTyping } from '@/lib/cards/client';
import CardView from '../CardView';
import PageTab from './PageTab';
import LookTab from './LookTab';
import StatsTab from './StatsTab';
import LeadsTab from './LeadsTab';
import CardsTab from './CardsTab';
import PlanTab from './PlanTab';
import { UndoToast, inputCls, jumpTo, type Undoable } from './ui';

const TABS = [
  { id: 'page', name: 'Page' },
  { id: 'look', name: 'Look' },
  { id: 'stats', name: 'Stats' },
  { id: 'leads', name: 'Contacts' },
  { id: 'cards', name: 'Cards & QR' },
  { id: 'plan', name: 'Plan' },
] as const;
type Tab = (typeof TABS)[number]['id'];

const EDITABLE: (keyof CardPage)[] = [
  'slug', 'published', 'display_name', 'headline', 'bio', 'avatar_url', 'cover_url', 'contact', 'links',
  'theme', 'review', 'special', 'lead_capture', 'lead_notify_email', 'hide_badge', 'lang',
];
// Everything autosaves except the address, which is checked and saved when its box loses focus.
const AUTOSAVE = EDITABLE.filter((k) => k !== 'slug');
const AUTOSAVE_MS = 800;

const changed = (a: CardPage, b: CardPage, keys: (keyof CardPage)[]) =>
  keys.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));

// Preview focus targets besides link ids (see data-focus in PageTab, zone() in CardView).
const FOCUS_ZONES = ['profile', 'contact', 'special', 'review', 'leads'];

export default function Editor() {
  const router = useRouter();
  const search = useSearchParams();
  const demoKey = search.get('demo');
  const demo = demoKey !== null;

  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pages, setPages] = useState<CardPage[] | null>(null);
  const [currentId, setCurrentId] = useState<string>('');
  const [draft, setDraft] = useState<CardPage | null>(null);
  const [tab, setTab] = useState<Tab>((search.get('tab') as Tab) || 'page');
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [focusId, setFocusId] = useState<string | null>(null);
  const [undo, setUndo] = useState<Undoable | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [creating, setCreating] = useState(false);

  // Load demo pages or the signed-in owner's pages.
  useEffect(() => {
    if (demo) {
      const list = DEMO_PAGES.map((p) => structuredClone(p));
      const start = list.find((p) => p.slug === `demo-${demoKey}`) ?? list[2];
      setPages(list);
      setCurrentId(start.id);
      setDraft(structuredClone(start));
      return;
    }
    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/card'); return; }
      setSession(data.session);
      getCurrentProfile().then((p) => setIsAdmin(p?.role === 'admin'));
      const mine = await listMyPages();
      setPages(mine);
      if (mine[0]) {
        setCurrentId(mine[0].id);
        setDraft(structuredClone(mine[0]));
      }
    });
  }, [demo, demoKey, router]);

  const saved = pages?.find((p) => p.id === currentId) ?? null;
  const dirty = useMemo(() => !!draft && !!saved && changed(draft, saved, AUTOSAVE).length > 0, [draft, saved]);
  const slugDirty = !!draft && !!saved && draft.slug !== saved.slug;

  // Saves read the latest draft/saved row through refs, so a queued save never sends stale data.
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const savedRef = useRef(saved);
  savedRef.current = saved;
  const queue = useRef<Promise<void>>(Promise.resolve());

  // Saves are chained so they never overlap. Only changed columns are sent, and the draft is left
  // alone afterwards so typing that happens mid-save isn't overwritten.
  const save = useCallback(
    (withSlug = false) => {
      const run = queue.current.then(async () => {
        const d = draftRef.current;
        const s = savedRef.current;
        if (demo || !d || !s || d.id !== s.id) return;
        const keys = changed(d, s, withSlug ? EDITABLE : AUTOSAVE);
        if (keys.length === 0) return;
        setStatus('saving');
        const patch = Object.fromEntries(keys.map((k) => [k, k === 'slug' ? slugify(d.slug) : d[k]]));
        const { data, error } = await getSupabase().from('card_pages').update(patch).eq('id', d.id).select('*').single();
        if (error || !data) { setStatus('error'); return; }
        const row = data as CardPage;
        savedRef.current = row;
        setPages((ps) => ps?.map((p) => (p.id === row.id ? row : p)) ?? null);
        if (keys.includes('slug')) setDraft((cur) => (cur && cur.id === row.id ? { ...cur, slug: row.slug } : cur));
        setStatus('saved');
      }).catch(() => setStatus('error')); // keep the chain alive so later saves still run
      queue.current = run;
      return run;
    },
    [demo],
  );

  useEffect(() => {
    if (!dirty || demo) return;
    const t = setTimeout(() => save(), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [draft, dirty, demo, save]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (demo || !(dirty || slugDirty || status !== 'saved')) return;
      save();
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, slugDirty, status, demo, save]);

  async function commitSlug() {
    const d = draftRef.current;
    const s = savedRef.current;
    if (demo || !d || !s) return;
    const slug = slugify(d.slug);
    if (slug === s.slug) { if (d.slug !== slug) set({ slug }); return; }
    if (slug.length < 3) { setNotice({ kind: 'err', text: 'Page address needs at least 3 letters or numbers.' }); return; }
    if (!(await slugAvailable(slug))) { setNotice({ kind: 'err', text: `“${slug}” is taken. Try another page address.` }); return; }
    await save(true);
    if (savedRef.current?.slug === slug) setNotice({ kind: 'ok', text: `Page address changed to /c/${slug}. Your cards keep working.` });
  }

  // Undo toast: the newest one wins; the previous one is committed (e.g. its contact is really deleted).
  const undoRef = useRef<Undoable | null>(null);
  const showUndo = useCallback((u: Undoable) => {
    undoRef.current?.commit?.();
    undoRef.current = u;
    setUndo(u);
  }, []);
  const closeUndo = useCallback((how: 'undo' | 'commit') => {
    const u = undoRef.current;
    if (!u) return;
    undoRef.current = null;
    setUndo(null);
    if (how === 'undo') u.undo();
    else u.commit?.();
  }, []);
  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => closeUndo('commit'), 6000);
    return () => clearTimeout(t);
  }, [undo, closeUndo]);
  useEffect(() => {
    const commit = () => closeUndo('commit');
    window.addEventListener('pagehide', commit);
    return () => { window.removeEventListener('pagehide', commit); commit(); };
  }, [closeUndo]);

  const set = useCallback((patch: Partial<CardPage>) => setDraft((d) => (d ? { ...d, ...patch } : d)), []);
  const setLinks = useCallback(
    (fn: (links: CardLink[]) => CardLink[]) => setDraft((d) => (d ? { ...d, links: fn(d.links ?? []) } : d)),
    [],
  );

  // Deep links like /card/edit?tab=look#buttons scroll to that setting once the tab renders.
  const loaded = !!draft;
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (loaded && id) requestAnimationFrame(() => jumpTo(id));
  }, [tab, loaded]);

  // The column reports which part of the page is being edited, from the nearest [data-focus].
  const trackFocus = (e: React.SyntheticEvent) => {
    const zone = (e.target as HTMLElement).closest<HTMLElement>('[data-focus]');
    setFocusId(zone?.dataset.focus ?? null);
  };
  const previewFocus =
    tab === 'page' && focusId && (FOCUS_ZONES.includes(focusId) || draft?.links?.some((l) => l.id === focusId)) ? focusId : null;

  function switchTab(t: Tab) {
    setTab(t);
    setFocusId(null);
    const params = new URLSearchParams(search.toString());
    params.set('tab', t);
    params.delete('welcome');
    params.delete('upgraded');
    router.replace(`/card/edit?${params.toString()}`, { scroll: false });
  }
  const upgrade = () => switchTab('plan');

  async function switchPage(id: string) {
    if (!demo) {
      await save();
      const d = draftRef.current;
      const s = savedRef.current;
      const pending = !!d && !!s && (changed(d, s, AUTOSAVE).length > 0 || d.slug !== s.slug);
      if (pending && !confirm('Some changes aren’t saved yet. Switch anyway?')) return;
    }
    const p = pages?.find((x) => x.id === id);
    if (!p) return;
    closeUndo('commit');
    setFocusId(null);
    setNotice(null);
    setStatus('saved');
    setCurrentId(id);
    setDraft(structuredClone(p));
  }

  function demoPlan(plan: Plan) {
    set({ plan });
    setPages((ps) => ps?.map((p) => (p.id === currentId ? { ...p, plan } : p)) ?? null);
  }

  async function signOut() {
    await getSupabase().auth.signOut();
    router.replace('/card');
  }

  const canAddPage = demo || (pages ?? []).some((p) => planAtLeast(p.plan, 'business'));

  if (!pages) {
    return <Shell><p className="p-10 text-center text-sm text-brand-light1">Loading…</p></Shell>;
  }

  if (!draft || creating) {
    return (
      <Shell>
        <CreatePage
          session={session}
          first={!draft}
          onCancel={draft ? () => setCreating(false) : undefined}
          onCreated={(p) => {
            setPages((ps) => [...(ps ?? []), p]);
            setCurrentId(p.id);
            setDraft(structuredClone(p));
            setCreating(false);
          }}
        />
      </Shell>
    );
  }

  const welcome = search.get('welcome') === '1';

  return (
    <Shell>
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-brand-dark2 bg-brand-near-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <a href="/" aria-label="Back to main site" title="Back to main site" className="flex items-center gap-1.5 border border-brand-dark2 px-2.5 py-1.5 text-xs uppercase tracking-widest text-brand-light1 hover:border-brand-light1 hover:text-brand-white">
            <Home size={14} /> <span className="hidden sm:inline">Home</span>
          </a>
          <Link href="/card" className="font-display text-base uppercase tracking-wider text-brand-white">N°1 Tap Cards</Link>
          {pages.length > 1 || canAddPage ? (
            <select
              value={currentId}
              onChange={(e) => (e.target.value === '__new' ? (canAddPage ? setCreating(true) : upgrade()) : switchPage(e.target.value))}
              className="max-w-[180px] border border-brand-dark2 bg-brand-black px-2 py-1.5 text-xs text-brand-offwhite"
            >
              {pages.map((p) => <option key={p.id} value={p.id}>{p.display_name || p.slug}</option>)}
              <option value="__new">+ New page</option>
            </select>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/en/cards" target="_blank" className="hidden text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white md:inline">Plans &amp; pricing</Link>
            {isAdmin && <Link href="/en/admin?tab=cards" className="hidden text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white sm:inline">Admin</Link>}
            <a
              href={`/c/${saved?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 border border-brand-dark2 px-3 py-2 text-xs uppercase tracking-widest text-brand-offwhite hover:border-brand-light1 sm:flex"
            >
              View <ExternalLink size={13} />
            </a>
            <SaveStatus demo={demo} status={status} pending={dirty} onRetry={() => save()} />
            {!demo && (
              <button type="button" aria-label="Sign out" title="Sign out" onClick={signOut} className="p-2 text-brand-light1 hover:text-brand-white">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => switchTab(t.id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-xs uppercase tracking-widest ${tab === t.id ? 'border-brand-white text-brand-white' : 'border-transparent text-brand-light1 hover:text-brand-white'}`}
            >
              {t.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5" onFocusCapture={trackFocus} onPointerDownCapture={trackFocus}>
          {demo && (
            <div className="border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              Demo mode: edit anything and watch the preview. Changes aren’t saved.{' '}
              <span className="whitespace-nowrap">
                Try:{' '}
                {DEMO_PAGES.map((p, i) => (
                  <button key={p.id} type="button" onClick={() => switchPage(p.id)} className="underline">
                    {p.plan}{i < DEMO_PAGES.length - 1 ? ', ' : ''}
                  </button>
                ))}
              </span>
            </div>
          )}
          {welcome && (
            <div className="border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              Your card is live! Add your photo, contact info and links below. Changes save automatically.
            </div>
          )}
          {notice && (
            <div className={`flex items-start justify-between gap-3 border px-4 py-3 text-sm ${notice.kind === 'ok' ? 'border-green-500/40 bg-green-500/10 text-green-300' : 'border-red-500/40 bg-red-500/10 text-red-300'}`}>
              {notice.text}
              <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)}><X size={15} /></button>
            </div>
          )}

          {tab === 'page' && (
            <PageTab
              page={draft}
              set={set}
              setLinks={setLinks}
              demo={demo}
              userId={session?.user.id ?? null}
              onUpgrade={upgrade}
              onUndoable={showUndo}
              onSlugBlur={commitSlug}
            />
          )}
          {tab === 'look' && <LookTab page={draft} set={set} onUpgrade={upgrade} />}
          {tab === 'stats' && <StatsTab page={draft} demo={demo} onUpgrade={upgrade} />}
          {tab === 'leads' && <LeadsTab page={draft} demo={demo} onUpgrade={upgrade} onUndoable={showUndo} />}
          {tab === 'cards' && <CardsTab page={saved ?? draft} demo={demo} />}
          {tab === 'plan' && <PlanTab page={draft} demo={demo} onDemoPlan={demoPlan} upgraded={search.get('upgraded') === '1'} />}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <PhoneFrame page={draft} focusId={previewFocus} />
            <p className="mt-3 text-center text-xs text-brand-mid">Live preview · /c/{draft.slug}</p>
          </div>
        </aside>
      </div>

      {/* Mobile preview */}
      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-brand-white px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-black shadow-xl lg:hidden"
      >
        <Smartphone size={16} /> Preview
      </button>
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black lg:hidden">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="fixed right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white"
          >
            <X size={14} /> Close
          </button>
          <CardView page={draft} preview />
        </div>
      )}

      {undo && <UndoToast item={undo} onUndo={() => closeUndo('undo')} onClose={() => closeUndo('commit')} />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-brand-near-black pb-24 text-brand-offwhite">{children}</div>;
}

function SaveStatus({
  demo, status, pending, onRetry,
}: {
  demo: boolean;
  status: 'saved' | 'saving' | 'error';
  pending: boolean;
  onRetry: () => void;
}) {
  const base = 'flex items-center gap-1.5 px-1 py-2 text-xs uppercase tracking-widest';
  if (demo) return <span className={`${base} text-brand-mid`}>Demo · not saved</span>;
  if (status === 'error') {
    return (
      <button type="button" onClick={onRetry} className={`${base} text-red-300 hover:text-red-200`}>
        Couldn’t save · <span className="underline">Retry</span>
      </button>
    );
  }
  if (status === 'saving' || pending) return <span aria-live="polite" className={`${base} text-brand-light1`}>Saving…</span>;
  return (
    <span aria-live="polite" className={`${base} text-brand-light1`}>
      <Check size={14} className="text-green-400" /> Saved
    </span>
  );
}

// Keeps the highlighted part of the page in view inside the phone while you edit it.
function PhoneFrame({ page, focusId }: { page: CardPage; focusId: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = focusId ? box.current?.querySelector<HTMLElement>('[data-preview-focus]') : null;
    if (!box.current || !el) return;
    const top = el.getBoundingClientRect().top - box.current.getBoundingClientRect().top + box.current.scrollTop;
    box.current.scrollTo({ top: Math.max(0, top - box.current.clientHeight / 3), behavior: 'smooth' });
  }, [focusId]);

  return (
    <div className="mx-auto h-[760px] w-[372px] overflow-hidden rounded-[44px] border-[10px] border-[#222226] bg-black shadow-2xl">
      <div ref={box} className="h-full overflow-y-auto [scrollbar-width:none]">
        <CardView page={page} preview focusId={focusId} />
      </div>
    </div>
  );
}

function CreatePage({
  session, first, onCreated, onCancel,
}: {
  session: Session | null;
  first: boolean;
  onCreated: (p: CardPage) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setError('');
    const s = slugify(slug || name);
    if (s.length < 3) { setError('Pick a page address with at least 3 letters or numbers.'); return; }
    setBusy(true);
    if (!(await slugAvailable(s))) { setError(`“${s}” is taken. Try another.`); setBusy(false); return; }
    try {
      onCreated(await createPage(session.user.id, name.trim(), s, first ? session.user.email : undefined));
    } catch {
      setError('Couldn’t create the page. Please try again.');
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[80dvh] items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 border border-brand-dark2 bg-brand-dark1 p-8">
        <div>
          <p className="font-display text-sm uppercase tracking-wider text-brand-light1">N°1 Tap Cards</p>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-brand-white">{first ? 'Create your page' : 'New page'}</h1>
          <p className="mt-2 text-sm text-brand-light1">
            {first ? 'This is what people see when they tap your card.' : 'Great for a second location or each person on your team.'}
          </p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-mid">Name or business</span>
          <input className={inputCls} required value={name} onChange={(e) => { setName(e.target.value); if (!touched) setSlug(slugify(e.target.value)); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-mid">Page address</span>
          <div className="flex items-center border border-brand-dark2 bg-brand-black focus-within:border-brand-light1">
            <span className="pl-3.5 text-sm text-brand-mid">…/c/</span>
            <input className="w-full bg-transparent px-1 py-2.5 text-sm text-brand-offwhite focus:outline-none" required value={slug} onChange={(e) => { setTouched(true); setSlug(slugTyping(e.target.value)); }} />
          </div>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 border border-brand-dark2 py-3 text-xs uppercase tracking-widest text-brand-light1">Cancel</button>
          )}
          <button type="submit" disabled={busy} className="flex flex-1 items-center justify-center gap-2 bg-brand-white py-3 text-xs font-semibold uppercase tracking-widest text-brand-black disabled:opacity-60">
            <Plus size={14} /> {busy ? 'Creating…' : 'Create page'}
          </button>
        </div>
      </form>
    </div>
  );
}
