import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/cards/server';
import { planForPrice, verifyStripeSignature } from '@/lib/cards/stripe';

type Subscription = {
  id: string;
  customer: string;
  status: string;
  metadata?: { page_id?: string; plan?: string };
  items?: { data?: { price?: { id?: string } }[] };
};

// Keeps card_pages.plan in step with Stripe. Point a Stripe webhook at
// /api/cards/stripe-webhook for checkout.session.completed and customer.subscription.*.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const admin = serviceClient();
  if (!secret || !admin) return NextResponse.json({ error: 'not_configured' }, { status: 501 });

  const payload = await req.text();
  if (!verifyStripeSignature(payload, req.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'bad_signature' }, { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: Record<string, unknown> } };
  const obj = event.data.object;

  if (event.type === 'checkout.session.completed') {
    const pageId = (obj.client_reference_id as string) || (obj.metadata as { page_id?: string })?.page_id;
    const plan = (obj.metadata as { plan?: string })?.plan;
    if (pageId && (plan === 'pro' || plan === 'business')) {
      await admin
        .from('card_pages')
        .update({ plan, stripe_customer_id: obj.customer, stripe_subscription_id: obj.subscription })
        .eq('id', pageId);
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = obj as unknown as Subscription;
    const active = event.type === 'customer.subscription.updated' && ['active', 'trialing', 'past_due'].includes(sub.status);
    const priced = planForPrice(sub.items?.data?.[0]?.price?.id ?? '');
    const plan = active ? priced ?? sub.metadata?.plan ?? 'pro' : 'free';
    const match = sub.metadata?.page_id
      ? admin.from('card_pages').update({ plan, stripe_subscription_id: active ? sub.id : null }).eq('id', sub.metadata.page_id)
      : admin.from('card_pages').update({ plan, stripe_subscription_id: active ? sub.id : null }).eq('stripe_subscription_id', sub.id);
    await match;
  }

  return NextResponse.json({ received: true });
}
