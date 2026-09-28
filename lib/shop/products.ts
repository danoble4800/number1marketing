// The N°1 tap product catalog. Prices live here only: the checkout API reads them
// server-side, so a shopper can't change what they pay. Names and descriptions are
// in messages/*.json under shop.products.<id>.

export type ProductId = 'reviewCard' | 'counterStand' | 'bracelet' | 'stickerPack' | 'shopBundle';

// Pre-printed designs. Cards, stands and the bundle come in these; custom printing
// (your own logo) is quoted separately, 125-piece minimum.
export const DESIGNS = ['googleReview', 'instagram', 'menu', 'wifi'] as const;
export type Design = (typeof DESIGNS)[number];

export type Product = {
  id: ProductId;
  price: number; // cents
  compareAt?: number; // cents, shown struck through (bundle savings)
  maxQty: number;
  art: 'card' | 'stand' | 'bracelet' | 'stickers' | 'bundle';
  designs: boolean; // pick one of DESIGNS per line
};

export const PRODUCTS: Product[] = [
  { id: 'reviewCard', price: 4000, maxQty: 50, art: 'card', designs: true },
  { id: 'counterStand', price: 5000, maxQty: 20, art: 'stand', designs: true },
  { id: 'bracelet', price: 4000, maxQty: 50, art: 'bracelet', designs: false },
  { id: 'stickerPack', price: 3500, maxQty: 20, art: 'stickers', designs: false },
  // 1 stand + 5 cards + 1 sticker pack = $285 if bought separately
  { id: 'shopBundle', price: 20000, compareAt: 28500, maxQty: 10, art: 'bundle', designs: true },
];

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p])) as Record<
  ProductId,
  Product
>;

// Flat-rate shipping, free at or above the threshold.
export const SHIPPING_CENTS = 500;
export const FREE_SHIPPING_CENTS = 7500;

// Custom printing (own logo) minimum, shown on the page.
export const CUSTOM_MIN_QTY = 125;

// Cart keys are "<productId>" or "<productId>:<design>".
export type Cart = Record<string, number>;

export function cartKey(id: ProductId, design?: Design) {
  return design ? `${id}:${design}` : id;
}

export type CartLine = { key: string; product: Product; design?: Design; qty: number };

export function cartLines(cart: Cart): CartLine[] {
  return Object.entries(cart ?? {}).flatMap(([key, raw]) => {
    const [id, design] = key.split(':') as [ProductId, Design | undefined];
    const product = PRODUCT_BY_ID[id];
    if (!product) return [];
    if (product.designs ? !DESIGNS.includes(design as Design) : design !== undefined) return [];
    const qty = Math.min(Math.floor(Number(raw) || 0), product.maxQty);
    return qty > 0 ? [{ key, product, design, qty }] : [];
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

// Which links the order form asks for, based on what's in the cart. Wi-Fi details are
// collected by text after the order, so there's no field for them.
export const LINK_FIELDS = ['googleReview', 'instagram', 'menu', 'other'] as const;
export type LinkField = (typeof LINK_FIELDS)[number];
export const REQUIRED_LINKS: LinkField[] = ['instagram', 'menu'];

export function neededLinks(lines: CartLine[]): LinkField[] {
  const need = new Set<LinkField>();
  for (const l of lines) {
    if (l.design && l.design !== 'wifi') need.add(l.design);
    if (!l.product.designs) need.add('other');
  }
  return LINK_FIELDS.filter((f) => need.has(f));
}

// English names for Stripe, the order sheet and emails.
export const PRODUCT_NAMES: Record<ProductId, string> = {
  reviewCard: 'N°1 Tap Card',
  counterStand: 'N°1 Tap Counter Stand',
  bracelet: 'N°1 Tap Bracelet',
  stickerPack: 'N°1 Tap Stickers (5-pack)',
  shopBundle: 'N°1 Shop Bundle',
};

export const DESIGN_NAMES: Record<Design, string> = {
  googleReview: 'Google Review',
  instagram: 'Instagram',
  menu: 'Menu',
  wifi: 'Wi-Fi',
};

export const LINK_NAMES: Record<LinkField, string> = {
  googleReview: 'Google review',
  instagram: 'Instagram',
  menu: 'Menu',
  other: 'Bracelet/stickers',
};

export function lineName(l: CartLine) {
  return l.design ? `${PRODUCT_NAMES[l.product.id]} (${DESIGN_NAMES[l.design]})` : PRODUCT_NAMES[l.product.id];
}
