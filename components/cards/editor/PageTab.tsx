'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUp, Check, CircleAlert, Copy, EllipsisVertical, GripVertical, ImagePlus, Lock, Mail, Plus, QrCode,
  Search, Settings, Star, Tag, Trash2, UserPlus, X,
} from 'lucide-react';
import {
  DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import type { CardLink, CardPage, LinkType } from '@/lib/cards/types';
import { LINK_TYPES, linkDomain, linkProblem, newLinkId, reviewUrlProblem } from '@/lib/cards/links';
import { can, FEATURE_PLAN } from '@/lib/cards/plans';
import { getSupabase } from '@/lib/supabase';
import { slugTyping } from '@/lib/cards/client';
import LinkIcon from '../LinkIcon';
import { usePageStats } from './StatsTab';
import { Field, Section, Toggle, inputCls, type Undoable } from './ui';

type Props = {
  page: CardPage;
  set: (patch: Partial<CardPage>) => void;
  // Functional update so Undo restores into the latest list, not a stale copy.
  setLinks: (fn: (links: CardLink[]) => CardLink[]) => void;
  demo: boolean;
  userId: string | null;
  onUpgrade: () => void;
  onUndoable: (u: Undoable) => void;
  onSlugBlur: () => void;
  // The saved address (the draft may be mid-edit) and a jump to the QR code on the Cards tab.
  liveSlug: string;
  onShowQr: () => void;
};

// data-focus marks what the phone preview highlights while you edit it (see Editor).
export default function PageTab({ page, set, setLinks, demo, userId, onUpgrade, onUndoable, onSlugBlur, liveSlug, onShowQr }: Props) {
  const c = page.contact ?? {};
  const setContact = (k: keyof typeof c, v: string) => set({ contact: { ...c, [k]: v } });
  const lock = (f: keyof typeof FEATURE_PLAN) => (can(page.plan, f) ? null : FEATURE_PLAN[f]);
  const { stats } = usePageStats(page, demo, 30);
  const reviewProblem = reviewUrlProblem(page.review?.url);

  return (
    <div className="space-y-4">
      <div data-focus="profile">
        <Section id="profile" title="Profile" hint="The top of your page.">
          <PageLink slug={liveSlug} live={page.published} onShowQr={onShowQr} />
          <div className="mt-5 flex flex-wrap gap-5">
            <ImageInput label="Photo / logo" round value={page.avatar_url} onChange={(v) => set({ avatar_url: v })} demo={demo} userId={userId} pageId={page.id} />
            <ImageInput label="Cover image" value={page.cover_url} onChange={(v) => set({ cover_url: v })} demo={demo} userId={userId} pageId={page.id} />
          </div>
          <div className="mt-5 grid gap-4">
            <Field label="Name or business" count={[page.display_name.length, 60]}>
              <input className={inputCls} value={page.display_name} maxLength={60} onChange={(e) => set({ display_name: e.target.value })} />
            </Field>
            <Field label="Headline" hint="e.g. “Realtor® · Harbor & Main” or “Neapolitan pizza · Salem, MA”" count={[page.headline.length, 80]}>
              <input className={inputCls} value={page.headline} maxLength={80} onChange={(e) => set({ headline: e.target.value })} />
            </Field>
            <Field label="Short bio" count={[page.bio.length, 280]}>
              <textarea className={inputCls} rows={3} value={page.bio} maxLength={280} onChange={(e) => set({ bio: e.target.value })} />
            </Field>
          </div>
        </Section>
      </div>

      <LinksEditor
        links={page.links ?? []}
        setLinks={setLinks}
        clicks={stats?.links ?? null}
        showClicks={can(page.plan, 'fullStats')}
        onUpgrade={onUpgrade}
        onUndoable={onUndoable}
      />


      <h2 className="px-1 pt-4 text-[17px] font-semibold text-ed-ink">More for your page</h2>

      <div data-focus="contact">
        <Section
          id="contact"
          collapsible
          defaultOpen={!c.phone && !c.email}
          icon={<Mail size={18} />}
          title="Contact details"
          hint="Powers the Call / Text / Email buttons and “Save contact”."
          summary={[c.phone, c.email].filter(Boolean).join(' · ') || 'Add your phone and email for the Call and Text buttons'}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile"><input className={inputCls} type="tel" value={c.phone ?? ''} onChange={(e) => setContact('phone', e.target.value)} /></Field>
            <Field label="Email"><input className={inputCls} type="email" value={c.email ?? ''} onChange={(e) => setContact('email', e.target.value)} /></Field>
            <Field label="Company"><input className={inputCls} value={c.company ?? ''} onChange={(e) => setContact('company', e.target.value)} /></Field>
            <Field label="Job title"><input className={inputCls} value={c.title ?? ''} onChange={(e) => setContact('title', e.target.value)} /></Field>
            <Field label="Website"><input className={inputCls} value={c.website ?? ''} onChange={(e) => setContact('website', e.target.value)} /></Field>
            <Field label="Address"><input className={inputCls} value={c.address ?? ''} onChange={(e) => setContact('address', e.target.value)} /></Field>
          </div>
        </Section>
      </div>

      <div data-focus="review">
        <Section
          id="reviews"
          collapsible
          icon={<Star size={18} />}
          summary={page.review?.url ? (page.review.funnel ? 'Review button on · star rating first' : 'Review button is on') : 'Add a big “Leave us a review” button'}
          title="Google reviews"
          hint="A big “Leave us a review” button. Paste your Google review link (Google Business Profile → Ask for reviews)."
          locked={lock('reviewButton')}
          onUpgrade={onUpgrade}
        >
          <div className="space-y-4">
            <Field label="Google review link">
              <input className={inputCls} placeholder="https://g.page/r/…/review" value={page.review?.url ?? ''} onChange={(e) => set({ review: { ...page.review, url: e.target.value } })} />
              {reviewProblem && <FixNote text={reviewProblem} />}
            </Field>
            <div className={can(page.plan, 'reviewFunnel') ? '' : 'opacity-60'}>
              <Toggle
                label="Star rating first (Business)"
                hint="Visitors tap 1–5 stars. Everyone can still post on Google; unhappy customers also get a private way to tell you what went wrong."
                checked={!!page.review?.funnel}
                disabled={!can(page.plan, 'reviewFunnel')}
                onChange={(v) => set({ review: { ...page.review, funnel: v } })}
              />
              {!can(page.plan, 'reviewFunnel') && (
                <button type="button" onClick={onUpgrade} className="mt-2 text-xs text-ed-ink underline">Upgrade to Business</button>
              )}
            </div>
          </div>
        </Section>
      </div>

      <div data-focus="special">
        <Section
          id="special"
          collapsible
          icon={<Tag size={18} />}
          summary={page.special?.enabled && page.special.title ? `Showing: ${page.special.title}` : 'A highlighted offer at the top of your page'}
          title="Special / coupon"
          hint="A highlighted offer at the top of your page. Change it weekly." locked={lock('special')} onUpgrade={onUpgrade}>
          <div className="space-y-4">
            <Toggle label="Show special" checked={!!page.special?.enabled} onChange={(v) => set({ special: { ...page.special, enabled: v } })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title"><input className={inputCls} value={page.special?.title ?? ''} placeholder="Tuesday 2-for-1" onChange={(e) => set({ special: { ...page.special, title: e.target.value } })} /></Field>
              <Field label="Code (optional)"><input className={inputCls} value={page.special?.code ?? ''} placeholder="TAP241" onChange={(e) => set({ special: { ...page.special, code: e.target.value.toUpperCase() } })} /></Field>
            </div>
            <Field label="Details"><textarea className={inputCls} rows={2} value={page.special?.body ?? ''} onChange={(e) => set({ special: { ...page.special, body: e.target.value } })} /></Field>
            <Field label="Ends (optional)"><input className={inputCls} value={page.special?.expires ?? ''} placeholder="Oct 31" onChange={(e) => set({ special: { ...page.special, expires: e.target.value } })} /></Field>
          </div>
        </Section>
      </div>

      <div data-focus="leads">
        <Section
          id="contact-exchange"
          collapsible
          icon={<UserPlus size={18} />}
          summary={page.lead_capture ? 'On · visitors can share their info with you' : 'Let visitors share their name, email and phone'}
          title="Contact exchange"
          hint="Let people share their name, email and phone with you. New contacts are emailed to you." locked={lock('leadCapture')} onUpgrade={onUpgrade}>
          <div className="space-y-4">
            <Toggle label="Show “Share your info” button" checked={page.lead_capture} onChange={(v) => set({ lead_capture: v })} />
            <Field label="Send new contacts to" hint="Leave blank to use your sign-in email.">
              <input className={inputCls} type="email" value={page.lead_notify_email ?? ''} onChange={(e) => set({ lead_notify_email: e.target.value || null })} />
            </Field>
          </div>
        </Section>
      </div>

      <Section
        id="settings"
        collapsible
        icon={<Settings size={18} />}
        title="Page settings"
        summary={`${page.published ? 'Live' : 'Hidden'} · /c/${page.slug} · ${({ en: 'English', es: 'Español', pt: 'Português' } as const)[page.lang] ?? page.lang}`}
      >
        <div className="space-y-5">
          <Field label="Page address" hint="Saved when you leave this box. Your card keeps working if you change this, but old shared links to /c/… will stop working.">
            <div className="flex items-center rounded-xl border border-ed-line bg-ed-field focus-within:border-ed-ink focus-within:bg-ed-surface">
              <span className="pl-3.5 text-sm text-ed-faint">…/c/</span>
              <input
                className="w-full bg-transparent px-1 py-2.5 text-[15px] text-ed-fg focus:outline-none"
                value={page.slug}
                onChange={(e) => set({ slug: slugTyping(e.target.value) })}
                onBlur={onSlugBlur}
                onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
              />
            </div>
          </Field>
          <Field label="Page language" hint="For buttons like “Save contact”. Your own text stays as you write it.">
            <select className={inputCls} value={page.lang} onChange={(e) => set({ lang: e.target.value as CardPage['lang'] })}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </Field>
          <Toggle label="Page is live" hint="Turn off to hide your page. Taps show a “page is hidden” message." checked={page.published} onChange={(v) => set({ published: v })} />
        </div>
      </Section>
    </div>
  );
}

function FixNote({ text }: { text: string }) {
  return (
    <span className="mt-1.5 flex items-start gap-1.5 text-xs text-ed-err">
      <CircleAlert size={13} className="mt-px shrink-0" /> {text}
    </span>
  );
}

// The page's public address with copy and QR shortcuts, like Linktree's link bar.
function PageLink({ slug, live, onShowQr }: { slug: string; live: boolean; onShowQr: () => void }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}/c/${slug}`;
  const host = origin.replace(/^https?:\/\/(www\.)?/, '');

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt('Copy your link:', url);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[22px] border border-ed-line bg-ed-field py-1.5 pl-4 pr-1.5 sm:rounded-full">
      <span
        title={live ? 'Your page is live' : 'Your page is hidden'}
        className={`h-2 w-2 shrink-0 rounded-full ${live ? 'bg-green-500 shadow-[0_0_0_3px_rgb(34_197_94/0.2)]' : 'bg-ed-faint'}`}
      />
      <a href={`/c/${slug}`} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm text-ed-soft hover:underline">
        {host}/c/<span className="font-semibold text-ed-ink">{slug}</span>
      </a>
      <span className="flex gap-1.5">
        <button type="button" onClick={copy} className="flex items-center gap-1.5 rounded-full bg-ed-ink px-3.5 py-1.5 text-sm font-semibold text-ed-field hover:bg-ed-fg">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy link'}
        </button>
        <button type="button" onClick={onShowQr} className="flex items-center gap-1.5 rounded-full border border-ed-line bg-ed-surface px-3.5 py-1.5 text-sm font-semibold text-ed-ink hover:border-ed-faint">
          <QrCode size={14} /> QR code
        </button>
      </span>
    </div>
  );
}

function LinksEditor({
  links, setLinks, clicks, showClicks, onUpgrade, onUndoable,
}: {
  links: CardLink[];
  setLinks: (fn: (links: CardLink[]) => CardLink[]) => void;
  clicks: Record<string, number> | null;
  showClicks: boolean;
  onUpgrade: () => void;
  onUndoable: (u: Undoable) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const patch = (id: string, p: Partial<CardLink>) => setLinks((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));
  const move = (id: string, d: number) =>
    setLinks((ls) => {
      const i = ls.findIndex((l) => l.id === id);
      const j = i + d;
      return i < 0 || j < 0 || j >= ls.length ? ls : arrayMove(ls, i, j);
    });
  const duplicate = (link: CardLink) => {
    const copy = { ...link, id: newLinkId() };
    setLinks((ls) => {
      const i = ls.findIndex((l) => l.id === link.id);
      return [...ls.slice(0, i + 1), copy, ...ls.slice(i + 1)];
    });
  };
  const remove = (link: CardLink) => {
    const at = links.findIndex((l) => l.id === link.id);
    setLinks((ls) => ls.filter((l) => l.id !== link.id));
    onUndoable({
      text: `“${link.label || LINK_TYPES[link.type]?.name}” deleted`,
      undo: () => setLinks((ls) => (ls.some((l) => l.id === link.id) ? ls : [...ls.slice(0, at), link, ...ls.slice(at)])),
    });
  };
  // New links go to the top, where you're looking (Linktree does the same).
  const add = (type: LinkType) => {
    const id = newLinkId();
    setLinks((ls) => [{ id, type, label: LINK_TYPES[type].social ? LINK_TYPES[type].name : '', url: '', enabled: true }, ...ls]);
    setJustAdded(id);
    setAdding(false);
    setQuery('');
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setLinks((ls) => {
      const from = ls.findIndex((l) => l.id === active.id);
      const to = ls.findIndex((l) => l.id === over.id);
      return from < 0 || to < 0 ? ls : arrayMove(ls, from, to);
    });
  };

  const q = query.trim().toLowerCase();
  const types = (Object.keys(LINK_TYPES) as LinkType[]).filter((t) => !q || LINK_TYPES[t].name.toLowerCase().includes(q));
  const buttons = types.filter((t) => !LINK_TYPES[t].social);
  const socials = types.filter((t) => LINK_TYPES[t].social);
  const typeGrid = (list: LinkType[]) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {list.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => add(t)}
          className="flex items-center gap-2.5 rounded-xl border border-ed-line bg-ed-surface px-3 py-2.5 text-left text-sm font-medium text-ed-fg hover:border-ed-ink"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ed-field"><LinkIcon type={t} size={16} /></span>
          {LINK_TYPES[t].name}
        </button>
      ))}
    </div>
  );

  return (
    <section id="links" className="scroll-mt-36 space-y-3">
      {adding ? (
        <div className="space-y-4 rounded-2xl border border-ed-line bg-ed-surface p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-ed-line bg-ed-field px-4 focus-within:border-ed-ink">
              <Search size={16} className="shrink-0 text-ed-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setAdding(false);
                  if (e.key === 'Enter' && types[0]) add(types[0]);
                }}
                placeholder="Search: Instagram, booking, menu…"
                className="w-full bg-transparent py-2.5 text-[15px] text-ed-fg placeholder:text-ed-faint focus:outline-none"
              />
            </label>
            <button type="button" aria-label="Close" onClick={() => { setAdding(false); setQuery(''); }} className="rounded-full p-2 text-ed-muted hover:bg-ed-field hover:text-ed-ink">
              <X size={18} />
            </button>
          </div>
          {buttons.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ed-faint">Buttons</p>
              {typeGrid(buttons)}
            </div>
          )}
          {socials.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ed-faint">Social icons</p>
              {typeGrid(socials)}
            </div>
          )}
          {types.length === 0 && <p className="text-sm text-ed-muted">Nothing matches “{query}”. Try “Website / link” for any web address.</p>}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ed-ink py-3.5 text-[15px] font-semibold text-ed-field shadow-sm hover:bg-ed-fg"
        >
          <Plus size={18} /> Add a link or button
        </button>
      )}

      <div className="flex items-baseline justify-between gap-3 px-1 pt-2">
        <h2 className="text-[17px] font-semibold text-ed-ink">Your links</h2>
        {links.length > 1 && <p className="flex items-center gap-1 text-[13px] text-ed-muted"><GripVertical size={14} /> Drag to reorder</p>}
      </div>
      {links.length === 0 && <p className="rounded-2xl border border-dashed border-ed-line px-4 py-8 text-center text-sm text-ed-muted">No links yet. Tap “Add a link or button” to start.</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {links.map((l, i) => (
              <LinkRow
                key={l.id}
                link={l}
                first={i === 0}
                last={i === links.length - 1}
                autoFocus={l.id === justAdded}
                clicks={clicks ? clicks[l.id] ?? 0 : null}
                showClicks={showClicks}
                onUpgrade={onUpgrade}
                onPatch={(p) => patch(l.id, p)}
                onMove={(d) => move(l.id, d)}
                onDuplicate={() => duplicate(l)}
                onDelete={() => remove(l)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <p className="px-1 text-[13px] text-ed-muted">Instagram, TikTok and other social links show as small icons under your buttons.</p>
    </section>
  );
}

// Inputs that look like plain text until you hover or click them.
const inlineCls =
  'w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1 -ml-2 text-ed-fg placeholder:text-ed-faint hover:bg-ed-field focus:border-ed-line focus:bg-ed-surface focus:outline-none';

function LinkRow({
  link, first, last, autoFocus, clicks, showClicks, onUpgrade, onPatch, onMove, onDuplicate, onDelete,
}: {
  link: CardLink;
  first: boolean;
  last: boolean;
  autoFocus: boolean;
  clicks: number | null;
  showClicks: boolean;
  onUpgrade: () => void;
  onPatch: (p: Partial<CardLink>) => void;
  onMove: (d: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const info = LINK_TYPES[link.type];
  const problem = linkProblem(link);
  const domain = linkDomain(link);

  return (
    <div
      ref={setNodeRef}
      data-focus={link.id}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`flex rounded-2xl border bg-ed-surface ${isDragging ? 'relative z-10 border-ed-ink shadow-2xl' : 'border-ed-line shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:border-ed-faint/50'}`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        title="Drag to reorder"
        className="flex w-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-l-2xl text-ed-faint hover:bg-ed-field hover:text-ed-ink active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
      <div className="min-w-0 flex-1 py-3 pr-1">
        <div className={link.enabled ? '' : 'opacity-50'}>
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-ed-muted">
            <LinkIcon type={link.type} size={13} /> <span className="truncate">{info?.name}{info?.social ? ' · icon' : ''}</span>
            {!link.enabled && <span className="text-ed-faint">· Hidden</span>}
          </span>
          {!info?.social && (
            <input
              className={`${inlineCls} mt-0.5 text-[15px] font-semibold`}
              autoFocus={autoFocus}
              aria-label="Button text"
              placeholder={`Add button text (${info?.name})`}
              value={link.label}
              onChange={(e) => onPatch({ label: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            />
          )}
          <input
            className={`${inlineCls} text-sm text-ed-soft`}
            autoFocus={autoFocus && info?.social}
            aria-label="Link"
            placeholder={info?.placeholder}
            value={link.url}
            onChange={(e) => onPatch({ url: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          />
        </div>
        {problem ? (
          <FixNote text={problem} />
        ) : (
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-ed-faint">
            {clicks !== null &&
              (showClicks ? (
                <span title="Last 30 days" className="shrink-0 tabular-nums text-ed-muted">
                  {clicks.toLocaleString()} {clicks === 1 ? 'click' : 'clicks'}
                </span>
              ) : (
                <button type="button" onClick={onUpgrade} title="See clicks per link with Pro" className="flex shrink-0 items-center gap-1 hover:text-ed-ink">
                  <Lock size={11} /> <span className="select-none blur-[3px]">{(clicks || 12).toLocaleString()} clicks</span>
                </button>
              ))}
            {clicks !== null && domain && <span>·</span>}
            {domain && <span className="truncate">{domain}</span>}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2 py-3 pr-3">
        <button
          type="button"
          role="switch"
          aria-checked={link.enabled}
          aria-label={link.enabled ? 'Showing on your page. Tap to hide.' : 'Hidden. Tap to show on your page.'}
          title={link.enabled ? 'Showing on your page' : 'Hidden from your page'}
          onClick={() => onPatch({ enabled: !link.enabled })}
          className={`relative h-[26px] w-11 rounded-full transition-colors ${link.enabled ? 'bg-green-600' : 'bg-ed-line'}`}
        >
          <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${link.enabled ? 'left-[21px]' : 'left-[3px]'}`} />
        </button>
        <span className="flex items-center gap-0.5">
          {problem && (
            <span title={problem} className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-ed-err">
              <CircleAlert size={12} /> Fix
            </span>
          )}
          <button type="button" aria-label="Delete" title="Delete" onClick={onDelete} className="rounded-full p-1.5 text-ed-faint hover:bg-red-500/10 hover:text-ed-err">
            <Trash2 size={16} />
          </button>
          <RowMenu
            items={[
              { label: 'Duplicate', icon: <Copy size={14} />, onClick: onDuplicate },
              !first && { label: 'Move up', icon: <ArrowUp size={14} />, onClick: () => onMove(-1) },
              !last && { label: 'Move down', icon: <ArrowDown size={14} />, onClick: () => onMove(1) },
            ]}
          />
        </span>
      </div>
    </div>
  );
}

