'use client';

import { Lock } from 'lucide-react';
import type { Plan } from '@/lib/cards/types';
import { PLANS } from '@/lib/cards/plans';

export const inputCls =
  'w-full border border-brand-dark2 bg-brand-black px-3.5 py-2.5 text-sm text-brand-offwhite placeholder:text-brand-mid focus:border-brand-light1 focus:outline-none disabled:opacity-50';

export function Section({
  title, hint, children, locked, onUpgrade, right,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  locked?: Plan | null;
  onUpgrade?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <section className="border border-brand-dark2 bg-brand-dark1">
      <header className="flex items-start justify-between gap-3 border-b border-brand-dark2 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-white">
            {title}
            {locked && <PlanBadge plan={locked} />}
          </h2>
          {hint && <p className="mt-1 text-xs text-brand-light1">{hint}</p>}
        </div>
        {right}
      </header>
      <div className="relative p-5">
        {locked ? (
          <>
            <div className="pointer-events-none select-none opacity-40 blur-[1.5px]">{children}</div>
            <div className="absolute inset-0 flex items-center justify-center bg-brand-dark1/60 p-4">
              <button
                type="button"
                onClick={onUpgrade}
                className="flex items-center gap-2 bg-brand-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite"
              >
                <Lock size={14} /> Unlock with {PLANS[locked].name}
              </button>
            </div>
          </>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span className="rounded-full border border-brand-mid px-2 py-0.5 text-[10px] font-semibold tracking-wider text-brand-light2">
      {PLANS[plan].name.toUpperCase()}
    </span>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-mid">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-brand-mid">{hint}</span>}
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
        <span className="block text-sm text-brand-offwhite">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-brand-mid">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-white' : 'bg-brand-dark2'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${checked ? 'left-[22px] bg-brand-black' : 'left-0.5 bg-brand-light1'}`}
        />
      </button>
    </label>
  );
}
