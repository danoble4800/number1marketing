'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import EmailCodeForm from '@/components/auth/EmailCodeForm';

// Email a 6-digit code — no password to forget, and unlike a link it works when the email
// is opened on another device or inside an app's browser. Shares Supabase Auth with the Academy.
export default function CardSignIn({ next, heading, sub }: { next: string; heading?: string; sub?: string }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const cleanEmail = email.trim().toLowerCase();
  const sendCode = async () => {
    const { error: err } = await getSupabase().auth.signInWithOtp({ email: cleanEmail });
    if (err) throw err;
  };

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await sendCode();
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
    setBusy(false);
  }

  return (
    <div className="w-full max-w-md border border-brand-dark2 bg-brand-dark1 p-8">
      <h1 className="font-display text-3xl uppercase tracking-tight text-brand-white">{heading ?? 'Edit your page'}</h1>
      {step === 'code' ? (
        <div className="mt-4">
          <EmailCodeForm
            email={cleanEmail}
            onResend={sendCode}
            // Full load so the destination page picks up the new session.
            onVerified={() => window.location.assign(next)}
            onBack={() => setStep('email')}
          />
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-brand-light1">
            {sub ?? 'Enter your email and we’ll send you a 6-digit code. No password needed. If you don’t see it, check your spam folder.'}
          </p>
          <form onSubmit={submitEmail} className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-widest text-brand-mid">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="w-full border border-brand-dark2 bg-brand-black px-4 py-3 text-sm text-brand-offwhite placeholder:text-brand-mid focus:border-brand-light1 focus:outline-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 bg-brand-white py-3 text-sm font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite disabled:opacity-60"
            >
              <Mail size={16} /> {busy ? 'Sending…' : 'Email me a code'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
