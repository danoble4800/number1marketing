import crypto from 'crypto';

// Minimal Stripe REST calls (no SDK dependency). Nothing here runs until
// STRIPE_SECRET_KEY and the price ids are set in the environment.
export function stripeConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function priceFor(plan: string, interval: string) {
  const key = `STRIPE_PRICE_${plan.toUpperCase()}_${interval === 'year' ? 'YEAR' : 'MONTH'}`;
  return process.env[key] || null;
}

export function planForPrice(priceId: string): 'pro' | 'business' | null {
  for (const plan of ['pro', 'business'] as const) {
    for (const interval of ['MONTH', 'YEAR']) {
      if (process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${interval}`] === priceId) return plan;
    }
  }
  return null;
}

function encode(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) return [];
    if (typeof v === 'object') return encode(v as Record<string, unknown>, key);
    return [`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`];
  });
}

export async function stripe<T = Record<string, unknown>>(path: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encode(params).join('&'),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${path} failed`);
  return json as T;
}

// Checks the Stripe-Signature header (v1 HMAC over "timestamp.body", 5 minute tolerance).
export function verifyStripeSignature(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]));
  const t = parts.t;
  const sigs = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!t || sigs.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}
