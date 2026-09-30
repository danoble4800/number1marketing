'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import { FOLLOW_UP, OPEN_TO_AUDIT, PURCHASED } from '@/lib/nfcLeadChoices';

type Values = {
  rep: string; date: string; owner: string; business: string; industry: string; location: string;
  phone: string; email: string; purchased: string; cards: string; audit: string; auditTime: string;
  followUp: string; notes: string;
};
type Gate = 'checking' | 'invalid' | 'open' | 'sent';

const KEY_STORE = 'n1-nfc-form-key';
const REP_STORE = 'n1-nfc-rep';

const today = () => new Date().toLocaleDateString('en-CA');
const blank = (rep = ''): Values => ({
  rep, date: today(), owner: '', business: '', industry: '', location: '', phone: '', email: '',
  purchased: '', cards: '', audit: '', auditTime: '', followUp: '', notes: '',
});

// Storage can be missing or blocked (private tabs); the form works without it.
const load = (k: string) => { try { return localStorage.getItem(k) ?? ''; } catch { return ''; } };
const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

const inputClass =
  'w-full bg-brand-dark1 border border-brand-dark2 text-brand-offwhite px-4 py-3 text-base focus:outline-none focus:border-brand-light2 transition-colors placeholder:text-brand-mid';

function Field({ id, label, required, children }: { id?: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-widest text-brand-light1 mb-2">
        {label}
        {required && <span className="text-brand-white ml-1" aria-hidden>*</span>}
      </label>
      {children}
    </div>
  );
}

