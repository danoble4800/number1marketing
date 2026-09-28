'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Lead } from '@/app/api/admin/leads/route';

const PHONE = '781-985-0916';

type Bucket = 'new' | 'contacted' | 'audit' | 'client' | 'closed';
type Filter = 'due' | 'open' | Bucket | 'all';
type Changes = Partial<Pick<Lead, 'status' | 'lastContacted' | 'contactedVia' | 'nextFollowUp' | 'notes'>>;

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

const SOURCE_LABEL: Record<Lead['source'], string> = { website: 'Website', inperson: 'In person', client: 'Client' };

const FILTERS: [Filter, string][] = [
  ['due', 'Due now'],
  ['open', 'All open'],
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['audit', 'Audit booked'],
  ['client', 'Clients'],
  ['closed', 'Closed'],
  ['all', 'Everything'],
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
const showDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
};
// Sheets date serials count days from 1899-12-30.
const added = (l: Lead) => {
  if (!l.submittedSort) return l.submitted.split(/\s+/)[0];
  const d = new Date(Math.round((l.submittedSort - 25569) * 86400000));
  return `Added ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`;
};
const isDue = (l: Lead) => isOpen(l) && !!l.nextFollowUp && l.nextFollowUp <= today();

function phoneForLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return digits ? `+${digits}` : '';
}

function showPhone(phone: string) {
  const d = phoneForLink(phone).replace(/^\+1(?=\d{10}$)/, '');
  return /^\d{10}$/.test(d) ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : phone;
}

function smsHref(phone: string, body: string) {
  const apple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${phoneForLink(phone)}${apple ? '&' : '?'}body=${encodeURIComponent(body)}`;
}

function firstName(l: Lead) {
  return l.name.split(/\s+/)[0] || 'there';
}

function textTemplate(l: Lead) {
  const who = firstName(l);
  const at = l.business ? ` for ${l.business}` : '';
  if (l.source === 'client') {
    return `Hi ${who}, it's Dan from Number 1 Digital Marketing. Just checking in. How is everything going on your end?`;
  }
  if (l.source === 'inperson') {
    return `Hi ${who}, it's Dan from Number 1 Digital Marketing. We met${l.business ? ` at ${l.business}` : ''} recently. I'd love to set up your free 30-minute audit. We look at your Google profile, reviews and website, and you keep the list of fixes either way. What day and time work for you?`;
  }
  return `Hi ${who}, it's Dan from Number 1 Digital Marketing. Thanks for requesting a free audit${at}. It takes about 30 minutes, and you keep the list of fixes either way. What day and time work for you this week?`;
}

function emailHref(l: Lead, body: string) {
  const subject = l.source === 'client'
    ? 'Checking in from Number 1'
    : `Your free 30-minute audit${l.business ? ` for ${l.business}` : ''}`;
  const signed = `${body}\n\nThanks,\nDan\nNumber 1 Digital Marketing\n${PHONE} · number1digitalmarketing.com`;
  return `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(signed)}`;
}

function followUpLabel(l: Lead) {
  if (!l.nextFollowUp) return l.followUpText ? { text: l.followUpText, tone: 'text-brand-light1' } : null;
  const t = today();
  if (!isOpen(l)) return { text: `Follow up ${showDate(l.nextFollowUp)}`, tone: 'text-brand-mid' };
  if (l.nextFollowUp < t) return { text: `Overdue · ${showDate(l.nextFollowUp)}`, tone: 'text-red-400' };
  if (l.nextFollowUp === t) return { text: 'Follow up today', tone: 'text-amber-300' };
  return { text: `Follow up ${showDate(l.nextFollowUp)}`, tone: 'text-brand-light1' };
}

const inputClass =
  'w-full bg-brand-dark1 border border-brand-dark2 text-brand-offwhite px-3 py-2.5 text-sm focus:outline-none focus:border-brand-light2 transition-colors';
const labelClass = 'block text-[11px] uppercase tracking-widest text-brand-light1 mb-1.5';
const btnClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest border border-brand-dark2 text-brand-offwhite hover:border-brand-light1 transition-colors disabled:opacity-40 disabled:pointer-events-none';
const primaryClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors disabled:opacity-40 disabled:pointer-events-none';

