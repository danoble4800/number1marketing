import type { Metadata, Viewport } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AdminDashboard from '@/components/admin/AdminDashboard';

// The manifest and Apple tags let /admin be added to a phone's Home Screen as its own app.
export const metadata: Metadata = {
  title: 'Admin | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
  manifest: '/api/admin/manifest',
  appleWebApp: { capable: true, title: 'N°1 Admin', statusBarStyle: 'black' },
  icons: { apple: '/admin-icon-180.png', icon: '/admin-icon-192.png' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminDashboard locale={locale} />;
}
