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
        <div className="border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-300">
          Thanks! Your upgrade is being applied. It can take a few seconds to show.
        </div>
      )}
      {demo && (
        <div className="border border-brand-dark2 bg-brand-dark1 p-4 text-sm text-brand-light2">
          <p className="mb-3">Demo: switch plans to see what each one unlocks.</p>
          <div className="flex gap-2">
            {PLAN_ORDER.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onDemoPlan(p)}
                className={`flex-1 border px-3 py-2 text-xs uppercase tracking-widest ${page.plan === p ? 'border-brand-white bg-brand-white text-brand-black' : 'border-brand-dark2 text-brand-light1'}`}
              >
                {PLANS[p].name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-light1">
          Current plan: <span className="font-semibold text-brand-white">{PLANS[page.plan].name}</span>
        </p>
        <div className="flex border border-brand-dark2 text-xs">
          {(['month', 'year'] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterval(i)}
              className={`px-3 py-1.5 uppercase tracking-widest ${interval === i ? 'bg-brand-white text-brand-black' : 'text-brand-light1'}`}
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
            <div key={p} className={`flex flex-col border p-5 ${current ? 'border-brand-white bg-brand-dark1' : 'border-brand-dark2 bg-brand-dark1'}`}>
              <p className="text-xs uppercase tracking-widest text-brand-light1">{plan.name}</p>
              <p className="mt-2 font-display text-3xl text-brand-white">
                {p === 'free' ? plan.price : interval === 'year' ? plan.yearly.replace('or ', '') : plan.price}
              </p>
              <p className="mt-1 text-xs text-brand-mid">{plan.blurb}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-brand-light2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-brand-white" />{f}</li>
                ))}
              </ul>
              {current ? (
                <p className="mt-5 py-2.5 text-center text-xs uppercase tracking-widest text-brand-light1">Your plan</p>
              ) : higher && !demo ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => go('/api/cards/checkout', { plan: p, interval }, p)}
                  className="mt-5 bg-brand-white py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite disabled:opacity-60"
                >
                  {busy === p ? 'Opening…' : `Upgrade to ${plan.name}`}
                </button>
              ) : higher && demo ? (
                <button type="button" onClick={() => onDemoPlan(p)} className="mt-5 bg-brand-white py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-black">
                  Try {plan.name}
                </button>
              ) : (
                <span className="mt-5" />
              )}
            </div>
          );
        })}
      </div>

      {msg && <p className="border border-brand-dark2 bg-brand-dark1 p-4 text-sm text-brand-light2">{msg}</p>}

      {page.stripe_customer_id && !demo && (
        <button
          type="button"
          onClick={() => go('/api/cards/portal', {}, 'portal')}
          className="text-sm text-brand-white underline"
        >
          {busy === 'portal' ? 'Opening…' : 'Manage billing, change plan or cancel'}
        </button>
      )}
    </div>
  );
}
