'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Plus, RefreshCw, X } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { showDate, showPhone, tidy } from '@/lib/crmFormat';
import type { Lead } from '@/lib/crmSheets';

const PHONE = '781-985-0916';

type Bucket = 'new' | 'contacted' | 'audit' | 'client' | 'closed';
type Filter = 'due' | 'new' | 'open' | 'client' | 'contacted' | 'audit' | 'closed' | 'all';
type Changes = Partial<Pick<Lead, 'status' | 'lastContacted' | 'contactedVia' | 'nextFollowUp' | 'notes'>>;
type Save = (lead: Lead, changes: Changes, logEntry?: string) => Promise<boolean>;
type Api = (method: 'GET' | 'PATCH' | 'POST', body?: unknown) => Promise<Record<string, unknown>>;

const BUCKETS: Record<string, Bucket> = {
  New: 'new',
  Contacted: 'contacted',
  Replied: 'contacted',
  'Audit Booked': 'audit',
  'Audit Done': 'audit',
  Client: 'client',
  'Not a Fit': 'closed',
  'Not Interested': 'closed',
};
const bucket = (status: string): Bucket => BUCKETS[status] ?? 'new';
const isOpen = (l: Lead) => ['new', 'contacted', 'audit'].includes(bucket(l.status));

// The four big counters double as the main filters; the rest live in the "More" menu.
const TILES: [Filter, string][] = [
  ['due', 'Due now'],
  ['new', 'New'],
  ['open', 'All open'],
  ['client', 'Clients'],
];
const MORE: [Filter, string][] = [
  ['contacted', 'Contacted'],
  ['audit', 'Audit booked'],
  ['closed', 'Closed'],
  ['all', 'Everything'],
];

const SOURCES: [string, string][] = [
  ['all', 'All sources'],
  ['website', 'Website'],
  ['inperson', 'In person'],
  ['manual', 'Added by hand'],
  ['client', 'Clients'],
];

const STATUS_STYLE: Record<Bucket, string> = {
  new: 'bg-brand-white text-brand-black',
  contacted: 'bg-brand-dark2 text-brand-offwhite',
  audit: 'bg-amber-300/15 text-amber-200',
  client: 'bg-emerald-400/15 text-emerald-300',
  closed: 'bg-transparent text-brand-mid border border-brand-dark2',
};

// Local calendar date as YYYY-MM-DD
const today = () => new Date().toLocaleDateString('en-CA');
const addDays = (iso: string, days: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d + days).toLocaleDateString('en-CA');
};
// Sheets date serials count days from 1899-12-30.
const added = (l: Lead) => {
  if (!l.submittedSort) return l.submitted.split(/\s+/)[0];
  const d = new Date(Math.round((l.submittedSort - 25569) * 86400000));
  return `added ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`;
};
const isDue = (l: Lead) => isOpen(l) && !!l.nextFollowUp && l.nextFollowUp <= today();
const title = (l: Lead) => tidy(l.business || l.name) || 'No name';

type Group = 'overdue' | 'today' | 'week' | 'later' | 'none' | 'closed';
const GROUPS: [Group, string, string][] = [
  ['overdue', 'Overdue', 'text-red-400'],
  ['today', 'Today', 'text-amber-300'],
  ['week', 'This week', 'text-brand-light2'],
  ['later', 'Later', 'text-brand-light2'],
  ['none', 'No follow-up date', 'text-brand-light1'],
  ['closed', 'Clients & closed', 'text-brand-light1'],
];
function groupOf(l: Lead): Group {
  if (!isOpen(l)) return 'closed';
  if (!l.nextFollowUp) return 'none';
  const t = today();
  if (l.nextFollowUp < t) return 'overdue';
  if (l.nextFollowUp === t) return 'today';
  return l.nextFollowUp <= addDays(t, 7) ? 'week' : 'later';
}

function phoneForLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return digits ? `+${digits}` : '';
}

