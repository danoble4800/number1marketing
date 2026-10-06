import type { CSSProperties } from 'react';
import type { BtnStyle, CardTheme, FontId, Plan, Radius, Shadow, Wallpaper } from './types';
import { can } from './plans';

// A theme is a starting point: a color set plus default wallpaper and button settings.
// Everything the owner changes in the Look tab (CardTheme) sits on top of it.

export type ThemePreset = {
  id: string;
  name: string;
  free: boolean;
  mood: 'light' | 'dark';
  bg: string;
  surface: string; // button / box fill
  text: string;
  muted: string;
  border: string;
  accent: string; // "Save my contact" button
  accentText: string;
  g: [string, string, string]; // gradient stops, all readable under `text`
  css?: string; // hand-made background, used while the wallpaper is left as the theme's own
  wallpaper: Wallpaper;
  button: BtnStyle;
  radius: Radius;
  shadow: Shadow;
};

type Defaults = Pick<ThemePreset, 'wallpaper' | 'button' | 'radius' | 'shadow'>;
const d = (wallpaper: Wallpaper, button: BtnStyle, radius: Radius, shadow: Shadow): Defaults => ({ wallpaper, button, radius, shadow });

const SIGNATURE: ThemePreset[] = [
  { id: 'midnight', name: 'Midnight', free: true, mood: 'dark', bg: '#0E0E10', surface: '#1A1A1E', text: '#F5F5F6', muted: '#8C8C91', border: '#2D2D32', accent: '#FFFFFF', accentText: '#0E0E10', g: ['#1A1A1F', '#121216', '#24242A'], ...d('solid', 'solid', 'rounder', 'none') },
  { id: 'paper', name: 'Paper', free: true, mood: 'light', bg: '#F7F6F3', surface: '#FFFFFF', text: '#16161A', muted: '#6B6B70', border: '#E3E1DC', accent: '#16161A', accentText: '#FFFFFF', g: ['#EDEBE5', '#F2F0EB', '#E6E3DC'], ...d('solid', 'solid', 'rounder', 'none') },
  { id: 'gold', name: 'Black & Gold', free: false, mood: 'dark', bg: '#0B0A08', surface: 'rgba(255,255,255,0.04)', text: '#F4EBD9', muted: '#A89B80', border: '#4A3F2A', accent: '#D4AF63', accentText: '#15120B', g: ['#2A2418', '#1A1610', '#3A3020'], css: 'radial-gradient(120% 80% at 50% 0%, #2A2418 0%, #0B0A08 60%)', ...d('gradient', 'solid', 'rounder', 'none') },
  { id: 'sunset', name: 'Sunset', free: false, mood: 'dark', bg: '#B23669', surface: 'rgba(255,255,255,0.16)', text: '#FFFFFF', muted: 'rgba(255,255,255,0.8)', border: 'rgba(255,255,255,0.28)', accent: '#FFFFFF', accentText: '#B23669', g: ['#FF7A59', '#E8467C', '#6B2FBF'], ...d('gradient', 'solid', 'rounder', 'none') },
  { id: 'ocean', name: 'Ocean', free: false, mood: 'dark', bg: '#0F4C75', surface: 'rgba(255,255,255,0.08)', text: '#EAF6FF', muted: '#A7C8DE', border: 'rgba(255,255,255,0.18)', accent: '#5CE1E6', accentText: '#062033', g: ['#0B2A4A', '#0F4C75', '#1B7FA6'], css: 'linear-gradient(180deg, #0B2A4A 0%, #0F4C75 55%, #1B7FA6 100%)', ...d('gradient', 'solid', 'rounder', 'none') },
  { id: 'forest', name: 'Forest', free: false, mood: 'dark', bg: '#13241C', surface: '#1C3328', text: '#EEF3EC', muted: '#9DB3A3', border: '#2C4A3A', accent: '#B8E07A', accentText: '#13241C', g: ['#1C3328', '#24402F', '#0E1C15'], ...d('solid', 'solid', 'rounder', 'none') },
  { id: 'blush', name: 'Blush', free: false, mood: 'light', bg: '#FBEFEA', surface: '#FFFFFF', text: '#3A2424', muted: '#8F6F6A', border: '#F0D6CD', accent: '#C8566B', accentText: '#FFFFFF', g: ['#F6DDD5', '#FBEAE4', '#F0CFC4'], ...d('solid', 'solid', 'rounder', 'none') },
  { id: 'neon', name: 'Neon', free: false, mood: 'dark', bg: '#07070A', surface: '#111118', text: '#F2F2F7', muted: '#8A8AA0', border: '#2A2A3A', accent: '#C6FF3D', accentText: '#07070A', g: ['#14141C', '#1C1C28', '#0C0C12'], ...d('solid', 'solid', 'rounder', 'none') },
];

