'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

// Email magic link — no password to forget. Shares Supabase Auth with the Academy.
export default function CardSignIn({ next, heading, sub }: { next: string; heading?: string; sub?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const { error: err } = await getSupabase().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    if (err) {
      setError(err.message);
      setState('error');
      return;
    }
    setState('sent');
  }

  return (
    <div className="w-full max-w-md border border-brand-dark2 bg-brand-dark1 p-8">
      <h1 className="font-display text-3xl uppercase tracking-tight text-brand-white">{heading ?? 'Edit your page'}</h1>
      <p className="mt-2 text-sm text-brand-light1">
        {sub ?? 'Enter your email and we’ll send you a sign-in link. No password needed.'}
      </p>
      {state === 'sent' ? (
        <div className="mt-6 flex items-start gap-3 border border-brand-dark2 bg-brand-black p-4 text-sm text-brand-offwhite">
          <Check size={18} className="mt-0.5 shrink-0 text-green-400" />
          <span>
            Check <strong>{email}</strong> for your sign-in link. Open it on this device.
          </span>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs uppercase tracking-widest text-brand-mid">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            className="w-full border border-brand-dark2 bg-brand-black px-4 py-3 text-sm text-brand-offwhite placeholder:text-brand-mid focus:border-brand-light1 focus:outline-none"
          />
          {state === 'error' && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="flex w-full items-center justify-center gap-2 bg-brand-white py-3 text-sm font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite disabled:opacity-60"
          >
            <Mail size={16} /> {state === 'sending' ? 'Sending…' : 'Send sign-in link'}
          </button>
        </form>
      )}
    </div>
  );
}
