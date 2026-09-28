'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { OnboardingClient } from '@/lib/onboardingSheet';

// Everyone who has completed the onboarding wizard, newest first, with their
// full answers and the documents that go with them. Read-only: the Onboarding
// tab in the Google Sheet stays the master copy.
export default function OnboardingClients({ onSignedOut }: { onSignedOut: () => void }) {
  const [clients, setClients] = useState<OnboardingClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await getSupabase().auth.getSession();
      if (!session) return onSignedOut();
      const res = await fetch('/api/admin/onboarding', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status === 401 || res.status === 403) return onSignedOut();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setClients(json.clients as OnboardingClient[]);
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
      [c.company, c.contact, c.email, c.phone, c.industry, c.website].join(' ').toLowerCase().includes(q),
    );
  }, [clients, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">Onboarded Clients</h2>
          <p className="mt-1 text-sm text-brand-light1">
            Everyone who completed the onboarding form, with their answers and signed agreement.
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

      {!loading && !error && shown.length === 0 && (
        <p className="border border-brand-dark2 px-5 py-8 text-center text-sm text-brand-mid">
          {clients.length ? 'No clients match that search.' : 'No one has completed onboarding yet.'}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {shown.map((c) => {
          const open = openKey === c.key;
          return (
            <li key={c.key} className={`border transition-colors ${open ? 'border-brand-light1' : 'border-brand-dark2'}`}>
              <button
                onClick={() => setOpenKey(open ? null : c.key)}
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
                  <span>{c.submitted}</span>
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

                  {c.goal && (
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-brand-mid mb-1">90-Day Goal</p>
                      <p className="text-sm text-brand-offwhite whitespace-pre-line">{c.goal}</p>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-brand-mid mb-2">Documents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {c.documents.map((d) => (
                        <a
                          key={d.label}
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 border border-brand-dark2 hover:border-brand-light1 transition-colors px-4 py-3 group"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-brand-offwhite group-hover:text-brand-white transition-colors">
                              {d.label}
                            </p>
                            {d.note && <p className="text-xs text-brand-mid">{d.note}</p>}
                          </div>
                          <span aria-hidden className="text-brand-light1">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Full answers */}
                  {c.sections.map((s) => (
                    <div key={s.title}>
                      <p className="text-[11px] uppercase tracking-widest text-brand-mid mb-2">{s.title}</p>
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
    </div>
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