// Every color set here passes WCAG AA: text ≥ 4.5:1 on bg, surface and all gradient stops; muted ≥ 3:1.
const PALETTES: ThemePreset[] = [
  { id: 'chalk', name: 'Chalk', free: true, mood: 'light', bg: '#FAFAF7', surface: '#FFFFFF', text: '#17171A', muted: '#62626A', border: '#E4E4DE', accent: '#17171A', accentText: '#FFFFFF', g: ['#ECE9E1', '#E1E6EE', '#F1E6DD'], ...d('solid', 'solid', 'rounder', 'soft') },
  { id: 'linen', name: 'Linen', free: true, mood: 'light', bg: '#F4EEE4', surface: '#FBF8F2', text: '#2B2118', muted: '#6E5E4C', border: '#E3D8C6', accent: '#9A4A26', accentText: '#FFFFFF', g: ['#EAD9C0', '#F0E2CF', '#E2CDB0'], ...d('solid', 'solid', 'full', 'none') },
  { id: 'mint', name: 'Mint', free: true, mood: 'light', bg: '#EAF7F0', surface: '#FFFFFF', text: '#0F2E22', muted: '#46695A', border: '#CDE8DA', accent: '#0F7A53', accentText: '#FFFFFF', g: ['#C6EFDB', '#DDF5EA', '#B5E5CF'], ...d('gradient', 'solid', 'rounder', 'soft') },
  { id: 'sky', name: 'Sky', free: true, mood: 'light', bg: '#EAF3FD', surface: '#FFFFFF', text: '#0D2440', muted: '#475F7D', border: '#CFE0F5', accent: '#2457D6', accentText: '#FFFFFF', g: ['#CBE1FB', '#E2EEFD', '#B8D4F7'], ...d('aura', 'glass', 'rounder', 'soft') },
  { id: 'lilac', name: 'Lilac', free: true, mood: 'light', bg: '#F3EEFC', surface: '#FFFFFF', text: '#24163F', muted: '#655681', border: '#E0D5F5', accent: '#6D2FD9', accentText: '#FFFFFF', g: ['#E0D1FA', '#F0E8FD', '#D2BFF5'], ...d('aura', 'glass', 'full', 'none') },
  { id: 'peach', name: 'Peach', free: true, mood: 'light', bg: '#FFF1E8', surface: '#FFFFFF', text: '#3A1F12', muted: '#7E5A49', border: '#F7D9C6', accent: '#C2410C', accentText: '#FFFFFF', g: ['#FFDAC2', '#FFE9DA', '#FBCBAF'], ...d('gradient', 'solid', 'full', 'soft') },
  { id: 'rose', name: 'Rose', free: true, mood: 'light', bg: '#FDEEF2', surface: '#FFFFFF', text: '#3B1424', muted: '#80505F', border: '#F5D3DD', accent: '#BE185D', accentText: '#FFFFFF', g: ['#F9D0DD', '#FCE4EB', '#F4BDCE'], ...d('dots', 'solid', 'rounder', 'soft') },
  { id: 'lemon', name: 'Lemon', free: true, mood: 'light', bg: '#FFFBE6', surface: '#FFFFFF', text: '#2E2A0F', muted: '#6B6440', border: '#F2EBBF', accent: '#2E2A0F', accentText: '#FFF6C2', g: ['#FFF0A8', '#FFF7D1', '#FCE68A'], ...d('solid', 'outline', 'square', 'none') },
  { id: 'sage', name: 'Sage', free: true, mood: 'light', bg: '#EEF1EA', surface: '#FAFBF8', text: '#1E2A1E', muted: '#566452', border: '#D7DED0', accent: '#3F5E39', accentText: '#FFFFFF', g: ['#DAE4CF', '#E8EDE2', '#CCD8C0'], ...d('dots', 'outline', 'full', 'none') },
  { id: 'dune', name: 'Dune', free: true, mood: 'light', bg: '#EFE6D8', surface: '#F8F2E8', text: '#2A2015', muted: '#6B5B45', border: '#DDCFB8', accent: '#2A2015', accentText: '#F8F2E8', g: ['#E5D2B5', '#EDE0CC', '#D8C1A0'], ...d('solid', 'solid', 'square', 'none') },
  { id: 'cloud', name: 'Cloud', free: true, mood: 'light', bg: '#F1F3F6', surface: '#FFFFFF', text: '#111827', muted: '#545D6C', border: '#DDE2E9', accent: '#0369A1', accentText: '#FFFFFF', g: ['#DDE5EF', '#EEF1F6', '#D0DAE7'], ...d('gradient', 'glass', 'rounder', 'soft') },
  { id: 'coral', name: 'Coral', free: true, mood: 'light', bg: '#FFF0EE', surface: '#FFFFFF', text: '#3A1512', muted: '#7F504A', border: '#F8D5D0', accent: '#C02A22', accentText: '#FFFFFF', g: ['#FFD1C9', '#FFE5E1', '#FBC0B6'], ...d('solid', 'solid', 'full', 'soft') },
  { id: 'ink', name: 'Ink', free: true, mood: 'dark', bg: '#0B0B0D', surface: '#17171B', text: '#F4F4F5', muted: '#94949C', border: '#2A2A30', accent: '#FFFFFF', accentText: '#0B0B0D', g: ['#22222A', '#141419', '#2E2E38'], ...d('solid', 'outline', 'full', 'none') },
  { id: 'navy', name: 'Navy', free: true, mood: 'dark', bg: '#0A1628', surface: '#12223A', text: '#EAF1FB', muted: '#94A8C4', border: '#22385A', accent: '#60A5FA', accentText: '#06121F', g: ['#0F2A52', '#1A4280', '#0B1F3D'], ...d('gradient', 'glass', 'rounder', 'none') },
  { id: 'plum', name: 'Plum', free: true, mood: 'dark', bg: '#1A0F24', surface: '#261734', text: '#F5ECFB', muted: '#AE98BE', border: '#3A2550', accent: '#C084FC', accentText: '#1A0F24', g: ['#3B1E5C', '#5E2C80', '#2A1540'], ...d('aura', 'glass', 'full', 'none') },
  { id: 'emerald', name: 'Emerald', free: true, mood: 'dark', bg: '#071C15', surface: '#0F2A20', text: '#E8F7EF', muted: '#8FB8A5', border: '#1C4234', accent: '#34D399', accentText: '#04140E', g: ['#0B3D2C', '#125A40', '#08291E'], ...d('gradient', 'solid', 'rounder', 'soft') },
  { id: 'ember', name: 'Ember', free: true, mood: 'dark', bg: '#1A0B07', surface: '#2A130C', text: '#FFF1EA', muted: '#C79E8C', border: '#4A2416', accent: '#FF7A45', accentText: '#1A0B07', g: ['#4A1A0C', '#7A2A10', '#2E0F07'], ...d('aura', 'solid', 'full', 'soft') },
  { id: 'bordeaux', name: 'Bordeaux', free: true, mood: 'dark', bg: '#1C070D', surface: '#2C0F18', text: '#FCEBEF', muted: '#C595A2', border: '#4B1A28', accent: '#F4A6B8', accentText: '#1C070D', g: ['#4A0F22', '#701733', '#2E0A15'], ...d('solid', 'outline', 'rounder', 'none') },
  { id: 'slate', name: 'Slate', free: true, mood: 'dark', bg: '#1E2329', surface: '#2A3038', text: '#F1F3F5', muted: '#A0A9B4', border: '#3A424C', accent: '#F1F3F5', accentText: '#1E2329', g: ['#2C333C', '#3A434E', '#232930'], ...d('dots', 'solid', 'round', 'soft') },
  { id: 'cobalt', name: 'Cobalt', free: true, mood: 'dark', bg: '#0B1340', surface: '#141D55', text: '#EEF0FF', muted: '#A6AEDC', border: '#26307A', accent: '#FACC15', accentText: '#0B1340', g: ['#1A2A8A', '#2A3FB8', '#101A5C'], ...d('gradient', 'solid', 'full', 'soft') },
  { id: 'abyss', name: 'Abyss', free: true, mood: 'dark', bg: '#041A1E', surface: '#0B2A30', text: '#E6FAFB', muted: '#8EBCC1', border: '#174248', accent: '#2DD4BF', accentText: '#041A1E', g: ['#07404A', '#0B5F6B', '#052A31'], ...d('aura', 'glass', 'rounder', 'none') },
  { id: 'espresso', name: 'Espresso', free: true, mood: 'dark', bg: '#1B1410', surface: '#28201A', text: '#F5EDE4', muted: '#B8A591', border: '#3F3329', accent: '#D4A373', accentText: '#1B1410', g: ['#3A2A1E', '#4E3828', '#2A1F17'], ...d('solid', 'solid', 'round', 'soft') },
  { id: 'signal', name: 'Signal', free: true, mood: 'dark', bg: '#0A0A0A', surface: '#151515', text: '#F5F5F5', muted: '#8F8F8F', border: '#2A2A2A', accent: '#FF6B2C', accentText: '#0A0A0A', g: ['#2A1206', '#4A220C', '#1A0B04'], ...d('dots', 'outline', 'square', 'none') },
  { id: 'magenta', name: 'Magenta', free: true, mood: 'dark', bg: '#1F0820', surface: '#2E0F30', text: '#FFEFFC', muted: '#D09DCA', border: '#4F1D52', accent: '#FF5CA8', accentText: '#1F0820', g: ['#5E0F5A', '#9A1F6B', '#3A0B3E'], ...d('aura', 'glass', 'full', 'soft') },
];

