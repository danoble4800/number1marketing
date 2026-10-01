export type Plan = 'free' | 'pro' | 'business';
export type Lang = 'en' | 'es' | 'pt';

export type LinkType =
  | 'link'
  | 'phone'
  | 'sms'
  | 'email'
  | 'whatsapp'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'x'
  | 'maps'
  | 'booking'
  | 'menu'
  | 'payment';

export type CardLink = {
  id: string;
  type: LinkType;
  label: string;
  url: string;
  enabled: boolean;
};

export type CardContact = {
  phone?: string;
  email?: string;
  website?: string;
  company?: string;
  title?: string;
  address?: string;
};

export type CardTheme = {
  preset?: string;
  accent?: string;
  shape?: 'rounded' | 'pill' | 'square';
  font?: 'inter' | 'grotesk' | 'serif' | 'display';
};

export type CardReview = { url?: string; funnel?: boolean };

export type CardSpecial = {
  enabled?: boolean;
  title?: string;
  body?: string;
  code?: string;
  expires?: string;
};

// What get_public_page() returns — everything the public page may see.
export type PublicPage = {
  id: string;
  slug: string;
  plan: Plan;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  cover_url: string | null;
  contact: CardContact;
  links: CardLink[];
  theme: CardTheme;
  review: CardReview;
  special: CardSpecial;
  lead_capture: boolean;
  hide_badge: boolean;
  lang: Lang;
};

// A row the owner edits (adds private fields).
export type CardPage = PublicPage & {
  owner_id: string;
  published: boolean;
  lead_notify_email: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CardRow = {
  id: string;
  page_id: string | null;
  status: 'active' | 'disabled';
  redirect_url: string | null;
  label: string;
  claimed_at: string | null;
  created_at: string;
  rep_id?: string | null; // the sales rep the card was given to
};

export type CardLead = {
  id: number;
  page_id: string;
  kind: 'lead' | 'feedback';
  name: string;
  email: string;
  phone: string;
  note: string;
  rating: number | null;
  created_at: string;
};

export type PageStats = {
  totals: Record<string, number>;
  all_time: Record<string, number>;
  daily: { day: string; taps: number; views: number; clicks: number }[];
  links: Record<string, number>;
  ratings: Record<string, number>;
};
