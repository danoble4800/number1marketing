'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GraduationCap, Shield, Eye, EyeOff } from 'lucide-react';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import EmailCodeForm from '@/components/auth/EmailCodeForm';

type Tab = 'student' | 'admin';
type Mode = 'login' | 'register' | 'forgot' | 'code';
// Which emailed code we're waiting on: signing in, confirming a new account, or resetting a password.
type Pending = 'signin' | 'confirm' | 'recovery';

function LoginInner({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('academy.login');

  const initialRole = (searchParams.get('role') as Tab) === 'admin' ? 'admin' : 'student';
  const [tab, setTab] = useState<Tab>(initialRole);
  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);

  // Clear error on field change
  useEffect(() => { setError(''); }, [email, password, name, tab, mode]);

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setMode('login');
    setPending(null);
    setError('');
    setSuccessMsg('');
  }

  function fail(message: string) {
    setError(message);
    setLoading(false);
  }

  const cleanEmail = email.trim().toLowerCase();

  async function sendCode(kind: Pending) {
    const auth = getSupabase().auth;
    const { error: err } =
      kind === 'recovery'
        ? await auth.resetPasswordForEmail(cleanEmail)
        : kind === 'confirm'
        ? await auth.resend({ type: 'signup', email: cleanEmail })
        : await auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: false } });
    if (err) throw err;
  }

  async function waitForCode(kind: Pending) {
    try {
      await sendCode(kind);
    } catch {
      return fail(kind === 'signin' ? t('noAccountForCode') : t('genericError'));
    }
    setPending(kind);
    setLoading(false);
  }

  async function afterSignIn() {
    const supabase = getSupabase();
    const profile = await getCurrentProfile();
    if (tab === 'admin') {
      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        setPending(null);
        return fail(t('notAdmin'));
      }
      router.push(`/${locale}/academy/admin`);
      return;
    }
    if (profile?.role === 'rep') {
      router.push(`/${locale}/team`);
      return;
    }
    router.push(`/${locale}/academy/dashboard`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const supabase = getSupabase();

    if (mode === 'forgot') return waitForCode('recovery');
    if (mode === 'code') return waitForCode('signin');

    if (mode === 'register') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (signUpError) return fail(signUpError.message);
      // Supabase hides whether an email is taken: an existing address comes back with no identities.
      if (data.user && data.user.identities?.length === 0) return fail(t('emailExists'));
      if (!data.session) {
        setPending('confirm');
        setLoading(false);
        return;
      }
      setSuccessMsg(t('registerSuccess'));
      router.push(`/${locale}/academy/dashboard`);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) {
      if (signInError.message.toLowerCase().includes('not confirmed')) return waitForCode('confirm');
      return fail(tab === 'admin' ? t('adminError') : t('studentLoginError'));
    }

    await afterSignIn();
  }

  return (
    <div className="min-h-screen bg-brand-near-black flex flex-col items-center justify-center px-4 pt-24 pb-12">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <GraduationCap size={20} className="text-brand-light2" />
          <span className="font-display text-lg text-brand-white uppercase tracking-wider">
            N°1 AI Starter Guide
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-brand-white uppercase tracking-tight">
          {t('heading')}
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-brand-dark1 border border-brand-dark2">
        {/* Tabs */}
        <div className="flex border-b border-brand-dark2">
          {(['student', 'admin'] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest transition-colors ${
                tab === tabKey
                  ? 'text-brand-white border-b-2 border-brand-white bg-brand-dark2'
                  : 'text-brand-light1 hover:text-brand-white'
              }`}
            >
              {tabKey === 'admin' ? <Shield size={13} /> : <GraduationCap size={13} />}
              {tabKey === 'student' ? t('studentTab') : t('adminTab')}
            </button>
          ))}
        </div>

        {pending ? (
          <div className="p-8">
            <EmailCodeForm
              email={cleanEmail}
              type={pending === 'recovery' ? 'recovery' : 'email'}
              onResend={() => sendCode(pending)}
              onVerified={() =>
                pending === 'recovery' ? router.push(`/${locale}/academy/reset-password`) : afterSignIn()
              }
              onBack={() => { setPending(null); setMode('login'); }}
              labels={{
                intro: t('codeIntro', { email: '{email}' }),
                spamHint: t('spamHint'),
                codeLabel: t('codeLabel'),
                submit: t('codeSubmit'),
                checking: t('codeChecking'),
                wrongCode: t('wrongCode'),
                resend: t('resendCode'),
                resent: t('codeResent'),
                back: t('codeBack'),
              }}
            />
          </div>
        ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Name field (register mode only) */}
          {tab === 'student' && mode === 'register' && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                required
                className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
              {t('emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
            />
          </div>

          {/* Password */}
          {mode !== 'forgot' && mode !== 'code' && (
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 pr-11 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid hover:text-brand-light1 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'login' && (
              <div className="mt-2 flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setSuccessMsg(''); }}
                  className="text-xs text-brand-mid hover:text-brand-light2 underline transition-colors"
                >
                  {t('forgotPassword')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('code'); setSuccessMsg(''); }}
                  className="text-xs text-brand-mid hover:text-brand-light2 underline transition-colors"
                >
                  {t('codeInstead')}
                </button>
              </div>
            )}
          </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/40 px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="bg-brand-dark2 border border-brand-dark2 px-4 py-3">
              <p className="text-brand-light2 text-sm">{successMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'forgot' || mode === 'code'
              ? loading ? t('sending') : mode === 'code' ? t('sendCode') : t('sendReset')
              : mode === 'register'
              ? loading ? t('registering') : t('registerButton')
              : loading ? t('loggingIn') : t('loginButton')}
          </button>

          {mode === 'forgot' || mode === 'code' ? (
            <p className="text-center text-xs text-brand-mid">
              <button
                type="button"
                onClick={() => { setMode('login'); setSuccessMsg(''); }}
                className="text-brand-light2 hover:text-brand-white underline transition-colors"
              >
                {t('backToLogin')}
              </button>
            </p>
          ) : tab === 'student' && (
            /* Toggle login/register (students only) */
            <p className="text-center text-xs text-brand-mid">
              {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setSuccessMsg(''); }}
                className="text-brand-light2 hover:text-brand-white underline transition-colors"
              >
                {mode === 'login' ? t('switchToRegister') : t('switchToLogin')}
              </button>
            </p>
          )}
        </form>
        )}
      </div>
    </div>
  );
}

export default function AcademyLoginClient({ locale }: { locale: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-near-black" />}>
      <LoginInner locale={locale} />
    </Suspense>
  );
}
