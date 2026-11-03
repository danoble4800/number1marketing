import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  ClipboardList,
  Globe,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Mic,
  ShieldCheck,
  Sun,
  Wrench,
} from 'lucide-react';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import PhoneChat, { type PhoneChatCopy } from '@/components/mac-assistant/PhoneChat';
import BuyForm from '@/components/mac-assistant/BuyForm';
import DashboardDemo, { type DashboardDemoCopy } from '@/components/mac-assistant/DashboardDemo';
import { ASSISTANT_PLANS } from '@/lib/macAssistant';

// Landing page for the N°1 Mac Assistant (the MacAssistant-Template + setup guide).
// No nav or footer (see SiteChrome) so reps can send it on its own: their referral link
// (/mac-assistant?ref=<rep>) credits them with the sale. Copy: messages/*.json macAssistant.

const USE_ICONS = [ClipboardList, Bell, Sun, Camera, Wrench, Globe];
const DASH_ICONS = [ClipboardList, Bell, Sun, Mic];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'macAssistant' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteUrl}/${locale}/mac-assistant`,
      languages: {
        en: `${siteUrl}/en/mac-assistant`,
        es: `${siteUrl}/es/mac-assistant`,
        pt: `${siteUrl}/pt/mac-assistant`,
        'x-default': `${siteUrl}/en/mac-assistant`,
      },
    },
  };
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-mid">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl uppercase leading-tight tracking-tight text-brand-white sm:text-4xl">{title}</h2>
    </div>
  );
}

export default async function MacAssistantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'macAssistant' });
  const chips = t.raw('chips') as string[];
  const uses = t.raw('uses.items') as { title: string; text: string }[];
  const dash = t.raw('dashboard.items') as string[];
  const steps = t.raw('how.steps') as { title: string; text: string }[];
  const needs = t.raw('needs.items') as { title: string; text: string }[];
  const safety = t.raw('safety.items') as string[];
  const faq = t.raw('faq.items') as { q: string; a: string }[];
  const from = `$${ASSISTANT_PLANS.diy.price / 100}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-near-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--brand-dark2)) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(to bottom, black, transparent 50%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 50%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 flex justify-center">
          <LocaleSwitcher locale={locale} variant="tabs" />
        </div>

        {/* Hero */}
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
          <div className="text-center lg:text-left">
            <Link
              href={`/${locale}`}
              aria-label="Number 1 Digital Marketing"
              className="inline-flex h-14 w-14 items-center justify-center bg-black font-display text-[1.75rem] leading-none tracking-tight text-white shadow-lg"
            >
              N°<span className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">1</span>
            </Link>
            <p className="mt-6">
              <span className="inline-block rounded-full border border-brand-dark2 bg-brand-dark1 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-light1">
                {t('eyebrow')}
              </span>
            </p>
            <h1 className="mt-5 font-display text-[2.8rem] uppercase leading-[0.95] tracking-tight text-brand-white sm:text-6xl">
              {t('headline')}
              <span className="mt-1 block text-brand-mid">{t('headlineAccent')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-light1 sm:text-lg lg:mx-0">{t('subline')}</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-start">
              {chips.map((chip) => (
                <li key={chip} className="flex items-center gap-1.5 text-sm font-medium text-brand-light2">
                  <Check size={15} className="text-emerald-500" strokeWidth={3} />
                  {chip}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#pricing"
                className="inline-flex w-full items-center justify-center gap-2 bg-brand-white px-7 py-4 text-sm font-semibold uppercase tracking-widest text-brand-black transition-opacity hover:opacity-90 sm:w-auto"
              >
                {t('cta', { price: from })}
              </a>
              <a href="#how" className="text-sm font-semibold text-brand-light1 underline-offset-4 hover:text-brand-white hover:underline">
                {t('ctaSecondary')}
              </a>
            </div>
          </div>
          <PhoneChat copy={t.raw('chat') as PhoneChatCopy} />
        </section>

        {/* Watch it work: the phone and the Mac's dashboard side by side */}
        <section className="mt-24">
          <SectionTitle kicker={t('watch.kicker')} title={t('watch.title')} />
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-brand-light1 sm:text-base">{t('watch.sub')}</p>
          <div className="mx-auto mt-10 max-w-4xl">
            <DashboardDemo copy={t.raw('demo') as DashboardDemoCopy} />
          </div>
        </section>

        {/* What you can text it */}
        <section className="mt-24">
          <SectionTitle kicker={t('uses.kicker')} title={t('uses.title')} />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {uses.map((u, i) => {
              const Icon = USE_ICONS[i] ?? MessageCircle;
              return (
                <div key={u.title} className="border border-brand-dark2 bg-brand-dark1 p-5">
                  <Icon size={20} className="text-[#0a84ff]" />
                  <p className="mt-3 font-semibold text-brand-white">{u.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-light1">{u.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dashboard */}
        <section className="mt-20 grid items-center gap-8 border border-brand-dark2 bg-brand-dark1 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <LayoutDashboard size={22} className="text-[#0a84ff]" />
            <h2 className="mt-3 font-display text-3xl uppercase leading-tight text-brand-white">{t('dashboard.title')}</h2>
            <p className="mt-3 leading-relaxed text-brand-light1">{t('dashboard.text')}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {dash.map((d, i) => {
              const Icon = DASH_ICONS[i] ?? Check;
              return (
                <li key={d} className="flex flex-col gap-2 border border-brand-dark2 bg-brand-near-black p-4 text-sm font-medium text-brand-light2">
                  <Icon size={18} className="text-brand-mid" />
                  {d}
                </li>
              );
            })}
          </ul>
        </section>

        {/* How it works */}
        <section id="how" className="mt-24 scroll-mt-6">
          <SectionTitle kicker={t('how.kicker')} title={t('how.title')} />
          <ol className="mt-10 grid gap-3 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="border border-brand-dark2 bg-brand-dark1 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-white font-display text-lg text-brand-black">
                  {i + 1}
                </span>
                <p className="mt-4 font-semibold text-brand-white">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-light1">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* What you need + safety */}
        <section className="mt-20 grid gap-4 lg:grid-cols-2">
          <div className="border border-brand-dark2 bg-brand-dark1 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-mid">{t('needs.kicker')}</p>
            <ul className="mt-4 flex flex-col gap-4">
              {needs.map((n) => (
                <li key={n.title}>
                  <p className="font-semibold text-brand-white">{n.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-brand-light1">{n.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-brand-dark2 bg-brand-dark1 p-6 sm:p-8">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-mid">
              <ShieldCheck size={14} /> {t('safety.kicker')}
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {safety.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-light2">
                  <Lock size={14} className="mt-1 shrink-0 text-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto mt-24 max-w-3xl scroll-mt-6">
          <SectionTitle kicker={t('pricing.kicker')} title={t('pricing.title')} />
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-brand-light1">{t('pricing.note')}</p>
          <div className="mt-10">
            <BuyForm />
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-24 max-w-3xl">
          <SectionTitle kicker={t('faq.kicker')} title={t('faq.title')} />
          <div className="mt-8 flex flex-col gap-2">
            {faq.map((f) => (
              <details key={f.q} className="group border border-brand-dark2 bg-brand-dark1 px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-white">
                  {f.q}
                  <span className="text-brand-mid transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-light1">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-20 flex flex-col items-center gap-5 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 border border-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-white transition-colors hover:bg-brand-white hover:text-brand-black"
          >
            {t('footerLink')} <ArrowUpRight size={16} />
          </Link>
          <p className="text-xs text-brand-mid">{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
}
