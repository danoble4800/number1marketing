import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Award } from 'lucide-react';
import VerifyLookupForm from '@/components/academy/VerifyLookupForm';

export const metadata: Metadata = {
  title: 'Verify a Certificate | N°1 AI Starter Guide',
};

export default async function VerifyLookupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'academy.certificate.verify' });

  return (
    <div className="min-h-screen bg-brand-near-black flex flex-col items-center justify-center px-4 pt-28 pb-16">
      <div className="w-full max-w-xl bg-brand-dark1 border border-brand-dark2 p-8 sm:p-12 text-center">
        <Award size={36} className="text-brand-light2 mx-auto mb-5" />
        <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">{t('lookupHeading')}</h1>
        <p className="text-brand-light1 mt-4 mb-8">{t('lookupIntro')}</p>
        <VerifyLookupForm locale={locale} />
      </div>
    </div>
  );
}
