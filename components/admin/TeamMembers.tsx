'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { TeamRow } from '@/app/api/admin/team/route';

async function authHeader(): Promise<Record<string, string> | null> {
  const { data: { session } } = await getSupabase().auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : null;
}

const inputClass =
  'w-full bg-brand-dark2 border border-brand-dark2 text-brand-offwhite px-3 py-2 text-sm focus:outline-none focus:border-brand-light2 transition-colors';

// Admins and sales reps (supabase/team.sql), plus reps invited but not signed up yet.
// The owner can fix anyone's name or email here.
export default function TeamMembers({ onSignedOut }: { onSignedOut: () => void }) {
  const [members, setMembers] = useState<TeamRow[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/team', { headers });
      if (res.status === 401 || res.status === 403) return onSignedOut();
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setMembers(json.members as TeamRow[]);
      setIsOwner(!!json.isOwner);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [onSignedOut]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">Team</h2>
          <p className="mt-1 text-sm text-brand-light1">
            Admins and sales reps with access to the portal.
            {!isOwner && ' Only the owner can make changes.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          {isOwner && !adding && (
            <button
              onClick={() => { setAdding(true); setNotice(''); }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors"
            >
              + Add member
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {adding && (
        <AddMember
          onCancel={() => setAdding(false)}
          onAdded={(msg) => { setAdding(false); setNotice(msg); load(); }}
          onSignedOut={onSignedOut}
        />
      )}

      {notice && (
        <div className="border border-emerald-400/50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-emerald-300">{notice}</p>
          <button onClick={() => setNotice('')} aria-label="Dismiss" className="text-brand-light1 hover:text-brand-white">×</button>
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <p className="border border-brand-dark2 px-5 py-8 text-center text-sm text-brand-mid">No team members yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {members.map((m) => {
          const key = `${m.kind}:${m.id}`;
          return editing === key ? (
            <EditRow
              key={key}
              member={m}
              onCancel={() => setEditing(null)}
              onSaved={() => { setEditing(null); load(); }}
              onSignedOut={onSignedOut}
            />
          ) : (
            <li key={key} className="border border-brand-dark2 px-5 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-brand-white truncate">{m.name || 'No name'}</p>
                  <RoleBadge member={m} />
                </div>
                <p className="text-xs text-brand-light1 truncate">{m.email}</p>
                {m.role === 'rep' && m.repName && m.repName !== m.name && (
                  <p className="text-xs text-brand-mid truncate">Tracker name: {m.repName}</p>
                )}
              </div>
              {isOwner && (
                <button
                  onClick={() => setEditing(key)}
                  className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors"
                >
                  Edit
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-brand-mid">
        New members are added as sales reps and show as Invited until they create their account at /team. Admins are still promoted in Supabase.
      </p>
    </div>
  );
}

function AddMember({
  onCancel, onAdded, onSignedOut,
}: { onCancel: () => void; onAdded: (notice: string) => void; onSignedOut: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [repName, setRepName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, repName }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Couldn’t add them.');
      const first = name.trim().split(/\s+/)[0];
      onAdded(json.hasAccount
        ? `${first} already had an account, so it’s now a sales rep account. They sign in at ${window.location.origin}/en/team.`
        : `${first} is invited. Send them ${window.location.origin}/en/team to create their account with ${email.trim().toLowerCase()}.`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={add} className="border border-brand-light1 px-5 py-4 flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-brand-mid">New sales rep</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-brand-light1">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-brand-light1">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs uppercase tracking-widest text-brand-light1">Tracker name (optional)</span>
          <input value={repName} onChange={(e) => setRepName(e.target.value)} placeholder={name} className={inputClass} />
          <span className="text-xs text-brand-mid">
            How they’re written in the in-person tracker’s Sales Rep Name column, if different from their name. List other spellings after commas.
          </span>
        </label>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors disabled:opacity-50"
        >
          {busy ? 'Adding…' : 'Add to team'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function EditRow({
  member: m, onCancel, onSaved, onSignedOut,
}: { member: TeamRow; onCancel: () => void; onSaved: () => void; onSignedOut: () => void }) {
  const [name, setName] = useState(m.name);
  const [email, setEmail] = useState(m.email);
  const [repName, setRepName] = useState(m.repName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const headers = await authHeader();
      if (!headers) return onSignedOut();
      const res = await fetch('/api/admin/team', {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: m.kind, id: m.id, name, email, repName }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Couldn’t save.');
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  const emailChanged = email.trim().toLowerCase() !== m.email.toLowerCase();

  return (
    <li className="border border-brand-light1">
      <form onSubmit={save} className="px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-widest text-brand-mid">Editing</p>
          <RoleBadge member={m} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-brand-light1">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-brand-light1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={m.isOwner}
              className={`${inputClass} disabled:opacity-50`}
            />
          </label>
          {m.role === 'rep' && (
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs uppercase tracking-widest text-brand-light1">Tracker name</span>
              <input value={repName} onChange={(e) => setRepName(e.target.value)} placeholder={name} className={inputClass} />
              <span className="text-xs text-brand-mid">
                How they’re written in the in-person tracker’s Sales Rep Name column. List other spellings after commas.
              </span>
            </label>
          )}
        </div>
        {m.isOwner && <p className="text-xs text-brand-mid">The owner email is set by OWNER_EMAIL in Vercel.</p>}
        {emailChanged && m.kind === 'account' && (
          <p className="text-xs text-amber-300">This changes their sign-in email — they’ll log in with the new one from now on.</p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-brand-white text-brand-black hover:bg-brand-offwhite transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </li>
  );
}

function RoleBadge({ member: m }: { member: TeamRow }) {
  const label = m.isOwner ? 'Owner' : m.role === 'admin' ? 'Admin' : 'Sales rep';
  return (
    <>
      <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest border border-brand-dark2 text-brand-light2">{label}</span>
      {m.kind === 'invite' && (
        <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest border border-amber-400/50 text-amber-300">Invited</span>
      )}
    </>
  );
}
