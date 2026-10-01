import type { Metadata, Viewport } from 'next';
import { setRequestLocale } from 'next-intl/server';
import TeamDashboard from '@/components/team/TeamDashboard';

// Sales reps' dashboard. Like /admin, it can be added to a phone's Home Screen.
export const metadata: Metadata = {
  title: 'Team | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
  manifest: '/api/team/manifest',
  appleWebApp: { capable: true, title: 'N°1 Team', statusBarStyle: 'black' },
  icons: { apple: '/admin-icon-180.png', icon: '/admin-icon-192.png' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TeamDashboard locale={locale} />;
}
