import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import StepFlow from '@/components/illustrations/StepFlow';
import ShopClient from '@/components/shop/ShopClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'shop' });

  return {
    title: t('metaTitle'),
    description: t('subheading'),
    alternates: {
      canonical: `${siteUrl}/${locale}/shop`,
      languages: {
        en: `${siteUrl}/en/shop`,
        es: `${siteUrl}/es/shop`,
        pt: `${siteUrl}/pt/shop`,
        'x-default': `${siteUrl}/en/shop`,
      },
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'shop' });
  const chips = t.raw('chips') as string[];
  const steps = t.raw('steps') as { title: string; desc: string }[];
  const faq = t.raw('faq') as { q: string; a: string }[];

  return (
    <>
      <Section className="bg-brand-near-black pt-28 lg:pt-36 pb-12 lg:pb-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-brand-light1 font-semibold mb-4">{t('eyebrow')}</p>
            <Heading as="h1" size="lg" animate={false}>
              {t('headline')} <span className="text-brand-light2">{t('headlineAccent')}</span>
            </Heading>
            <p className="mt-6 text-brand-light1 text-lg leading-relaxed max-w-2xl">{t('subheading')}</p>
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
        </Container>
      </Section>

      <Section className="bg-brand-near-black pt-0 lg:pt-0">
        <Container>
          <ShopClient locale={locale} />
        </Container>
      </Section>

      {/* How it works */}
      <Section className="bg-brand-black">
        <Container>
          <p className="text-xs uppercase tracking-widest text-brand-mid font-semibold mb-4">{t('stepsEyebrow')}</p>
          <Heading as="h2" size="md">
            {t('stepsHeading')}
          </Heading>
          <div className="mt-10">
            <StepFlow steps={steps} icons={['order', 'test', 'review']} toasts={t.raw('stepsArt')} layout="cards" />
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-brand-near-black">
        <Container>
          <div className="max-w-3xl">
            <Heading as="h2" size="md">
              {t('faqHeading')}
            </Heading>
            <div className="mt-8 divide-y divide-brand-dark2 border-y border-brand-dark2">
              {faq.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-brand-offwhite font-semibold">
                    {item.q}
                    <span className="text-brand-mid transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-brand-light1 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Cross-sell: the audit */}
      <Section className="bg-brand-black">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heading as="h2" size="md">
              {t('auditHeading')}
            </Heading>
            <p className="mt-6 text-brand-light2 text-lg leading-relaxed">{t('auditText')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={`/${locale}/audit`} variant="primary">
                {t('auditCta')}
              </Button>
              <Button href="#order" variant="outline">
                {t('orderCta')}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
