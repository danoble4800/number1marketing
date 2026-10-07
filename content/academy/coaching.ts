// Paid add-ons to the free course. Until checkout is set up, the buttons go to the contact
// page tagged with ?interest=<offer>, so the lead alert says which offer they picked
// (labels in app/api/contact/route.ts). Set NEXT_PUBLIC_ACADEMY_GROUP_URL /
// NEXT_PUBLIC_ACADEMY_COACHING_URL (a Calendly paid event or Stripe Payment Link) to send
// people straight to booking and payment instead.

export const COACHING_PRICES = {
  group: 49, // USD per month
  oneOnOne: 197, // USD per 60-minute session
  dwyOne: 497, // USD, one system built with them
  dwyBoth: 997, // USD, both systems
};

export type Offer = 'group' | 'oneOnOne' | 'dwyOne' | 'dwyBoth' | 'team' | 'doneForYou';

const INTEREST: Record<Offer, string> = {
  group: 'academy-group',
  oneOnOne: 'academy-1on1',
  dwyOne: 'academy-dwy-one',
  dwyBoth: 'academy-dwy-both',
  team: 'academy-team',
  doneForYou: 'academy-done-for-you',
};

const CHECKOUT: Partial<Record<Offer, string | undefined>> = {
  group: process.env.NEXT_PUBLIC_ACADEMY_GROUP_URL,
  oneOnOne: process.env.NEXT_PUBLIC_ACADEMY_COACHING_URL,
};

export function coachingHref(offer: Offer, locale: string): string {
  return CHECKOUT[offer] || `/${locale}/contact?interest=${INTEREST[offer]}`;
}

// "Do it with us" card at the end of the AI for Your Business modules (copy in
// messages/*.json under academy.upsell.<module>). Prices come from COACHING_PRICES.
export const MODULE_UPSELLS: Record<string, { primary: keyof typeof COACHING_PRICES; secondary: Offer }> = {
  '12': { primary: 'dwyOne', secondary: 'doneForYou' },
  '13': { primary: 'oneOnOne', secondary: 'doneForYou' },
  '14': { primary: 'oneOnOne', secondary: 'group' },
};
