import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import CaseStudyCard from '@/components/CaseStudyCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'caseStudies' });

  return {
    title: `Case Studies | Number 1 Digital Marketing`,
    description: t('subheading'),
    alternates: {
      canonical: `${siteUrl}/${locale}/case-studies`,
      languages: {
        en: `${siteUrl}/en/case-studies`,
        es: `${siteUrl}/es/case-studies`,
        pt: `${siteUrl}/pt/case-studies`,
        'x-default': `${siteUrl}/en/case-studies`,
      },
    },
  };
}

type CaseStudyItem = {
  slug: string;
  stat: string;
  statLabel: string;
  title: string;
  client: string;
  industry: string;
};

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'caseStudies' });
  const cases = t.raw('items') as CaseStudyItem[];

  return (
    <>
      <Section className="bg-brand-near-black pt-32">
        <Container>
          <Heading as="h1" size="xl">{t('heading')}</Heading>
          <p className="mt-6 text-brand-light1 text-xl max-w-2xl">{t('subheading')}</p>
        </Container>
      </Section>

      <Section className="bg-brand-black">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((cs, i) => (
              <CaseStudyCard
                key={cs.slug}
                stat={cs.stat}
                statLabel={cs.statLabel}
                title={cs.title}
                client={cs.client}
                industry={cs.industry}
                href={`/${locale}/case-studies/${cs.slug}`}
                ctaLabel="Read the story"
                index={i}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
