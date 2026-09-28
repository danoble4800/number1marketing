import { anonClient, isDemoId } from '@/lib/cards/server';

// Beacon from the public page: link clicks and review stars.
export async function POST(req: Request) {
  let body: { page_id?: string; kind?: string; link_id?: string; rating?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const { page_id, kind, link_id, rating } = body;
  if (!page_id || !kind || isDemoId(page_id) || !['click', 'review'].includes(kind)) {
    return new Response(null, { status: 204 });
  }
  await anonClient()?.rpc('record_card_event', {
    p_page: page_id,
    p_kind: kind,
    p_link: typeof link_id === 'string' ? link_id : null,
    p_rating: typeof rating === 'number' ? rating : null,
  });
  return new Response(null, { status: 204 });
}
