'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export type CodeLabels = {
  intro: string; // "{email}" is replaced with the address
  spamHint: string;
  codeLabel: string;
  submit: string;
  checking: string;
  wrongCode: string;
  resend: string;
  resent: string;
  back: string;
};

export const ENGLISH_CODE_LABELS: CodeLabels = {
  intro: 'We sent a 6-digit code to {email}. Enter it below.',
  spamHint: 'Don’t see it? Check your spam or junk folder. It can take a minute to arrive.',
  codeLabel: 'Code from your email',
  submit: 'Continue',
  checking: 'Checking…',
  wrongCode: 'That code didn’t work. Check it, or send a new one.',
  resend: 'Send a new code',
  resent: 'New code sent.',
  back: 'Use a different email',
};

// Second step of every emailed-code flow (sign in, confirm a new account, reset a password).
// `type: 'recovery'` is for password resets; 'email' covers sign-in and new-account codes.
export default function EmailCodeForm({
  email,
  type = 'email',
  onVerified,
  onResend,
  onBack,
  labels = ENGLISH_CODE_LABELS,
}: {
  email: string;
  type?: 'email' | 'recovery';
  onVerified: () => void | Promise<void>;
  onResend: () => Promise<unknown>;
  onBack: () => void;
  labels?: CodeLabels;
}) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setResent(false);
    const { error: err } = await getSupabase().auth.verifyOtp({ email, token: code.trim(), type });
    if (err) {
      setError(labels.wrongCode);
      setBusy(false);
      return;
    }
    await onVerified();
  }

  async function resend() {
    setBusy(true);
    setError('');
    setResent(false);
    try {
      await onResend();
      setCode('');
      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.wrongCode);
    }
    setBusy(false);
  }

  const [before, after] = labels.intro.split('{email}');

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-light1">
        {before}
        <strong className="text-brand-offwhite">{email}</strong>
        {after}
      </p>
      <p className="text-xs text-brand-mid">{labels.spamHint}</p>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-xs uppercase tracking-widest text-brand-mid">{labels.codeLabel}</label>
        <input
          type="text"
          required
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6,10}"
          maxLength={10}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="123456"
          className="w-full border border-brand-dark2 bg-brand-black px-4 py-3 font-mono text-lg tracking-[0.3em] text-brand-offwhite placeholder:text-brand-mid focus:border-brand-light1 focus:outline-none"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {resent && !error && <p className="text-sm text-green-400">{labels.resent}</p>}
        <button
          type="submit"
          disabled={busy || code.length < 6}
          className="flex w-full items-center justify-center gap-2 bg-brand-white py-3 text-sm font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite disabled:opacity-60"
        >
          <KeyRound size={16} /> {busy ? labels.checking : labels.submit}
        </button>
      </form>
      <div className="flex justify-between gap-4 text-xs text-brand-light1">
        <button type="button" onClick={resend} disabled={busy} className="underline hover:text-brand-white">
          {labels.resend}
        </button>
        <button type="button" onClick={onBack} className="underline hover:text-brand-white">
          {labels.back}
        </button>
      </div>
    </div>
  );
}
