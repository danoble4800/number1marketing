'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { CardPage, Plan } from '@/lib/cards/types';
import { PLANS, PLAN_ORDER } from '@/lib/cards/plans';
import { authHeader } from '@/lib/cards/client';

type Props = {
  page: CardPage;
  demo: boolean;
  onDemoPlan: (plan: Plan) => void;
  upgraded: boolean;
};

export default function PlanTab({ page, demo, onDemoPlan, upgraded }: Props) {
  const [interval, setInterval] = useState<'month' | 'year'>('year');
  const [busy, setBusy] = useState<string>('');
  const [msg, setMsg] = useState('');

  async function go(path: string, body: Record<string, unknown>, key: string) {
    setMsg('');
    setBusy(key);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
        body: JSON.stringify({ page_id: page.id, ...body }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.url) { window.location.href = json.url; return; }
      setMsg(
        json.error === 'not_configured'
          ? 'Online checkout isn’t switched on yet. Text or call (781) 985-0916 and we’ll upgrade you today.'
          : 'Something went wrong. Please try again.',
      );
    } catch {
      setMsg('Something went wrong. Please try again.');
    }
    setBusy('');
  }

  return (
    <div className="space-y-5">
      {upgraded && (
        <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm text-ed-ok">
          Thanks! Your upgrade is being applied. It can take a few seconds to show.
        </div>
      )}
      {demo && (
        <div className="rounded-2xl border border-ed-line bg-ed-surface p-4 text-sm text-ed-soft">
          <p className="mb-3">Demo: switch plans to see what each one unlocks.</p>
          <div className="flex gap-2">
            {PLAN_ORDER.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onDemoPlan(p)}
                className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium ${page.plan === p ? 'border-ed-ink bg-ed-ink text-ed-field' : 'border-ed-line text-ed-muted'}`}
              >
                {PLANS[p].name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-ed-muted">
          Current plan: <span className="font-semibold text-ed-ink">{PLANS[page.plan].name}</span>
        </p>
        <div className="flex rounded-full border border-ed-line p-0.5 text-xs">
          {(['month', 'year'] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterval(i)}
              className={`rounded-full px-3 py-1.5 ${interval === i ? 'bg-ed-ink text-ed-field' : 'text-ed-muted'}`}
            >
              {i === 'month' ? 'Monthly' : 'Yearly · 2 months free'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLAN_ORDER.map((p) => {
          const plan = PLANS[p];
          const current = page.plan === p;
          const higher = PLAN_ORDER.indexOf(p) > PLAN_ORDER.indexOf(page.plan);
          return (
            <div key={p} className={`flex flex-col rounded-2xl border p-5 ${current ? 'border-ed-ink bg-ed-surface' : 'border-ed-line bg-ed-surface'}`}>
              <p className="text-sm font-medium text-ed-muted">{plan.name}</p>
              <p className="mt-2 font-display text-3xl text-ed-ink">
                {p === 'free' ? plan.price : interval === 'year' ? plan.yearly.replace('or ', '') : plan.price}
              </p>
              <p className="mt-1 text-xs text-ed-faint">{plan.blurb}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-ed-soft">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-ed-ink" />{f}</li>
                ))}
              </ul>
              {current ? (
                <p className="mt-5 py-2.5 text-center text-sm font-medium text-ed-muted">Your plan</p>
              ) : higher && !demo ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => go('/api/cards/checkout', { plan: p, interval }, p)}
                  className="mt-5 rounded-full bg-ed-ink py-2.5 text-sm font-semibold text-ed-field hover:bg-ed-fg disabled:opacity-60"
                >
                  {busy === p ? 'Opening…' : `Upgrade to ${plan.name}`}
                </button>
              ) : higher && demo ? (
                <button type="button" onClick={() => onDemoPlan(p)} className="mt-5 rounded-full bg-ed-ink py-2.5 text-sm font-semibold text-ed-field">
                  Try {plan.name}
                </button>
              ) : (
                <span className="mt-5" />
              )}
            </div>
          );
        })}
      </div>

      {msg && <p className="rounded-2xl border border-ed-line bg-ed-surface p-4 text-sm text-ed-soft">{msg}</p>}

      {page.stripe_customer_id && !demo && (
        <button
          type="button"
          onClick={() => go('/api/cards/portal', {}, 'portal')}
          className="text-sm text-ed-ink underline"
        >
          {busy === 'portal' ? 'Opening…' : 'Manage billing, change plan or cancel'}
        </button>
      )}
    </div>
  );
}
