import { NextResponse } from 'next/server';
import { anonClient } from '@/lib/cards/server';

export const dynamic = 'force-dynamic';

// The URL written to every chip. Never changes, so where it leads is up to us:
// the owner's page, the claim screen for a new card, or an admin-set redirect.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const id = params.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const source = url.searchParams.get('src') === 'qr' ? 'qr' : 'nfc';
  const to = (path: string) => NextResponse.redirect(new URL(path, url.origin), 302);

  const supabase = anonClient();
  if (!supabase || !id) return to('/card/claim/' + id + '?state=missing');

  const { data, error } = await supabase.rpc('resolve_card', { p_card: id, p_source: source });
  if (error || !data) return to(`/card/claim/${id}?state=missing`);

  const r = data as { status: string; slug?: string; redirect_url?: string | null };
  switch (r.status) {
    case 'active':
      return to(`/c/${r.slug}?src=${source}`);
    case 'unclaimed':
      if (r.redirect_url) return NextResponse.redirect(new URL(r.redirect_url, url.origin), 302);
      return to(`/card/claim/${id}`);
    default:
      return to(`/card/claim/${id}?state=${r.status}`);
  }
}
