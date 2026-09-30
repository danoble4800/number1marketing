import { createHmac, timingSafeEqual } from 'crypto';

// The NFC lead form (/en/nfc-lead) is only for the owner and sales reps, so its link
// carries a key. Set NFC_FORM_KEY to choose (or rotate) it; otherwise it's derived
// from the Google private key, which is already a server-only secret.
export function nfcFormKey(): string {
  if (process.env.NFC_FORM_KEY) return process.env.NFC_FORM_KEY;
  const secret = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!secret) return '';
  return createHmac('sha256', secret).update('nfc-lead-form').digest('base64url').slice(0, 16);
}

export function isNfcFormKey(value: unknown): boolean {
  const key = nfcFormKey();
  if (!key || typeof value !== 'string') return false;
  const a = Buffer.from(value);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}
