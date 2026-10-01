'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GraduationCap } from 'lucide-react';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';

export default function AcademyResetPasswordClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy.reset');

  // null = still reading the link from the reset email
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });
    // Give the client a moment to pick the recovery token out of the URL.
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setReady(Boolean(session));
    }, 1500);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: updateError } = await getSupabase().auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    setDone(true);
    const profile = await getCurrentProfile();
    await new Promise((r) => setTimeout(r, 1000));
    if (profile?.role === 'rep') {
      router.push(`/${locale}/team`);
      return;
    }
    router.push(`/${locale}/academy/${profile?.role === 'admin' ? 'admin' : 'dashboard'}`);
  }

  return (
    <div className="min-h-screen bg-brand-near-black flex flex-col items-center justify-center px-4 pt-24 pb-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <GraduationCap size={20} className="text-brand-light2" />
          <span className="font-display text-lg text-brand-white uppercase tracking-wider">
            N°1 Academy
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-brand-white uppercase tracking-tight">
          {t('heading')}
        </h1>
      </div>

      <div className="w-full max-w-md bg-brand-dark1 border border-brand-dark2 p-8">
        {ready === null ? (
          <p className="text-brand-mid text-sm text-center">{t('checking')}</p>
        ) : ready === false ? (
          <div className="space-y-5 text-center">
            <p className="text-red-400 text-sm">{t('invalidLink')}</p>
            <a
              href={`/${locale}/academy/login`}
              className="inline-block text-xs text-brand-light2 hover:text-brand-white underline"
            >
              {t('backToLogin')}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
                {t('newPasswordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-800/40 px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {done && (
              <div className="bg-brand-dark2 border border-brand-dark2 px-4 py-3">
                <p className="text-brand-light2 text-sm">{t('updated')}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('updating') : t('updateButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