export const THEMES: ThemePreset[] = [...SIGNATURE, ...PALETTES];
const BY_ID = new Map(THEMES.map((t) => [t.id, t]));
export const getPreset = (id?: string) => (id && BY_ID.get(id)) || THEMES[0];

export const WALLPAPERS: Record<Wallpaper, { name: string; pro?: boolean }> = {
  solid: { name: 'Solid' },
  gradient: { name: 'Gradient' },
  aura: { name: 'Aura' },
  dots: { name: 'Dots' },
  blur: { name: 'Blur', pro: true },
  image: { name: 'Image', pro: true },
  video: { name: 'Video', pro: true },
};
export const BUTTON_STYLES: Record<BtnStyle, string> = { solid: 'Solid', glass: 'Glass', outline: 'Outline' };
export const RADII: Record<Radius, string> = { square: '4px', round: '10px', rounder: '18px', full: '999px' };
export const SHADOWS: Record<Shadow, { name: string; pro?: boolean }> = {
  none: { name: 'None' },
  soft: { name: 'Soft' },
  strong: { name: 'Strong', pro: true },
  hard: { name: 'Hard', pro: true },
};

export const FONTS: Record<FontId, { name: string; group: 'Clean' | 'Unique'; css: string; heading: string; upper?: boolean; scale?: number }> = {
  inter: { name: 'Clean', group: 'Clean', css: 'var(--font-inter), system-ui, sans-serif', heading: 'var(--font-inter), system-ui, sans-serif' },
  grotesk: { name: 'Modern', group: 'Clean', css: 'var(--font-grotesk), system-ui, sans-serif', heading: 'var(--font-grotesk), system-ui, sans-serif' },
  friendly: { name: 'Friendly', group: 'Clean', css: 'var(--font-nunito), system-ui, sans-serif', heading: 'var(--font-nunito), system-ui, sans-serif' },
  mono: { name: 'Tech', group: 'Clean', css: 'var(--font-mono), ui-monospace, monospace', heading: 'var(--font-mono), ui-monospace, monospace' },
  serif: { name: 'Elegant', group: 'Unique', css: 'var(--font-inter), system-ui, sans-serif', heading: 'var(--font-serif), Georgia, serif' },
  editorial: { name: 'Editorial', group: 'Unique', css: 'var(--font-fraunces), Georgia, serif', heading: 'var(--font-fraunces), Georgia, serif' },
  display: { name: 'Bold', group: 'Unique', css: 'var(--font-anton), Impact, sans-serif', heading: 'var(--font-anton), Impact, sans-serif', upper: true },
  script: { name: 'Handwritten', group: 'Unique', css: 'var(--font-caveat), cursive', heading: 'var(--font-caveat), cursive', scale: 1.35 },
};
// Display-only fonts are fine for a title but tiring for a whole page; body text falls back to Clean.
const BODY_SAFE: Partial<Record<FontId, FontId>> = { display: 'inter', script: 'inter' };

