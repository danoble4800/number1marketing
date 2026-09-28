import { NextResponse } from 'next/server';
import { userClient, siteUrl } from '@/lib/cards/server';
import { stripe, stripeConfigured } from '@/lib/cards/stripe';

// Stripe billing portal: update card, switch plan, cancel.
export async function POST(req: Request) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'not_configured' }, { status: 501 });
  const supabase = userClient(req);
  if (!supabase) return NextResponse.json({ error: 'signed_out' }, { status: 401 });

  const { page_id } = await req.json().catch(() => ({}));
  const { data: page } = await supabase.from('card_pages').select('stripe_customer_id').eq('id', page_id).single();
  if (!page?.stripe_customer_id) return NextResponse.json({ error: 'no_subscription' }, { status: 404 });

  try {
    const portal = await stripe<{ url: string }>('billing_portal/sessions', {
      customer: page.stripe_customer_id,
      return_url: `${siteUrl()}/card/edit?tab=plan`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error('Card portal error:', err);
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}
