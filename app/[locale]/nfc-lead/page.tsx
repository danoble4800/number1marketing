import type { Metadata, Viewport } from 'next';
import { setRequestLocale } from 'next-intl/server';
import NfcLeadForm from '@/components/nfc/NfcLeadForm';

// Internal form for the owner and sales reps; the shareable link comes from /admin.
export const metadata: Metadata = {
  title: 'NFC Lead Intake | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'N°1 Leads', statusBarStyle: 'black' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default async function NfcLeadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NfcLeadForm />;
}
