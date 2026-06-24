'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Users, Activity, Award, LogOut, Edit, Upload } from 'lucide-react';

const AUTH_KEY = 'academy_authed';
const ROLE_KEY = 'academy_role';
const NAME_KEY = 'academy_name';
const STUDENT_STORE_KEY = 'academy_students';

type ModuleItem = { number: string; title: string; time: string };

interface Student {
  name: string;
  email: string;
  joinedAt: string;
}

export default function AcademyAdminClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy');
  const modules = t.raw('modules.items') as ModuleItem[];

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem(AUTH_KEY) === 'true';
    const role = sessionStorage.getItem(ROLE_KEY);
    if (!isAuthed || role !== 'admin') {
      router.replace(`/${locale}/academy/login?role=admin`);
    } else {
      try {
        const raw = JSON.parse(sessionStorage.getItem(STUDENT_STORE_KEY) || '[]') as Student[];
        setStudents(raw);
      } catch {
        setStudents([]);
      }
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

  const stats = [
    { label: t('admin.stats.totalStudents'), value: students.length, icon: Users },
    { label: t('admin.stats.activeThisWeek'), value: 0, icon: Activity },
    { label: t('admin.stats.certificatesIssued'), value: 0, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-brand-near-black">
      {/* Header bar */}
      <div className="border-b border-brand-dark2 bg-brand-black pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest text-brand-mid">N°1 Academy</span>
                <span className="w-px h-3 bg-brand-dark2" />
                <span className="text-xs uppercase tracking-widest text-brand-mid">Admin</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">
                {t('admin.heading')}
              </h1>
              <p className="text-brand-mid text-sm mt-1">{t('admin.subheading')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-brand-mid hover:text-brand-light1 transition-colors text-xs uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Stats */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-brand-dark1 border border-brand-dark2 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-brand-dark2 flex items-center justify-center">
                      <Icon size={16} className="text-brand-light2" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-brand-mid">
                      {stat.label}
                    </span>
                  </div>
                  <div className="font-display text-5xl text-brand-white leading-none">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Student Roster */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('admin.roster.heading')}
          </h2>
          <div className="bg-brand-dark1 border border-brand-dark2">
            {students.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={32} className="text-brand-dark2 mx-auto mb-4" />
                <p className="text-brand-mid text-sm uppercase tracking-widest">
                  {t('admin.roster.empty')}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-dark2">
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-brand-mid font-normal">
                        {t('admin.roster.colName')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-brand-mid font-normal">
                        {t('admin.roster.colEmail')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-brand-mid font-normal">
                        {t('admin.roster.colJoined')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-brand-mid font-normal">
                        {t('admin.roster.colProgress')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i} className="border-b border-brand-dark2 last:border-0">
                        <td className="px-6 py-4 text-brand-offwhite">{s.name}</td>
                        <td className="px-6 py-4 text-brand-light1">{s.email}</td>
                        <td className="px-6 py-4 text-brand-light1">
                          {new Date(s.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs uppercase tracking-widest text-brand-mid border border-brand-dark2 px-2 py-0.5">
                            0%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Module Management */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('admin.modules.heading')}
          </h2>
          <div className="bg-brand-dark1 border border-brand-dark2 divide-y divide-brand-dark2">
            {modules.map((mod, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-display text-2xl text-brand-dark2 flex-shrink-0">
                    {mod.number}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm text-brand-offwhite uppercase tracking-tight truncate">
                      {mod.title}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-brand-mid border border-brand-dark2 px-2 py-0.5 mt-1 inline-block">
                      {t('admin.modules.comingSoon')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    disabled
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-mid opacity-40 cursor-not-allowed"
                  >
                    <Edit size={11} />
                    {t('admin.modules.edit')}
                  </button>
                  <button
                    disabled
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-mid opacity-40 cursor-not-allowed"
                  >
                    <Upload size={11} />
                    {t('admin.modules.publish')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