function smsHref(phone: string, body: string) {
  const apple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${phoneForLink(phone)}${apple ? '&' : '?'}body=${encodeURIComponent(body)}`;
}

type Template = { id: string; label: string; body: string };

// Messages for each stage of a lead. Messages written for a specific lead (the Custom
// Text / Nudge / Email columns of the in-person tracker) replace the standard ones.
function templates(l: Lead): Template[] {
  const who = tidy(l.name.split(/\s+/)[0] || '') || 'there';
  const biz = l.business ? tidy(l.business) : '';
  const first = l.source === 'website'
    ? `Hi ${who}, it's Dan from Number 1 Digital Marketing. Thanks for requesting a free audit${biz ? ` for ${biz}` : ''}. It takes about 30 minutes, and you keep the list of fixes either way. What day and time work for you this week?`
    : `Hi ${who}, it's Dan from Number 1 Digital Marketing. ${l.source === 'inperson' && biz ? `We met at ${biz} recently. ` : ''}I'd love to set up your free 30-minute audit. We look at your Google profile, reviews and website, and you keep the list of fixes either way. What day and time work for you?`;
  const list: Template[] = [
    { id: 'first', label: 'First message', body: l.custom.text || first },
    { id: 'nudge', label: 'Second nudge', body: l.custom.nudge || `Hi ${who}, Dan from Number 1 again. Just bumping this in case it got buried. Happy to do ${biz ? `${biz}'s` : 'your'} free audit whenever works, even next week.` },
    { id: 'reminder', label: 'Audit reminder', body: `Hi ${who}, it's Dan from Number 1 Digital Marketing. Just confirming your free audit${biz ? ` for ${biz}` : ''}. Does the time we set still work? If not, send me a better day and time.` },
    { id: 'thanks', label: 'Thanks after the audit', body: `Hi ${who}, thanks again for making time for the audit. I'll send over the list of fixes we talked about. Happy to walk you through any of it, or take it off your plate.` },
    { id: 'checkin', label: 'Check-in', body: l.source === 'client'
      ? `Hi ${who}, it's Dan from Number 1 Digital Marketing. Just checking in. How is everything going on your end?`
      : `Hi ${who}, it's Dan from Number 1 Digital Marketing. Just checking in to see how things are going${biz ? ` at ${biz}` : ''}. If you ever want a fresh look at your Google profile or website, I'm happy to help.` },
  ];
  if (l.custom.email) list.splice(1, 0, { id: 'email', label: 'Email draft', body: l.custom.email });
  return list;
}

// Which message fits where the lead is right now.
function defaultTemplate(l: Lead): string {
  if (l.source === 'client') return 'checkin';
  switch (l.status) {
    case 'New': return l.custom.email && !l.phone ? 'email' : 'first';
    case 'Contacted':
    case 'Replied': return 'nudge';
    case 'Audit Booked': return 'reminder';
    case 'Audit Done': return 'thanks';
    default: return 'checkin';
  }
}

function emailHref(l: Lead, body: string) {
  const subject = l.source === 'client'
    ? 'Checking in from Number 1'
    : `Your free 30-minute audit${l.business ? ` for ${tidy(l.business)}` : ''}`;
  // Drafts written for a lead already end with a signature.
  const signed = body.includes(PHONE) ? body : `${body}\n\nThanks,\nDan\nNumber 1 Digital Marketing\n${PHONE} · number1digitalmarketing.com`;
  return `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(signed)}`;
}

// "2026-09-28 · Text (first message)" → ["Mon 9/28", "Text (first message)"]
function historyLine(line: string): [string, string] {
  const m = line.match(/^(\d{4}-\d{2}-\d{2})\s*·\s*(.*)$/);
  return m ? [showDate(m[1]), m[2]] : ['', line];
}

// Short note on the right of a row. The group heading already says "Today", so today's rows skip it.
function followUpNote(l: Lead, group: Group) {
  if (!l.nextFollowUp) return l.followUpText && isOpen(l) ? l.followUpText : '';
  if (group === 'overdue') return `was due ${showDate(l.nextFollowUp)}`;
  if (group === 'week' || group === 'later') return showDate(l.nextFollowUp);
  return '';
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

const inputClass =
  'w-full bg-brand-dark1 border border-brand-dark2 text-brand-offwhite px-3 py-2.5 text-sm focus:outline-none focus:border-brand-light2 transition-colors';
const labelClass = 'block text-[11px] uppercase tracking-widest text-brand-light1 mb-1.5';
const btnClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest border border-brand-dark2 text-brand-offwhite hover:border-brand-light1 transition-colors disabled:opacity-40 disabled:pointer-events-none';
const primaryClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors disabled:opacity-40 disabled:pointer-events-none';

function StatusChip({ status }: { status: string }) {
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 whitespace-nowrap ${STATUS_STYLE[bucket(status)]}`}>
      {status}
    </span>
  );
}

function LeadPanel({
  lead, contactMethods, onSave, desktop,
}: {
  lead: Lead;
  contactMethods: string[];
  onSave: Save;
  desktop: boolean;
}) {
  const editable = lead.source !== 'client';
  const id = (name: string) => `${name}-${lead.key}`;
  const options = templates(lead);
  const [templateId, setTemplateId] = useState(() => defaultTemplate(lead));
  const [message, setMessage] = useState(() => options.find((t) => t.id === templateId)?.body ?? '');
  const template = options.find((t) => t.id === templateId) ?? options[0];
  const pickTemplate = (id: string) => {
    setTemplateId(id);
    setMessage(options.find((t) => t.id === id)?.body ?? '');
  };
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [via, setVia] = useState(lead.phone ? 'Text' : 'Email');
  const [draft, setDraft] = useState({ status: lead.status, nextFollowUp: lead.nextFollowUp, notes: lead.notes });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft({ status: lead.status, nextFollowUp: lead.nextFollowUp, notes: lead.notes });
  }, [lead.status, lead.nextFollowUp, lead.notes]);

  const dirty = draft.status !== lead.status || draft.nextFollowUp !== lead.nextFollowUp || draft.notes !== lead.notes;

  const save = async (changes: Changes, logEntry?: string) => {
    setSaving(true);
    await onSave(lead, changes, logEntry);
    setSaving(false);
  };

  const saveDraft = () => {
    const changes: Changes = {};
    if (draft.status !== lead.status) changes.status = draft.status;
    if (draft.nextFollowUp !== lead.nextFollowUp) changes.nextFollowUp = draft.nextFollowUp;
    if (draft.notes !== lead.notes) changes.notes = draft.notes;
    save(changes, changes.status ? `Status: ${lead.status} → ${changes.status}` : undefined);
  };

  const markContacted = () => {
    const changes: Changes = { lastContacted: today(), contactedVia: via };
    if (lead.status === 'New') changes.status = 'Contacted';
    // Leave the follow-up date alone if one is already set for later; otherwise nudge in 3 days.
    if (!lead.nextFollowUp || lead.nextFollowUp <= today()) changes.nextFollowUp = addDays(today(), 3);
    save(changes, `${via} (${template.label.toLowerCase()})`);
  };

  const hasContact = !!(lead.phone || lead.email);
  const isUrl = /^https?:\/\//.test(lead.location);
  const contactButtons = (
    <>
      {lead.phone && <a href={smsHref(lead.phone, message)} className={`${primaryClass} flex-1 lg:flex-none`}>Text</a>}
      {lead.email && (
        <a href={emailHref(lead, message)} className={`${lead.phone ? btnClass : primaryClass} flex-1 lg:flex-none`}>Email</a>
      )}
      {lead.phone && <a href={`tel:${phoneForLink(lead.phone)}`} className={`${btnClass} flex-1 lg:flex-none`}>Call</a>}
    </>
  );

  return (
    <div className={`flex flex-col gap-6 ${desktop ? 'p-6' : 'border-t border-brand-dark2 px-4 py-5'}`}>
      {desktop && (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-3xl text-brand-white uppercase tracking-tight leading-none break-words">{title(lead)}</h2>
            <p className="mt-2 text-sm text-brand-light1">
              {[lead.business ? tidy(lead.name) : '', lead.origin, added(lead)].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <StatusChip status={lead.status} />
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {lead.phone && (
          <a href={`tel:${phoneForLink(lead.phone)}`} className="inline-flex items-center gap-2 text-brand-offwhite hover:underline tabular-nums">
            <Phone size={14} className="text-brand-mid" />{showPhone(lead.phone)}
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 text-brand-offwhite hover:underline break-all">
            <Mail size={14} className="text-brand-mid" />{lead.email}
          </a>
        )}
        {!hasContact && <p className="text-red-400">No phone or email on file. Add one in the sheet.</p>}
      </div>

      {/* Reach out */}
      {hasContact && (
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <label htmlFor={id('msg')} className={labelClass.replace(' mb-1.5', '')}>Message</label>
                <label htmlFor={id('tpl')} className="sr-only">Which message</label>
                <select
                  id={id('tpl')}
                  value={templateId}
                  onChange={(e) => pickTemplate(e.target.value)}
                  className="bg-transparent text-xs text-brand-offwhite border-b border-brand-dark2 focus:outline-none focus:border-brand-light2 py-0.5 min-w-0"
                >
                  {options.map((t) => <option key={t.id} value={t.id} className="bg-brand-dark1">{t.label}</option>)}
                </select>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(message)}
                className="text-[11px] uppercase tracking-widest text-brand-light1 hover:text-brand-white"
              >
                Copy
              </button>
            </div>
            <textarea
              id={id('msg')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={templateId === 'email' ? 10 : 5}
              className={`${inputClass} leading-relaxed resize-y`}
            />
            {templateId === 'email' && lead.custom.attach && (
              <p className="mt-1.5 text-xs text-amber-300">
                Attach {lead.custom.attach} (Desktop › Number1 Follow-ups › pdf).
              </p>
            )}
          </div>
          {desktop && <div className="flex flex-wrap gap-2">{contactButtons}</div>}
        </div>
      )}

      {editable && (
        <div className="flex flex-col gap-3 border border-brand-dark2 p-4">
          <p className="text-sm text-brand-light1">
            {lead.lastContacted
              ? <>Last contacted <span className="text-brand-offwhite">{showDate(lead.lastContacted)}</span>{lead.contactedVia && <> by {lead.contactedVia.toLowerCase()}</>}.</>
              : 'Not contacted yet.'}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <label htmlFor={id('via')} className="text-sm text-brand-light1">Reached out by</label>
            <select id={id('via')} value={via} onChange={(e) => setVia(e.target.value)} className={inputClass.replace('w-full', 'w-auto')}>
              {contactMethods.map((m) => <option key={m}>{m}</option>)}
            </select>
            {desktop && (
              <button type="button" onClick={markContacted} disabled={saving} className={primaryClass}>
                Mark contacted today
              </button>
            )}
          </div>
          {lead.history.length > 0 && (
            <ol className="flex flex-col gap-1 border-t border-brand-dark2 pt-3 text-sm" aria-label="Contact history">
              {[...lead.history].reverse().slice(0, showAllHistory ? undefined : 4).map((line, i) => {
                const [when, what] = historyLine(line);
                return (
                  <li key={i} className="flex gap-3">
                    <span className="w-20 flex-shrink-0 text-brand-mid tabular-nums">{when}</span>
                    <span className="text-brand-light2">{what}</span>
                  </li>
                );
              })}
              {lead.history.length > 4 && (
                <li>
                  <button type="button" onClick={() => setShowAllHistory(!showAllHistory)} className="text-xs text-brand-light1 hover:text-brand-white underline underline-offset-4">
                    {showAllHistory ? 'Show less' : `Show all ${lead.history.length}`}
                  </button>
                </li>
              )}
            </ol>
          )}
          <p className="text-xs text-brand-mid">
            Mark contacted sets today’s date{lead.status === 'New' ? ', moves the status to Contacted,' : ''} and schedules a follow-up in 3 days unless a later one is already set.
          </p>
        </div>
      )}

      {editable && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={id('status')} className={labelClass}>Status</label>
              <select
                id={id('status')}
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                className={inputClass}
              >
                {!lead.statuses.includes(draft.status) && <option>{draft.status}</option>}
                {lead.statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={id('next')} className={labelClass}>Next follow-up</label>
              <input
                id={id('next')}
                type="date"
                value={draft.nextFollowUp}
                onChange={(e) => setDraft({ ...draft, nextFollowUp: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
              <div className="flex gap-3 mt-2 text-xs">
                {([['Tomorrow', 1], ['+3 days', 3], ['+1 week', 7]] as const).map(([text, n]) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => setDraft({ ...draft, nextFollowUp: addDays(today(), n) })}
                    className="text-brand-light1 hover:text-brand-white underline underline-offset-4"
                  >
                    {text}
                  </button>
                ))}
                {draft.nextFollowUp && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, nextFollowUp: '' })}
                    className="text-brand-mid hover:text-brand-light2 underline underline-offset-4"
                  >
                    Clear
                  </button>
                )}
              </div>
              {lead.followUpText && !lead.nextFollowUp && (
                <p className="text-xs text-brand-mid mt-1.5">The sheet says “{lead.followUpText}”, which isn’t a date.</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor={id('notes')} className={labelClass}>Follow-up notes</label>
            <textarea
              id={id('notes')}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveDraft} disabled={!dirty || saving} className={dirty ? primaryClass : btnClass}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {dirty && !saving && (
              <button
                type="button"
                onClick={() => setDraft({ status: lead.status, nextFollowUp: lead.nextFollowUp, notes: lead.notes })}
                className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light2"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      <details className="group border-t border-brand-dark2 pt-4">
        <summary className="cursor-pointer list-none text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white">
          <span className="group-open:hidden">+ More details</span>
          <span className="hidden group-open:inline">− Hide details</span>
        </summary>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-1.5 text-sm">
          {[
            ['Industry', tidy(lead.industry)],
            ['Location', lead.location],
            ...lead.details,
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-brand-mid">{k}</dt>
              <dd className="text-brand-light2 mb-1.5 sm:mb-0 break-words">
                {k === 'Location' && isUrl
                  ? <a href={v} target="_blank" rel="noopener noreferrer" className="hover:underline">Open in Maps ↗</a>
                  : v}
              </dd>
            </div>
          ))}
        </dl>
        <a href={lead.sheetUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-brand-mid hover:text-brand-light2">
          Open this row in Google Sheets ↗
        </a>
      </details>

      {/* Phone: the main actions stay pinned to the bottom of the screen */}
      {!desktop && (hasContact || editable) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-dark2 bg-brand-black/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-2">
            {contactButtons}
            {editable && (
              <button type="button" onClick={markContacted} disabled={saving} className={`${btnClass} flex-1`}>
                {saving ? 'Saving…' : 'Mark contacted'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddLeadForm({
  sources, api, onDone, onCancel,
}: {
  sources: string[];
  api: Api;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', business: '', phone: '', email: '', industry: '', location: '',
    source: sources[0] ?? 'Referral', howMet: '', nextFollowUp: addDays(today(), 1), notes: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() && !form.business.trim()) {
      setError('Add a name or a business.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api('POST', form);
      onDone();
    } catch (err) {
      if ((err as Error).message !== 'Signed out') setError((err as Error).message);
      setBusy(false);
    }
  };

  const field = (k: keyof typeof form, text: string, type = 'text', auto?: string) => (
    <div>
      <label htmlFor={`new-${k}`} className={labelClass}>{text}</label>
      <input id={`new-${k}`} type={type} autoComplete={auto} value={form[k]} onChange={set(k)} className={inputClass} />
    </div>
  );

  return (
    <form onSubmit={submit} className="border border-brand-light1 p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">New lead</h2>
        <button type="button" onClick={onCancel} aria-label="Cancel" className="text-brand-mid hover:text-brand-white"><X size={18} /></button>
      </div>
      <p className="text-sm text-brand-light1 -mt-3">For referrals, calls and walk-ins. Saved to the “Other Leads” tab of your leads sheet.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('firstName', 'First name', 'text', 'off')}
        {field('lastName', 'Last name', 'text', 'off')}
        {field('business', 'Business')}
        {field('industry', 'Industry')}
        {field('phone', 'Phone', 'tel', 'off')}
        {field('email', 'Email', 'email', 'off')}
        {field('location', 'Location')}
        <div>
          <label htmlFor="new-source" className={labelClass}>Where they came from</label>
          <select id="new-source" value={form.source} onChange={set('source')} className={inputClass}>
            {sources.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="new-howMet" className={labelClass}>How you met / who referred them</label>
          <textarea id="new-howMet" value={form.howMet} onChange={set('howMet')} rows={2} className={`${inputClass} resize-y`} />
        </div>
        <div>
          <label htmlFor="new-nextFollowUp" className={labelClass}>First follow-up</label>
          <input id="new-nextFollowUp" type="date" value={form.nextFollowUp} onChange={set('nextFollowUp')} className={`${inputClass} [color-scheme:dark]`} />
        </div>
        <div>
          <label htmlFor="new-notes" className={labelClass}>Notes</label>
          <input id="new-notes" value={form.notes} onChange={set('notes')} className={inputClass} />
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className={primaryClass}>{busy ? 'Adding…' : 'Add lead'}</button>
        <button type="button" onClick={onCancel} className={btnClass}>Cancel</button>
      </div>
    </form>
  );
}

export default function LeadsCRM({ onSignedOut }: { onSignedOut: () => void }) {
  const desktop = useIsDesktop();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [manualSources, setManualSources] = useState<string[]>([]);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ text: string; bad?: boolean } | null>(null);
  const [filter, setFilter] = useState<Filter>('due');
  const [source, setSource] = useState('all');
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const api: Api = useCallback(async (method, body) => {
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      onSignedOut();
      throw new Error('Signed out');
    }
    const res = await fetch('/api/admin/leads', {
      method,
      headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 || res.status === 403) {
      onSignedOut();
      throw new Error('Signed out');
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Something went wrong');
    return json;
  }, [onSignedOut]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const json = await api('GET');
      setLeads(json.leads as Lead[]);
      setContactMethods(json.contactMethods as string[]);
      setManualSources(json.manualSources as string[]);
      setLoadErrors((json.errors as string[]) ?? []);
    } catch (err) {
      if ((err as Error).message !== 'Signed out') setLoadErrors([(err as Error).message]);
    }
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  // If nothing is due, open on the full open list instead of an empty screen.
  const dueCount = useMemo(() => leads.filter(isDue).length, [leads]);
  useEffect(() => {
    if (!loading && filter === 'due' && dueCount === 0) setFilter('open');
  }, [loading, dueCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const save: Save = async (lead, changes, logEntry) => {
    if (!Object.keys(changes).length && !logEntry) return true;
    try {
      const json = await api('PATCH', { source: lead.source, row: lead.row, check: lead.check, changes, logEntry });
      const history = (json.history as string[] | undefined) ?? lead.history;
      setLeads((all) => all.map((l) => (l.key === lead.key
        ? { ...l, ...changes, history, followUpText: changes.nextFollowUp !== undefined ? '' : l.followUpText }
        : l)));
      setNotice({ text: 'Saved to the sheet' });
      return true;
    } catch (err) {
      if ((err as Error).message !== 'Signed out') setNotice({ text: (err as Error).message, bad: true });
      return false;
    }
  };

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { due: 0, open: 0, new: 0, contacted: 0, audit: 0, client: 0, closed: 0, all: leads.length };
    for (const l of leads) {
      c[bucket(l.status)]++;
      if (isOpen(l)) c.open++;
      if (isDue(l)) c.due++;
    }
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter((l) => source === 'all' || l.source === source)
      .filter((l) => {
        if (filter === 'all') return true;
        if (filter === 'due') return isDue(l);
        if (filter === 'open') return isOpen(l);
        return bucket(l.status) === filter;
      })
      .filter((l) => !q || [l.name, l.business, l.email, l.phone, l.industry, l.location, l.notes, l.origin].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => {
        // Soonest follow-up first (overdue at the top), then newest.
        const fa = isOpen(a) && a.nextFollowUp ? a.nextFollowUp : '9999';
        const fb = isOpen(b) && b.nextFollowUp ? b.nextFollowUp : '9999';
        return fa === fb ? b.submittedSort - a.submittedSort : fa < fb ? -1 : 1;
      });
  }, [leads, filter, source, query]);

  // Clients and closed leads have no follow-up dates, so they're shown as one plain list.
  const grouped = filter !== 'client' && filter !== 'closed';
  const sections = grouped
    ? GROUPS.map(([g, text, tone]) => ({ g, text, tone, items: visible.filter((l) => groupOf(l) === g) })).filter((s) => s.items.length)
    : [{ g: 'closed' as Group, text: '', tone: '', items: visible }];

  const selected = visible.find((l) => l.key === openKey) ?? null;

  // On a computer, keep a lead open in the right-hand pane.
  useEffect(() => {
    if (desktop && !loading && !selected && visible.length) setOpenKey(visible[0].key);
  }, [desktop, loading, selected, visible]);

  const moreValue = MORE.some(([f]) => f === filter) ? filter : '';

  return (
    <div className={`flex flex-col gap-6 ${!desktop && selected ? 'pb-28' : 'pb-16'}`}>
      {/* Heading */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl text-brand-white uppercase tracking-tight leading-none">Leads</h1>
        <div className="flex gap-2">
          <button type="button" onClick={load} disabled={loading} aria-label="Refresh" className={btnClass}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button type="button" onClick={() => setAdding(true)} className={primaryClass}>
            <Plus size={14} /> New lead
          </button>
        </div>
      </div>

      {adding && (
        <AddLeadForm
          sources={manualSources}
          api={api}
          onCancel={() => setAdding(false)}
          onDone={async () => {
            setAdding(false);
            setNotice({ text: 'Lead added' });
            setFilter('open');
            setSource('all');
            setQuery('');
            await load();
          }}
        />
      )}

      {/* Counters = filters */}
      <div className="grid grid-cols-4 gap-px bg-brand-dark2 border border-brand-dark2" role="group" aria-label="Show">
        {TILES.map(([f, text]) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`text-left px-3 sm:px-4 py-3 sm:py-4 transition-colors ${
              filter === f ? 'bg-brand-offwhite text-brand-black' : 'bg-brand-near-black hover:bg-brand-dark1'
            }`}
          >
            <div className={`font-display text-2xl sm:text-3xl tabular-nums leading-none ${
              filter === f ? '' : f === 'due' && counts.due > 0 ? 'text-red-400' : 'text-brand-white'
            }`}>
              {loading ? '–' : counts[f]}
            </div>
            <div className={`text-[10px] sm:text-[11px] uppercase tracking-widest mt-1.5 ${filter === f ? 'text-brand-dark2' : 'text-brand-light1'}`}>
              {text}
            </div>
          </button>
        ))}
      </div>

      {/* Search + more filters */}
      <div className="grid grid-cols-2 sm:grid-cols-[1fr_11rem_11rem] gap-2">
        <label htmlFor="crm-search" className="sr-only">Search</label>
        <input
          id="crm-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, business, phone…"
          className={`${inputClass} col-span-2 sm:col-span-1`}
        />
        <label htmlFor="crm-more" className="sr-only">More filters</label>
        <select
          id="crm-more"
          value={moreValue}
          onChange={(e) => e.target.value && setFilter(e.target.value as Filter)}
          className={`${inputClass} ${moreValue ? 'border-brand-light1' : ''}`}
        >
          <option value="">More filters…</option>
          {MORE.map(([f, text]) => <option key={f} value={f}>{text} ({counts[f]})</option>)}
        </select>
        <label htmlFor="crm-source" className="sr-only">Source</label>
        <select id="crm-source" value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}>
          {SOURCES.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
        </select>
      </div>

      {loadErrors.map((e) => (
        <p key={e} className="text-sm text-red-400 border border-red-500/40 px-4 py-3">{e}</p>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 items-start">
        {/* List */}
        <div className="flex flex-col gap-6">
          {!loading && visible.length === 0 && (
            <p className="text-sm text-brand-mid border border-dashed border-brand-dark2 px-4 py-8 text-center">
              Nothing here{query ? ' matches your search' : ''}.
            </p>
          )}
          {sections.map(({ g, text, tone, items }) => (
            <section key={g} className="flex flex-col gap-2">
              {text && (
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest ${tone}`}>
                  {text} <span className="text-brand-mid tabular-nums">{items.length}</span>
                </h2>
              )}
              {items.map((l) => {
                const open = openKey === l.key;
                const note = followUpNote(l, g);
                return (
                  <div key={l.key} className={`border transition-colors ${open ? 'border-brand-light1 bg-brand-dark1/60' : 'border-brand-dark2'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenKey(open && !desktop ? null : l.key)}
                      aria-expanded={open}
                      className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-brand-dark1/60 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-white font-semibold truncate">{title(l)}</p>
                        <p className="text-xs text-brand-light1 truncate">
                          {[l.business ? tidy(l.name) : '', l.origin, added(l)].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          {l.phone && <Phone size={13} className="text-brand-mid" aria-label="Has phone" />}
                          {l.email && <Mail size={13} className="text-brand-mid" aria-label="Has email" />}
                          {!l.phone && !l.email && (
                            <span className="text-[10px] uppercase tracking-widest text-red-400">No contact info</span>
                          )}
                          <StatusChip status={l.status} />
                        </div>
                        {note && <span className={`text-xs ${g === 'overdue' ? 'text-red-400' : 'text-brand-light1'}`}>{note}</span>}
                      </div>
                    </button>
                    {open && !desktop && (
                      <LeadPanel lead={l} contactMethods={contactMethods} onSave={save} desktop={false} />
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>

        {/* Detail pane (computer) */}
        {desktop && (
          <div className="sticky top-20 border border-brand-dark2 bg-brand-dark1/40 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {selected
              ? <LeadPanel key={selected.key} lead={selected} contactMethods={contactMethods} onSave={save} desktop />
              : <p className="p-10 text-sm text-brand-mid text-center">Pick a lead to see it here.</p>}
          </div>
        )}
      </div>

      {notice && (
        <div
          role="status"
          className={`fixed left-1/2 -translate-x-1/2 ${!desktop && selected ? 'bottom-24' : 'bottom-6'} px-5 py-3 text-sm font-semibold shadow-lg z-50 ${
            notice.bad ? 'bg-red-500 text-white' : 'bg-brand-white text-brand-black'
          }`}
        >
          {notice.text}
        </div>
      )}
    </div>
  );
}
