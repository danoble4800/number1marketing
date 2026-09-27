import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AcademyResetPasswordClient from '@/components/academy/AcademyResetPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
};

export default async function AcademyResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AcademyResetPasswordClient locale={locale} />;
}
