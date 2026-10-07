'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { CreatorApplication } from '@/app/api/admin/creators/route';
import { CAMPAIGN_TYPES, FOLLOWER_RANGES, NICHES } from '@/content/creators/plans';

async function authHeader(): Promise<Record<string, string> | null> {
  const { data: { session } } = await getSupabase().auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : null;
}

type Filter = CreatorApplication['status'] | 'all';
const FILTERS: [Filter, string][] = [['new', 'New'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']];

const label = <T extends Record<string, string>>(map: T, key: string) => map[key as keyof T] ?? key;

// A link to the creator's profile from their handle or a pasted URL.
function profileUrl(platform: 'instagram' | 'tiktok', handle: string) {
  if (/^https?:\/\//i.test(handle)) return handle;
  const h = handle.replace(/^@/, '');
  return platform === 'instagram' ? `https://instagram.com/${h}` : `https://tiktok.com/@${h}`;
}

const StatusBadge = ({ status }: { status: CreatorApplication['status'] }) => (
  <span
    className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border ${
      status === 'approved'
        ? 'border-emerald-400/50 text-emerald-500'
        : status === 'rejected'
        ? 'border-brand-dark2 text-brand-mid'
        : 'border-amber-400/60 text-amber-600 [[data-site-theme=dark]_&]:text-amber-300'
    }`}
  >
    {status}
  </span>
);

// Applications from the /creators page (supabase/creators.sql). Any admin can approve or reject.
export default function CreatorApplications({ onSignedOut }: { onSignedOut: () => void }) {
  const [apps, setApps] = useState<CreatorApplication[]>([]);
  const [filter, setFilter] = useState<Filter>('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/creators', { headers });
      if (res.status === 401 || res.status === 403) return onSignedOut();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setApps(json.applications as CreatorApplication[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [onSignedOut]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: CreatorApplication['status']) => {
    setSaving(id);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/creators', {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.status === 401 || res.status === 403) return onSignedOut();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Couldn’t save.');
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const counts = Object.fromEntries(FILTERS.map(([f]) => [f, f === 'all' ? apps.length : apps.filter((a) => a.status === f).length]));
  const shown = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">Creators</h2>
          <p className="mt-1 text-sm text-brand-light1">Applications from the N°1 Creators page. Approve the ones that meet the bar.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter applications">
        {FILTERS.map(([f, name]) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
              filter === f ? 'bg-brand-dark2 border-brand-dark2 text-brand-white' : 'border-brand-dark2 text-brand-light1 hover:text-brand-white'
            }`}
          >
            {name} <span className="text-brand-mid">{counts[f]}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && shown.length === 0 && (
        <p className="border border-brand-dark2 px-5 py-8 text-center text-sm text-brand-mid">
          {filter === 'new' ? 'No new applications.' : 'Nothing here yet.'}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {shown.map((a) => (
          <li key={a.id} className="border border-brand-dark2 px-5 py-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-brand-white">{a.full_name}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-xs text-brand-light1">
                  <a href={`mailto:${a.email}`} className="hover:text-brand-white">{a.email}</a>
                  {a.location && ` · ${a.location}`}
                  {' · '}
                  {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2">
                {a.status !== 'approved' && (
                  <button
                    onClick={() => setStatus(a.id, 'approved')}
                    disabled={saving === a.id}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {a.status !== 'rejected' && (
                  <button
                    onClick={() => setStatus(a.id, 'rejected')}
                    disabled={saving === a.id}
                    className="px-3 py-1.5 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                {a.status !== 'new' && (
                  <button
                    onClick={() => setStatus(a.id, 'new')}
                    disabled={saving === a.id}
                    className="px-3 py-1.5 text-xs uppercase tracking-widest text-brand-mid hover:text-brand-white transition-colors disabled:opacity-50"
                  >
                    Undo
                  </button>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-brand-mid">Handles</dt>
                <dd className="flex flex-col text-brand-offwhite">
                  {a.instagram && <a href={profileUrl('instagram', a.instagram)} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">IG {a.instagram}</a>}
                  {a.tiktok && <a href={profileUrl('tiktok', a.tiktok)} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">TikTok {a.tiktok}</a>}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-brand-mid">Followers · Niche</dt>
                <dd className="text-brand-offwhite">{label(FOLLOWER_RANGES, a.followers)} · {label(NICHES, a.niche)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-brand-mid">Campaigns</dt>
                <dd className="text-brand-offwhite">{a.campaign_types.map((t) => label(CAMPAIGN_TYPES, t)).join(', ') || '—'}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-brand-mid">Rate per video</dt>
                <dd className="text-brand-offwhite">{a.rate || '—'}</dd>
              </div>
            </dl>

            <div className="text-sm">
              <p className="text-[11px] uppercase tracking-widest text-brand-mid">Video links</p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {a.links.split(/\s+/).filter(Boolean).map((l, i) => (
                  <li key={i} className="truncate">
                    {/^https?:\/\//i.test(l)
                      ? <a href={l} target="_blank" rel="noopener noreferrer" className="text-brand-light2 hover:text-brand-white hover:underline">{l}</a>
                      : <span className="text-brand-light1">{l}</span>}
                  </li>
                ))}
              </ul>
            </div>
            {a.about && <p className="text-sm text-brand-light1 whitespace-pre-line">{a.about}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
