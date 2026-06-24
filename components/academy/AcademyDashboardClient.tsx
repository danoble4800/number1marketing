'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock, Award, Clock, LogOut } from 'lucide-react';

const AUTH_KEY = 'academy_authed';
const ROLE_KEY = 'academy_role';
const NAME_KEY = 'academy_name';

type ModuleItem = { number: string; title: string; time: string };

export default function AcademyDashboardClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy');
  const modules = t.raw('modules.items') as ModuleItem[];

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const isAuthed = sessionStorage.getItem(AUTH_KEY) === 'true';
    const role = sessionStorage.getItem(ROLE_KEY);
    if (!isAuthed || role !== 'student') {
      router.replace(`/${locale}/academy/login?role=student`);
    } else {
      setStudentName(sessionStorage.getItem(NAME_KEY) || 'Student');
      setAuthed(true);
    }
  }, [locale, router]);

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(NAME_KEY);
    router.push(`/${locale}/academy`);
  }

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
            <span className="text-xs text-brand-light2">{t('dashboard.progressValue')}</span>
          </div>
          <div className="h-2 bg-brand-dark2 w-full">
            <div className="h-2 bg-brand-light2 w-0" />
          </div>
        </section>

        {/* Modules */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.modulesHeading')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <div
                key={i}
                className="relative bg-brand-dark1 border border-brand-dark2 p-6"
              >
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs uppercase tracking-widest text-brand-mid border border-brand-dark2 px-2 py-0.5">
                    {t('dashboard.comingSoon')}
                  </span>
                </div>

                {/* Module number */}
                <div className="font-display text-5xl text-brand-dark2 mb-4 leading-none">
                  {mod.number}
                </div>

                {/* Lock */}
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={13} className="text-brand-mid flex-shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-brand-mid">
                    {t('dashboard.locked')}
                  </span>
                </div>

                <h3 className="font-display text-base text-brand-light1 uppercase tracking-tight mb-4">
                  {mod.title}
                </h3>

                <div className="flex items-center gap-1.5 text-brand-mid">
                  <Clock size={12} />
                  <span className="text-xs">{t('dashboard.estTime')}: {mod.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certificate placeholder */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.certificateHeading')}
          </h2>
          <div className="bg-brand-dark1 border border-brand-dark2 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            {/* Certificate icon placeholder */}
            <div className="flex-shrink-0 w-32 h-32 border-2 border-brand-dark2 flex items-center justify-center relative">
              <Award size={48} className="text-brand-dark2" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={20} className="text-brand-mid mt-14" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 border border-brand-dark2">
                <Lock size={11} className="text-brand-mid" />
                <span className="text-xs uppercase tracking-widest text-brand-mid">
                  {t('dashboard.certificateLockedBadge')}
                </span>
              </div>
              <h3 className="font-display text-xl text-brand-offwhite uppercase tracking-tight mb-2">
                AI Marketing Certificate
              </h3>
              <p className="text-brand-light1 text-sm max-w-md leading-relaxed">
                {t('dashboard.certificateLocked')}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
