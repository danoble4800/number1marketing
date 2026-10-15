'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { EASE } from '@/components/illustrations/useLoop';

// One question at a time, Typeform style. Contact details come third so a lead who
// stops partway still lands in the leads sheet (see app/api/free-audit/route.ts).
const STEPS = ['business', 'goal', 'contact', 'run', 'budget', 'timing'] as const;
type Step = (typeof STEPS)[number];
type ChoiceStep = Exclude<Step, 'contact'>;

const OPTIONS: Record<ChoiceStep, string[]> = {
  business: ['home', 'food', 'beauty', 'health', 'auto', 'retail', 'realestate', 'other'],
  goal: ['calls', 'customers', 'followers', 'all'],
  run: ['self', 'us', 'unsure'],
  budget: ['under300', '300to750', '750to1500', 'over1500', 'unsure'],
  timing: ['now', 'month', 'looking'],
};

type Contact = { firstName: string; lastName: string; businessName: string; phone: string; email: string; consent: boolean };
const CONTACT_FIELDS = ['firstName', 'lastName', 'businessName', 'phone', 'email'] as const;

export default function AuditApplication() {
  const t = useTranslations('freeAudit.form');
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Partial<Record<ChoiceStep, string>>>({});
  const [businessOther, setBusinessOther] = useState('');
  const [contact, setContact] = useState<Contact>({ firstName: '', lastName: '', businessName: '', phone: '', email: '', consent: false });
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  // Signed row token from the "start" save; resolves to null if that save failed.
  const startSave = useRef<Promise<string | null> | null>(null);

  const current = STEPS[step];
  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const payload = () => ({ ...contact, ...answers, businessOther: businessOther.trim() });

  const choose = (key: ChoiceStep, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (key === 'timing' || (key === 'business' && value === 'other')) return;
    setTimeout(() => go(step + 1), 280);
  };

  const submitContact = () => {
    const e: typeof errors = {};
    for (const f of ['firstName', 'phone', 'email'] as const) if (!contact[f].trim()) e[f] = t('contact.required');
    if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) e.email = t('contact.emailInvalid');
    if (!contact.consent) e.consent = t('contact.consentRequired');
    setErrors(e);
    if (Object.keys(e).length) return;

    startSave.current ??= fetch('/api/free-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: 'start', ...payload() }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (j?.token as string) ?? null)
      .catch(() => null);
    go(step + 1);
  };

  const finish = async () => {
    setStatus('sending');
    try {
      const token = startSave.current ? await startSave.current : null;
      const res = await fetch('/api/free-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: 'finish', token, ...payload() }),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-center px-6 py-14 text-center"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white"
        >
          <CheckCircle size={32} />
        </motion.span>
        <h3 className="mt-5 font-display text-3xl uppercase text-brand-white">{t('done.title', { name: contact.firstName.trim() })}</h3>
        <p className="mt-3 max-w-sm leading-relaxed text-brand-light1">{t('done.body')}</p>
        <p className="mt-4 text-sm text-brand-mid">{t('done.note')}</p>
      </motion.div>
    );
  }

  const inputClass = (err?: string) =>
    `w-full border bg-brand-near-black px-4 py-3.5 text-base text-brand-offwhite placeholder:text-brand-mid focus:outline-none focus:border-brand-white transition-colors ${
      err ? 'border-rose-400' : 'border-brand-dark2'
    }`;

  return (
    <div className="flex flex-col">
      {/* Progress */}
      <div className="h-1 w-full bg-brand-dark2">
        <motion.div
          className="h-full bg-emerald-500"
          initial={false}
          animate={{ width: `${((step + (answers.timing ? 1 : 0)) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>

      <div className="relative min-h-[460px] overflow-hidden px-5 pb-6 pt-6 sm:px-8 sm:pt-8">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-mid">
          {t('progress', { n: step + 1, total: STEPS.length })}
        </p>

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={current}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <h3 className="font-display text-2xl uppercase leading-tight text-brand-white sm:text-3xl">{t(`${current}.q`)}</h3>
            {(current === 'contact' || current === 'budget') && (
              <p className="mt-2 text-sm text-brand-light1">{t(`${current}.sub`)}</p>
            )}

            {current === 'contact' ? (
              <form
                noValidate
                className="mt-6 flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitContact();
                }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {CONTACT_FIELDS.map((f) => (
                    <div key={f} className={f === 'firstName' || f === 'lastName' ? '' : 'col-span-2'}>
                      <label htmlFor={`fa-${f}`} className="sr-only">{t(`contact.${f}`)}</label>
                      <input
                        id={`fa-${f}`}
                        type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
                        inputMode={f === 'phone' ? 'tel' : f === 'email' ? 'email' : undefined}
                        autoComplete={{ firstName: 'given-name', lastName: 'family-name', businessName: 'organization', phone: 'tel', email: 'email' }[f]}
                        placeholder={`${t(`contact.${f}`)}${f === 'firstName' || f === 'phone' || f === 'email' ? ' *' : ''}`}
                        value={contact[f]}
                        onChange={(e) => {
                          setContact((c) => ({ ...c, [f]: e.target.value }));
                          if (errors[f]) setErrors((x) => ({ ...x, [f]: undefined }));
                        }}
                        className={inputClass(errors[f])}
                      />
                      {errors[f] && <p className="mt-1 text-xs text-rose-400">{errors[f]}</p>}
                    </div>
                  ))}
                </div>
                <label className="mt-1 flex cursor-pointer items-start gap-3 text-sm leading-snug text-brand-light1">
                  <input
                    type="checkbox"
                    checked={contact.consent}
                    onChange={() => {
                      setContact((c) => ({ ...c, consent: !c.consent }));
                      if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }));
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500"
                  />
                  {t('contact.consent')}
                </label>
                {errors.consent && <p className="-mt-1 text-xs text-rose-400">{errors.consent}</p>}
                <NavRow t={t} onBack={() => go(step - 1)}>
                  <button type="submit" className={primaryBtn}>
                    {t('next')} <ArrowRight size={16} />
                  </button>
                </NavRow>
              </form>
            ) : (
              <>
                <div className={`mt-6 grid gap-2.5 ${current === 'business' ? 'sm:grid-cols-2' : ''}`}>
                  {OPTIONS[current].map((value, i) => {
                    const picked = answers[current] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => choose(current, value)}
                        className={`group flex items-center gap-3 border px-4 py-3.5 text-left text-base transition-colors duration-150 ${
                          picked
                            ? 'border-emerald-500 bg-emerald-500/10 text-brand-white'
                            : 'border-brand-dark2 bg-brand-near-black text-brand-offwhite hover:border-brand-light1'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] font-bold ${
                            picked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-brand-dark2 text-brand-light1'
                          }`}
                        >
                          {picked ? <Check size={13} strokeWidth={3} /> : String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-medium">{t(`${current}.options.${value}`)}</span>
                      </button>
                    );
                  })}
                </div>

                {current === 'business' && answers.business === 'other' && (
                  <form
                    className="mt-3 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (businessOther.trim()) go(step + 1);
                    }}
                  >
                    <input
                      autoFocus
                      value={businessOther}
                      onChange={(e) => setBusinessOther(e.target.value)}
                      placeholder={t('business.otherPlaceholder')}
                      className={inputClass()}
                    />
                    <button type="submit" disabled={!businessOther.trim()} className={`${primaryBtn} shrink-0 disabled:opacity-40`}>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}

                <NavRow t={t} onBack={step > 0 ? () => go(step - 1) : undefined}>
                  {current === 'timing' ? (
                    <button type="button" onClick={finish} disabled={!answers.timing || status === 'sending'} className={`${primaryBtn} disabled:opacity-40`}>
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> {t('sending')}
                        </>
                      ) : (
                        <>
                          {t('submit')} <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  ) : answers[current] && !(current === 'business' && answers.business === 'other') ? (
                    <button type="button" onClick={() => go(step + 1)} className={primaryBtn}>
                      {t('next')} <ArrowRight size={16} />
                    </button>
                  ) : null}
                </NavRow>
                {status === 'error' && <p className="mt-3 text-sm text-rose-400">{t('error')}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const primaryBtn =
  'inline-flex items-center justify-center gap-2 bg-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-black transition-opacity hover:opacity-90';

function NavRow({
  t, onBack, children,
}: { t: ReturnType<typeof useTranslations>; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {onBack ? (
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 px-1 py-2 text-sm text-brand-light1 hover:text-brand-white">
          <ArrowLeft size={15} /> {t('back')}
        </button>
      ) : (
        <span />
      )}
      {children}
    </div>
  );
}
