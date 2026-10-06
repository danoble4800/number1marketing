// Student quotes for the Academy page. The section stays hidden while this list is empty.
// Only add real quotes from real students, with their permission — the course itself teaches
// that invented testimonials are off-limits. A quote can be one string or one per language.

type Locale = 'en' | 'es' | 'pt';

export type Testimonial = {
  quote: string | Partial<Record<Locale, string>>;
  name: string;
  role: string; // e.g. "Owner, Brancato Barbershop"
};

export const testimonials: Testimonial[] = [
  // { quote: '…', name: 'First L.', role: 'Owner, Business Name' },
];

export function quoteFor(t: Testimonial, locale: string): string {
  return typeof t.quote === 'string' ? t.quote : t.quote[locale as Locale] ?? t.quote.en ?? '';
}
