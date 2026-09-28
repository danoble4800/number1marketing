'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Lock, Award, Clock, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';

type ModuleItem = { number: string; title: string; time: string };

export default function AcademyDashboardClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy');
  const modules = t.raw('modules.items') as ModuleItem[];

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [studentName, setStudentName] = useState('');
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const profile = await getCurrentProfile();
      if (cancelled) return;
      if (!profile) {
        router.replace(`/${locale}/academy/login?role=student`);
        return;
      }
      const { data } = await getSupabase()
        .from('module_progress')
        .select('module_number')
        .eq('user_id', profile.id);
      if (cancelled) return;
      setCompleted((data ?? []).map((row) => row.module_number as string));
      setStudentName(profile.full_name || profile.email);
      setAuthed(true);
    })();
    return () => { cancelled = true; };
  }, [locale, router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push(`/${locale}/academy`);
  }

  const allDone = modules.length > 0 && modules.every((m) => completed.includes(m.number));
  const percent = modules.length ? Math.round((completed.length / modules.length) * 100) : 0;

  if (authed === null) {
    return <div className="min-h-screen bg-brand-near-black" />;
  }

  return (
    <div className="min-h-screen bg-brand-near-black">
      {/* Header bar */}
      <div className="border-b border-brand-dark2 bg-brand-black pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-brand-mid">N°1 Academy</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">
                {t('dashboard.heading')}, {studentName}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-brand-mid hover:text-brand-light1 transition-colors text-xs uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Progress bar */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-brand-mid">
              {t('dashboard.progressLabel')}
            </span>
            <span className="text-xs text-brand-light2">{t('dashboard.progressValue', { percent })}</span>
          </div>
          <div className="h-2 bg-brand-dark2 w-full">
            <div className="h-2 bg-brand-light2" style={{ width: `${percent}%` }} />
          </div>
        </section>

        {/* Modules */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.modulesHeading')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const done = completed.includes(mod.number);
              const unlocked = i === 0 || completed.includes(modules[i - 1].number);
              const badge = done ? t('dashboard.completed') : unlocked ? t('dashboard.start') : t('dashboard.locked');
              const card = (
                <>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs uppercase tracking-widest border px-2 py-0.5 ${
                        done
                          ? 'text-brand-light2 border-brand-light2/40'
                          : unlocked
                          ? 'text-brand-white border-brand-light1'
                          : 'text-brand-mid border-brand-dark2'
                      }`}
                    >
                      {done ? <CheckCircle2 size={11} /> : !unlocked && <Lock size={11} />}
                      {badge}
                    </span>
                  </div>

                  <div className={`font-display text-5xl mb-4 leading-none ${unlocked ? 'text-brand-mid' : 'text-brand-dark2'}`}>
                    {mod.number}
                  </div>

                  <h3 className={`font-display text-base uppercase tracking-tight mb-4 ${unlocked ? 'text-brand-white' : 'text-brand-light1'}`}>
                    {mod.title}
                  </h3>

                  <div className="flex items-center justify-between text-brand-mid">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Clock size={12} />
                      {t('dashboard.estTime')}: {mod.time}
                    </span>
                    {unlocked && <ArrowRight size={14} className="text-brand-light1" />}
                  </div>
                </>
              );
              return unlocked ? (
                <Link
                  key={mod.number}
                  href={`/${locale}/academy/module/${mod.number}`}
                  className="relative bg-brand-dark1 border border-brand-dark2 p-6 hover:border-brand-light1 transition-colors"
                >
                  {card}
                </Link>
              ) : (
                <div key={mod.number} className="relative bg-brand-dark1 border border-brand-dark2 p-6 opacity-70">
                  {card}
                </div>
              );
            })}
          </div>
        </section>

        {/* Certificate placeholder */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.certificateHeading')}
          </h2>
          <div className="bg-brand-dark1 border border-brand-dark2 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <div className={`flex-shrink-0 w-32 h-32 border-2 flex items-center justify-center relative ${allDone ? 'border-brand-light2' : 'border-brand-dark2'}`}>
              <Award size={48} className={allDone ? 'text-brand-light2' : 'text-brand-dark2'} />
              {!allDone && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={20} className="text-brand-mid mt-14" />
                </div>
              )}
            </div>
            <div>
              <div className={`inline-flex items-center gap-1.5 mb-3 px-2 py-1 border ${allDone ? 'border-brand-light2/40' : 'border-brand-dark2'}`}>
                {allDone ? <CheckCircle2 size={11} className="text-brand-light2" /> : <Lock size={11} className="text-brand-mid" />}
                <span className={`text-xs uppercase tracking-widest ${allDone ? 'text-brand-light2' : 'text-brand-mid'}`}>
                  {allDone ? t('dashboard.certificateEarnedBadge') : t('dashboard.certificateLockedBadge')}
                </span>
              </div>
              <h3 className="font-display text-xl text-brand-offwhite uppercase tracking-tight mb-2">
                AI Marketing Certificate
              </h3>
              <p className="text-brand-light1 text-sm max-w-md leading-relaxed">
                {allDone ? t('dashboard.certificateEarned') : t('dashboard.certificateLocked')}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