const LEGACY_SHAPE: Record<string, Radius> = { rounded: 'rounder', pill: 'full', square: 'square' };
const HEX = /^#[0-9a-fA-F]{6}$/;
const hex = (v?: string) => (v && HEX.test(v) ? v : undefined);

function wallpaperCss(w: Wallpaper, p: Pick<ThemePreset, 'mood' | 'bg' | 'g' | 'accent'>) {
  const dark = p.mood === 'dark';
  switch (w) {
    case 'gradient':
      return `linear-gradient(160deg, ${p.g[0]} 0%, ${p.g[1]} 55%, ${p.g[2]} 100%)`;
    case 'aura':
      return [
        `radial-gradient(60% 45% at 15% 8%, ${p.g[1]} 0%, transparent 70%)`,
        `radial-gradient(55% 40% at 90% 30%, ${p.g[2]} 0%, transparent 70%)`,
        HEX.test(p.accent) ? `radial-gradient(70% 50% at 50% 100%, ${p.accent}${dark ? '30' : '24'} 0%, transparent 70%)` : '',
        p.bg,
      ].filter(Boolean).join(', ');
    case 'dots':
      return `radial-gradient(${dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1.4px) 0 0 / 16px 16px, linear-gradient(180deg, ${p.bg} 0%, ${p.g[0]} 100%)`;
    default:
      return p.bg;
  }
}

