// The N°1 tap product catalog. Prices live here only: the checkout API reads them
// server-side, so a shopper can't change what they pay. Names and descriptions are
// in messages/*.json under shop.products.<id>.

export type ProductId = 'reviewCard' | 'counterStand' | 'stickerPack' | 'shopBundle';

export type Product = {
  id: ProductId;
  price: number; // cents
  compareAt?: number; // cents, shown struck through (bundle savings)
  maxQty: number;
  art: 'card' | 'stand' | 'stickers' | 'bundle';
};

export const PRODUCTS: Product[] = [
  { id: 'reviewCard', price: 2900, maxQty: 50, art: 'card' },
  { id: 'counterStand', price: 3900, maxQty: 20, art: 'stand' },
  { id: 'stickerPack', price: 3500, maxQty: 20, art: 'stickers' },
  // 1 stand + 5 cards + 1 sticker pack = $219 if bought separately
  { id: 'shopBundle', price: 14900, compareAt: 21900, maxQty: 10, art: 'bundle' },
];

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p])) as Record<
  ProductId,
  Product
>;

// Flat-rate shipping, free at or above the threshold.
export const SHIPPING_CENTS = 500;
export const FREE_SHIPPING_CENTS = 7500;

// Where the customer wants the tap to open. "Other" gets explained in the notes field.
export const TAP_TARGETS = ['googleReview', 'website', 'instagram', 'other'] as const;
export type TapTarget = (typeof TAP_TARGETS)[number];

export const TAP_TARGET_LABELS: Record<TapTarget, string> = {
  googleReview: 'Google review page',
  website: 'Website',
  instagram: 'Instagram',
  other: 'Other (see notes)',
};

export type Cart = Partial<Record<ProductId, number>>;

export function cartLines(cart: Cart) {
  return PRODUCTS.flatMap((p) => {
    const qty = Math.floor(Number(cart[p.id]) || 0);
    return qty > 0 ? [{ product: p, qty: Math.min(qty, p.maxQty) }] : [];
  });
}

export function cartSubtotal(cart: Cart) {
  return cartLines(cart).reduce((sum, l) => sum + l.product.price * l.qty, 0);
}

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
}

export function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
}

// English product names for Stripe, the order sheet and emails.
export const PRODUCT_NAMES: Record<ProductId, string> = {
  reviewCard: 'N°1 Tap Review Card',
  counterStand: 'N°1 Tap Counter Stand',
  stickerPack: 'N°1 Tap Stickers (5-pack)',
  shopBundle: 'N°1 Shop Bundle',
};
