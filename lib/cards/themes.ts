import type { CardTheme, Plan } from './types';
import { can } from './plans';

export type ThemePreset = {
  id: string;
  name: string;
  free: boolean;
  background: string;
  text: string;
  muted: string;
  button: string;
  buttonText: string;
  border: string;
  accent: string;
  accentText: string;
};

export const THEMES: ThemePreset[] = [
  {
    id: 'midnight', name: 'Midnight', free: true,
    background: '#0E0E10', text: '#F5F5F6', muted: '#8C8C91',
    button: '#1A1A1E', buttonText: '#F5F5F6', border: '#2D2D32',
    accent: '#FFFFFF', accentText: '#0E0E10',
  },
  {
    id: 'paper', name: 'Paper', free: true,
    background: '#F7F6F3', text: '#16161A', muted: '#6B6B70',
    button: '#FFFFFF', buttonText: '#16161A', border: '#E3E1DC',
    accent: '#16161A', accentText: '#FFFFFF',
  },
  {
    id: 'gold', name: 'Black & Gold', free: false,
    background: 'radial-gradient(120% 80% at 50% 0%, #2A2418 0%, #0B0A08 60%)', text: '#F4EBD9', muted: '#A89B80',
    button: 'rgba(255,255,255,0.04)', buttonText: '#F4EBD9', border: '#4A3F2A',
    accent: '#D4AF63', accentText: '#15120B',
  },
  {
    id: 'sunset', name: 'Sunset', free: false,
    background: 'linear-gradient(160deg, #FF7A59 0%, #E8467C 50%, #6B2FBF 100%)', text: '#FFFFFF', muted: 'rgba(255,255,255,0.8)',
    button: 'rgba(255,255,255,0.16)', buttonText: '#FFFFFF', border: 'rgba(255,255,255,0.28)',
    accent: '#FFFFFF', accentText: '#B23669',
  },
  {
    id: 'ocean', name: 'Ocean', free: false,
    background: 'linear-gradient(180deg, #0B2A4A 0%, #0F4C75 55%, #1B7FA6 100%)', text: '#EAF6FF', muted: '#A7C8DE',
    button: 'rgba(255,255,255,0.08)', buttonText: '#EAF6FF', border: 'rgba(255,255,255,0.18)',
    accent: '#5CE1E6', accentText: '#062033',
  },
  {
    id: 'forest', name: 'Forest', free: false,
    background: '#13241C', text: '#EEF3EC', muted: '#9DB3A3',
    button: '#1C3328', buttonText: '#EEF3EC', border: '#2C4A3A',
    accent: '#B8E07A', accentText: '#13241C',
  },
  {
    id: 'blush', name: 'Blush', free: false,
    background: '#FBEFEA', text: '#3A2424', muted: '#8F6F6A',
    button: '#FFFFFF', buttonText: '#3A2424', border: '#F0D6CD',
    accent: '#C8566B', accentText: '#FFFFFF',
  },
  {
    id: 'neon', name: 'Neon', free: false,
    background: '#07070A', text: '#F2F2F7', muted: '#8A8AA0',
    button: '#111118', buttonText: '#F2F2F7', border: '#2A2A3A',
    accent: '#C6FF3D', accentText: '#07070A',
  },
];

export const FONTS = {
  inter: { name: 'Clean', css: 'var(--font-inter), system-ui, sans-serif', heading: 'var(--font-inter), system-ui, sans-serif' },
  grotesk: { name: 'Modern', css: 'var(--font-grotesk), system-ui, sans-serif', heading: 'var(--font-grotesk), system-ui, sans-serif' },
  serif: { name: 'Elegant', css: 'var(--font-inter), system-ui, sans-serif', heading: 'var(--font-serif), Georgia, serif' },
  display: { name: 'Bold', css: 'var(--font-inter), system-ui, sans-serif', heading: 'var(--font-anton), Impact, sans-serif' },
} as const;

export const SHAPES = { rounded: '14px', pill: '999px', square: '4px' } as const;

// Free pages fall back to a free preset and the default style, whatever is saved,
// so a downgrade quietly removes Pro styling without deleting the owner's choices.
export function resolveTheme(theme: CardTheme, plan: Plan) {
  const all = can(plan, 'allThemes');
  const custom = can(plan, 'customStyle');
  let preset = THEMES.find((t) => t.id === theme.preset) ?? THEMES[0];
  if (!preset.free && !all) preset = THEMES[0];
  const accent = custom && theme.accent && /^#[0-9a-fA-F]{6}$/.test(theme.accent) ? theme.accent : preset.accent;
  const accentText = custom && theme.accent ? readableOn(accent) : preset.accentText;
  const font = FONTS[(custom && theme.font) || 'inter'] ?? FONTS.inter;
  const radius = SHAPES[(custom && theme.shape) || 'rounded'] ?? SHAPES.rounded;
  return { ...preset, accent, accentText, font, radius };
}

export type ResolvedTheme = ReturnType<typeof resolveTheme>;

function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#111111' : '#FFFFFF';
}
