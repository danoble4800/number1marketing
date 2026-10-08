'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ExternalLink, Home, LogOut, Moon, Plus, Smartphone, Sun, X } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import type { CardLink, CardPage, Plan } from '@/lib/cards/types';
import { DEMO_PAGES } from '@/lib/cards/demo';
import { PLANS, PLAN_ORDER, planAtLeast } from '@/lib/cards/plans';
import { createPage, listMyPages, slugAvailable, slugify, slugTyping } from '@/lib/cards/client';
import CardView from '../CardView';
import PageTab from './PageTab';
import LookTab from './LookTab';
import StatsTab from './StatsTab';
import LeadsTab from './LeadsTab';
import CardsTab from './CardsTab';
import PlanTab from './PlanTab';
import { UndoToast, inputCls, jumpTo, useEditorTheme, type Undoable } from './ui';

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
  'theme', 'review', 'special', 'lead_capture', 'lead_notify_email', 'report_frequency', 'hide_badge', 'lang',
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
    return <Shell><p className="p-10 text-center text-sm text-ed-muted">Loading…</p></Shell>;
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
      <div className="sticky top-0 z-30 border-b border-ed-line bg-ed-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5 px-4 py-3">
          <a href="/" aria-label="Back to main site" title="Back to main site" className="flex items-center gap-1.5 rounded-full border border-ed-line bg-ed-surface px-3 py-1.5 text-sm font-medium text-ed-soft hover:border-ed-faint hover:text-ed-ink">
            <Home size={14} /> <span className="hidden sm:inline">Home</span>
          </a>
          <Link href="/card" className="font-display text-lg uppercase tracking-wide text-ed-ink">N°1 Tap Cards</Link>
          {pages.length > 1 || canAddPage ? (
            <select
              value={currentId}
              onChange={(e) => (e.target.value === '__new' ? (canAddPage ? setCreating(true) : upgrade()) : switchPage(e.target.value))}
              className="max-w-[180px] rounded-full border border-ed-line bg-ed-surface px-3 py-1.5 text-sm text-ed-fg"
            >
              {pages.map((p) => <option key={p.id} value={p.id}>{p.display_name || p.slug}</option>)}
              <option value="__new">+ New page</option>
            </select>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/en/cards" target="_blank" className="hidden text-sm font-medium text-ed-muted hover:text-ed-ink md:inline">Plans &amp; pricing</Link>
            {isAdmin && <Link href="/en/admin?tab=cards" className="hidden text-sm font-medium text-ed-muted hover:text-ed-ink sm:inline">Admin</Link>}
            <a
              href={`/c/${saved?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-ed-line bg-ed-surface px-3.5 py-1.5 text-sm font-medium text-ed-fg hover:border-ed-faint sm:flex"
            >
              View <ExternalLink size={13} />
            </a>
            <SaveStatus demo={demo} status={status} pending={dirty} onRetry={() => save()} />
            <ThemeToggle />
            {!demo && (
              <button type="button" aria-label="Sign out" title="Sign out" onClick={signOut} className="rounded-full p-2 text-ed-muted hover:bg-ed-surface hover:text-ed-ink">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => switchTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tab === t.id ? 'bg-ed-ink text-ed-field' : 'text-ed-muted hover:bg-ed-surface hover:text-ed-ink'}`}
            >
              {t.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="mx-auto w-full min-w-0 max-w-[720px] space-y-4" onFocusCapture={trackFocus} onPointerDownCapture={trackFocus}>
          {demo && (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-ed-warn">
              Demo mode: edit anything and watch the preview. Changes aren’t saved.{' '}
              <span className="whitespace-nowrap">
                Example pages:{' '}
                {DEMO_PAGES.map((p, i) => (
                  <button key={p.id} type="button" onClick={() => switchPage(p.id)} className="underline">
                    {p.display_name.split(' ')[0]}{i < DEMO_PAGES.length - 1 ? ', ' : ''}
                  </button>
                ))}
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="mr-1 text-xs">See it as:</span>
                {PLAN_ORDER.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => demoPlan(p)}
                    className={`rounded-full border px-2.5 py-1 text-[13px] font-medium ${draft.plan === p ? 'border-amber-200 bg-amber-200 text-black' : 'border-amber-500/40 hover:border-amber-500'}`}
                  >
                    {PLANS[p].name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {welcome && (
            <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-ed-ok">
              Your card is live! Add your photo, contact info and links below. Changes save automatically.
            </div>
          )}
          {notice && (
            <div className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${notice.kind === 'ok' ? 'border-green-500/40 bg-green-500/10 text-ed-ok' : 'border-red-500/40 bg-red-500/10 text-ed-err'}`}>
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
              liveSlug={saved?.slug ?? draft.slug}
              onShowQr={() => switchTab('cards')}
            />
          )}
          {tab === 'look' && <LookTab page={draft} set={set} onUpgrade={upgrade} demo={demo} userId={session?.user.id ?? null} />}
          {tab === 'stats' && <StatsTab page={draft} set={set} demo={demo} onUpgrade={upgrade} />}
          {tab === 'leads' && <LeadsTab page={draft} demo={demo} onUpgrade={upgrade} onUndoable={showUndo} />}
          {tab === 'cards' && <CardsTab page={saved ?? draft} demo={demo} />}
          {tab === 'plan' && <PlanTab page={draft} demo={demo} onDemoPlan={demoPlan} upgraded={search.get('upgraded') === '1'} />}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <PhoneFrame page={draft} focusId={previewFocus} />
            <p className="mt-3 text-center text-xs text-ed-faint">Live preview · /c/{draft.slug}</p>
          </div>
        </aside>
      </div>

      {/* Mobile preview */}
      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-ed-ink px-4 py-3 text-sm font-semibold text-ed-field shadow-xl lg:hidden"
      >
        <Smartphone size={16} /> Preview
      </button>
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black lg:hidden">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="fixed right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-2 text-sm font-semibold text-white"
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
  const [theme] = useEditorTheme();
  return <div data-ed-theme={theme} className="ed min-h-[100dvh] bg-ed-bg pb-24 text-ed-fg">{children}</div>;
}

function ThemeToggle() {
  const [theme, toggle] = useEditorTheme();
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="rounded-full p-2 text-ed-muted hover:bg-ed-surface hover:text-ed-ink">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function SaveStatus({
  demo, status, pending, onRetry,
}: {
  demo: boolean;
  status: 'saved' | 'saving' | 'error';
  pending: boolean;
  onRetry: () => void;
}) {
  const base = 'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium';
  if (demo) return <span className={`${base} text-ed-faint`}>Demo · not saved</span>;
  if (status === 'error') {
    return (
      <button type="button" onClick={onRetry} className={`${base} text-ed-err hover:text-ed-err`}>
        Couldn’t save · <span className="underline">Retry</span>
      </button>
    );
  }
  if (status === 'saving' || pending) return <span aria-live="polite" className={`${base} text-ed-muted`}>Saving…</span>;
  return (
    <span aria-live="polite" className={`${base} text-ed-muted`}>
      <Check size={14} className="text-ed-ok" /> Saved
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
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-ed-line bg-ed-surface p-8">
        <div>
          <p className="font-display text-sm text-ed-muted">N°1 Tap Cards</p>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-ed-ink">{first ? 'Create your page' : 'New page'}</h1>
          <p className="mt-2 text-sm text-ed-muted">
            {first ? 'This is what people see when they tap your card.' : 'Great for a second location or each person on your team.'}
          </p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ed-faint">Name or business</span>
          <input className={inputCls} required value={name} onChange={(e) => { setName(e.target.value); if (!touched) setSlug(slugify(e.target.value)); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ed-faint">Page address</span>
          <div className="flex items-center rounded-xl border border-ed-line bg-ed-field focus-within:border-ed-muted">
            <span className="pl-3.5 text-sm text-ed-faint">…/c/</span>
            <input className="w-full bg-transparent px-1 py-2.5 text-sm text-ed-fg focus:outline-none" required value={slug} onChange={(e) => { setTouched(true); setSlug(slugTyping(e.target.value)); }} />
          </div>
        </label>
        {error && <p className="text-sm text-ed-err">{error}</p>}
        <div className="flex gap-3">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-ed-line py-3 text-sm font-medium text-ed-muted">Cancel</button>
          )}
          <button type="submit" disabled={busy} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ed-ink py-3 text-sm font-semibold text-ed-field disabled:opacity-60">
            <Plus size={14} /> {busy ? 'Creating…' : 'Create page'}
          </button>
        </div>
      </form>
    </div>
  );
}
