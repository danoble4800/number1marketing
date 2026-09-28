import type { CardLink, LinkType } from './types';

export const LINK_TYPES: Record<LinkType, { name: string; placeholder: string; social?: boolean }> = {
  link: { name: 'Website / link', placeholder: 'https://…' },
  booking: { name: 'Book an appointment', placeholder: 'https://calendly.com/…' },
  menu: { name: 'Menu', placeholder: 'https://…/menu' },
  payment: { name: 'Pay me', placeholder: 'https://venmo.com/… or cash.app/…' },
  maps: { name: 'Directions', placeholder: 'Street address or Google Maps link' },
  phone: { name: 'Call', placeholder: '(555) 123-4567' },
  sms: { name: 'Text', placeholder: '(555) 123-4567' },
  email: { name: 'Email', placeholder: 'you@business.com' },
  whatsapp: { name: 'WhatsApp', placeholder: '+1 555 123 4567' },
  instagram: { name: 'Instagram', placeholder: '@yourhandle', social: true },
  tiktok: { name: 'TikTok', placeholder: '@yourhandle', social: true },
  facebook: { name: 'Facebook', placeholder: 'facebook.com/yourpage', social: true },
  linkedin: { name: 'LinkedIn', placeholder: 'linkedin.com/in/you', social: true },
  youtube: { name: 'YouTube', placeholder: 'youtube.com/@you', social: true },
  x: { name: 'X', placeholder: '@yourhandle', social: true },
};

const digits = (s: string) => s.replace(/[^\d+]/g, '');
const handle = (s: string) => s.trim().replace(/^@/, '').replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '');

function withScheme(url: string) {
  const u = url.trim();
  if (!u) return '';
  if (/^(https?:|mailto:|tel:|sms:)/i.test(u)) return u;
  return `https://${u}`;
}

// Turns what the owner typed ("@joespizza", "555-1234") into a real href.
export function linkHref(link: Pick<CardLink, 'type' | 'url'>): string {
  const v = link.url.trim();
  if (!v) return '';
  switch (link.type) {
    case 'phone': return `tel:${digits(v)}`;
    case 'sms': return `sms:${digits(v)}`;
    case 'email': return v.startsWith('mailto:') ? v : `mailto:${v}`;
    case 'whatsapp': return /^https?:/.test(v) ? v : `https://wa.me/${digits(v).replace('+', '')}`;
    case 'instagram': return /instagram\.com/.test(v) ? withScheme(v) : `https://instagram.com/${handle(v)}`;
    case 'tiktok': return /tiktok\.com/.test(v) ? withScheme(v) : `https://www.tiktok.com/@${handle(v)}`;
    case 'x': return /(x|twitter)\.com/.test(v) ? withScheme(v) : `https://x.com/${handle(v)}`;
    case 'maps':
      return /^https?:|maps\.|goo\.gl/.test(v) ? withScheme(v) : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
    default: return withScheme(v);
  }
}

export function newLinkId() {
  return Math.random().toString(36).slice(2, 10);
}
