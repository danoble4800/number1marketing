import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AcademyLoginClient from '@/components/academy/AcademyLoginClient';

export const metadata: Metadata = {
  title: 'Academy Login | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
};

export default async function AcademyLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AcademyLoginClient locale={locale} />;
}
