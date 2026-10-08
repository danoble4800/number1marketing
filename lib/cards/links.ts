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
  section: { name: 'Section', placeholder: '' },
};

// A section is a heading (a brand, with an optional logo). The links under it in the list,
// up to the next section, show together in one box on the page.
export const isSection = (link: Pick<CardLink, 'type'>) => link.type === 'section';

export type LinkGroup = { section: CardLink; links: CardLink[] };

// Splits the list into the links above the first section and one group per section.
export function groupLinks(links: CardLink[]): { loose: CardLink[]; groups: LinkGroup[] } {
  const loose: CardLink[] = [];
  const groups: LinkGroup[] = [];
  for (const l of links) {
    if (isSection(l)) groups.push({ section: l, links: [] });
    else if (groups.length) groups[groups.length - 1].links.push(l);
    else loose.push(l);
  }
  return { loose, groups };
}

// Social links show as small round icons unless the owner switched them to a full button.
export function isIconLink(link: Pick<CardLink, 'type' | 'display'>): boolean {
  return !!LINK_TYPES[link.type]?.social && link.display !== 'button';
}

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

// What a link row shows next to its click count: "calendly.com", "@joespizza", "(555) 123-4567".
export function linkDomain(link: Pick<CardLink, 'type' | 'url'>): string {
  const v = link.url.trim();
  if (!v) return '';
  if (['phone', 'sms', 'whatsapp', 'email'].includes(link.type)) return v.replace(/^mailto:/, '');
  if (!/^https?:|\//.test(v) && v.startsWith('@')) return v;
  if (link.type === 'maps' && !/^https?:|maps\.|goo\.gl/.test(v)) return v;
  try {
    return new URL(withScheme(v)).hostname.replace(/^www\./, '');
  } catch {
    return v;
  }
}

// Client-side health check for a link row. Returns what to fix, or null if it looks fine.
export function linkProblem(link: Pick<CardLink, 'type' | 'url'>): string | null {
  if (link.type === 'section') return null;
  const v = link.url.trim();
  if (!v) return 'Empty, so it won’t show on your page.';
  const isUrl = /^https?:\/\//i.test(v) || /\.[a-z]{2,}(\/|$)/i.test(v);
  switch (link.type) {
    case 'phone':
    case 'sms':
    case 'whatsapp':
      return /^https?:/.test(v) || v.replace(/\D/g, '').length >= 10 ? null : 'Phone number looks too short.';
    case 'email':
      return /^(mailto:)?[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'That doesn’t look like an email address.';
    case 'instagram':
    case 'tiktok':
    case 'x':
      return isUrl || !/\s/.test(v) ? null : 'Handles can’t have spaces.';
    case 'maps':
      return null;
    default:
      if (/\s/.test(v)) return 'Web addresses can’t have spaces.';
      return isUrl ? null : 'That doesn’t look like a web address.';
  }
}

// The review button only works with a real Google review / Maps link.
export function reviewUrlProblem(url: string | undefined): string | null {
  const v = (url ?? '').trim();
  if (!v) return null;
  return /(g\.page|maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.|search\.google\.com|g\.co\/kgs)/i.test(v)
    ? null
    : 'This doesn’t look like a Google review link. Use the one from Google Business Profile → Ask for reviews.';
}

// Names for click stats, including the built-in buttons that aren't in page.links.
export function linkNames(links: CardLink[]): Record<string, string> {
  const named: Record<string, string> = {
    'quick-call': 'Call button',
    'quick-text': 'Text button',
    'quick-email': 'Email button',
    review: 'Google review',
  };
  links.forEach((l) => { named[l.id] = l.label || LINK_TYPES[l.type]?.name || l.type; });
  return named;
}
