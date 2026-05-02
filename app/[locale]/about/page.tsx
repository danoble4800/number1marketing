import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle, X } from 'lucide-react';
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
    title: `About | Number 1 Digital Marketing`,
    description: 'We build AI systems that scale modern businesses. Real ROI, no hype.',
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        en: `${siteUrl}/en/about`,
        es: `${siteUrl}/es/about`,
        pt: `${siteUrl}/pt/about`,
        'x-default': `${siteUrl}/en/about`,
      },
    },
  };
}

type BeliefItem = { title: string; description: string };
type ColumnItem = { title: string; points: string[] };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });
  const beliefs = t.raw('beliefs.items') as BeliefItem[];
  const columns = t.raw('different.columns') as ColumnItem[];

  return (
    <>
      {/* Hero */}
      <Section className="bg-brand-near-black pt-32 grain-overlay relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
          }}
        />
        <Container className="relative">
          <Heading as="h1" size="xl">{t('hero.headline')}</Heading>
          <p className="mt-6 max-w-2xl text-brand-light1 text-xl leading-relaxed">
            {t('hero.subheading')}
          </p>
        </Container>
      </Section>

      {/* What we believe */}
      <Section className="bg-brand-black">
        <Container>
          <Heading as="h2" size="lg" className="mb-12">{t('beliefs.heading')}</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {beliefs.map((belief, i) => (
              <div key={i} className="border-l-2 border-brand-dark2 pl-6">
                <h3 className="font-display text-xl text-brand-white uppercase tracking-tight mb-3">
                  {belief.title}
                </h3>
                <p className="text-brand-light1 leading-relaxed">{belief.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How we're different */}
      <Section className="bg-brand-dark1">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="lg">{t('different.heading')}</Heading>
            <p className="mt-4 text-brand-light1">{t('different.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-brand-dark2">
            {columns.map((col, i) => (
              <div
                key={i}
                className={`p-8 ${i === 1 ? 'bg-brand-near-black' : 'bg-brand-dark1'}`}
              >
                <h3 className="font-display text-lg text-brand-white uppercase tracking-tight mb-6">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2">
                      {i === 1 ? (
                        <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-brand-light2" />
                      ) : (
                        <X size={15} className="mt-0.5 flex-shrink-0 text-brand-mid" />
                      )}
                      <span className="text-brand-light1 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Team placeholder */}
      <Section className="bg-brand-black">
        <Container>
          <Heading as="h2" size="lg" className="mb-6">{t('team.heading')}</Heading>
          <p className="text-brand-light1 text-lg max-w-2xl mb-8">{t('team.subheading')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-brand-dark1 border border-brand-dark2 p-6">
                <div className="w-16 h-16 bg-brand-dark2 mb-4 flex items-center justify-center text-brand-mid text-xs uppercase tracking-widest">
                  Photo
                </div>
                <div className="h-4 bg-brand-dark2 rounded-none mb-2 w-3/4" />
                <div className="h-3 bg-brand-dark2 rounded-none w-1/2" />
              </div>
            ))}
          </div>
          <p className="mt-8 text-brand-mid text-sm">{t('team.placeholder')}</p>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-brand-near-black">
        <Container className="text-center">
          <Heading as="h2" size="lg">{t('cta.heading')}</Heading>
          <p className="mt-4 text-brand-light1 max-w-xl mx-auto">{t('cta.subheading')}</p>
          <div className="mt-8">
            <Button href={`/${locale}/contact`} variant="primary">
              {t('cta.button')}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
