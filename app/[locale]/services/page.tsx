import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle } from 'lucide-react';
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
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: `Services | Number 1 Digital Marketing`,
    description: t('subheading'),
    alternates: {
      canonical: `${siteUrl}/${locale}/services`,
      languages: {
        en: `${siteUrl}/en/services`,
        es: `${siteUrl}/es/services`,
        pt: `${siteUrl}/pt/services`,
        'x-default': `${siteUrl}/en/services`,
      },
    },
  };
}

type ServiceItem = {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  problem: string;
  includes: string[];
  outcomes: string;
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'services' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });
  const services = t.raw('items') as ServiceItem[];

  const sideNavLabels: Record<string, string> = {
    'ai-agents': 'AI Agents',
    'ai-consulting': 'AI Consulting',
    'seo': 'SEO',
    'web-design': 'Web Design',
    'workflow-automation': 'Workflow',
    'growth-marketing': 'Growth',
  };

  return (
    <>
      {/* Header */}
      <Section className="bg-brand-near-black pt-32">
        <Container>
          <Heading as="h1" size="xl">{t('heading')}</Heading>
          <p className="mt-6 max-w-2xl text-brand-light1 text-xl leading-relaxed">
            {t('subheading')}
          </p>
        </Container>
      </Section>

      {/* Services with sticky side nav */}
      <div className="bg-brand-black">
        <Container className="relative flex gap-12">
          {/* Sticky side nav - desktop only */}
          <aside className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-24 py-12">
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <a
                      href={`#${service.slug}`}
                      className="block text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white transition-colors py-1.5 border-l-2 border-transparent hover:border-brand-mid pl-3"
                    >
                      {sideNavLabels[service.slug] || service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Services list */}
          <div className="flex-1 py-12">
            {services.map((service, i) => (
              <section
                key={service.slug}
                id={service.slug}
                className={`py-16 ${i < services.length - 1 ? 'border-b border-brand-dark2' : ''}`}
              >
                <Heading as="h2" size="lg">{service.name}</Heading>
                <p className="mt-3 text-brand-light2 text-lg italic">{service.tagline}</p>

                <div className="mt-8 grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-brand-mid mb-3">The Problem</h3>
                    <p className="text-brand-light1 leading-relaxed">{service.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-brand-mid mb-3">What&apos;s Included</h3>
                    <ul className="space-y-2">
                      {service.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-brand-light2" />
                          <span className="text-brand-light1 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 bg-brand-dark1 border border-brand-dark2 p-6">
                  <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">Typical Outcomes</p>
                  <p className="text-brand-offwhite font-semibold">{service.outcomes}</p>
                </div>

                <div className="mt-8">
                  <Button href={`/${locale}/contact`} variant="outline">
                    {tContact('heading')} →
                  </Button>
                </div>
              </section>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