type MenuItem = { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean };

function RowMenu({ items }: { items: (MenuItem | false)[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="More"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="rounded-full p-1.5 text-ed-faint hover:bg-ed-field hover:text-ed-ink"
      >
        <EllipsisVertical size={16} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-40 rounded-2xl border border-ed-line bg-ed-surface py-1 shadow-2xl">
          {items.filter((x): x is MenuItem => !!x).map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              onClick={() => { setOpen(false); it.onClick(); }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm hover:bg-ed-field ${it.danger ? 'text-ed-err' : 'text-ed-fg'}`}
            >
              {it.icon} {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageInput({
  label, value, onChange, round, demo, userId, pageId,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  round?: boolean;
  demo: boolean;
  userId: string | null;
  pageId: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(file: File) {
    setErr('');
    if (file.size > 5 * 1024 * 1024) { setErr('Max 5 MB'); return; }
    if (demo || !userId) { onChange(URL.createObjectURL(file)); return; }
    setBusy(true);
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${userId}/${pageId}/${round ? 'avatar' : 'cover'}-${Date.now()}.${ext}`;
    const supabase = getSupabase();
    const { error } = await supabase.storage.from('card-media').upload(path, file, { contentType: file.type, upsert: true });
    setBusy(false);
    if (error) { setErr('Upload failed'); return; }
    onChange(supabase.storage.from('card-media').getPublicUrl(path).data.publicUrl);
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-medium text-ed-soft">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`relative flex items-center justify-center overflow-hidden border border-dashed border-ed-faint/60 bg-ed-field text-ed-muted hover:border-ed-ink hover:text-ed-ink ${round ? 'h-20 w-20 rounded-full' : 'h-20 w-40 rounded-xl'}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} />
          )}
          {busy && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs">…</span>}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="text-xs text-ed-muted underline hover:text-ed-ink">Remove</button>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-ed-err">{err}</p>}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
    </div>
  );
}
