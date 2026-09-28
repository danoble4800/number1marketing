import type { Plan } from './types';

export const PLAN_ORDER: Plan[] = ['free', 'pro', 'business'];

export const PLANS: Record<
  Plan,
  { name: string; price: string; yearly: string; blurb: string; features: string[] }
> = {
  free: {
    name: 'Free',
    price: '$0',
    yearly: 'Included with every card',
    blurb: 'A clean page your card opens, with the basics.',
    features: [
      'Your page with photo, bio and unlimited links',
      '“Save my contact” button',
      'Call, text and email buttons',
      '2 themes',
      'Total tap count',
      'Switch off a lost card',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$7/mo',
    yearly: 'or $59/year',
    blurb: 'For people who hand out their card every day.',
    features: [
      'Everything in Free',
      'All themes, your colors, fonts and button styles',
      'Remove the N°1 badge',
      'Full stats: taps, views and clicks per link',
      'Contact exchange: people share their info back',
      'New contacts emailed to you, CSV export',
      'Google review button',
    ],
  },
  business: {
    name: 'Business',
    price: '$29/mo',
    yearly: 'or $290/year',
    blurb: 'For shops, restaurants and teams.',
    features: [
      'Everything in Pro',
      'Review flow with star rating and private feedback',
      'Special / coupon of the week',
      'Booking and menu buttons up top',
      'Multiple pages (one per employee)',
      'Custom domain (card.yourbusiness.com), set up by us',
      'Monthly check-in on your numbers',
    ],
  },
};

export function planAtLeast(plan: Plan, min: Plan) {
  return PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(min);
}

// Which plan unlocks a feature — used for gating and "Upgrade" labels.
export const FEATURE_PLAN = {
  allThemes: 'pro',
  customStyle: 'pro',
  hideBadge: 'pro',
  fullStats: 'pro',
  leadCapture: 'pro',
  reviewButton: 'pro',
  reviewFunnel: 'business',
  special: 'business',
} as const satisfies Record<string, Plan>;

export type Feature = keyof typeof FEATURE_PLAN;

export function can(plan: Plan, feature: Feature) {
  return planAtLeast(plan, FEATURE_PLAN[feature]);
}