function Choice({ label, name, options, value, required, onChange }: {
  label: string; name: string; options: string[]; value: string; required?: boolean; onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="block text-xs uppercase tracking-widest text-brand-light1 mb-2">
        {label}
        {required && <span className="text-brand-white ml-1" aria-hidden>*</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`cursor-pointer px-5 py-3 text-sm font-semibold uppercase tracking-widest border transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-light2 ${
              value === opt
                ? 'bg-brand-white text-brand-black border-brand-white'
                : 'bg-brand-dark1 text-brand-light1 border-brand-dark2 hover:border-brand-light1'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              required={required}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function NfcLeadForm() {
  const [gate, setGate] = useState<Gate>('checking');
  const [key, setKey] = useState('');
  const [v, setV] = useState<Values>(blank());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lastBusiness, setLastBusiness] = useState('');

  // The key arrives in the shared link and is remembered, so a Home Screen shortcut keeps working.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('k') ?? '';
    const k = fromUrl || load(KEY_STORE);
    setV(blank(load(REP_STORE)));
    if (!k) { setGate('invalid'); return; }
    fetch(`/api/nfc-lead?k=${encodeURIComponent(k)}`)
      .then((res) => {
        if (!res.ok) { setGate('invalid'); return; }
        save(KEY_STORE, k);
        setKey(k);
        setGate('open');
      })
      .catch(() => setGate('invalid'));
  }, []);

  const set = (field: keyof Values) => (value: string) => { setV((prev) => ({ ...prev, [field]: value })); setError(''); };
  const text = (field: keyof Values) => ({
    id: `nfc-${field}`,
    value: v[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(field)(e.target.value),
    className: inputClass,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/nfc-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, k: key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not save. Try again.');
        if (res.status === 403) setGate('invalid');
        return;
      }
      save(REP_STORE, v.rep);
      setLastBusiness(v.business);
      setV(blank(v.rep));
      setGate('sent');
      window.scrollTo({ top: 0 });
    } catch {
      setError('No connection. Check your signal and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-near-black">
      <div className="border-b border-brand-dark2 bg-brand-black pt-[calc(env(safe-area-inset-top)+3rem)] pb-10">
        <Container>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-display text-xs text-brand-mid tracking-widest uppercase">N°1</span>
              <span className="w-px h-4 bg-brand-dark2" />
              <span className="text-xs text-brand-mid tracking-widest uppercase">Sales Team</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-brand-white uppercase tracking-tight leading-none">
              NFC Card Sales<br />Lead Intake
            </h1>
            <p className="mt-4 text-brand-light1 text-base leading-relaxed">
              Fill this out after speaking with a business owner about our NFC business cards. Complete every field you
              can — it feeds the team&apos;s lead tracker.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-xl mx-auto py-10 pb-[calc(env(safe-area-inset-bottom)+4rem)]">
          {gate === 'checking' && <div className="min-h-[40vh]" />}

          {gate === 'invalid' && (
            <div className="border border-brand-dark2 p-6">
              <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">Link needed</p>
              <p className="text-brand-offwhite">
                This form only opens from the team link. Ask your manager for the current NFC lead form link.
              </p>
            </div>
          )}

          {gate === 'sent' && (
            <div className="border border-brand-dark2 p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-white" />
                <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">Lead saved</h2>
              </div>
              <p className="text-brand-light1">
                {lastBusiness ? <><span className="text-brand-offwhite font-semibold">{lastBusiness}</span> is</> : 'It’s'} in the
                lead tracker now.
              </p>
              <button
                onClick={() => setGate('open')}
                className="w-full bg-brand-white text-brand-black px-6 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors"
              >
                Log another lead
              </button>
            </div>
          )}

          {gate === 'open' && (
            <form onSubmit={submit} className="flex flex-col gap-10">
              <section className="flex flex-col gap-5">
                <h2 className="text-xs uppercase tracking-widest text-brand-mid border-b border-brand-dark2 pb-2">The visit</h2>
                <Field id="nfc-rep" label="Sales Rep Name" required>
                  <input {...text('rep')} autoComplete="name" required />
                </Field>
                <Field id="nfc-date" label="Date of Contact" required>
                  <input {...text('date')} type="date" required className={`${inputClass} [color-scheme:dark]`} />
                </Field>
              </section>

              <section className="flex flex-col gap-5">
                <h2 className="text-xs uppercase tracking-widest text-brand-mid border-b border-brand-dark2 pb-2">The business</h2>
                <Field id="nfc-owner" label="Business Owner Name" required>
                  <input {...text('owner')} autoComplete="off" required />
                </Field>
                <Field id="nfc-business" label="Business Name" required>
                  <input {...text('business')} autoComplete="off" required />
                </Field>
                <Field id="nfc-industry" label="Business Type / Industry">
                  <input {...text('industry')} autoComplete="off" />
                </Field>
                <Field id="nfc-location" label="Location (City/Address)" required>
                  <input {...text('location')} autoComplete="off" required />
                </Field>
                <Field id="nfc-phone" label="Phone Number">
                  <input {...text('phone')} type="tel" inputMode="tel" autoComplete="off" />
                </Field>
                <Field id="nfc-email" label="Email">
                  <input {...text('email')} type="email" inputMode="email" autoComplete="off" autoCapitalize="none" />
                </Field>
              </section>

              <section className="flex flex-col gap-6">
                <h2 className="text-xs uppercase tracking-widest text-brand-mid border-b border-brand-dark2 pb-2">Outcome</h2>
                <Choice label="Did they purchase an NFC card?" name="purchased" options={PURCHASED} value={v.purchased} required onChange={set('purchased')} />
                <Field id="nfc-cards" label="Number of Cards Purchased">
                  <input {...text('cards')} autoComplete="off" />
                </Field>
                <Choice label="Open to a free 10-minute audit?" name="audit" options={OPEN_TO_AUDIT} value={v.audit} required onChange={set('audit')} />
                <Field id="nfc-auditTime" label="Preferred Date/Time for Audit (if applicable)">
                  <input {...text('auditTime')} autoComplete="off" />
                </Field>
                <Choice label="Follow-Up Needed?" name="followUp" options={FOLLOW_UP} value={v.followUp} onChange={set('followUp')} />
                <Field id="nfc-notes" label="Notes">
                  <textarea {...text('notes')} rows={4} />
                </Field>
              </section>

              <div className="flex flex-col gap-3">
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-brand-white text-brand-black px-6 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Submit lead'}
                </button>
                <p className="text-xs text-brand-mid text-center">* Required</p>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
