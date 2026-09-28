import crypto from 'crypto';

// Minimal Stripe REST client (no SDK): Checkout Sessions + webhook signature checks.

type Params = Record<string, string | number | boolean | undefined>;

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function stripePost<T = Record<string, unknown>>(path: string, params: Params): Promise<T> {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined) body.append(k, String(v));

  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `Stripe ${res.status}`);
  return json as T;
}

export async function stripeGet<T = Record<string, unknown>>(path: string): Promise<T> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? `Stripe ${res.status}`);
  return json as T;
}

// Verifies the Stripe-Signature header (v1 scheme, 5-minute tolerance).
export function verifyStripeSignature(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.split('=') as [string, string]).filter(([k]) => k === 't')
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
  return header
    .split(',')
    .filter((p) => p.startsWith('v1='))
    .some((p) => {
      const sig = Buffer.from(p.slice(3), 'hex');
      const exp = Buffer.from(expected, 'hex');
      return sig.length === exp.length && crypto.timingSafeEqual(sig, exp);
    });
}
