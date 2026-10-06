// Paid add-ons to the free course. Until checkout is set up, the buttons go to the contact
// page; set NEXT_PUBLIC_ACADEMY_GROUP_URL / NEXT_PUBLIC_ACADEMY_COACHING_URL (a Calendly paid
// event or Stripe Payment Link) to send people straight to booking and payment.

export const COACHING_PRICES = {
  group: 49, // USD per month
  oneOnOne: 197, // USD per 60-minute session
};

export function coachingHref(kind: 'group' | 'oneOnOne', locale: string): string {
  const url =
    kind === 'group'
      ? process.env.NEXT_PUBLIC_ACADEMY_GROUP_URL
      : process.env.NEXT_PUBLIC_ACADEMY_COACHING_URL;
  return url || `/${locale}/contact`;
}
