import { NextRequest, NextResponse } from 'next/server';
import { ASSISTANT_PLANS, PRODUCT_TAG, isAssistantPlan } from '@/lib/macAssistant';
import { referredBy } from '@/lib/referrals';
import { stripeConfigured, stripePost } from '@/lib/shop/stripe';

const STRIPE_LOCALES: Record<string, string> = { en: 'en', es: 'es', pt: 'pt-BR' };

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

// Starts a Stripe Checkout for the Mac Assistant. The rep whose referral link brought the
// buyer in rides along in the metadata, so the webhook can credit their commission.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const locale = ['en', 'es', 'pt'].includes(body.locale) ? body.locale : 'en';
    const plan = body.plan;
    const name = clip(body.name, 120);
    const email = clip(body.email, 200).toLowerCase();
    const phone = clip(body.phone, 40);

    if (!isAssistantPlan(plan)) return NextResponse.json({ error: 'missing' }, { status: 400 });
    // Setup buyers get a call to schedule the screen share, so the phone is required for them.
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || (plan === 'setup' && !phone)) {
      return NextResponse.json({ error: 'missing' }, { status: 400 });
    }

    if (!stripeConfigured()) {
      // Local preview without Stripe keys: skip payment and show the thank-you page.
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ url: `/${locale}/mac-assistant/success?demo=${plan}` });
      }
      return NextResponse.json({ error: 'closed' }, { status: 503 });
    }

    const origin = req.nextUrl.origin;
    const referrer = await referredBy(req);
    const session = await stripePost<{ url: string }>('checkout/sessions', {
      mode: 'payment',
      locale: STRIPE_LOCALES[locale],
      customer_email: email,
      success_url: `${origin}/${locale}/mac-assistant/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/mac-assistant#pricing`,
      'automatic_tax[enabled]': process.env.STRIPE_AUTOMATIC_TAX === '1' ? true : undefined,
      'line_items[0][quantity]': 1,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': ASSISTANT_PLANS[plan].price,
      'line_items[0][price_data][product_data][name]': ASSISTANT_PLANS[plan].name,
      'metadata[product]': PRODUCT_TAG,
      'metadata[plan]': plan,
      'metadata[contact_name]': name,
      'metadata[phone]': phone,
      'metadata[referred_by]': referrer,
      'metadata[locale]': locale,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Mac Assistant checkout error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
