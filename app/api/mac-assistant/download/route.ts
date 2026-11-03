import { NextRequest, NextResponse } from 'next/server';
import { serviceClient } from '@/lib/cards/server';
import { ASSISTANT_FILES, PRODUCTS_BUCKET, PRODUCT_TAG, type AssistantFile } from '@/lib/macAssistant';
import { stripeConfigured, stripeGet } from '@/lib/shop/stripe';

export const dynamic = 'force-dynamic';

const LINK_TTL = 60 * 10; // seconds

// /api/mac-assistant/download?session_id=cs_…&file=zip|guide
// The paid Checkout Session is the buyer's key: we check it with Stripe, then send them to
// a 10-minute link for the file. The link in their receipt email works the same way.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id') ?? '';
  const file = req.nextUrl.searchParams.get('file') as AssistantFile;
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !(file in ASSISTANT_FILES)) {
    return NextResponse.json({ error: 'Bad link' }, { status: 400 });
  }
  if (!stripeConfigured()) return NextResponse.json({ error: 'Not available' }, { status: 503 });

  try {
    const s = await stripeGet<{ payment_status: string; metadata: Record<string, string> }>(
      `checkout/sessions/${sessionId}`
    );
    if (s.payment_status !== 'paid' || s.metadata?.product !== PRODUCT_TAG) {
      return NextResponse.json({ error: 'No paid order for this link' }, { status: 403 });
    }
  } catch (err) {
    console.error('Mac Assistant download: Stripe lookup failed:', err);
    return NextResponse.json({ error: 'No paid order for this link' }, { status: 403 });
  }

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });
  const path = ASSISTANT_FILES[file];
  const { data, error } = await db.storage
    .from(PRODUCTS_BUCKET)
    .createSignedUrl(path, LINK_TTL, { download: path.split('/').pop() });
  if (error || !data) {
    console.error(`Mac Assistant download: no signed link for ${path}:`, error);
    return NextResponse.json({ error: 'File not available. Reply to your receipt email and we’ll send it.' }, { status: 500 });
  }
  return NextResponse.redirect(data.signedUrl);
}
