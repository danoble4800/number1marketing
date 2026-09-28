import { NextResponse } from 'next/server';
import { userClient, siteUrl } from '@/lib/cards/server';
import { priceFor, stripe, stripeConfigured } from '@/lib/cards/stripe';

// Starts a Stripe Checkout subscription for one of the caller's pages.
export async function POST(req: Request) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'not_configured' }, { status: 501 });

  const supabase = userClient(req);
  if (!supabase) return NextResponse.json({ error: 'signed_out' }, { status: 401 });

  const { page_id, plan, interval } = await req.json().catch(() => ({}));
  if (!['pro', 'business'].includes(plan)) return NextResponse.json({ error: 'bad_plan' }, { status: 400 });
  const price = priceFor(plan, interval);
  if (!price) return NextResponse.json({ error: 'not_configured' }, { status: 501 });

  // RLS: only returns the page if the caller owns it.
  const { data: page } = await supabase
    .from('card_pages')
    .select('id, slug, stripe_customer_id, stripe_subscription_id')
    .eq('id', page_id)
    .single();
  if (!page) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { data: { user } } = await supabase.auth.getUser();
  const base = siteUrl();

  try {
    if (page.stripe_subscription_id && page.stripe_customer_id) {
      // Already subscribed: change plan in the billing portal.
      const portal = await stripe<{ url: string }>('billing_portal/sessions', {
        customer: page.stripe_customer_id,
        return_url: `${base}/card/edit?tab=plan`,
      });
      return NextResponse.json({ url: portal.url });
    }
    const session = await stripe<{ url: string }>('checkout/sessions', {
      mode: 'subscription',
      line_items: { 0: { price, quantity: 1 } },
      client_reference_id: page.id,
      customer: page.stripe_customer_id || undefined,
      customer_email: page.stripe_customer_id ? undefined : user?.email,
      metadata: { page_id: page.id, plan },
      subscription_data: { metadata: { page_id: page.id, plan } },
      allow_promotion_codes: true,
      success_url: `${base}/card/edit?tab=plan&upgraded=1`,
      cancel_url: `${base}/card/edit?tab=plan`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Card checkout error:', err);
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}
