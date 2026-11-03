'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, Loader2, Lock } from 'lucide-react';
import { ASSISTANT_PLANS, type AssistantPlan } from '@/lib/macAssistant';

const PLANS: AssistantPlan[] = ['diy', 'setup'];

const primaryBtn =
  'inline-flex w-full items-center justify-center gap-2 bg-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-black transition-opacity hover:opacity-90 disabled:opacity-50';

const inputClass = (err?: boolean) =>
  `w-full border bg-brand-near-black px-4 py-3.5 text-base text-brand-offwhite placeholder:text-brand-mid focus:outline-none focus:border-brand-white transition-colors ${
    err ? 'border-rose-400' : 'border-brand-dark2'
  }`;

// The two plan cards, then a short form (name, email, phone) that goes to Stripe Checkout.
export default function BuyForm() {
  const t = useTranslations('macAssistant.buy');
  const locale = useLocale();
  const [plan, setPlan] = useState<AssistantPlan | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const missing = {
    name: !form.name.trim(),
    email: !/^\S+@\S+\.\S+$/.test(form.email.trim()),
    phone: plan === 'setup' && !form.phone.trim(),
  };

  function choose(p: AssistantPlan) {
    setPlan(p);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!plan || Object.values(missing).some(Boolean)) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/mac-assistant/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error);
      window.location.href = data.url;
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => {
          const features = t.raw(`${p}.features`) as string[];
          const picked = plan === p;
          return (
            <div
              key={p}
              className={`relative flex flex-col border bg-brand-dark1 p-6 transition-colors ${
                picked ? 'border-brand-white' : p === 'setup' ? 'border-brand-light2' : 'border-brand-dark2'
              }`}
            >
              {p === 'setup' && (
                <span className="absolute -top-3 left-6 bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {t('popular')}
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-mid">{t(`${p}.name`)}</p>
              <p className="mt-2 font-display text-5xl text-brand-white">${ASSISTANT_PLANS[p].price / 100}</p>
              <p className="mt-1 text-xs text-brand-mid">{t('oneTime')}</p>
              <p className="mt-4 text-sm leading-relaxed text-brand-light1">{t(`${p}.blurb`)}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-brand-light2">
                    <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => choose(p)} className={`mt-6 ${primaryBtn}`}>
                {picked ? <><Check size={16} /> {t('chosen')}</> : t(`${p}.cta`)}
              </button>
            </div>
          );
        })}
      </div>

      {plan && (
        <form ref={formRef} onSubmit={submit} noValidate className="mt-6 border border-brand-dark2 bg-brand-dark1 p-6">
          <p className="font-display text-2xl uppercase text-brand-white">
            {t('formTitle', { plan: t(`${plan}.name`), price: `$${ASSISTANT_PLANS[plan].price / 100}` })}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {(['name', 'email', 'phone'] as const).map((f) => (
              <div key={f}>
                <label htmlFor={`ma-${f}`} className="sr-only">{t(`fields.${f}`)}</label>
                <input
                  id={`ma-${f}`}
                  type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
                  autoComplete={f === 'name' ? 'name' : f === 'email' ? 'email' : 'tel'}
                  placeholder={f === 'phone' && plan === 'diy' ? t('fields.phoneOptional') : t(`fields.${f}`)}
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className={inputClass(tried && missing[f])}
                />
                {tried && missing[f] && <p className="mt-1 text-xs text-rose-400">{t(`errors.${f}`)}</p>}
              </div>
            ))}
          </div>
          <button type="submit" disabled={status === 'sending'} className={`mt-5 ${primaryBtn}`}>
            {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
            {t('pay', { price: `$${ASSISTANT_PLANS[plan].price / 100}` })}
          </button>
          <p className="mt-3 text-center text-xs text-brand-mid">{t('secure')}</p>
          {status === 'error' && <p className="mt-3 text-center text-sm text-rose-400">{t('error')}</p>}
        </form>
      )}
    </div>
  );
}
