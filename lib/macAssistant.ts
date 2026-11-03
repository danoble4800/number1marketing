// The N°1 Mac Assistant: the MacAssistant-Template zip + its setup guide, sold on
// /mac-assistant. Prices live here only (the checkout API reads them server-side).
// Page copy is in messages/*.json under macAssistant.

export type AssistantPlan = 'diy' | 'setup';

export const ASSISTANT_PLANS: Record<AssistantPlan, { price: number; name: string }> = {
  diy: { price: 20000, name: 'N°1 Mac Assistant (template + setup guide)' },
  setup: { price: 30000, name: 'N°1 Mac Assistant + done-for-you setup' },
};

// Reps earn this share of every sale that came through their referral link.
export const COMMISSION_RATE = 0.2;

// The files live in a private Supabase Storage bucket (supabase/products.sql), never in
// the repo, which is public. Buyers get short-lived links after Stripe confirms payment.
export const PRODUCTS_BUCKET = 'products';
export const ASSISTANT_FILES = {
  zip: 'mac-assistant/MacAssistant-Template.zip',
  guide: 'mac-assistant/Setup-Guide.pdf',
} as const;
export type AssistantFile = keyof typeof ASSISTANT_FILES;

export const isAssistantPlan = (v: unknown): v is AssistantPlan => v === 'diy' || v === 'setup';

// Stripe Checkout sessions for this product carry metadata.product = PRODUCT_TAG.
export const PRODUCT_TAG = 'mac-assistant';

export const orderIdFor = (sessionId: string) => `MA-${sessionId.slice(-6).toUpperCase()}`;
