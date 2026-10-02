'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Minus, Plus, TriangleAlert } from 'lucide-react';
import Container from '@/components/Container';
import { sameBusiness, showDate, smsHref, tidy } from '@/lib/crmFormat';
import { FOLLOW_UP, OPEN_TO_AUDIT, PURCHASED, VISIT_RESULTS } from '@/lib/nfcLeadChoices';
import type { KnownBusiness } from '@/app/api/nfc-lead/route';

type Values = {
  rep: string; date: string; owner: string; business: string; industry: string; location: string;
  phone: string; email: string; purchased: string; cards: string; audit: string; auditTime: string;
  followUp: string; notes: string; result: string;
};
type Gate = 'checking' | 'invalid' | 'open' | 'sent';

const KEY_STORE = 'n1-nfc-form-key';
const REP_STORE = 'n1-nfc-rep';
const DRAFT_STORE = 'n1-nfc-draft';
const TODAY_STORE = 'n1-nfc-today';

const today = () => new Date().toLocaleDateString('en-CA');
const blank = (rep = ''): Values => ({
  rep, date: today(), owner: '', business: '', industry: '', location: '', phone: '', email: '',
  purchased: '', cards: '', audit: '', auditTime: '', followUp: '', notes: '', result: '',
});

// The text to send right after the visit, from the rep's own phone.
function followUpText(v: Values) {
  const me = v.rep.split(/\s+/)[0];
  const first = tidy(v.owner.split(/\s+/)[0] ?? '');
  const biz = tidy(v.business);
  if (v.result === 'Owner not in') {
    return `Hi${first ? ` ${first}` : ''}, it's ${me} from Number 1 Digital Marketing. I stopped by ${biz} today hoping to catch the owner. We help local businesses get found on Google and get more reviews. When's a good time to swing back by, or would a quick call work better?`;
  }
  return `Hi${first ? ` ${first}` : ''}, it's ${me} from Number 1 Digital Marketing. Great meeting you at ${biz} today!${v.purchased === 'Yes' ? ' Thanks for picking up the NFC cards.' : ''} Whenever you have 10 minutes, I'd love to do your free audit of your Google profile, reviews and website. What day works for you?`;
}

// Storage can be missing or blocked (private tabs); the form works without it.
const load = (k: string) => { try { return localStorage.getItem(k) ?? ''; } catch { return ''; } };
const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
const forget = (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } };

// Visits logged on this phone today, shown as a running count at the top.
const visitsToday = () => {
  try {
    const t = JSON.parse(load(TODAY_STORE) || '{}');
    return t.date === today() ? Number(t.count) || 0 : 0;
  } catch { return 0; }
};

// A visit is worth keeping as a draft once anything beyond the rep and date is filled in.
const hasInput = (v: Values) => (Object.keys(v) as (keyof Values)[]).some((k) => k !== 'rep' && k !== 'date' && v[k]);

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

// Cards bought: big tap targets instead of typing a number at the counter.
function CardCount({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const n = Math.max(1, parseInt(value, 10) || 1);
  const btn = 'w-12 h-[46px] flex items-center justify-center bg-brand-dark1 border border-brand-dark2 text-brand-offwhite hover:border-brand-light1 disabled:opacity-40';
  return (
    <div className="flex items-center" role="group" aria-label="How many cards">
      <button type="button" onClick={() => onChange(String(n - 1))} disabled={n <= 1} aria-label="One fewer card" className={btn}>
        <Minus size={16} aria-hidden />
      </button>
      <input
        id="nfc-cards"
        inputMode="numeric"
        aria-label="Number of cards"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 3))}
        onBlur={() => onChange(String(n))}
        className="w-14 h-[46px] bg-brand-dark1 border-y border-brand-dark2 text-center text-lg font-semibold text-brand-offwhite tabular-nums focus:outline-none focus:border-brand-light2"
      />
      <button type="button" onClick={() => onChange(String(n + 1))} aria-label="One more card" className={btn}>
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}