function LeadPanel({
  lead, contactMethods, onSave,
}: {
  lead: Lead;
  contactMethods: string[];
  onSave: (lead: Lead, changes: Changes) => Promise<boolean>;
}) {
  const editable = lead.source !== 'client';
  const [message, setMessage] = useState(() => textTemplate(lead));
  const [via, setVia] = useState(lead.phone ? 'Text' : 'Email');
  const [draft, setDraft] = useState({ status: lead.status, nextFollowUp: lead.nextFollowUp, notes: lead.notes });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft({ status: lead.status, nextFollowUp: lead.nextFollowUp, notes: lead.notes });
  }, [lead.status, lead.nextFollowUp, lead.notes]);

  const dirty = draft.status !== lead.status || draft.nextFollowUp !== lead.nextFollowUp || draft.notes !== lead.notes;

  const save = async (changes: Changes) => {
    setSaving(true);
    await onSave(lead, changes);
    setSaving(false);
  };

  const saveDraft = () => {
    const changes: Changes = {};
    if (draft.status !== lead.status) changes.status = draft.status;
    if (draft.nextFollowUp !== lead.nextFollowUp) changes.nextFollowUp = draft.nextFollowUp;
    if (draft.notes !== lead.notes) changes.notes = draft.notes;
    save(changes);
  };

  const markContacted = () => {
    const changes: Changes = { lastContacted: today(), contactedVia: via };
    if (lead.status === 'New') changes.status = 'Contacted';
    // Leave the follow-up date alone if one is already set for later; otherwise nudge in 3 days.
    if (!lead.nextFollowUp || lead.nextFollowUp <= today()) changes.nextFollowUp = addDays(today(), 3);
    save(changes);
  };

  const isUrl = /^https?:\/\//.test(lead.location);

  return (
    <div className="border-t border-brand-dark2 px-4 sm:px-5 py-5 flex flex-col gap-6">
      {/* Contact */}
      <div className="flex flex-col gap-1.5 text-sm">
        {lead.phone && (
          <a href={`tel:${phoneForLink(lead.phone)}`} className="text-brand-offwhite hover:underline w-fit tabular-nums">
            {showPhone(lead.phone)}
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="text-brand-offwhite hover:underline w-fit break-all">
            {lead.email}
          </a>
        )}
        {!lead.phone && !lead.email && <p className="text-red-400">No phone or email on file.</p>}
        {lead.location && (
          isUrl
            ? <a href={lead.location} target="_blank" rel="noopener noreferrer" className="text-brand-light1 hover:underline w-fit">Open in Maps</a>
            : <p className="text-brand-light1">{lead.location}</p>
        )}
      </div>

      {lead.details.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-1.5 text-sm">
          {lead.details.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-brand-mid">{k}</dt>
              <dd className="text-brand-light2 mb-1.5 sm:mb-0 break-words">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Message */}
      {(lead.phone || lead.email) && (
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor={`msg-${lead.key}`} className={labelClass}>Message</label>
            <textarea
              id={`msg-${lead.key}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={`${inputClass} leading-relaxed resize-y`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {lead.phone && <a href={smsHref(lead.phone, message)} className={primaryClass}>Text</a>}
            {lead.email && <a href={emailHref(lead, message)} className={lead.phone ? btnClass : primaryClass}>Email</a>}
            {lead.phone && <a href={`tel:${phoneForLink(lead.phone)}`} className={btnClass}>Call</a>}
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(message)}
              className={btnClass}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {editable && (
        <>
          {/* Mark contacted */}
          <div className="flex flex-col gap-3 border border-brand-dark2 p-4">
            <p className="text-sm text-brand-light1">
              {lead.lastContacted
                ? <>Last contacted <span className="text-brand-offwhite">{showDate(lead.lastContacted)}</span>{lead.contactedVia && <> by {lead.contactedVia.toLowerCase()}</>}.</>
                : 'Not contacted yet.'}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <label htmlFor={`via-${lead.key}`} className="sr-only">Contacted by</label>
              <select
                id={`via-${lead.key}`}
                value={via}
                onChange={(e) => setVia(e.target.value)}
                className={inputClass.replace('w-full', 'w-auto')}
              >
                {contactMethods.map((m) => <option key={m}>{m}</option>)}
              </select>
              <button type="button" onClick={markContacted} disabled={saving} className={primaryClass}>
                Mark contacted today
              </button>
            </div>
            <p className="text-xs text-brand-mid">
              Sets Last Contacted to today{lead.status === 'New' ? ', moves the status to Contacted' : ''}, and schedules a follow-up in 3 days unless a later one is already set.
            </p>
          </div>

          {/* Edit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`status-${lead.key}`} className={labelClass}>Status</label>
              <select
                id={`status-${lead.key}`}
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                className={inputClass}
              >
                {!lead.statuses.includes(draft.status) && <option>{draft.status}</option>}
                {lead.statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`next-${lead.key}`} className={labelClass}>Next follow-up</label>
              <input
                id={`next-${lead.key}`}
                type="date"
                value={draft.nextFollowUp}
                onChange={(e) => setDraft({ ...draft, nextFollowUp: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
              <div className="flex gap-3 mt-2 text-xs">
                {([['Tomorrow', 1], ['+3 days', 3], ['+1 week', 7]] as const).map(([label, n]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDraft({ ...draft, nextFollowUp: addDays(today(), n) })}
                    className="text-brand-light1 hover:text-brand-white underline underline-offset-4"
                  >
                    {label}
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
            <div className="sm:col-span-2">
              <label htmlFor={`notes-${lead.key}`} className={labelClass}>Follow-up notes</label>
              <textarea
                id={`notes-${lead.key}`}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveDraft} disabled={!dirty || saving} className={primaryClass}>
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
        </>
      )}

      <a href={lead.sheetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-mid hover:text-brand-light2 w-fit">
        Open this row in Google Sheets ↗
      </a>
    </div>
  );
}

export default function LeadsCRM({ onSignedOut }: { onSignedOut: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ text: string; bad?: boolean } | null>(null);
  const [filter, setFilter] = useState<Filter>('due');
  const [source, setSource] = useState<'all' | Lead['source']>('all');
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const call = useCallback(async (method: 'GET' | 'PATCH', body?: unknown) => {
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
      const json = await call('GET');
      setLeads(json.leads);
      setContactMethods(json.contactMethods);
      setLoadErrors(json.errors ?? []);
    } catch (err) {
      if ((err as Error).message !== 'Signed out') setLoadErrors([(err as Error).message]);
    }
    setLoading(false);
  }, [call]);

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

  const save = async (lead: Lead, changes: Changes) => {
    if (!Object.keys(changes).length) return true;
    try {
      await call('PATCH', { source: lead.source, row: lead.row, check: lead.check, changes });
      setLeads((all) => all.map((l) => (l.key === lead.key ? { ...l, ...changes, followUpText: changes.nextFollowUp !== undefined ? '' : l.followUpText } : l)));
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
      .filter((l) => !q || [l.name, l.business, l.email, l.phone, l.industry, l.location, l.notes].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => {
        // Soonest follow-up first (overdue at the top), then newest.
        const fa = isOpen(a) && a.nextFollowUp ? a.nextFollowUp : '9999';
        const fb = isOpen(b) && b.nextFollowUp ? b.nextFollowUp : '9999';
        return fa === fb ? b.submittedSort - a.submittedSort : fa < fb ? -1 : 1;
      });
  }, [leads, filter, source, query]);

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-brand-white uppercase tracking-tight leading-none">
            Leads
          </h1>
          <p className="mt-2 text-brand-light1 text-sm">
            Website, in-person and client contacts in one place. Changes save straight to the Google Sheets.
          </p>
        </div>
        <button type="button" onClick={load} disabled={loading} className={btnClass}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-brand-dark2 border border-brand-dark2">
        {([
          ['due', 'Follow-ups due', counts.due],
          ['new', 'New', counts.new],
          ['audit', 'Audits booked', counts.audit],
          ['client', 'Clients', counts.client],
        ] as const).map(([f, label, n]) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`text-left bg-brand-near-black px-4 py-4 hover:bg-brand-dark1 transition-colors ${filter === f ? 'bg-brand-dark1' : ''}`}
          >
            <div className={`font-display text-3xl tabular-nums ${f === 'due' && n > 0 ? 'text-red-400' : 'text-brand-white'}`}>
              {loading ? '–' : n}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-brand-light1 mt-1">{label}</div>
          </button>
        ))}
      </div>

      {loadErrors.map((e) => (
        <p key={e} className="text-sm text-red-400 border border-red-500/40 px-4 py-3">{e}</p>
      ))}

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Status">
          {FILTERS.map(([f, label]) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                filter === f
                  ? 'bg-brand-white text-brand-black border-brand-white'
                  : 'border-brand-dark2 text-brand-light1 hover:border-brand-light1'
              }`}
            >
              {label} <span className="tabular-nums opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="crm-search" className="sr-only">Search</label>
          <input
            id="crm-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, business, phone…"
            className={`${inputClass} sm:flex-1`}
          />
          <label htmlFor="crm-source" className="sr-only">Source</label>
          <select
            id="crm-source"
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            className={`${inputClass} sm:w-48`}
          >
            <option value="all">All sources</option>
            <option value="website">Website</option>
            <option value="inperson">In person</option>
            <option value="client">Clients</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {!loading && visible.length === 0 && (
          <p className="text-sm text-brand-mid border border-dashed border-brand-dark2 px-4 py-8 text-center">
            Nothing here.
          </p>
        )}
        {visible.map((l) => {
          const open = openKey === l.key;
          const fu = followUpLabel(l);
          return (
            <div key={l.key} className={`border transition-colors ${open ? 'border-brand-light1 bg-brand-dark1/40' : 'border-brand-dark2'}`}>
              <button
                type="button"
                onClick={() => setOpenKey(open ? null : l.key)}
                aria-expanded={open}
                className="w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-brand-dark1/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-brand-white font-semibold truncate">{l.business || l.name || 'No name'}</p>
                  <p className="text-xs text-brand-light1 truncate">
                    {[l.business ? l.name : '', SOURCE_LABEL[l.source], added(l)].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {fu && <span className={`text-xs ${fu.tone}`}>{fu.text}</span>}
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 whitespace-nowrap ${STATUS_STYLE[bucket(l.status)]}`}>
                    {l.status}
                  </span>
                </div>
              </button>
              {open && <LeadPanel lead={l} contactMethods={contactMethods} onSave={save} />}
            </div>
          );
        })}
      </div>

      {notice && (
        <div
          role="status"
          className={`fixed left-1/2 -translate-x-1/2 bottom-6 px-5 py-3 text-sm font-semibold shadow-lg z-50 ${
            notice.bad ? 'bg-red-500 text-white' : 'bg-brand-white text-brand-black'
          }`}
        >
          {notice.text}
        </div>
      )}
    </div>
  );
}
