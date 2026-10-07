'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Lock, Award, Clock, LogOut, CheckCircle2, Circle, ArrowRight, Download, ExternalLink, Copy, BookOpen, Wrench, Medal, Video } from 'lucide-react';
import { course, prerequisite, TRACKS, type TrackId } from '@/content/academy/lessons';
import { GLOSSARY } from '@/content/academy/glossary';
import { loadAcademyState } from '@/lib/academyState';
import CapstoneCard, { type CapstoneSubmission } from '@/components/academy/CapstoneCard';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import { downloadCertificatePdf, type CertificateText } from '@/lib/certificatePdf';

type Certificate = { id: string; full_name: string; issued_at: string };

type ModuleItem = { number: string; title: string; time: string };

export default function AcademyDashboardClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy');
  const modules = t.raw('modules.items') as ModuleItem[];

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [studentName, setStudentName] = useState('');
  const [completed, setCompleted] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);
  const [knownAll, setKnownAll] = useState(false);
  const [checklistsDone, setChecklistsDone] = useState(0);
  const [capstone, setCapstone] = useState<CapstoneSubmission | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAcademyState().then(({ checklists, knownTerms }) => {
      if (cancelled) return;
      const known = new Set(knownTerms);
      setKnownAll(GLOSSARY.every((g) => known.has(g.id)));
      setChecklistsDone(course.filter((m) => (checklists[m.number] ?? []).length >= m.checklist.length).length);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const profile = await getCurrentProfile();
      if (cancelled) return;
      if (!profile) {
        router.replace(`/${locale}/academy/login?role=student`);
        return;
      }
      const supabase = getSupabase();
      const [{ data }, { data: cert }, { data: capstoneRow }] = await Promise.all([
        supabase.from('module_progress').select('module_number').eq('user_id', profile.id),
        supabase.from('certificates').select('id, full_name, issued_at').eq('user_id', profile.id).maybeSingle(),
        supabase
          .from('capstone_submissions')
          .select('link, note, status, feedback, submitted_at')
          .eq('user_id', profile.id)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      setCapstone((capstoneRow as CapstoneSubmission) ?? null);
      setCompleted((data ?? []).map((row) => row.module_number as string));
      setCertificate((cert as Certificate) ?? null);
      setIsAdmin(profile.role === 'admin');
      setStudentName(profile.full_name || profile.email);
      setAuthed(true);
    })();
    return () => { cancelled = true; };
  }, [locale, router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push(`/${locale}/academy`);
  }

  const allDone = Boolean(certificate);
  const verifyUrl = certificate
    ? `${typeof window === 'undefined' ? '' : window.location.origin}/${locale}/academy/verify/${certificate.id}`
    : '';

  function handleDownload() {
    if (!certificate) return;
    downloadCertificatePdf({
      name: certificate.full_name,
      code: certificate.id,
      issuedAt: certificate.issued_at,
      verifyUrl: verifyUrl.replace(/^https?:\/\//, ''),
      locale,
      text: t.raw('certificate.pdf') as CertificateText,
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the verify link is still shown on screen.
    }
  }

  const linkedInUrl = certificate
    ? 'https://www.linkedin.com/profile/add?' +
      new URLSearchParams({
        startTask: 'CERTIFICATION_NAME',
        name: 'N°1 AI Starter Guide: AI Marketing Course Certificate of Completion',
        organizationName: 'Number 1 Digital Marketing',
        issueYear: String(new Date(certificate.issued_at).getFullYear()),
        issueMonth: String(new Date(certificate.issued_at).getMonth() + 1),
        certUrl: verifyUrl,
        certId: certificate.id,
      }).toString()
    : '';
  const inTrack = (id: TrackId) => modules.filter((m) => TRACKS[id].includes(m.number));
  const coreModules = inTrack('marketing');
  const handsOnModules = inTrack('handsOn');
  const starterModules = [...inTrack('forYou'), ...inTrack('forBusiness')];
  const doneIn = (list: ModuleItem[]) => list.filter((m) => completed.includes(m.number)).length;
  const coreDone = doneIn(coreModules);
  const handsOnDone = doneIn(handsOnModules);
  const percent = modules.length ? Math.round((doneIn(modules) / modules.length) * 100) : 0;

  const badges = [
    { id: 'firstStep', earned: completed.length > 0 },
    { id: 'starter', earned: starterModules.length > 0 && doneIn(starterModules) === starterModules.length },
    { id: 'halfway', earned: completed.length >= 3 },
    { id: 'certified', earned: Boolean(certificate) },
    { id: 'localPro', earned: completed.includes('07') },
    { id: 'reputationPro', earned: completed.includes('08') },
    { id: 'wordsmith', earned: knownAll },
    { id: 'handsOn', earned: checklistsDone >= 3 },
  ];

  function moduleCard(mod: ModuleItem) {
    const done = completed.includes(mod.number);
    const prev = prerequisite(mod.number);
    // Admins can open every module to review it.
    const unlocked = isAdmin || !prev || completed.includes(prev);
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
                <span className="text-xs uppercase tracking-widest text-brand-mid">N°1 AI Starter Guide</span>
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

        {/* Starter Guide: open in any order */}
        {(['forYou', 'forBusiness'] as const).map((id) => {
          const list = inTrack(id);
          return (
            <section key={id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight">
                  {t(`tracks.${id}.title`)}
                </h2>
                <span className="text-xs uppercase tracking-widest text-brand-mid">
                  {t('dashboard.handsOnProgress', { done: doneIn(list), total: list.length })}
                </span>
              </div>
              <p className="text-brand-light1 text-sm mb-6 max-w-2xl">{t(`tracks.${id}.desc`)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(moduleCard)}</div>
            </section>
          );
        })}

        {/* AI Marketing Course */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-2">
            {t('dashboard.modulesHeading')}
          </h2>
          <p className="text-brand-light1 text-sm mb-6 max-w-2xl">{t('tracks.marketing.desc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreModules.map(moduleCard)}
          </div>
        </section>

        {/* Study tools */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.toolsHeading')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: 'academy/glossary', Icon: BookOpen, title: t('dashboard.glossaryTitle'), desc: t('dashboard.glossaryDesc') },
              { href: 'academy/toolkit', Icon: Wrench, title: t('dashboard.toolkitTitle'), desc: t('dashboard.toolkitDesc') },
              { href: 'academy#coaching', Icon: Video, title: t('dashboard.coachingTitle'), desc: t('dashboard.coachingDesc') },
            ].map(({ href, Icon, title, desc }) => (
              <Link
                key={href}
                href={`/${locale}/${href}`}
                className="flex items-start gap-4 bg-brand-dark1 border border-brand-dark2 p-6 hover:border-brand-light1 transition-colors"
              >
                <Icon size={22} className="text-brand-light2 flex-shrink-0 mt-1" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base uppercase tracking-tight text-brand-white">{title}</span>
                  <span className="block text-sm text-brand-light1 mt-1">{desc}</span>
                </span>
                <ArrowRight size={14} className="text-brand-light1 mt-1.5 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Certificate placeholder */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.certificateHeading')}
          </h2>
          <div className="bg-brand-dark1 border border-brand-dark2 p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className={`flex-shrink-0 w-32 h-32 border-2 flex items-center justify-center relative ${allDone ? 'border-brand-light2' : 'border-brand-dark2'}`}>
              <Award size={48} className={allDone ? 'text-brand-light2' : 'text-brand-dark2'} />
              {!allDone && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={20} className="text-brand-mid mt-14" />
                </div>
              )}
            </div>
            <div className="w-full min-w-0 flex-1">
              <div className={`inline-flex items-center gap-1.5 mb-3 px-2 py-1 border ${allDone ? 'border-brand-light2/40' : 'border-brand-dark2'}`}>
                {allDone ? <CheckCircle2 size={11} className="text-brand-light2" /> : <Lock size={11} className="text-brand-mid" />}
                <span className={`text-xs uppercase tracking-widest ${allDone ? 'text-brand-light2' : 'text-brand-mid'}`}>
                  {allDone ? t('dashboard.certificateEarnedBadge') : t('dashboard.certificateLockedBadge')}
                </span>
              </div>
              <h3 className="font-display text-xl text-brand-offwhite uppercase tracking-tight mb-2">
                {t('dashboard.certificateTitle')}
              </h3>
              <p className="text-brand-light1 text-sm max-w-md leading-relaxed">
                {allDone ? t('dashboard.certificateEarned') : t('dashboard.certificateLocked')}
              </p>
              {!certificate && (
                <ul className="mt-4 space-y-1.5 text-sm">
                  {[
                    { done: coreDone === coreModules.length, label: t('dashboard.requirementModules', { done: coreDone }) },
                    { done: capstone?.status === 'approved', label: t('dashboard.requirementCapstone') },
                  ].map(({ done, label }) => (
                    <li key={label} className={`flex items-center gap-2 ${done ? 'text-brand-light2' : 'text-brand-light1'}`}>
                      {done ? <CheckCircle2 size={14} /> : <Circle size={14} className="text-brand-mid" />}
                      {label}
                    </li>
                  ))}
                </ul>
              )}
              {!certificate && (
                <CapstoneCard
                  locale={locale}
                  unlocked={isAdmin || completed.includes('05')}
                  submission={capstone}
                  onSubmitted={setCapstone}
                />
              )}
              {certificate && (
                <>
                  <p className="text-xs uppercase tracking-widest text-brand-mid mt-4">
                    {t('certificate.pdf.idLabel')}: <span className="text-brand-offwhite">{certificate.id}</span>
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors"
                    >
                      <Download size={13} /> {t('certificate.download')}
                    </button>
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-brand-dark2 text-brand-light1 text-xs uppercase tracking-widest px-5 py-3 hover:border-brand-light1 hover:text-brand-white transition-colors"
                    >
                      <ExternalLink size={13} /> {t('certificate.linkedIn')}
                    </a>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 border border-brand-dark2 text-brand-light1 text-xs uppercase tracking-widest px-5 py-3 hover:border-brand-light1 hover:text-brand-white transition-colors"
                    >
                      <Copy size={13} /> {copied ? t('certificate.copied') : t('certificate.copyLink')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Hands-On Track */}
        {handsOnModules.length > 0 && (
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight">
                {t('dashboard.handsOnHeading')}
              </h2>
              <span className="text-xs uppercase tracking-widest text-brand-mid">
                {t('dashboard.handsOnProgress', { done: handsOnDone, total: handsOnModules.length })}
              </span>
            </div>
            <p className="text-brand-light1 text-sm mb-6 max-w-2xl">{t('dashboard.handsOnIntro')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {handsOnModules.map(moduleCard)}
            </div>
          </section>
        )}

        {/* Badges */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.badgesHeading')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {badges.map(({ id, earned }) => (
              <div
                key={id}
                className={`border p-4 ${earned ? 'border-brand-light2/40 bg-brand-dark1' : 'border-brand-dark2 bg-brand-dark1 opacity-50'}`}
              >
                <Medal size={20} className={earned ? 'text-brand-light2' : 'text-brand-dark2'} />
                <span className={`block mt-3 text-sm font-semibold ${earned ? 'text-brand-white' : 'text-brand-light1'}`}>
                  {t(`dashboard.badges.${id}.title`)}
                </span>
                <span className="block text-xs text-brand-mid mt-1">{t(`dashboard.badges.${id}.desc`)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-brand-mid mt-3">{t('dashboard.badgesNote')}</p>
        </section>

      </div>
    </div>
  );
}
