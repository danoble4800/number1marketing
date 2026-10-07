// N°1 Creators: free for creators, monthly plans for brands who run their own campaigns,
// and a managed add-on where our team runs them. The brand dashboard isn't open yet, so
// plan buttons go to the contact page tagged with ?interest=<plan> (labels in
// app/api/contact/route.ts). Set NEXT_PUBLIC_CREATORS_<PLAN>_URL (a Stripe Payment Link)
// to send brands straight to checkout instead.

export type BrandPlan = 'starter' | 'growth' | 'pro';
export type Offer = BrandPlan | 'managed';

export const BRAND_PRICES: Record<Offer, number> = {
  starter: 79, // USD per month, up to 5 creator collaborations
  growth: 179, // USD per month, up to 15
  pro: 279, // USD per month, up to 30
  managed: 497, // USD per month on top of a plan: our team runs the campaigns
};

export const COLLABS_PER_MONTH: Record<BrandPlan, number> = { starter: 5, growth: 15, pro: 30 };

const INTEREST: Record<Offer, string> = {
  starter: 'creators-starter',
  growth: 'creators-growth',
  pro: 'creators-pro',
  managed: 'creators-managed',
};

const CHECKOUT: Partial<Record<Offer, string | undefined>> = {
  starter: process.env.NEXT_PUBLIC_CREATORS_STARTER_URL,
  growth: process.env.NEXT_PUBLIC_CREATORS_GROWTH_URL,
  pro: process.env.NEXT_PUBLIC_CREATORS_PRO_URL,
};

export function brandPlanHref(offer: Offer, locale: string): string {
  return CHECKOUT[offer] || `/${locale}/contact?interest=${INTEREST[offer]}`;
}

// Choices on the creator application. The keys are stored; the page shows translated
// labels from messages (creators.apply.*) and the admin tab shows these English ones.
export const FOLLOWER_RANGES = {
  under3k: 'Under 3,000',
  '3k-10k': '3,000–10,000',
  '10k-50k': '10,000–50,000',
  '50k-250k': '50,000–250,000',
  '250k+': '250,000+',
} as const;

export const NICHES = {
  beauty: 'Beauty & skincare',
  food: 'Food & drink',
  fitness: 'Fitness & wellness',
  home: 'Home & lifestyle',
  fashion: 'Fashion',
  tech: 'Tech & gadgets',
  family: 'Parenting & family',
  pets: 'Pets',
  local: 'Local business',
  other: 'Other',
} as const;

export const CAMPAIGN_TYPES = {
  gifted: 'Gifted',
  paid: 'Paid',
  affiliate: 'Affiliate',
} as const;

export type FollowerRange = keyof typeof FOLLOWER_RANGES;
export type Niche = keyof typeof NICHES;
export type CampaignType = keyof typeof CAMPAIGN_TYPES;
