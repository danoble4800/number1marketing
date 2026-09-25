import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'audit' });

  return {
    title: t('metaTitle'),
    description: t('subheading'),
    alternates: {
      canonical: `${siteUrl}/${locale}/audit`,
      languages: {
        en: `${siteUrl}/en/audit`,
        es: `${siteUrl}/es/audit`,
        pt: `${siteUrl}/pt/audit`,
        'x-default': `${siteUrl}/en/audit`,
      },
    },
  };
}

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'audit' });
  const tHome = await getTranslations({ locale, namespace: 'home' });
  const chips = t.raw('chips') as string[];
  const benefits = t.raw('get') as { title: string; desc: string }[];

  return (
    <>
      {/* Intro + form. DOM order puts the form right after the intro on mobile;
          on desktop the form moves to the right column beside intro + benefits. */}
      <Section className="bg-brand-near-black pt-28 lg:pt-36">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-x-20 lg:gap-y-12">
            {/* Intro */}
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="text-xs uppercase tracking-widest text-brand-light1 font-semibold mb-4">
                {t('eyebrow')}
              </p>
              <Heading as="h1" size="lg" animate={false}>
                {t('headline')} <span className="text-brand-light2">{t('headlineAccent')}</span>
              </Heading>
              <p className="mt-6 text-brand-light1 text-lg leading-relaxed max-w-xl">
                {t('subheading')}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li
                    key={chip}
                    className="border border-brand-dark2 px-3 py-1.5 text-xs uppercase tracking-widest text-brand-light2"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div
              id="book"
              className="lg:col-start-2 lg:row-start-1 lg:row-span-2 scroll-mt-24 bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8"
            >
              <Heading as="h2" size="sm" animate={false}>
                {t('formHeading')}
              </Heading>
              <p className="mt-3 mb-6 text-brand-light1 text-sm">{t('formSubheading')}</p>
              <ContactForm showHeading={false} />
            </div>

            {/* Benefits */}
            <div className="lg:col-start-1 lg:row-start-2">
              <p className="text-xs uppercase tracking-widest text-brand-mid font-semibold mb-6">
                {t('getHeading')}
              </p>
              <ul className="space-y-6">
                {benefits.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-brand-light2" />
                    <div>
                      <p className="text-brand-offwhite font-semibold">{item.title}</p>
                      <p className="mt-1 text-brand-light1 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Proof */}
      <Section className="bg-brand-black">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="font-display text-7xl lg:text-8xl text-brand-white tracking-tighter">
              {tHome('caseStudy.stat')}
            </div>
            <div className="text-brand-light1 text-sm uppercase tracking-widest mt-2 mb-6">
              {t('proofLabel')}
            </div>
            <p className="text-brand-light2 text-lg leading-relaxed">{t('proofText')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="#book" variant="primary">
                {t('formHeading')}
              </Button>
              <Button href={`/${locale}/case-studies/lead-qualifier`} variant="outline">
                {t('proofCta')}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