export default function NfcLeadForm() {
  const [gate, setGate] = useState<Gate>('checking');
  const [key, setKey] = useState('');
  const [v, setV] = useState<Values>(blank());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [more, setMore] = useState(false);
  const [known, setKnown] = useState<KnownBusiness[]>([]);
  const [last, setLast] = useState<Values | null>(null);
  const [message, setMessage] = useState('');
  const [today_, setToday] = useState(0);
  const [restored, setRestored] = useState(false);

  // The key arrives in the shared link and is remembered, so a Home Screen shortcut keeps working.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('k') ?? '';
    const k = fromUrl || load(KEY_STORE);
    // The team dashboard's "Log a new lead" link fills in the rep's name.
    const rep = params.get('rep')?.trim().slice(0, 80) || load(REP_STORE);
    // A visit that wasn't saved (closed tab, no signal) comes back where it was left.
    let draft: Values | null = null;
    try { draft = JSON.parse(load(DRAFT_STORE) || 'null'); } catch { /* ignore */ }
    if (draft && hasInput({ ...blank(), ...draft })) {
      setV({ ...blank(rep), ...draft, rep: rep || draft.rep });
      setRestored(true);
    } else {
      setV(blank(rep));
    }
    setToday(visitsToday());
    if (!k) { setGate('invalid'); return; }
    fetch(`/api/nfc-lead?k=${encodeURIComponent(k)}`)
      .then(async (res) => {
        if (!res.ok) { setGate('invalid'); return; }
        const data = await res.json().catch(() => ({}));
        setKnown(Array.isArray(data.known) ? data.known : []);
        save(KEY_STORE, k);
        setKey(k);
        setGate('open');
      })
      .catch(() => setGate('invalid'));
  }, []);

  useEffect(() => {
    if (gate !== 'open') return;
    if (hasInput(v)) save(DRAFT_STORE, JSON.stringify(v)); else forget(DRAFT_STORE);
  }, [gate, v]);

  const set = (field: keyof Values) => (value: string) => { setV((prev) => ({ ...prev, [field]: value })); setError(''); };
  const text = (field: keyof Values) => ({
    id: `nfc-${field}`,
    value: v[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(field)(e.target.value),
    className: inputClass,
  });

  // Someone may already have stopped here, or it came in from the website.
  const repeats = useMemo(
    () => (v.business.trim().length < 3 ? [] : known.filter((k) => sameBusiness(k.business, v.business))).slice(0, 3),
    [known, v.business],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.result) { setError('Pick how the visit went.'); return; }
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
      forget(DRAFT_STORE);
      setRestored(false);
      const count = visitsToday() + 1;
      save(TODAY_STORE, JSON.stringify({ date: today(), count }));
      setToday(count);
      setKnown((all) => [...all, { business: v.business, who: v.rep, date: v.date, status: v.result === 'Not interested' ? 'Not Interested' : 'New' }]);
      setLast(v);
      setMessage(followUpText(v));
      setV(blank(v.rep));
      setMore(false);
      setGate('sent');
      window.scrollTo({ top: 0 });
    } catch {
      setError('No connection. Your visit is kept on this phone; try again when you have signal.');
    } finally {
      setBusy(false);
    }
  };

  const canText = !!last?.phone && last.result !== 'Not interested';

  return (
    <div className="min-h-screen bg-brand-near-black">
      <div className="border-b border-brand-dark2 bg-brand-black pt-[calc(env(safe-area-inset-top)+2rem)] pb-6">
        <Container>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-xs text-brand-mid tracking-widest uppercase">N°1</span>
              <span className="w-px h-4 bg-brand-dark2" />
              <span className="text-xs text-brand-mid tracking-widest uppercase">Sales Team</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-brand-white uppercase tracking-tight leading-none">
              Log a visit
            </h1>
            <p className="mt-3 text-brand-light1 text-base leading-relaxed">
              The business name and how it went is all you need at the door. Add the rest from the car.
            </p>
            {today_ > 0 && (
              <p className="mt-4 text-xs uppercase tracking-widest text-brand-light1">
                <span className="font-display text-xl text-brand-white tabular-nums align-middle mr-2">{today_}</span>
                {today_ === 1 ? 'visit' : 'visits'} logged today
              </p>
            )}
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-xl mx-auto py-8 pb-[calc(env(safe-area-inset-bottom)+4rem)]">
          {gate === 'checking' && <div className="min-h-[40vh]" />}

          {gate === 'invalid' && (
            <div className="border border-brand-dark2 p-6">
              <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">Link needed</p>
              <p className="text-brand-offwhite">
                This form only opens from the team link. Ask your manager for the current NFC lead form link.
              </p>
            </div>
          )}

          {gate === 'sent' && last && (
            <div className="border border-brand-dark2 p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-white" />
                <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">Visit saved</h2>
              </div>
              <p className="text-brand-light1">
                <span className="text-brand-offwhite font-semibold">{tidy(last.business)}</span> is in the lead tracker
                {last.result === 'Not interested' ? ' as not interested.' : last.result === 'Owner not in' ? ', with a reminder to stop back tomorrow.' : ', with a follow-up in 2 days.'}
              </p>
              {canText && (
                <div className="flex flex-col gap-3">
                  <label htmlFor="nfc-message" className="block text-xs uppercase tracking-widest text-brand-light1">
                    Text them while you&apos;re fresh in their mind
                  </label>
                  <textarea id="nfc-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className={inputClass} />
                  <a
                    href={smsHref(last.phone, message)}
                    className="w-full text-center bg-brand-white text-brand-black px-6 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors"
                  >
                    Text {tidy(last.owner.split(/\s+/)[0] || last.business)} now
                  </a>
                </div>
              )}
              <button
                onClick={() => setGate('open')}
                className={`w-full px-6 py-4 text-sm font-semibold tracking-widest uppercase transition-colors ${
                  canText
                    ? 'border border-brand-dark2 text-brand-offwhite hover:border-brand-light1'
                    : 'bg-brand-white text-brand-black hover:bg-brand-offwhite'
                }`}
              >
                Log the next visit
              </button>
            </div>
          )}

          {gate === 'open' && (
            <form onSubmit={submit} className="flex flex-col gap-6">
              {restored && (
                <div className="-mb-2 flex items-center justify-between gap-3 border border-brand-dark2 px-4 py-3 text-sm text-brand-light1">
                  <span>Picked up your unsaved visit.</span>
                  <button
                    type="button"
                    onClick={() => { setV(blank(v.rep)); setRestored(false); setMore(false); }}
                    className="text-xs uppercase tracking-widest text-brand-offwhite hover:underline"
                  >
                    Start over
                  </button>
                </div>
              )}
              <Field id="nfc-business" label="Business Name" required>
                <input {...text('business')} autoComplete="off" autoCapitalize="words" required />
              </Field>
              {repeats.length > 0 && (
                <div role="status" className="-mt-3 border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm flex gap-3">
                  <TriangleAlert size={16} className="text-amber-300 flex-shrink-0 mt-0.5" aria-hidden />
                  <div className="flex flex-col gap-1">
                    <p className="text-amber-200 font-semibold">Already on the lead list</p>
                    {repeats.map((k, i) => (
                      <p key={i} className="text-brand-light2">
                        {tidy(k.business)} · {k.who}{k.date && ` · ${showDate(k.date)}`} · {k.status}
                      </p>
                    ))}
                    <p className="text-brand-light1">You can still save it if it&apos;s a different location.</p>
                  </div>
                </div>
              )}

              <Choice
                label="How did it go?"
                name="result"
                options={VISIT_RESULTS}
                value={v.result}
                required
                onChange={(result) => { setV((prev) => ({ ...prev, result, ...(result === 'Not interested' ? { purchased: '', cards: '' } : {}) })); setError(''); }}
              />

              <Field id="nfc-owner" label="Owner / Contact Name">
                <input {...text('owner')} autoComplete="off" autoCapitalize="words" />
              </Field>
              <Field id="nfc-phone" label="Phone Number">
                <input {...text('phone')} type="tel" inputMode="tel" autoComplete="off" />
              </Field>

              {v.result !== 'Not interested' && (
                <div className="flex flex-wrap items-end gap-x-4 gap-y-4">
                  <Choice
                    label="Bought NFC cards?"
                    name="purchased"
                    options={PURCHASED}
                    value={v.purchased}
                    onChange={(purchased) => setV((prev) => ({ ...prev, purchased, cards: purchased === 'Yes' ? prev.cards || '1' : '' }))}
                  />
                  {v.purchased === 'Yes' && <CardCount value={v.cards} onChange={set('cards')} />}
                </div>
              )}

              <Field id="nfc-notes" label="Quick note">
                <textarea {...text('notes')} rows={2} />
              </Field>

              <button
                type="button"
                onClick={() => setMore(!more)}
                aria-expanded={more}
                className="flex items-center justify-between border-b border-brand-dark2 pb-2 text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light1"
              >
                More details (optional)
                <ChevronDown size={16} className={`transition-transform ${more ? 'rotate-180' : ''}`} aria-hidden />
              </button>

              {more && (
                <div className="flex flex-col gap-5">
                  <Field id="nfc-location" label="Location (street or city is fine)">
                    <input {...text('location')} autoComplete="off" />
                  </Field>
                  <Field id="nfc-industry" label="Business Type / Industry">
                    <input {...text('industry')} autoComplete="off" />
                  </Field>
                  <Field id="nfc-email" label="Email">
                    <input {...text('email')} type="email" inputMode="email" autoComplete="off" autoCapitalize="none" />
                  </Field>
                  <Choice label="Open to a free 10-minute audit?" name="audit" options={OPEN_TO_AUDIT} value={v.audit} onChange={set('audit')} />
                  {v.audit && v.audit !== 'No' && (
                    <Field id="nfc-auditTime" label="Preferred Date/Time for Audit">
                      <input {...text('auditTime')} autoComplete="off" />
                    </Field>
                  )}
                  <Choice label="Follow-Up Needed?" name="followUp" options={FOLLOW_UP} value={v.followUp} onChange={set('followUp')} />
                  <Field id="nfc-date" label="Date of Visit" required>
                    <input {...text('date')} type="date" required className={`${inputClass} [color-scheme:dark]`} />
                  </Field>
                </div>
              )}

              <Field id="nfc-rep" label="Your Name" required>
                <input {...text('rep')} autoComplete="name" required />
              </Field>

              <div className="sticky bottom-0 -mx-4 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-brand-near-black/95 backdrop-blur border-t border-brand-dark2 flex flex-col gap-3">
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-brand-white text-brand-black px-6 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Save visit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
