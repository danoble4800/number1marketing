import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AcademyToolkitClient from '@/components/academy/AcademyToolkitClient';

export const metadata: Metadata = {
  title: 'Templates & Toolkit | N°1 Academy',
  robots: { index: false, follow: false },
};

export default async function AcademyToolkitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AcademyToolkitClient locale={locale} />;
}