function shadowCss(s: Shadow, dark: boolean, color: string) {
  if (s === 'soft') return dark ? '0 4px 14px rgba(0,0,0,0.35)' : '0 4px 14px rgba(0,0,0,0.10)';
  if (s === 'strong') return dark ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.22)';
  if (s === 'hard') return `4px 4px 0 ${color}`;
  return undefined;
}

type Colors = { mood: 'light' | 'dark'; text: string; surface: string; border: string };

function buttonCss(style: BtnStyle, shadow: Shadow, c: Colors, color?: string, textColor?: string): CSSProperties {
  const dark = c.mood === 'dark';
  let s: CSSProperties;
  if (style === 'outline') {
    s = { background: 'transparent', color: textColor ?? color ?? c.text, border: `1.5px solid ${color ?? c.text}` };
  } else if (style === 'glass') {
    s = {
      background: color ? `${color}40` : dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)',
      color: textColor ?? c.text,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.75)'}`,
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
    };
  } else {
    s = {
      background: color ?? c.surface,
      color: textColor ?? (color ? readableOn(color) : c.text),
      border: `1px solid ${color ?? c.border}`,
    };
  }
  if (shadow === 'hard') s.border = `2px solid ${c.text}`;
  s.boxShadow = shadowCss(shadow, dark, c.text);
  return s;
}

