'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ClipboardList, Handshake, Lock, Timer, Wrench, XCircle } from 'lucide-react';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import LessonBody from '@/components/academy/LessonBody';
import VideoEmbed from '@/components/academy/VideoEmbed';
import { getModuleVideo } from '@/content/academy/videos';
import { CERT_MODULE, isStarter, prerequisite, type CourseModule } from '@/content/academy/lessons';
import { loadAcademyState, saveChecklist } from '@/lib/academyState';
import { PASS_PERCENT, type QuizQuestion } from '@/content/academy/quizzes';
import { COACHING_PRICES, MODULE_UPSELLS, coachingHref } from '@/content/academy/coaching';

// A failed attempt comes back with only the score and when the quiz reopens; which answers
// were right is returned only on a pass. A submit during the wait returns just retry_at.
type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  results?: boolean[];
  certificate?: boolean;
  retry_at?: string | null;
};

interface Props {
  locale: string;
  courseModule: CourseModule;
  title: string;
  time: string;
  quiz: QuizQuestion[];
  nextNumber: string | null;
}

export default function AcademyModuleClient({ locale, courseModule, title, time, quiz, nextNumber }: Props) {
  const router = useRouter();
  const t = useTranslations('academy.module');

  const [status, setStatus] = useState<'loading' | 'locked' | 'open'>('loading');
  const [completed, setCompleted] = useState(false);
  // 0..lessons.length-1 = lessons; lessons.length = exercise + quiz
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [retryAt, setRetryAt] = useState<Date | null>(null);

  const lessons = courseModule.lessons;
  const quizStep = lessons.length;
  const prevNumber = prerequisite(courseModule.number);
  // The certificate's final assessment; the Hands-On Track modules after it are regular quizzes.
  const isFinal = courseModule.number === CERT_MODULE;
  const isLast = nextNumber === null;
  // Starter Guide modules are open in any order, so passing one doesn't "unlock" anything.
  const starter = isStarter(courseModule.number);
  const video = getModuleVideo(courseModule.number, locale);
  const upsell = MODULE_UPSELLS[courseModule.number];

  const [ticked, setTicked] = useState<number[]>([]);
  useEffect(() => {
    let cancelled = false;
    loadAcademyState().then(({ checklists }) => {
      if (!cancelled) setTicked(checklists[courseModule.number] ?? []);
    });
    return () => { cancelled = true; };
  }, [courseModule.number]);
  function toggleTick(i: number) {
    const next = ticked.includes(i) ? ticked.filter((x) => x !== i) : [...ticked, i];
    setTicked(next);
    saveChecklist(courseModule.number, next);
  }

  // Clear the wait once it's over so the quiz can be retaken without a reload.
  useEffect(() => {
    if (!retryAt) return;
    const ms = retryAt.getTime() - Date.now();
    if (ms <= 0) { setRetryAt(null); return; }
    const timer = setTimeout(() => setRetryAt(null), ms);
    return () => clearTimeout(timer);
  }, [retryAt]);

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
      const done = new Set((data ?? []).map((row) => row.module_number as string));
      setCompleted(done.has(courseModule.number));
      const unlocked = !prevNumber || done.has(prevNumber) || profile.role === 'admin';
      setStatus(unlocked ? 'open' : 'locked');
      if (!unlocked) return;
      const { data: until } = await getSupabase().rpc('quiz_retry_at', { p_module: courseModule.number });
      if (!cancelled && until) setRetryAt(new Date(until as string));
    })();
    return () => { cancelled = true; };
  }, [locale, router, courseModule.number, prevNumber]);

  function goTo(nextStep: number) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitQuiz() {
    if (answers.some((a) => a === null)) {
      setError(t('answerAll'));
      return;
    }
    setError('');
    setSubmitting(true);
    const { data, error: rpcError } = await getSupabase().rpc('submit_quiz', {
      p_module: courseModule.number,
      p_answers: answers,
    });
    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message.includes('locked') ? t('lockedMessage', { prev: prevNumber ?? '' }) : t('submitError'));
      return;
    }
    const graded = data as QuizResult;
    if (graded.retry_at) setRetryAt(new Date(graded.retry_at));
    if (graded.score === undefined) return;
    setResult(graded);
    if (graded.passed) setCompleted(true);
  }

  function retry() {
    setResult(null);
    setAnswers(quiz.map(() => null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const retryTime = retryAt?.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }) ?? '';
  // The final assessment issues the certificate only once the capstone is approved too.
  const awaitingCapstone = isFinal && result?.passed && !result.certificate;

  if (status === 'loading') {
    return <div className="min-h-screen bg-brand-near-black" />;
  }

  const header = (
    <div className="border-b border-brand-dark2 bg-brand-black pt-20 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/academy/dashboard`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light1 transition-colors mb-4"
        >
          <ArrowLeft size={13} />
          {t('backToDashboard')}
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-widest text-brand-mid">
            {t('moduleLabel', { number: courseModule.number })}
          </span>
          <span className="w-px h-3 bg-brand-dark2" />
          <span className="text-xs uppercase tracking-widest text-brand-mid">{time}</span>
          {completed && (
            <>
              <span className="w-px h-3 bg-brand-dark2" />
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-brand-light2">
                <CheckCircle2 size={12} /> {t('completed')}
              </span>
            </>
          )}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">{title}</h1>
        <p className="text-brand-light1 text-sm mt-2 max-w-3xl">{courseModule.summary}</p>
      </div>
    </div>
  );

  if (status === 'locked') {
    return (
      <div className="min-h-screen bg-brand-near-black">
        {header}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Lock size={32} className="text-brand-mid mx-auto mb-4" />
          <p className="text-brand-light1">{t('lockedMessage', { prev: prevNumber ?? '' })}</p>
          <Link
            href={`/${locale}/academy/module/${prevNumber}`}
            className="inline-block mt-6 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-brand-offwhite transition-colors"
          >
            {t('goToModule', { number: prevNumber ?? '' })}
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    ...lessons.map((l) => ({ label: l.title, meta: t('minutes', { count: l.minutes }) })),
    { label: isFinal ? t('finalHeading') : t('quizHeading'), meta: t('questions', { count: quiz.length }) },
  ];

  return (
    <div className="min-h-screen bg-brand-near-black">
      {header}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Step navigation */}
        <nav className="lg:sticky lg:top-24 self-start bg-brand-dark1 border border-brand-dark2 divide-y divide-brand-dark2">
          {steps.map((s, i) => {
            const active = i === step;
            const Icon = i === quizStep ? ClipboardList : Circle;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors ${
                  active ? 'bg-brand-dark2' : 'hover:bg-brand-dark2/50'
                }`}
              >
                <Icon size={15} className={`mt-0.5 flex-shrink-0 ${active ? 'text-brand-white' : 'text-brand-mid'}`} />
                <span className="min-w-0">
                  <span className={`block text-sm ${active ? 'text-brand-white' : 'text-brand-light1'}`}>{s.label}</span>
                  <span className="block text-xs text-brand-mid mt-0.5">{s.meta}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <main className="min-w-0">
          {step < quizStep ? (
            <article className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-10">
              <span className="text-xs uppercase tracking-widest text-brand-mid">
                {t('lessonLabel', { current: step + 1, total: lessons.length })}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight mt-2 mb-6">
                {lessons[step].title}
              </h2>
              {step === 0 && video && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-brand-mid mb-3">{t('videoHeading')}</p>
                  <VideoEmbed link={video} title={`${title} — ${t('videoHeading')}`} />
                </div>
              )}
              <LessonBody body={lessons[step].body} locale={locale} />

              <aside className="mt-8 border border-brand-light2/40 bg-brand-dark2/60 p-5 sm:p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-light2 mb-3">
                  <Timer size={14} /> {t('tryIt')}
                </p>
                <LessonBody body={lessons[step].tryIt} locale={locale} />
              </aside>

              <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-brand-dark2">
                <button
                  onClick={() => goTo(step - 1)}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light1 disabled:opacity-0 transition-colors"
                >
                  <ArrowLeft size={13} /> {t('previous')}
                </button>
                <button
                  onClick={() => goTo(step + 1)}
                  className="inline-flex items-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors"
                >
                  {step + 1 === quizStep ? (isFinal ? t('toFinal') : t('toQuiz')) : t('nextLesson')}
                  <ArrowRight size={13} />
                </button>
              </div>
            </article>
          ) : (
            <div className="space-y-8">
              {/* Exercise */}
              <section className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-10">
                <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-5">
                  {courseModule.exercise.title}
                </h2>
                <LessonBody body={courseModule.exercise.body} locale={locale} />
              </section>

              {/* Do it on your own business */}
              <section className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight">
                    {t('checklistHeading')}
                  </h2>
                  <span className="text-xs uppercase tracking-widest text-brand-mid">
                    {t('checklistProgress', { done: ticked.length, total: courseModule.checklist.length })}
                  </span>
                </div>
                <p className="text-brand-mid text-sm mb-6">{t('checklistIntro')}</p>
                <ul className="space-y-2">
                  {courseModule.checklist.map((item, i) => {
                    const done = ticked.includes(i);
                    return (
                      <li key={i}>
                        <label
                          className={`flex items-start gap-3 px-4 py-3 border text-sm cursor-pointer transition-colors ${
                            done ? 'border-brand-dark2 text-brand-mid' : 'border-brand-dark2 text-brand-light1 hover:border-brand-mid'
                          }`}
                        >
                          <input type="checkbox" checked={done} onChange={() => toggleTick(i)} className="mt-0.5 accent-white" />
                          <span className={done ? 'line-through' : ''}>{item}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href={`/${locale}/academy/toolkit`}
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-light2 hover:text-brand-white transition-colors"
                >
                  <Wrench size={13} /> {t('toolkitLink')} <ArrowRight size={13} />
                </Link>
              </section>

              {/* Do it with us */}
              {upsell && (
                <section className="bg-brand-dark1 border border-brand-light2/40 p-6 sm:p-10">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-light2 mb-3">
                    <Handshake size={14} /> {t('upsell.eyebrow')}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-3">
                    {t(`upsell.${courseModule.number}.heading`)}
                  </h2>
                  <p className="text-brand-light1 text-sm leading-relaxed max-w-2xl">
                    {t(`upsell.${courseModule.number}.desc`, { price: COACHING_PRICES[upsell.primary] })}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a
                      href={coachingHref(upsell.primary, locale)}
                      className="inline-flex items-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors"
                    >
                      {t(`upsell.${courseModule.number}.cta`)} <ArrowRight size={13} />
                    </a>
                    <a
                      href={coachingHref(upsell.secondary, locale)}
                      className="text-xs uppercase tracking-widest text-brand-light2 hover:text-brand-white transition-colors"
                    >
                      {t(`upsell.${courseModule.number}.secondary`)}
                    </a>
                  </div>
                </section>
              )}

              {/* Quiz */}
              <section className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-10">
                <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-2">
                  {isFinal ? t('finalHeading') : t('quizHeading')}
                </h2>
                <p className="text-brand-mid text-sm mb-8">
                  {t('quizIntro', { total: quiz.length, pass: PASS_PERCENT })}
                </p>

                <ol className="space-y-8">
                  {quiz.map((q, qi) => {
                    const graded = result?.results?.[qi];
                    return (
                      <li key={qi}>
                        <p className="text-brand-offwhite mb-3 flex items-start gap-2">
                          <span className="text-brand-mid">{qi + 1}.</span>
                          <span className="flex-1">{q.question}</span>
                          {result?.results && (graded
                            ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                            : <XCircle size={18} className="text-red-400 flex-shrink-0" />)}
                        </p>
                        <div className="space-y-2 sm:pl-5">
                          {q.options.map((option, oi) => {
                            const selected = answers[qi] === oi;
                            return (
                              <label
                                key={oi}
                                className={`flex items-start gap-3 px-4 py-3 border text-sm cursor-pointer transition-colors ${
                                  selected
                                    ? 'border-brand-light1 bg-brand-dark2 text-brand-white'
                                    : 'border-brand-dark2 text-brand-light1 hover:border-brand-mid'
                                } ${result ? 'pointer-events-none' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${qi}`}
                                  checked={selected}
                                  onChange={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                                  className="mt-0.5 accent-white"
                                />
                                <span>{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {error && (
                  <div className="mt-8 bg-red-950/40 border border-red-800/40 px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {result ? (
                  <div className={`mt-8 border px-6 py-5 ${result.passed ? 'border-emerald-700/50 bg-emerald-950/30' : 'border-red-800/40 bg-red-950/30'}`}>
                    <p className={`font-display text-lg uppercase tracking-tight ${result.passed ? 'text-emerald-300' : 'text-red-300'}`}>
                      {result.passed
                        ? t('resultPassed', { score: result.score, total: result.total })
                        : t('resultFailed', { score: result.score, total: result.total, pass: PASS_PERCENT })}
                    </p>
                    <p className="text-brand-light1 text-sm mt-1">
                      {result.passed
                        ? awaitingCapstone
                          ? `${t('finalPassed')} ${t('capstoneNext')}`
                          : isFinal
                          ? `${t('courseComplete')} ${t('certUnlocked')}`
                          : isLast
                          ? starter ? t('starterTrackComplete') : t('trackComplete')
                          : starter ? t('starterNext') : t('nextUnlocked')
                        : t('reviewHint')}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {result.passed ? (
                        <Link
                          href={isFinal || isLast ? `/${locale}/academy/dashboard` : `/${locale}/academy/module/${nextNumber}`}
                          className="inline-flex items-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors"
                        >
                          {awaitingCapstone
                            ? t('toCapstone')
                            : isFinal || isLast
                            ? t('backToDashboard')
                            : t('goToModule', { number: nextNumber })}
                          <ArrowRight size={13} />
                        </Link>
                      ) : (
                        <button
                          onClick={retry}
                          disabled={Boolean(retryAt)}
                          className="bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                        >
                          {t('retry')}
                        </button>
                      )}
                    </div>
                    {!result.passed && retryAt && (
                      <p className="text-brand-mid text-sm mt-4">{t('cooldown', { time: retryTime })}</p>
                    )}
                  </div>
                ) : retryAt ? (
                  <p className="mt-8 border border-brand-dark2 px-6 py-5 text-brand-light1 text-sm">
                    {t('cooldown', { time: retryTime })}
                  </p>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={submitting}
                    className="mt-8 w-full sm:w-auto bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                  >
                    {submitting ? t('submitting') : t('submit')}
                  </button>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
