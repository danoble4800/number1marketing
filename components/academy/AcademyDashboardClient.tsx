'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Lock, Award, Clock, LogOut, CheckCircle2, ArrowRight, Download, ExternalLink, Copy, BookOpen, Wrench, Medal } from 'lucide-react';
import { course, isHandsOn } from '@/content/academy/lessons';
import { GLOSSARY } from '@/content/academy/glossary';
import { readChecklist, readKnownTerms } from '@/lib/academyLocal';
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

  useEffect(() => {
    const known = new Set(readKnownTerms());
    setKnownAll(GLOSSARY.every((g) => known.has(g.id)));
    setChecklistsDone(course.filter((m) => readChecklist(m.number).length >= m.checklist.length).length);
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
      const [{ data }, { data: cert }] = await Promise.all([
        supabase.from('module_progress').select('module_number').eq('user_id', profile.id),
        supabase.from('certificates').select('id, full_name, issued_at').eq('user_id', profile.id).maybeSingle(),
      ]);
      if (cancelled) return;
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
        name: 'N°1 Academy AI Marketing Certificate',
        organizationName: 'Number 1 Digital Marketing',
        issueYear: String(new Date(certificate.issued_at).getFullYear()),
        issueMonth: String(new Date(certificate.issued_at).getMonth() + 1),
        certUrl: verifyUrl,
        certId: certificate.id,
      }).toString()
    : '';
  const coreModules = modules.filter((m) => !isHandsOn(m.number));
  const handsOnModules = modules.filter((m) => isHandsOn(m.number));
  const coreDone = coreModules.filter((m) => completed.includes(m.number)).length;
  const handsOnDone = handsOnModules.filter((m) => completed.includes(m.number)).length;
  const percent = coreModules.length ? Math.round((coreDone / coreModules.length) * 100) : 0;

  const badges = [
    { id: 'firstStep', earned: completed.includes('01') },
    { id: 'halfway', earned: completed.length >= 3 },
    { id: 'certified', earned: Boolean(certificate) },
    { id: 'localPro', earned: completed.includes('07') },
    { id: 'reputationPro', earned: completed.includes('08') },
    { id: 'wordsmith', earned: knownAll },
    { id: 'handsOn', earned: checklistsDone >= 3 },
  ];

  function moduleCard(mod: ModuleItem) {
    const i = modules.findIndex((m) => m.number === mod.number);
    const done = completed.includes(mod.number);
    // Admins can open every module to review it.
    const unlocked = isAdmin || i === 0 || completed.includes(modules[i - 1].number);
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
            {coreModules.map(moduleCard)}
          </div>
        </section>

        {/* Study tools */}
        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">
            {t('dashboard.toolsHeading')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: 'glossary', Icon: BookOpen, title: t('dashboard.glossaryTitle'), desc: t('dashboard.glossaryDesc') },
              { href: 'toolkit', Icon: Wrench, title: t('dashboard.toolkitTitle'), desc: t('dashboard.toolkitDesc') },
            ].map(({ href, Icon, title, desc }) => (
              <Link
                key={href}
                href={`/${locale}/academy/${href}`}
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
