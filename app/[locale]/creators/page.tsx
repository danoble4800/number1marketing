import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check, X, Clapperboard, Plus, Users } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import CreatorApplyForm from '@/components/creators/CreatorApplyForm';
import StepFlow from '@/components/illustrations/StepFlow';
import { BRAND_PRICES, brandPlanHref, type BrandPlan } from '@/content/creators/plans';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'creators.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}/creators`,
      languages: {
        en: `${siteUrl}/en/creators`,
        es: `${siteUrl}/es/creators`,
        pt: `${siteUrl}/pt/creators`,
        'x-default': `${siteUrl}/en/creators`,
      },
    },
  };
}

type Way = { tag: string; title: string; desc: string; points: string[]; best: string };
type Step = { title: string; desc: string };
type Plan = { name: string; desc: string; features: string[]; cta: string };
type Item = { title: string; desc: string };
type Faq = { q: string; a: string };

const PLAN_ORDER: BrandPlan[] = ['starter', 'growth', 'pro'];
const FEATURED: BrandPlan = 'growth';

export default async function CreatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'creators' });
  const facts = t.raw('hero.facts') as string[];
  const briefRows = t.raw('brief.rows') as { label: string; value: string }[];
  const ways = t.raw('ways.items') as Way[];
  const creatorSteps = t.raw('how.creators.steps') as Step[];
  const brandSteps = t.raw('how.brands.steps') as Step[];
  const requirements = t.raw('requirements.items') as string[];
  const plans = t.raw('brands.plans') as Record<BrandPlan, Plan>;
  const managedFeatures = t.raw('brands.managed.features') as string[];
  const more = t.raw('brands.more.items') as Item[];
  const faqs = t.raw('faq.items') as Faq[];

  return (
    <>
      {/* Hero */}
      <Section className="bg-brand-near-black pt-32 relative overflow-hidden">
        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-brand-dark2 bg-brand-dark1">
                <Clapperboard size={14} className="text-brand-light2" />
                <span className="text-xs uppercase tracking-widest text-brand-light2">{t('hero.eyebrow')}</span>
              </div>
              <Heading as="h1" size="xl" animate={false}>{t('hero.headline')}</Heading>
              <p className="mt-6 max-w-2xl text-brand-light1 text-lg sm:text-xl leading-relaxed">{t('hero.subheadline')}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button href="#apply" variant="primary">{t('hero.creatorCta')}</Button>
                <Button href="#brands" variant="outline">{t('hero.brandCta')}</Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2 text-sm text-brand-light1">
                    <Check size={15} className="text-brand-light2 flex-shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            {/* What a campaign looks like */}
            <aside className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-7 flex flex-col gap-4" aria-label={t('brief.label')}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-widest text-brand-mid">{t('brief.label')}</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-brand-white text-brand-black">
                  {t('brief.type')}
                </span>
              </div>
              <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">{t('brief.title')}</h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
                {briefRows.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-brand-mid">{row.label}</dt>
                    <dd className="text-brand-offwhite font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-l-2 border-brand-light2 pl-3 text-sm text-brand-light1">
                <span className="font-semibold text-brand-white">{t('brief.hookLabel')}</span> “{t('brief.hook')}”
              </p>
              <p className="text-xs text-brand-mid">{t('brief.note')}</p>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Three ways to work with brands */}
      <Section id="ways" className="bg-brand-black">
        <Container>
          <div className="max-w-3xl mb-14">
            <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{t('ways.eyebrow')}</p>
            <Heading as="h2" size="lg">{t('ways.heading')}</Heading>
            <p className="mt-4 text-brand-light1 text-lg">{t('ways.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-brand-dark2 bg-brand-dark1">
            {ways.map((way, i) => (
              <article
                key={way.tag}
                className="p-6 sm:p-8 flex flex-col gap-4 border-brand-dark2 border-b md:border-b-0 md:border-r last:border-0"
              >
                <span className="font-display text-5xl leading-none text-brand-dark2">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-light2">{way.tag}</p>
                <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">{way.title}</h3>
                <p className="text-sm text-brand-light1 leading-relaxed">{way.desc}</p>
                <ul className="flex flex-col gap-2 flex-1">
                  {way.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-brand-light1">
                      <Check size={15} className="text-brand-light2 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="pt-4 border-t border-brand-dark2 text-xs text-brand-mid">{way.best}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section id="how" className="bg-brand-near-black">
        <Container>
          <div className="max-w-3xl mb-14">
            <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{t('how.eyebrow')}</p>
            <Heading as="h2" size="lg">{t('how.heading')}</Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <StepFlow
              title={t('how.creators.title')}
              steps={creatorSteps}
              icons={['application', 'approved', 'paid']}
              toasts={t.raw('how.creators.art')}
            />
            <StepFlow
              title={t('how.brands.title')}
              steps={brandSteps}
              icons={['plan', 'campaign', 'videos']}
              toasts={t.raw('how.brands.art')}
            />
          </div>
        </Container>
      </Section>

      {/* Who we accept */}
      <Section id="requirements" className="bg-brand-black">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{t('requirements.eyebrow')}</p>
              <Heading as="h2" size="lg">{t('requirements.heading')}</Heading>
              <p className="mt-4 text-brand-light1 text-lg max-w-xl">{t('requirements.subheading')}</p>
            </div>
            <ul className="border-t border-brand-dark2">
              {requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 py-4 border-b border-brand-dark2 text-brand-offwhite">
                  <Check size={18} className="text-brand-light2 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-3 py-4 border-b border-brand-dark2 text-brand-light1">
                <X size={18} className="text-brand-mid mt-0.5 flex-shrink-0" />
                {t('requirements.no')}
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* Brand plans */}
      <Section id="brands" className="bg-brand-near-black border-t border-brand-dark2">
        <Container>
          <div className="max-w-3xl mb-10">
            <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{t('brands.eyebrow')}</p>
            <Heading as="h2" size="lg">{t('brands.heading')}</Heading>
            <p className="mt-4 text-brand-light1 text-lg">{t('brands.subheading')}</p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 border border-amber-500/40 bg-amber-50 [[data-site-theme=dark]_&]:bg-amber-950/30 px-5 py-4">
            <span className="flex-shrink-0 self-start text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-amber-600 text-white">
              {t('brands.earlyAccess')}
            </span>
            <p className="text-sm text-amber-900 [[data-site-theme=dark]_&]:text-amber-100">{t('brands.earlyAccessNote')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLAN_ORDER.map((id) => {
              const plan = plans[id];
              const featured = id === FEATURED;
              const href = brandPlanHref(id, locale);
              return (
                <div
                  key={id}
                  className={`relative bg-brand-dark1 border p-6 sm:p-8 flex flex-col ${featured ? 'border-brand-light1' : 'border-brand-dark2'}`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-6 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-brand-white text-brand-black">
                      {t('brands.popular')}
                    </span>
                  )}
                  <h3 className="font-display text-lg text-brand-white uppercase tracking-tight">{plan.name}</h3>
                  <p className="mt-2 text-sm text-brand-light1">{plan.desc}</p>
                  <p className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-5xl text-brand-white">${BRAND_PRICES[id]}</span>
                    <span className="text-sm text-brand-mid">{t('brands.perMonth')}</span>
                  </p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-brand-light1">
                        <Check size={15} className="text-brand-light2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button href={href} external={href.startsWith('http')} variant={featured ? 'primary' : 'outline'} className="w-full justify-center">
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Managed campaigns + existing clients */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            <div className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-start">
              <div className="flex-1">
                <h3 className="font-display text-lg text-brand-white uppercase tracking-tight">{t('brands.managed.title')}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-offwhite">{t('brands.managed.price', { price: BRAND_PRICES.managed })}</p>
                <p className="mt-3 text-sm text-brand-light1">{t('brands.managed.desc')}</p>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {managedFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-brand-light1">
                      <Check size={15} className="text-brand-light2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button href={brandPlanHref('managed', locale)} variant="outline" className="flex-shrink-0">
                {t('brands.managed.cta')}
              </Button>
            </div>
            <div className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8 flex gap-4">
              <Users size={26} className="text-brand-light2 flex-shrink-0" />
              <div>
                <h3 className="font-display text-lg text-brand-white uppercase tracking-tight">{t('brands.clients.title')}</h3>
                <p className="mt-2 text-sm text-brand-light1">{t('brands.clients.desc')}</p>
              </div>
            </div>
          </div>

          {/* Upsell into the main services */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <h3 className="font-display text-2xl text-brand-white uppercase tracking-tight">{t('brands.more.heading')}</h3>
              <Button href={`/${locale}/services`} variant="outline">{t('brands.more.cta')}</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-brand-dark2">
              {more.map((item) => (
                <div key={item.title} className="pt-5 pr-6 pb-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-white">{item.title}</p>
                  <p className="mt-1 text-sm text-brand-light1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 text-xs text-brand-mid max-w-3xl">{t('brands.note')}</p>
        </Container>
      </Section>

      {/* Creator application */}
      <Section id="apply" className="bg-brand-black scroll-mt-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{t('apply.eyebrow')}</p>
              <Heading as="h2" size="lg">{t('apply.heading')}</Heading>
              <p className="mt-4 text-brand-light1 text-lg">{t('apply.subheading')}</p>
            </div>
            <CreatorApplyForm locale={locale} />
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-brand-near-black">
        <Container className="max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{t('faq.eyebrow')}</p>
          <Heading as="h2" size="lg" className="mb-10">{t('faq.heading')}</Heading>
          <div className="border-t border-brand-dark2">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-brand-dark2 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-brand-white [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Plus size={20} className="flex-shrink-0 text-brand-mid group-open:rotate-45 transition-transform" />
                </summary>
                <p className="mt-3 max-w-3xl text-brand-light1 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Closing */}
      <Section className="bg-brand-dark1 border-t border-brand-dark2">
        <Container className="text-center">
          <Heading as="h2" size="lg">{t('closing.heading')}</Heading>
          <p className="mt-6 text-brand-light1 text-lg max-w-2xl mx-auto">{t('closing.subheading')}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="#apply" variant="primary">{t('closing.creatorCta')}</Button>
            <Button href="#brands" variant="outline">{t('closing.brandCta')}</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
