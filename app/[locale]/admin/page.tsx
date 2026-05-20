import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/Container';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-brand-near-black">
      <div className="border-b border-brand-dark2 bg-brand-black pt-24 pb-8">
        <Container>
          <div className="flex items-center gap-3">
            <span className="font-display text-xs text-brand-mid tracking-widest uppercase">N°1</span>
            <span className="w-px h-4 bg-brand-dark2" />
            <span className="text-xs text-brand-mid tracking-widest uppercase">Admin</span>
          </div>
        </Container>
      </div>
      <Container>
        <AdminDashboard />
      </Container>
    </div>
  );
}
