import { NextRequest, NextResponse } from 'next/server';
import {
  DESIGN_NAMES,
  LINK_NAMES,
  REQUIRED_LINKS,
  cartLines,
  cartSubtotal,
  lineName,
  neededLinks,
  shippingFor,
  type Cart,
} from '@/lib/shop/products';
import { stripeConfigured, stripePost } from '@/lib/shop/stripe';

const STRIPE_LOCALES: Record<string, string> = { en: 'en', es: 'es', pt: 'pt-BR' };

const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const locale = ['en', 'es', 'pt'].includes(body.locale) ? body.locale : 'en';
    const cart = (body.cart ?? {}) as Cart;
    const lines = cartLines(cart);

    const order = {
      business: clip(body.business, 120),
      contactName: clip(body.contactName, 120),
      phone: clip(body.phone, 40),
      email: clip(body.email, 200).toLowerCase(),
      notes: clip(body.notes, 480),
      smsConsent: body.smsConsent ? 'Yes' : 'No',
    };

    if (!lines.length) return NextResponse.json({ error: 'empty' }, { status: 400 });
    if (!order.business || !order.contactName || !order.phone || !/^\S+@\S+\.\S+$/.test(order.email)) {
      return NextResponse.json({ error: 'missing' }, { status: 400 });
    }

    const needed = neededLinks(lines);
    const links = needed.map((f) => ({ field: f, value: clip(body.links?.[f], 200) }));
    if (links.some((l) => REQUIRED_LINKS.includes(l.field) && !l.value)) {
      return NextResponse.json({ error: 'missing' }, { status: 400 });
    }
    const designs = Array.from(new Set(lines.flatMap((l) => (l.design ? [DESIGN_NAMES[l.design]] : []))));

    if (!stripeConfigured()) {
      // Local preview without Stripe keys: skip payment and show the thank-you page.
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ url: `/${locale}/shop/success?demo=1` });
      }
      return NextResponse.json({ error: 'closed' }, { status: 503 });
    }

    const items = lines.map((l) => `${l.qty}× ${lineName(l)}`).join(', ');
    const shipping = shippingFor(cartSubtotal(cart));
    const origin = req.nextUrl.origin;

    const params: Record<string, string | number | boolean | undefined> = {
      mode: 'payment',
      locale: STRIPE_LOCALES[locale],
      customer_email: order.email,
      success_url: `${origin}/${locale}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/shop#order`,
      'shipping_address_collection[allowed_countries][0]': 'US',
      'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
      'shipping_options[0][shipping_rate_data][display_name]': shipping ? 'Standard shipping' : 'Free shipping',
      'shipping_options[0][shipping_rate_data][fixed_amount][amount]': shipping,
      'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'usd',
      'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]': 'business_day',
      'shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]': 5,
      'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]': 'business_day',
      'shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]': 10,
      'automatic_tax[enabled]': process.env.STRIPE_AUTOMATIC_TAX === '1' ? true : undefined,
      'metadata[business]': order.business,
      'metadata[contact_name]': order.contactName,
      'metadata[phone]': order.phone,
      'metadata[designs]': designs.join(', '),
      'metadata[links]': links
        .map((l) => `${LINK_NAMES[l.field]}: ${l.value || 'find it for me'}`)
        .join(' | ')
        .slice(0, 500),
      'metadata[notes]': order.notes,
      'metadata[sms_consent]': order.smsConsent,
      'metadata[items]': items.slice(0, 500),
      'metadata[locale]': locale,
    };

    lines.forEach((l, i) => {
      params[`line_items[${i}][quantity]`] = l.qty;
      params[`line_items[${i}][price_data][currency]`] = 'usd';
      params[`line_items[${i}][price_data][unit_amount]`] = l.product.price;
      params[`line_items[${i}][price_data][product_data][name]`] = lineName(l);
      params[`line_items[${i}][price_data][product_data][description]`] =
        `Programmed for ${order.business}`.slice(0, 200);
    });

    const session = await stripePost<{ url: string }>('checkout/sessions', params);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Shop checkout error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
