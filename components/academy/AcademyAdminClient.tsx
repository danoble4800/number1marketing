'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Users, Activity, Award, LogOut, Eye } from 'lucide-react';
import { getSupabase, getCurrentProfile, type Profile } from '@/lib/supabase';
import CapstoneReviews, { type CapstoneRow } from '@/components/academy/CapstoneReviews';
import type { CapstoneStatus } from '@/components/academy/CapstoneCard';

type ModuleItem = { number: string; title: string; time: string };
type ProgressRow = { user_id: string; module_number: string; completed_at: string };

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function AcademyAdminClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy');
  const modules = t.raw('modules.items') as ModuleItem[];

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [students, setStudents] = useState<Profile[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [certified, setCertified] = useState<Set<string>>(new Set());
  const [capstones, setCapstones] = useState<CapstoneRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const profile = await getCurrentProfile();
      if (cancelled) return;
      if (profile?.role !== 'admin') {
        router.replace(`/${locale}/academy/login?role=admin`);
        return;
      }
      // Row level security only returns every profile to admins.
      const supabase = getSupabase();
      const [profilesRes, progressRes, certificatesRes, capstonesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, full_name, role, created_at')
          .eq('role', 'student')
          .order('created_at', { ascending: false }),
        supabase.from('module_progress').select('user_id, module_number, completed_at'),
        supabase.from('certificates').select('user_id'),
        supabase
          .from('capstone_submissions')
          .select('user_id, link, note, status, feedback, submitted_at, reviewed_at'),
      ]);
      if (cancelled) return;
      setStudents((profilesRes.data as Profile[]) ?? []);
      setProgress((progressRes.data as ProgressRow[]) ?? []);
      setCertified(new Set((certificatesRes.data ?? []).map((row) => row.user_id as string)));
      setCapstones((capstonesRes.data as CapstoneRow[]) ?? []);
      setAuthed(true);
    })();
    return () => { cancelled = true; };
  }, [locale, router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push(`/${locale}/academy`);
  }

  const completedCount = (userId: string) =>
    progress.filter((row) => row.user_id === userId).length;
  const percentFor = (userId: string) =>
    modules.length ? Math.round((completedCount(userId) / modules.length) * 100) : 0;
  const activeThisWeek = new Set(
    progress
      .filter((row) => Date.now() - new Date(row.completed_at).getTime() < WEEK_MS)
      .map((row) => row.user_id)
  ).size;

  function handleReviewed(userId: string, status: CapstoneStatus, feedback: string, certificate: boolean) {
    setCapstones((rows) =>
      rows.map((row) => (row.user_id === userId ? { ...row, status, feedback, reviewed_at: new Date().toISOString() } : row))
    );
    if (certificate) setCertified((ids) => new Set(ids).add(userId));
  }

  if (authed === null) {
    return <div className="min-h-screen bg-brand-near-black" />;
  }

  const stats = [
    { label: t('admin.stats.totalStudents'), value: students.length, icon: Users },
    { label: t('admin.stats.activeThisWeek'), value: activeThisWeek, icon: Activity },
    { label: t('admin.stats.certificatesIssued'), value: certified.size, icon: Award },
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

        <CapstoneReviews
          locale={locale}
          submissions={capstones}
          students={students}
          finalPassed={new Set(progress.filter((row) => row.module_number === '06').map((row) => row.user_id))}
          certified={certified}
          onReviewed={handleReviewed}
        />

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
                    {students.map((s) => (
                      <tr key={s.id} className="border-b border-brand-dark2 last:border-0">
                        <td className="px-6 py-4 text-brand-offwhite">{s.full_name || '—'}</td>
                        <td className="px-6 py-4 text-brand-light1">{s.email}</td>
                        <td className="px-6 py-4 text-brand-light1">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs uppercase tracking-widest text-brand-mid border border-brand-dark2 px-2 py-0.5">
                            {percentFor(s.id)}%
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
                    <span className="text-xs uppercase tracking-widest text-brand-light2 border border-brand-light2/40 px-2 py-0.5 mt-1 inline-block">
                      {t('admin.modules.live')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="hidden sm:inline text-xs uppercase tracking-widest text-brand-mid">
                    {t('admin.modules.passed', {
                      count: students.filter((s) => progress.some((row) => row.user_id === s.id && row.module_number === mod.number)).length,
                    })}
                  </span>
                  <Link
                    href={`/${locale}/academy/module/${mod.number}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light1 hover:text-brand-white transition-colors"
                  >
                    <Eye size={12} />
                    {t('admin.modules.view')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
