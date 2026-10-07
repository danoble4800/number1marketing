import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AcademyDashboardClient from '@/components/academy/AcademyDashboardClient';

export const metadata: Metadata = {
  title: 'My Dashboard | N°1 AI Starter Guide',
  robots: { index: false, follow: false },
};

export default async function AcademyDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AcademyDashboardClient locale={locale} />;
}
