import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CardView from '@/components/cards/CardView';
import { anonClient, getPublicPage, isDemoId } from '@/lib/cards/server';

export const dynamic = 'force-dynamic';

type Params = { params: { slug: string }; searchParams: { src?: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = await getPublicPage(params.slug);
  if (!page) return { title: 'Page not found' };
  const description = page.headline || page.bio?.slice(0, 150) || undefined;
  return {
    title: page.display_name,
    description,
    openGraph: {
      title: page.display_name,
      description,
      images: page.avatar_url ? [page.avatar_url] : undefined,
    },
    robots: page.slug.startsWith('demo-') ? { index: false } : undefined,
  };
}

export default async function CustomerPage({ params, searchParams }: Params) {
  const page = await getPublicPage(params.slug);
  if (!page) notFound();

  if (!isDemoId(page.id)) {
    // Taps are logged by /t/<id>; this counts every page open (taps, QR scans, shared links).
    await anonClient()?.rpc('record_card_event', {
      p_page: page.id,
      p_kind: 'view',
      p_source: (searchParams.src || 'link').slice(0, 20),
    });
  }

  return (
    <main className="min-h-[100dvh]">
      <CardView page={page} />
    </main>
  );
}