// What the page actually shows for a saved theme on a given plan. Paid-only choices fall back
// quietly on a lower plan, so a downgrade never deletes the owner's settings.
export function resolveTheme(theme: CardTheme, plan: Plan, avatarUrl?: string | null) {
  let p = getPreset(theme.preset);
  if (!p.free && !can(plan, 'allThemes')) p = THEMES[0];

  // Wallpaper
  let wallpaper: Wallpaper = theme.wallpaper && WALLPAPERS[theme.wallpaper] ? theme.wallpaper : p.wallpaper;
  const media =
    wallpaper === 'image' ? theme.wallpaperImage : wallpaper === 'video' ? theme.wallpaperVideo : wallpaper === 'blur' ? avatarUrl ?? undefined : undefined;
  const allowed = WALLPAPERS[wallpaper].pro ? can(plan, 'mediaWallpaper') && !!media : true;
  if (!allowed) wallpaper = p.wallpaper;

  // A custom wallpaper color re-derives the whole page palette so text stays readable.
  const bgColor = hex(theme.bgColor);
  let base: Pick<ThemePreset, 'mood' | 'bg' | 'g' | 'accent' | 'surface' | 'border' | 'text' | 'muted'> = p;
  if (bgColor) {
    const dark = luminance(bgColor) < 0.5;
    base = {
      mood: dark ? 'dark' : 'light',
      bg: bgColor,
      g: dark ? [shade(bgColor, 0.12), shade(bgColor, 0.24), shade(bgColor, -0.25)] : [shade(bgColor, -0.07), shade(bgColor, 0.4), shade(bgColor, -0.13)],
      accent: p.accent,
      surface: dark ? shade(bgColor, 0.09) : shade(bgColor, 0.75),
      border: dark ? shade(bgColor, 0.18) : shade(bgColor, -0.12),
      text: dark ? '#F5F5F6' : '#16161A',
      muted: dark ? 'rgba(245,245,246,0.68)' : 'rgba(22,22,26,0.66)',
    };
  }
  const mood = base.mood;
  const background = wallpaper === p.wallpaper && p.css && !bgColor ? p.css : wallpaperCss(wallpaper, base);
  const tint = mood === 'dark' ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.42)';

  // Text
  const textColor = hex(theme.textColor);
  const text = textColor ?? base.text;
  const muted = textColor ? `${textColor}B8` : base.muted;
  const titleColor = hex(theme.titleColor) ?? text;
  const fontId: FontId = theme.font && FONTS[theme.font] ? theme.font : 'inter';
  const titleFontId: FontId = theme.titleFont && FONTS[theme.titleFont] ? theme.titleFont : fontId;
  const font = FONTS[BODY_SAFE[fontId] ?? fontId];
  const titleFont = FONTS[titleFontId];

  // Header
  const hero = theme.header === 'hero' && can(plan, 'heroHeader') && !!avatarUrl;
  const logo = can(plan, 'logoTitle') ? theme.logo || undefined : undefined;
  const titleSize = (theme.titleSize === 'large' ? 34 : 26) * (titleFont.scale ?? 1);

  // Buttons
  const style: BtnStyle = theme.button && BUTTON_STYLES[theme.button] ? theme.button : p.button;
  const radiusId: Radius = (theme.radius && RADII[theme.radius] ? theme.radius : theme.shape && LEGACY_SHAPE[theme.shape]) || p.radius;
  let shadow: Shadow = theme.shadow && SHADOWS[theme.shadow] ? theme.shadow : p.shadow;
  if (SHADOWS[shadow].pro && !can(plan, 'boldShadows')) shadow = 'soft';
  const colors: Colors = { mood, text, surface: base.surface, border: base.border };
  const button = buttonCss(style, shadow, colors, hex(theme.buttonColor), hex(theme.buttonText));
  // Boxes (review, coupon, contact form) hold accent-colored text, so they ignore the custom button color.
  const box = buttonCss(style, shadow, colors);
  const accent = hex(theme.accent) ?? base.accent;
  const accentText = hex(theme.accent) ? readableOn(accent) : p.accentText;

  return {
    id: p.id, mood, background, base: base.bg, tint, wallpaper, media: allowed ? media : undefined,
    text, muted, titleColor, border: base.border, surface: base.surface,
    font, titleFont, titleSize, hero, logo,
    style, shadow, radius: RADII[radiusId], radiusId, button, box,
    accent, accentText,
  };
}

export type ResolvedTheme = ReturnType<typeof resolveTheme>;

function luminance(h: string) {
  const n = parseInt(h.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}

export function readableOn(h: string) {
  return luminance(h) > 0.6 ? '#111111' : '#FFFFFF';
}

// Mix toward white (amt > 0) or black (amt < 0).
function shade(h: string, amt: number) {
  const n = parseInt(h.slice(1), 16);
  const to = amt > 0 ? 255 : 0;
  const a = Math.abs(amt);
  const ch = (v: number) => Math.round(v + (to - v) * a).toString(16).padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}
