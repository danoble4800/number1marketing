import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import HeroSection from '@/components/HeroSection';
import ProcessSteps from '@/components/ProcessSteps';
import PortfolioSection from '@/components/PortfolioSection';
import TrustedMarquee from '@/components/TrustedMarquee';
import AuditPopup from '@/components/AuditPopup';
import LiveResults from '@/components/LiveResults';
import ShiftShowcase from '@/components/ShiftShowcase';
import CountUp from '@/components/CountUp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: 'Number 1 Digital Marketing | More Calls. More Customers.',
    description: t('subline'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        pt: `${siteUrl}/pt`,
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
      {/* Homepage only — promotes the free audit; never rendered on /audit or other pages */}
      <AuditPopup locale={locale} />

      {/* HERO — client component handles all Framer Motion */}
      <HeroSection
        headline={t('hero.headline')}
        headlineAccent={t('hero.headlineAccent')}
        subline={t('hero.subline')}
        ctaPrimary={t('hero.ctaPrimary')}
        ctaSecondary={t('hero.ctaSecondary')}
        cards={t.raw('hero.cards')}
        locale={locale}
      />

      {/* LIVE RESULTS */}
      <LiveResults label={t('results.label')} labels={t.raw('results.items')} locale={locale} />

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
      <ShiftShowcase
        copy={{
          heading: t('shift.heading'),
          subheading: t('shift.subheading'),
          beforeLabel: t('shift.beforeLabel'),
          afterLabel: t('shift.afterLabel'),
          pairs: shiftPairs,
          scenes: t.raw('shift.scenes'),
        }}
      />

      {/* CASE STUDY TEASER */}
      <Section className="bg-brand-black">
        <Container>
          <Heading as="h2" size="md" className="text-center mb-12">
            {t('caseStudy.heading')}
          </Heading>
          <div className="max-w-4xl mx-auto bg-brand-dark1 border border-brand-dark2 p-8 lg:p-12">
            <div className="font-display text-7xl lg:text-9xl text-brand-white tracking-tighter">
              <CountUp value={t('caseStudy.stat')} />
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
            <Button href={`/${locale}/audit`} variant="primary" className="text-sm px-10 py-4">
              {t('cta.label')}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
