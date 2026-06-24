import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AcademyAdminClient from '@/components/academy/AcademyAdminClient';

export const metadata: Metadata = {
  title: 'Academy Admin | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
};

export default async function AcademyAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AcademyAdminClient locale={locale} />;
}
