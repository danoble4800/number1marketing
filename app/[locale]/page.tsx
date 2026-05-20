import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle, X } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import HeroSection from '@/components/HeroSection';
import ProcessSteps from '@/components/ProcessSteps';
import PortfolioSection from '@/components/PortfolioSection';
import TrustedMarquee from '@/components/TrustedMarquee';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: 'Number 1 Digital Marketing | The #1 Growth & AI Marketing Partner',
    description: t('subline'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        fr: `${siteUrl}/fr`,
        'x-default': `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: 'Number 1 Digital Marketing',
      description: t('subline'),
      url: `${siteUrl}/${locale}`,
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
    },
  };
}


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home' });
  const tServices = await getTranslations({ locale, namespace: 'services' });

  const shiftPairs = t.raw('shift.pairs') as Array<{ before: string; after: string }>;
  const processSteps = t.raw('process.steps') as Array<{
    number: string; title: string; description: string;
  }>;
  const servicesList = tServices.raw('items') as Array<{
    slug: string; name: string; icon: string; tagline: string;
  }>;

  return (
    <>
      {/* HERO — client component handles all Framer Motion */}
      <HeroSection
        headline={t('hero.headline')}
        headlineAccent={t('hero.headlineAccent')}
        subline={t('hero.subline')}
        ctaPrimary={t('hero.ctaPrimary')}
        ctaSecondary={t('hero.ctaSecondary')}
        locale={locale}
      />

      {/* TRUSTED BY */}
      <div className="bg-brand-dark1 border-y border-brand-dark2 py-8">
        <p className="text-center text-xs uppercase tracking-widest text-brand-mid mb-6">
          {t('trusted.label')}
        </p>
        <TrustedMarquee />
      </div>

      {/* SERVICES */}
      <Section className="bg-brand-near-black">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="lg">{t('services.heading')}</Heading>
            <p className="mt-4 text-brand-light1 text-lg">{t('services.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesList.map((service, i) => (
              <ServiceCard
                key={service.slug}
                icon={service.icon}
                name={service.name}
                tagline={service.tagline}
                href={`/${locale}/services#${service.slug}`}
                ctaLabel="Learn more"
                index={i}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button href={`/${locale}/services`} variant="outline">
              {t('services.cta')}
            </Button>
          </div>
        </Container>
      </Section>

      {/* THE SHIFT */}
      <div className="lg:grid lg:grid-cols-2">
        {/* Before */}
        <div className="bg-brand-dark2 px-8 py-16 lg:px-16">
          <Heading as="h2" size="md" className="text-brand-white mb-4">
            {t('shift.heading')}
          </Heading>
          <p className="text-brand-light1 mb-8">{t('shift.subheading')}</p>
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-brand-mid font-semibold">
              {t('shift.beforeLabel')}
            </span>
          </div>
          <ul className="space-y-4">
            {shiftPairs.map((pair, i) => (
              <li key={i} className="flex items-start gap-3">
                <X size={16} className="mt-0.5 flex-shrink-0 text-brand-mid" />
                <span className="text-brand-light1 text-sm">{pair.before}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* After */}
        <div className="bg-brand-near-black px-8 py-16 lg:px-16">
          <Heading as="h2" size="md" className="mb-4 invisible">
            {t('shift.heading')}
          </Heading>
          <p className="text-brand-light1 mb-8 invisible">{t('shift.subheading')}</p>
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-brand-white font-semibold">
              {t('shift.afterLabel')}
            </span>
          </div>
          <ul className="space-y-4">
            {shiftPairs.map((pair, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-brand-light2" />
                <span className="text-brand-offwhite text-sm">{pair.after}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CASE STUDY TEASER */}
      <Section className="bg-brand-black">
        <Container>
          <Heading as="h2" size="md" className="text-center mb-12">
            {t('caseStudy.heading')}
          </Heading>
          <div className="max-w-4xl mx-auto bg-brand-dark1 border border-brand-dark2 p-8 lg:p-12">
            <div className="font-display text-7xl lg:text-9xl text-brand-white tracking-tighter">
              {t('caseStudy.stat')}
            </div>
            <div className="text-brand-light1 text-sm uppercase tracking-widest mt-2 mb-6">
              {t('caseStudy.statLabel')}
            </div>
            <p className="text-brand-light2 text-lg leading-relaxed max-w-2xl">
              {t('caseStudy.description')}
            </p>
            <div className="mt-8">
              <Button href={`/${locale}/case-studies/lead-qualifier`} variant="outline">
                {t('caseStudy.cta')}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* PORTFOLIO */}
      <PortfolioSection
        heading={t('portfolio.heading')}
        subheading={t('portfolio.subheading')}
        nicheLabel={t('portfolio.nicheLabel')}
        viewSite={t('portfolio.viewSite')}
      />

      {/* PROCESS */}
      <Section className="bg-brand-near-black">
        <Container>
          <div className="text-center mb-16">
            <Heading as="h2" size="lg">{t('process.heading')}</Heading>
            <p className="mt-4 text-brand-light1">{t('process.subheading')}</p>
          </div>
          <ProcessSteps steps={processSteps} />
        </Container>
      </Section>

      {/* CTA */}
      <Section id="book" className="bg-brand-dark1">
        <Container className="text-center">
          <Heading as="h2" size="lg">{t('cta.heading')}</Heading>
          <p className="mt-4 text-brand-light1 max-w-xl mx-auto">{t('cta.subheading')}</p>
          <div className="mt-10">
            <Button href={`/${locale}/contact`} variant="primary" className="text-sm px-10 py-4">
              {t('cta.label')}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
