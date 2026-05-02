import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clock, Mail } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import ContactForm from '@/components/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: `Contact | Number 1 Digital Marketing`,
    description: t('subheading'),
    alternates: {
      canonical: `${siteUrl}/${locale}/contact`,
      languages: {
        en: `${siteUrl}/en/contact`,
        es: `${siteUrl}/es/contact`,
        pt: `${siteUrl}/pt/contact`,
        'x-default': `${siteUrl}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <>
      {/* Header */}
      <Section className="bg-brand-near-black pt-32">
        <Container>
          <Heading as="h1" size="xl">{t('heading')}</Heading>
          <p className="mt-6 text-brand-light1 text-xl max-w-2xl">{t('subheading')}</p>
        </Container>
      </Section>

      {/* Form + contact info */}
      <Section className="bg-brand-black">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Form — wider column */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact details — narrower column */}
            <div className="lg:col-span-2 flex flex-col gap-8 lg:pt-12">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">Contact</p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-brand-light1 text-sm">
                    <Clock size={16} className="flex-shrink-0 text-brand-mid" />
                    {t('hours')}
                  </div>
                  <a
                    href="https://instagram.com/number1marketing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-brand-light1 hover:text-brand-white transition-colors text-sm"
                  >
                    <span className="text-brand-mid font-display text-xs">IG</span>
                    {t('instagram')}
                  </a>
                  <a
                    href={`mailto:${t('email')}`}
                    className="flex items-center gap-3 text-brand-light1 hover:text-brand-white transition-colors text-sm"
                  >
                    <Mail size={16} className="flex-shrink-0 text-brand-mid" />
                    {t('email')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
