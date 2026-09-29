import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import GlossaryClient from '@/components/academy/GlossaryClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
  return {
    title: 'Marketing & AI Glossary | Number 1 Digital Marketing Academy',
    description:
      'Plain-language definitions of the digital marketing, local SEO and AI terms small businesses hear every day, each with a real example.',
    alternates: {
      canonical: `${siteUrl}/${locale}/academy/glossary`,
      languages: {
        en: `${siteUrl}/en/academy/glossary`,
        es: `${siteUrl}/es/academy/glossary`,
        pt: `${siteUrl}/pt/academy/glossary`,
        'x-default': `${siteUrl}/en/academy/glossary`,
      },
    },
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GlossaryClient locale={locale} />;
}
