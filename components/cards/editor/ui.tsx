'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { ChevronDown, Lock, X } from 'lucide-react';
import type { Plan } from '@/lib/cards/types';
import { PLANS } from '@/lib/cards/plans';

export const inputCls =
  'w-full rounded-xl border border-ed-line bg-ed-field px-3.5 py-2.5 text-[15px] text-ed-fg placeholder:text-ed-faint hover:border-ed-faint/60 focus:border-ed-ink focus:bg-ed-surface focus:outline-none disabled:opacity-50';

export function Section({
  id, title, hint, children, locked, onUpgrade, right, icon, summary, collapsible, defaultOpen,
}: {
  // Anchor for #hash deep links (/card/edit?tab=look#buttons).
  id?: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
  locked?: Plan | null;
  onUpgrade?: () => void;
  right?: React.ReactNode;
  icon?: React.ReactNode;
  // Collapsible sections start closed and show `summary` until opened (or deep-linked to).
  summary?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!collapsible || !!defaultOpen);
  useEffect(() => {
    if (!collapsible || !id) return;
    const sync = () => { if (window.location.hash === `#${id}`) setOpen(true); };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [collapsible, id]);

  const heading = (
    <span className="flex min-w-0 flex-1 items-center gap-3.5">
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ed-field text-ed-soft">{icon}</span>}
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ed-ink">
          {title}
          {locked && <PlanBadge plan={locked} />}
        </span>
        {collapsible && !open && summary ? (
          <span className="mt-0.5 block truncate text-[13px] text-ed-muted">{summary}</span>
        ) : (
          hint && <span className="mt-0.5 block text-[13px] text-ed-muted">{hint}</span>
        )}
      </span>
    </span>
  );

  return (
    <section id={id} className="scroll-mt-36 rounded-2xl border border-ed-line bg-ed-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-shadow">
      {collapsible ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left hover:bg-ed-field/50"
        >
          {heading}
          <ChevronDown size={18} className={`shrink-0 text-ed-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <header className="flex items-start justify-between gap-3 px-5 pb-1 pt-5">
          {heading}
          {right}
        </header>
      )}
      {open && (
        <div className={`relative px-5 pb-5 ${collapsible ? 'pt-1' : 'pt-4'}`}>
          {locked ? (
            <>
              <div className="pointer-events-none select-none opacity-40 blur-[1.5px]">{children}</div>
              <div className="absolute inset-0 flex items-center justify-center rounded-b-2xl bg-ed-surface/60 p-4">
                <button
                  type="button"
                  onClick={onUpgrade}
                  className="flex items-center gap-2 rounded-full bg-ed-ink px-4 py-2.5 text-sm font-semibold text-ed-field hover:bg-ed-fg"
                >
                  <Lock size={14} /> Unlock with {PLANS[locked].name}
                </button>
              </div>
            </>
          ) : (
            children
          )}
        </div>
      )}
    </section>
  );
}

export function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span className="rounded-full bg-ed-field px-2 py-0.5 text-[10px] font-semibold tracking-wider text-ed-soft ring-1 ring-ed-line">
      {PLANS[plan].name.toUpperCase()}
    </span>
  );
}

export function Field({
  label, children, hint, count,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  // [current length, max] shows a "19/280" counter.
  count?: [number, number];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px] font-medium text-ed-soft">
        {label}
        {count && (
          <span className={`font-normal tabular-nums ${count[0] >= count[1] ? 'text-ed-warn' : 'text-ed-faint'}`}>
            {count[0]}/{count[1]}
          </span>
        )}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ed-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked, onChange, label, hint, disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <span>
        <span className="block text-[15px] font-medium text-ed-fg">{label}</span>
        {hint && <span className="mt-0.5 block text-[13px] text-ed-muted">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-[26px] w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-ed-line'}`}
      >
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[21px]' : 'left-[3px]'}`}
        />
      </button>
    </label>
  );
}

export type Undoable = {
  text: string;
  undo: () => void;
  // Runs when the toast times out or is replaced (e.g. the real delete for contacts).
  commit?: () => void;
};

export function UndoToast({ item, onUndo, onClose }: { item: Undoable; onUndo: () => void; onClose: () => void }) {
  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ed-ink px-5 py-3 text-sm text-ed-field shadow-2xl"
    >
      <span>{item.text}</span>
      <button type="button" onClick={onUndo} className="text-sm font-semibold underline">
        Undo
      </button>
      <button type="button" aria-label="Dismiss" onClick={onClose} className="opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// Scrolls to a section or setting by id, puts it in the URL hash so the link can be shared,
// and briefly outlines it so the eye lands in the right place.
export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.location.hash !== `#${id}`) history.replaceState(history.state, '', `#${id}`);
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.add('ring-2', 'ring-ed-ink');
  setTimeout(() => el.classList.remove('ring-2', 'ring-ed-ink'), 1400);
}

// Editor light/dark choice, remembered on this device. Light is the default.
const THEME_KEY = 'n1-editor-theme';
const themeListeners = new Set<() => void>();
function readTheme(): 'light' | 'dark' {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}
export function useEditorTheme() {
  const theme = useSyncExternalStore(
    (cb) => { themeListeners.add(cb); return () => { themeListeners.delete(cb); }; },
    readTheme,
    () => 'light' as const,
  );
  const toggle = () => {
    try { localStorage.setItem(THEME_KEY, theme === 'dark' ? 'light' : 'dark'); } catch { /* private mode */ }
    themeListeners.forEach((l) => l());
  };
  return [theme, toggle] as const;
}
