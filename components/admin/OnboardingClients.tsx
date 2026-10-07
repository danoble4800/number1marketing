'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { HubAgreement, HubClient } from '@/app/api/admin/clients/route';

const CLIENT_FILES_BUCKET = 'client-files';

const fmtDate = (iso: string) =>
  !iso ? '' : new Date(iso).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });

async function authHeader(): Promise<Record<string, string> | null> {
  const { data: { session } } = await getSupabase().auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : null;
}

// The client hub: everyone who completed onboarding, newest first, with their full
// answers, their signed Service Agreement, and any other contracts uploaded for them.
// Supabase is the master copy (supabase/clients.sql).
export default function OnboardingClients({ onSignedOut }: { onSignedOut: () => void }) {
  const [clients, setClients] = useState<HubClient[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [legacySheetUrl, setLegacySheetUrl] = useState<string | null>(null);
  const [leadErrors, setLeadErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/clients', { headers });
      if (res.status === 401 || res.status === 403) return onSignedOut();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setClients(json.clients as HubClient[]);
      setIsOwner(!!json.isOwner);
      setLegacySheetUrl(json.legacySheetUrl ?? null);
      setLeadErrors(json.leadErrors ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [onSignedOut]);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.company, c.contact, c.email, c.phone, c.industry, c.website, c.lead?.origin ?? '', ...c.agreements.map((a) => a.number)]
        .join(' ').toLowerCase().includes(q),
    );
  }, [clients, query]);

  const awaiting = clients.filter((c) => c.agreements.some((a) => !a.countersignedAt)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">Clients</h2>
          <p className="mt-1 text-sm text-brand-light1">
            Everyone onboarded, plus clients marked Client in the Leads tab.
            {awaiting > 0 && <span className="text-amber-300"> {awaiting} awaiting countersignature.</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients"
            aria-label="Search clients"
            className="flex-1 sm:w-64 bg-brand-dark2 border border-brand-dark2 text-brand-offwhite px-4 py-2 text-sm focus:outline-none focus:border-brand-light2 transition-colors"
          />
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {leadErrors.length > 0 && (
        <p className="text-xs text-amber-300">{leadErrors.join(' ')} Some clients from the Leads tab may be missing.</p>
      )}

      {!loading && !error && shown.length === 0 && (
        <p className="border border-brand-dark2 px-5 py-8 text-center text-sm text-brand-mid">
          {clients.length ? 'No clients match that search.' : 'No one has completed onboarding yet.'}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {shown.map((c) => {
          const open = openId === c.id;
          const pending = c.agreements.some((a) => !a.countersignedAt);
          return (
            <li key={c.id} className={`border transition-colors ${open ? 'border-brand-light1' : 'border-brand-dark2'}`}>
              <button
                onClick={() => setOpenId(open ? null : c.id)}
                aria-expanded={open}
                className="w-full text-left px-5 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 hover:bg-brand-black/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-brand-white truncate">{c.company || c.contact}</p>
                  <p className="text-xs text-brand-light1 truncate">
                    {[c.contact, c.industry].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-brand-mid">
                  {c.lead ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest border border-brand-dark2 text-brand-light1">Not onboarded</span>
                  ) : c.agreements.length > 0 && <StatusBadge pending={pending} />}
                  {c.createdAt && <span>{fmtDate(c.createdAt)}</span>}
                  <span aria-hidden className="text-brand-light1">{open ? '−' : '+'}</span>
                </div>
              </button>

              {open && (
                <div className="border-t border-brand-dark2 px-5 py-5 flex flex-col gap-6">
                  {/* Quick contact */}
                  <div className="flex flex-wrap gap-2">
                    {c.email && <Chip href={`mailto:${c.email}`}>{c.email}</Chip>}
                    {c.phone && <Chip href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>{c.phone}</Chip>}
                    {c.website && (
                      <Chip href={/^https?:\/\//.test(c.website) ? c.website : `https://${c.website}`} external>
                        {c.website}
                      </Chip>
                    )}
                  </div>

                  {c.lead && (
                    <div className="flex flex-col gap-3">
                      <SectionLabel>From the Leads tab</SectionLabel>
                      <dl className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-x-6 gap-y-2 text-sm">
                        {([['Came from', c.lead.origin], ['Location', c.lead.location], ...c.lead.details, ['Notes', c.lead.notes]] as [string, string][])
                          .filter(([, v]) => v)
                          .map(([label, value]) => (
                            <div key={label} className="contents">
                              <dt className="text-brand-light1">{label}</dt>
                              <dd className="text-brand-offwhite whitespace-pre-line break-words mb-2 sm:mb-0">{value}</dd>
                            </div>
                          ))}
                      </dl>
                      <p className="text-sm text-brand-mid">
                        No onboarding or signed agreement yet. Send them the onboarding link at the top of the page; once they finish, this entry is replaced by their full client record.
                      </p>
                      {c.lead.sheetUrl && (
                        <div>
                          <Chip href={c.lead.sheetUrl} external>Open in Google Sheet</Chip>
                        </div>
                      )}
                    </div>
                  )}

                  {!c.lead && c.goal && (
                    <div>
                      <SectionLabel>90-Day Goal</SectionLabel>
                      <p className="text-sm text-brand-offwhite whitespace-pre-line">{c.goal}</p>
                    </div>
                  )}

                  {/* Signed agreements */}
                  {!c.lead && <>
                  <div className="flex flex-col gap-3">
                    <SectionLabel>Service Agreement</SectionLabel>
                    {c.agreements.length === 0 && <p className="text-sm text-brand-mid">No signed agreement on file.</p>}
                    {c.agreements.map((a) => (
                      <AgreementCard key={a.id} agreement={a} isOwner={isOwner} onChanged={load} onSignedOut={onSignedOut} />
                    ))}
                  </div>

                  {/* Other contracts */}
                  <div className="flex flex-col gap-3">
                    <SectionLabel>Contracts &amp; Documents</SectionLabel>
                    {c.documents.length === 0 && <p className="text-sm text-brand-mid">No other contracts uploaded.</p>}
                    {c.documents.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {c.documents.map((d) => (
                          <FileLink key={d.id} href={d.url} label={d.label} note={`${d.fileName} · ${fmtDate(d.createdAt)}`} />
                        ))}
                      </div>
                    )}
                    {isOwner && <UploadContract clientId={c.id} onUploaded={load} onSignedOut={onSignedOut} />}
                  </div>
                  </>}

                  {/* Full answers */}
                  {c.sections.map((s) => (
                    <div key={s.title}>
                      <SectionLabel>{s.title}</SectionLabel>
                      <dl className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-x-6 gap-y-2 text-sm">
                        {s.fields.map(([label, value]) => (
                          <div key={label} className="contents">
                            <dt className="text-brand-light1">{label}</dt>
                            <dd className="text-brand-offwhite whitespace-pre-line break-words mb-2 sm:mb-0">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {legacySheetUrl && (
        <p className="text-xs text-brand-mid">
          Clients onboarded before the hub launched are in the{' '}
          <a href={legacySheetUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-light1">
            Google Sheet
          </a>.
        </p>
      )}
    </div>
  );
}

function AgreementCard({
  agreement: a, isOwner, onChanged, onSignedOut,
}: { agreement: HubAgreement; isOwner: boolean; onChanged: () => void; onSignedOut: () => void }) {
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const countersign = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/clients/countersign', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreementId: a.id, name }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Countersign failed');
      if (json.warning) setMsg({ text: json.warning, bad: true });
      onChanged();
    } catch (err) {
      setMsg({ text: (err as Error).message, bad: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-brand-dark2 p-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-white">{a.number}</p>
        <StatusBadge pending={!a.countersignedAt} />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-x-6 gap-y-1 text-xs">
        <dt className="text-brand-light1">Signed by client</dt>
        <dd className="text-brand-offwhite">{a.signerName} ({a.signerEmail}) · {fmtDate(a.signedAt)}</dd>
        <dt className="text-brand-light1">Countersigned</dt>
        <dd className="text-brand-offwhite">
          {a.countersignedAt ? `${a.countersignerName} · ${fmtDate(a.countersignedAt)}` : 'Not yet'}
        </dd>
        <dt className="text-brand-light1">Agreement version</dt>
        <dd className="text-brand-offwhite">{a.version}</dd>
        <dt className="text-brand-light1">Signer IP</dt>
        <dd className="text-brand-offwhite">{a.signerIp || '—'}</dd>
        <dt className="text-brand-light1">Text fingerprint</dt>
        <dd className="text-brand-offwhite font-mono break-all">{a.textSha256}</dd>
      </dl>

      {a.files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {a.files.map((f) => <FileLink key={f.label} href={f.url} label={f.label} note={f.note} />)}
        </div>
      ) : (
        <p className="text-xs text-amber-300">The signed PDF is missing — check the server logs for this agreement.</p>
      )}

      {isOwner && !a.countersignedAt && (
        <div className="border-t border-brand-dark2 pt-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-brand-mid">Countersign for Number 1 Digital Marketing</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your full legal name"
            aria-label="Your full legal name"
            className="w-full sm:max-w-sm bg-brand-dark2 border border-brand-dark2 text-brand-offwhite px-4 py-2 font-display text-lg tracking-wide focus:outline-none focus:border-brand-light2"
          />
          <label className="flex items-start gap-2 text-xs text-brand-light2">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-0.5" />
            I agree to this Service Agreement on behalf of Number 1 Digital Marketing and am signing it electronically.
          </label>
          <div>
            <button
              onClick={countersign}
              disabled={busy || !confirm || name.trim().length < 2}
              className="px-4 py-2 text-xs uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors disabled:opacity-40"
            >
              {busy ? 'Signing…' : 'Countersign & send'}
            </button>
          </div>
        </div>
      )}
      {msg && <p className={`text-xs ${msg.bad ? 'text-red-400' : 'text-brand-light1'}`}>{msg.text}</p>}
    </div>
  );
}

function UploadContract({ clientId, onUploaded, onSignedOut }: { clientId: string; onUploaded: () => void; onSignedOut: () => void }) {
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [inputKey, setInputKey] = useState(0);

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const post = async (payload: Record<string, unknown>) => {
        const res = await fetch('/api/admin/clients/documents', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId, fileName: file.name, contentType: file.type, size: file.size, ...payload }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || 'Upload failed');
        return json;
      };
      const { path, token } = await post({ action: 'prepare' });
      const { error: upErr } = await getSupabase().storage
        .from(CLIENT_FILES_BUCKET)
        .uploadToSignedUrl(path, token, file, { contentType: file.type || undefined });
      if (upErr) throw new Error(upErr.message);
      await post({ action: 'record', path, label: label.trim() });
      setLabel('');
      setFile(null);
      setInputKey((k) => k + 1);
      onUploaded();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label, e.g. Statement of Work — Q4"
        aria-label="Document label"
        className="flex-1 bg-brand-dark2 border border-brand-dark2 text-brand-offwhite px-3 py-2 text-sm focus:outline-none focus:border-brand-light2"
      />
      <input
        key={inputKey}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        aria-label="Contract file"
        className="text-xs text-brand-light1 file:mr-2 file:px-3 file:py-2 file:border-0 file:bg-brand-dark2 file:text-brand-light2"
      />
      <button
        onClick={upload}
        disabled={busy || !file || !label.trim()}
        className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors disabled:opacity-40"
      >
        {busy ? 'Uploading…' : 'Upload'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function StatusBadge({ pending }: { pending: boolean }) {
  return pending ? (
    <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest border border-amber-400/50 text-amber-300">Needs countersign</span>
  ) : (
    <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest border border-emerald-400/50 text-emerald-300">Executed</span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-widest text-brand-mid mb-1">{children}</p>;
}

function FileLink({ href, label, note }: { href: string; label: string; note?: string }) {
  return (
    <a
      href={href || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 border border-brand-dark2 hover:border-brand-light1 transition-colors px-4 py-3 group"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand-offwhite group-hover:text-brand-white transition-colors truncate">{label}</p>
        {note && <p className="text-xs text-brand-mid truncate">{note}</p>}
      </div>
      <span aria-hidden className="text-brand-light1">↓</span>
    </a>
  );
}

function Chip({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="px-3 py-1.5 text-xs border border-brand-dark2 text-brand-light2 hover:border-brand-light1 hover:text-brand-white transition-colors break-all"
    >
      {children}
    </a>
  );
}
