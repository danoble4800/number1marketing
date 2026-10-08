export type Plan = 'free' | 'pro' | 'business';
export type Lang = 'en' | 'es' | 'pt';
export type ReportFrequency = 'weekly' | 'monthly' | 'off';

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
  | 'spotify'
  | 'applemusic'
  | 'soundcloud'
  | 'youtubemusic'
  | 'audiomack'
  | 'tidal'
  | 'amazonmusic'
  | 'bandcamp'
  | 'maps'
  | 'booking'
  | 'menu'
  | 'payment'
  | 'section';

export type CardLink = {
  id: string;
  type: LinkType;
  label: string;
  url: string;
  enabled: boolean;
  display?: 'icon' | 'button'; // social links only; icon unless the owner picks button
  image?: string; // sections only: the brand's logo
};

export type CardContact = {
  phone?: string;
  email?: string;
  website?: string;
  company?: string;
  title?: string;
  address?: string;
};

export type Wallpaper = 'solid' | 'gradient' | 'aura' | 'dots' | 'blur' | 'image' | 'video';
export type BtnStyle = 'solid' | 'glass' | 'outline';
export type Radius = 'square' | 'round' | 'rounder' | 'full';
export type Shadow = 'none' | 'soft' | 'strong' | 'hard';
export type FontId = 'inter' | 'grotesk' | 'serif' | 'display' | 'editorial' | 'friendly' | 'mono' | 'script';

// The chosen theme (preset) plus everything the owner changed on top of it in the Look tab.
// Colors are #RRGGBB; anything unset falls back to the theme.
export type CardTheme = {
  preset?: string;
  // Header
  header?: 'classic' | 'hero';
  logo?: string; // image shown instead of the name
  titleSize?: 'small' | 'large';
  titleFont?: FontId;
  titleColor?: string;
  // Wallpaper
  wallpaper?: Wallpaper;
  bgColor?: string;
  wallpaperImage?: string;
  wallpaperVideo?: string;
  // Text
  font?: FontId;
  textColor?: string;
  // Buttons
  button?: BtnStyle;
  radius?: Radius;
  shadow?: Shadow;
  buttonColor?: string;
  buttonText?: string;
  accent?: string; // "Save my contact" button
  shape?: 'rounded' | 'pill' | 'square'; // older pages; read as radius
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
  report_frequency: ReportFrequency; // stats email
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
