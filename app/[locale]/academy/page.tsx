import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Lock, Award, Clock } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';

  return {
    title: `Get AI Certified | Number 1 Digital Marketing`,
    description:
      'Master AI marketing and automation. Earn your AI Marketing Certificate with Number 1 Digital Marketing Academy.',
    alternates: {
      canonical: `${siteUrl}/${locale}/academy`,
      languages: {
        en: `${siteUrl}/en/academy`,
        es: `${siteUrl}/es/academy`,
        pt: `${siteUrl}/pt/academy`,
        'x-default': `${siteUrl}/en/academy`,
      },
    },
  };
}

type ModuleItem = { number: string; title: string; time: string };
type OverviewItem = { title: string; desc: string };

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'academy' });
  const modules = t.raw('modules.items') as ModuleItem[];
  const overviewItems = t.raw('overview.items') as OverviewItem[];

  return (
    <>
      {/* Hero */}
      <Section className="bg-brand-near-black pt-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
          }}
        />
        <Container className="relative text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-brand-dark2 bg-brand-dark1">
            <Award size={14} className="text-brand-light2" />
            <span className="text-xs uppercase tracking-widest text-brand-light2">Number 1 Digital Marketing Academy</span>
          </div>
          <Heading as="h1" size="xl" className="mb-6">
            {t('hero.headline')}
          </Heading>
          <p className="mt-4 max-w-2xl mx-auto text-brand-light1 text-xl leading-relaxed">
            {t('hero.subheadline')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={`/${locale}/academy/login?role=student`} variant="primary">
              {t('hero.enrollCta')}
            </Button>
            <Button href={`/${locale}/academy/login?role=admin`} variant="outline">
              {t('hero.adminCta')}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Program Overview */}
      <Section className="bg-brand-black">
        <Container>
          <div className="text-center mb-16">
            <Heading as="h2" size="lg">{t('overview.heading')}</Heading>
            <p className="mt-4 text-brand-light1 max-w-2xl mx-auto">
              {t('overview.subheading')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {overviewItems.map((item, i) => (
              <div key={i} className="bg-brand-dark1 border border-brand-dark2 p-6">
                <div className="font-display text-4xl text-brand-dark2 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-lg text-brand-white uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-brand-light1 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Course Modules */}
      <Section className="bg-brand-near-black">
        <Container>
          <div className="text-center mb-16">
            <Heading as="h2" size="lg">{t('modules.heading')}</Heading>
            <p className="mt-4 text-brand-light1">{t('modules.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <div
                key={i}
                className="relative bg-brand-dark1 border border-brand-dark2 p-6 group"
              >
                {/* Lock overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-widest text-brand-mid border border-brand-dark2 px-2 py-0.5">
                    {t('modules.comingSoon')}
                  </span>
                </div>

                {/* Module number */}
                <div className="font-display text-5xl text-brand-dark2 mb-4 leading-none">
                  {mod.number}
                </div>

                {/* Lock icon */}
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-brand-mid flex-shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-brand-mid">
                    {t('modules.locked')}
                  </span>
                </div>

                <h3 className="font-display text-lg text-brand-light1 uppercase tracking-tight mb-4">
                  {mod.title}
                </h3>

                <div className="flex items-center gap-1.5 text-brand-mid">
                  <Clock size={12} />
                  <span className="text-xs">{t('modules.estTime')}: {mod.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Certificate CTA */}
      <Section className="bg-brand-dark1 border-t border-brand-dark2">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 mx-auto w-24 h-24 border-2 border-brand-dark2 flex items-center justify-center">
              <Award size={40} className="text-brand-light2" />
            </div>
            <Heading as="h2" size="lg">{t('overview.certificate.heading')}</Heading>
            <p className="mt-6 text-brand-light1 text-lg leading-relaxed max-w-xl mx-auto">
              {t('overview.certificate.description')}
            </p>
            <div className="mt-10">
              <Button href={`/${locale}/academy/login?role=student`} variant="primary">
                {t('hero.enrollCta')}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
