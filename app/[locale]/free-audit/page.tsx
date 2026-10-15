import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Check } from 'lucide-react';
import ExplainerVideo, { type ExplainerCopy } from '@/components/free-audit/ExplainerVideo';
import AuditApplication from '@/components/free-audit/AuditApplication';
import LocaleSwitcher from '@/components/LocaleSwitcher';

// Landing page for Instagram traffic: no nav or footer (see SiteChrome), one job —
// watch the video, then fill in the step-by-step free audit form.
// The public /audit page stays as the version for people browsing the site.

const FORM_ID = 'get-audit';
const INSTAGRAM_URL = 'https://instagram.com/number1marketing';

// lucide-react v1 has no Instagram icon.
function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'freeAudit' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    // Ad/bio link only; /audit is the page we want in search results.
    robots: { index: false, follow: true },
  };
}

function StepLabel({ n, title, note }: { n: number; title: string; note: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-white font-display text-lg text-brand-black">
        {n}
      </span>
      <div className="leading-tight">
        <p className="font-display text-xl uppercase tracking-tight text-brand-white sm:text-2xl">{title}</p>
        <p className="text-xs uppercase tracking-widest text-brand-mid">{note}</p>
      </div>
    </div>
  );
}

export default async function FreeAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'freeAudit' });
  const chips = t.raw('chips') as string[];
  const videoUrl = process.env.NEXT_PUBLIC_FREE_AUDIT_VIDEO_URL;

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-near-black">
      {/* Faint dot grid + glow so the page doesn't feel flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--brand-dark2)) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(to bottom, black, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* Language tabs: this page has no nav, so the switcher lives here */}
        <div className="mb-6 flex justify-center">
          <LocaleSwitcher locale={locale} variant="tabs" />
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <span
            aria-label="Number 1 Digital Marketing"
            className="flex h-16 w-16 items-center justify-center bg-black font-display text-[2rem] leading-none tracking-tight text-white shadow-lg"
          >
            N°<span className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">1</span>
          </span>
        </div>

        {/* Headline */}
        <div className="mt-7 text-center">
          <span className="inline-block rounded-full border border-brand-dark2 bg-brand-dark1 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-light1">
            {t('eyebrow')}
          </span>
          <h1 className="mt-5 font-display text-[2.6rem] uppercase leading-[0.95] tracking-tight text-brand-white sm:text-6xl">
            {t('headline')}
            <span className="mt-1 block text-brand-mid">{t('headlineAccent')}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-light1 sm:text-lg">{t('subline')}</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {chips.map((chip) => (
              <li key={chip} className="flex items-center gap-1.5 text-sm font-medium text-brand-light2">
                <Check size={15} className="text-emerald-500" strokeWidth={3} />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* Step 1: video */}
        <section className="mt-10">
          <StepLabel n={1} title={t('step1')} note={t('step1Note')} />
          <div className="mt-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
                className="aspect-[4/5] w-full bg-black object-cover sm:aspect-video"
              />
            ) : (
              <ExplainerVideo copy={t.raw('video') as ExplainerCopy} formId={FORM_ID} />
            )}
          </div>
        </section>

        {/* Step 2: form */}
        <section id={FORM_ID} className="mt-12 scroll-mt-6">
          <StepLabel n={2} title={t('step2')} note={t('step2Note')} />
          <div className="mt-4 border border-brand-dark2 bg-brand-dark1 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.3)]">
            <AuditApplication />
          </div>
        </section>

        <footer className="mt-14 flex flex-col items-center gap-5 text-center">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 border border-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-white transition-colors hover:bg-brand-white hover:text-brand-black"
            >
              {t('footerLink')} <ArrowUpRight size={16} />
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-brand-dark2 bg-brand-dark1 px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-white transition-colors hover:border-brand-light1"
            >
              <InstagramIcon /> {t('instagram')}
            </a>
          </div>
          <p className="text-xs text-brand-mid">{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
}
