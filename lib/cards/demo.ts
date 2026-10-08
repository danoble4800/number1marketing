import type { CardPage, PageStats, CardLead, CardRow } from './types';

// Sample pages for sales demos and the editor preview (/c/demo-…, /card/edit?demo=…).
const base = {
  owner_id: 'demo',
  published: true,
  lead_notify_email: null,
  report_frequency: 'monthly' as const,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  created_at: '2026-09-01T12:00:00Z',
  updated_at: '2026-09-01T12:00:00Z',
  hide_badge: false,
  lang: 'en' as const,
};

export const DEMO_PAGES: CardPage[] = [
  {
    ...base,
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'demo-free',
    plan: 'free',
    display_name: 'Marcus Reid',
    headline: 'Licensed Electrician · Reid Electric',
    bio: 'Residential and commercial wiring, panel upgrades and EV chargers across the North Shore.',
    avatar_url: null,
    cover_url: null,
    contact: { phone: '(781) 555-0142', email: 'marcus@reidelectric.com', company: 'Reid Electric', title: 'Owner', website: 'reidelectric.com' },
    links: [
      { id: 'a1', type: 'link', label: 'Get a free quote', url: 'reidelectric.com/quote', enabled: true },
      { id: 'a2', type: 'maps', label: 'Service area', url: 'Lynn, MA', enabled: true },
      { id: 'a3', type: 'instagram', label: 'Instagram', url: '@reidelectric', enabled: true },
      { id: 'a4', type: 'facebook', label: 'Facebook', url: 'facebook.com/reidelectric', enabled: true },
    ],
    theme: { preset: 'midnight' },
    review: {},
    special: {},
    lead_capture: false,
  },
  {
    ...base,
    id: '00000000-0000-0000-0000-000000000002',
    slug: 'demo-realtor',
    plan: 'pro',
    display_name: 'Sofia Almeida',
    headline: 'Realtor® · Harbor & Main Realty',
    bio: 'Helping first-time buyers and families find home in Greater Boston. Se habla español · Falo português.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces',
    cover_url: null,
    contact: { phone: '(617) 555-0199', email: 'sofia@harborandmain.com', company: 'Harbor & Main Realty', title: 'Realtor', website: 'harborandmain.com' },
    links: [
      { id: 'b1', type: 'link', label: 'See my current listings', url: 'harborandmain.com/sofia', enabled: true },
      { id: 'b2', type: 'booking', label: 'Book a home consultation', url: 'calendly.com/sofia-almeida', enabled: true },
      { id: 'b3', type: 'link', label: 'What’s my home worth?', url: 'harborandmain.com/valuation', enabled: true },
      { id: 'b4', type: 'whatsapp', label: 'WhatsApp', url: '+16175550199', enabled: true },
      { id: 'b5', type: 'instagram', label: 'Instagram', url: '@sofiasellsboston', enabled: true },
      { id: 'b6', type: 'linkedin', label: 'LinkedIn', url: 'linkedin.com/in/sofiaalmeida', enabled: true },
    ],
    theme: { preset: 'gold', shape: 'pill', font: 'serif' },
    review: { url: 'https://g.page/r/example/review' },
    special: {},
    lead_capture: true,
    hide_badge: true,
  },
  {
    ...base,
    id: '00000000-0000-0000-0000-000000000003',
    slug: 'demo-pizza',
    plan: 'business',
    display_name: 'Tony’s Brick Oven',
    headline: 'Neapolitan pizza · Salem, MA',
    bio: 'Wood-fired since 1998. Dine in, take out, or cater your next party.',
    avatar_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop',
    cover_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=500&fit=crop',
    contact: { phone: '(978) 555-0123', email: 'hello@tonysbrickoven.com', company: 'Tony’s Brick Oven', website: 'tonysbrickoven.com', address: '12 Derby St, Salem, MA 01970' },
    links: [
      { id: 'c1', type: 'menu', label: 'See the menu', url: 'tonysbrickoven.com/menu', enabled: true },
      { id: 'c2', type: 'link', label: 'Order online', url: 'tonysbrickoven.com/order', enabled: true },
      { id: 'c3', type: 'booking', label: 'Book catering', url: 'tonysbrickoven.com/catering', enabled: true },
      { id: 'c4', type: 'maps', label: 'Directions', url: '12 Derby St, Salem, MA 01970', enabled: true },
      { id: 'c5', type: 'instagram', label: 'Instagram', url: '@tonysbrickoven', enabled: true },
      { id: 'c6', type: 'tiktok', label: 'TikTok', url: '@tonysbrickoven', enabled: true },
    ],
    theme: { preset: 'sunset', shape: 'rounded', font: 'display' },
    review: { url: 'https://g.page/r/example/review', funnel: true },
    special: { enabled: true, title: 'Tuesday 2-for-1', body: 'Buy any large pie, get a margherita free. Dine-in only.', code: 'TAP241', expires: 'Oct 31' },
    lead_capture: true,
    hide_badge: true,
  },
];

export function getDemoPage(slug: string) {
  return DEMO_PAGES.find((p) => p.slug === slug) ?? null;
}

export function demoStats(page: CardPage): PageStats {
  // Ends today so the chart and "this week" sentence have data.
  const now = new Date();
  const daily = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 29 + i));
    const wave = Math.round(6 + 5 * Math.sin(i / 3) + (i % 7 === 5 ? 6 : 0));
    return { day: d.toISOString().slice(0, 10), taps: wave, views: wave + 4 + (i % 4), clicks: Math.round(wave * 0.8) };
  });
  const sum = (k: 'taps' | 'views' | 'clicks') => daily.reduce((n, d) => n + d[k], 0);
  const links: Record<string, number> = {};
  page.links.forEach((l, i) => { links[l.id] = Math.max(3, Math.round(sum('clicks') / (i + 2))); });
  return {
    totals: { tap: sum('taps'), view: sum('views'), click: sum('clicks'), save_contact: 41, lead: 9, review: 23 },
    all_time: { tap: sum('taps') * 3, view: sum('views') * 3, click: sum('clicks') * 3 },
    daily,
    links,
    ratings: { 5: 17, 4: 4, 3: 1, 2: 1 },
  };
}

export const DEMO_LEADS: CardLead[] = [
  { id: 1, page_id: '', kind: 'lead', name: 'Jenna Walsh', email: 'jenna.walsh@example.com', phone: '(617) 555-0110', note: 'Looking for a 3-bed in Melrose, spring move.', rating: null, created_at: '2026-09-27T15:22:00Z' },
  { id: 2, page_id: '', kind: 'lead', name: 'Carlos Mendes', email: 'carlos@example.com', phone: '', note: '', rating: null, created_at: '2026-09-25T19:03:00Z' },
  { id: 3, page_id: '', kind: 'feedback', name: 'Anonymous', email: '', phone: '', note: 'Waited 25 minutes for a takeout order that was quoted at 10.', rating: 2, created_at: '2026-09-24T23:40:00Z' },
];

export const DEMO_CARDS: CardRow[] = [
  { id: 'K7M2QX9', page_id: 'demo', status: 'active', redirect_url: null, label: 'Matte black', claimed_at: '2026-09-02T12:00:00Z', created_at: '2026-09-01T12:00:00Z' },
  { id: 'P4TW8NB', page_id: 'demo', status: 'disabled', redirect_url: null, label: 'Lost at expo', claimed_at: '2026-09-02T12:00:00Z', created_at: '2026-09-01T12:00:00Z' },
];
