'use client';

import { useRef, useState } from 'react';
import { Check, ImagePlus, Lock, Shuffle, Video } from 'lucide-react';
import type { BtnStyle, CardPage, CardTheme, FontId, Radius, Shadow, Wallpaper } from '@/lib/cards/types';
import { BUTTON_STYLES, FONTS, RADII, SHADOWS, THEMES, WALLPAPERS, getPreset, resolveTheme, type ThemePreset } from '@/lib/cards/themes';
import { can, type Feature } from '@/lib/cards/plans';
import { useCropUpload, type CropSpec } from './ImageCropper';
import { getSupabase } from '@/lib/supabase';
import { PlanBadge, Toggle } from './ui';

type Props = {
  page: CardPage;
  set: (patch: Partial<CardPage>) => void;
  onUpgrade: () => void;
  demo: boolean;
  userId: string | null;
};

// One panel open at a time, like Linktree's Design tab.
const SECTIONS = [
  { id: 'theme', name: 'Theme' },
  { id: 'header', name: 'Header' },
  { id: 'wallpaper', name: 'Wallpaper' },
  { id: 'text', name: 'Text' },
  { id: 'buttons', name: 'Buttons' },
  { id: 'branding', name: 'Footer' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

// #hash deep links to a setting open the section that holds it.
const HASH_SECTION: Record<string, SectionId> = { accent: 'buttons', shape: 'buttons', font: 'text' };

const SWATCHES = ['#FFFFFF', '#111111', '#D4AF63', '#FF6B4A', '#E8467C', '#7C5CFF', '#2F80ED', '#5CE1E6', '#27AE60', '#C6FF3D'];
const opt = (on: boolean) =>
  `border text-sm ${on ? 'border-ed-ink text-ed-ink' : 'border-ed-line text-ed-muted hover:border-ed-faint'}`;

export default function LookTab({ page, set, onUpgrade, demo, userId }: Props) {
  const theme = page.theme ?? {};
  const setTheme = (patch: Partial<CardTheme>) => set({ theme: { ...theme, ...patch } });
  const has = (f: Feature) => can(page.plan, f);
  const r = resolveTheme(theme, page.plan, page.avatar_url);
  const preset = getPreset(theme.preset);

  const [open, setOpen] = useState<SectionId>(() => {
    if (typeof window === 'undefined') return 'theme';
    const h = window.location.hash.slice(1);
    return HASH_SECTION[h] ?? (SECTIONS.some((s) => s.id === h) ? (h as SectionId) : 'theme');
  });

  function choose(id: SectionId) {
    setOpen(id);
    history.replaceState(history.state, '', `#${id}`);
  }

  const summary: Record<SectionId, string> = {
    theme: preset.name,
    header: `${r.hero ? 'Hero' : 'Classic'}${r.logo ? ' · Logo' : ''}`,
    wallpaper: WALLPAPERS[r.wallpaper].name,
    text: r.titleFont === r.font ? r.font.name : `${r.font.name} + ${r.titleFont.name}`,
    buttons: `${BUTTON_STYLES[r.style]} · ${r.radiusId}`,
    branding: page.hide_badge && has('hideBadge') ? 'Badge hidden' : 'Badge shown',
  };

  return (
    <div className="rounded-2xl border border-ed-line bg-ed-surface sm:grid sm:grid-cols-[176px_minmax(0,1fr)]">
      <nav className="flex gap-1 overflow-x-auto border-b border-ed-line p-2 [scrollbar-width:none] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => choose(s.id)}
            className={`shrink-0 px-3 py-2 text-left sm:py-2.5 ${open === s.id ? 'bg-ed-field text-ed-ink' : 'text-ed-muted hover:text-ed-ink'}`}
          >
            <span className="block text-sm font-semibold">{s.name}</span>
            <span className="hidden truncate text-[11px] capitalize text-ed-faint sm:block">{summary[s.id]}</span>
          </button>
        ))}
      </nav>

      <section id={open} className="min-w-0 scroll-mt-32 space-y-6 p-5">
        {open === 'theme' && <div><ThemePanel page={page} theme={theme} set={set} onUpgrade={onUpgrade} /></div>}
        {open === 'header' && <HeaderPanel page={page} theme={theme} setTheme={setTheme} has={has} onUpgrade={onUpgrade} demo={demo} userId={userId} />}
        {open === 'wallpaper' && <WallpaperPanel page={page} theme={theme} setTheme={setTheme} has={has} onUpgrade={onUpgrade} demo={demo} userId={userId} />}
        {open === 'text' && <TextPanel theme={theme} setTheme={setTheme} />}
        {open === 'buttons' && <ButtonsPanel theme={theme} setTheme={setTheme} has={has} onUpgrade={onUpgrade} preset={preset} />}
        {open === 'branding' && (
          <div className="space-y-2">
            <Toggle
              label="Hide “Get your own tap card” badge"
              hint="The small N°1 badge at the bottom of your page."
              checked={page.hide_badge}
              disabled={!has('hideBadge')}
              onChange={(v) => set({ hide_badge: v })}
            />
            {!has('hideBadge') && (
              <button type="button" onClick={onUpgrade} className="flex items-center gap-2 text-xs text-ed-ink underline">
                Remove with <PlanBadge plan="pro" />
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

type PanelProps = {
  theme: CardTheme;
  setTheme: (patch: Partial<CardTheme>) => void;
  has: (f: Feature) => boolean;
  onUpgrade: () => void;
};

function Group({ label, id, children, pro }: { label: string; id?: string; children: React.ReactNode; pro?: boolean }) {
  return (
    <div id={id} className="scroll-mt-32">
      <p className="mb-2 flex items-center gap-2 text-[13px] font-medium text-ed-faint">
        {label}
        {pro && <PlanBadge plan="pro" />}
      </p>
      {children}
    </div>
  );
}

// A choice button; locked ones send Free users to the Plan tab.
function Choice({
  on, locked, onClick, onUpgrade, children, className = '', style,
}: {
  on: boolean;
  locked?: boolean;
  onClick: () => void;
  onUpgrade: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button type="button" onClick={locked ? onUpgrade : onClick} className={`relative ${opt(on)} ${className}`} style={style}>
      {children}
      {locked && <Lock size={11} className="absolute right-1.5 top-1.5 text-ed-faint" />}
    </button>
  );
}

function ColorField({ value, onChange, label = 'Theme' }: { value?: string; onChange: (v?: string) => void; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`h-8 rounded-full border px-3 text-xs ${!value ? 'border-ed-ink text-ed-ink' : 'border-ed-line text-ed-muted'}`}
      >
        {label}
      </button>
      {SWATCHES.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          onClick={() => onChange(c)}
          className={`h-8 w-8 rounded-full border-2 ${value?.toUpperCase() === c ? 'border-ed-ink' : 'border-ed-line'}`}
          style={{ background: c }}
        />
      ))}
      <label className="flex h-8 items-center gap-1.5 rounded-xl border border-ed-line bg-ed-field pl-1 pr-2">
        <input type="color" aria-label="Pick any color" value={value ?? '#888888'} onChange={(e) => onChange(e.target.value)} className="h-6 w-6 cursor-pointer bg-transparent" />
        <span className="font-mono text-[11px] text-ed-muted">{value?.toUpperCase() ?? 'Custom'}</span>
      </label>
    </div>
  );
}

// ---------- Theme ----------

function ThemePanel({ page, theme, set, onUpgrade }: { page: CardPage; theme: CardTheme; set: (p: Partial<CardPage>) => void; onUpgrade: () => void }) {
  const [mood, setMood] = useState<'any' | 'light' | 'dark'>('any');
  const all = can(page.plan, 'allThemes');
  const active = theme.preset ?? 'midnight';
  const list = THEMES.filter((t) => mood === 'any' || t.mood === mood);

  // A new theme resets colors, wallpaper style and buttons; header, uploads and fonts stay.
  function pick(t: ThemePreset) {
    if (!t.free && !all) { onUpgrade(); return; }
    const { header, logo, titleSize, titleFont, font, wallpaperImage, wallpaperVideo } = theme;
    set({ theme: { preset: t.id, header, logo, titleSize, titleFont, font, wallpaperImage, wallpaperVideo } });
  }

  // Random theme, font and roundness; header and uploads stay.
  function surprise() {
    const pool = THEMES.filter((t) => (t.free || all) && t.id !== active);
    const one = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
    const { header, logo, titleSize, titleFont, wallpaperImage, wallpaperVideo } = theme;
    set({
      theme: {
        preset: one(pool).id, header, logo, titleSize, titleFont, wallpaperImage, wallpaperVideo,
        font: one(Object.keys(FONTS) as FontId[]),
        radius: one(Object.keys(RADII) as Radius[]),
      },
    });
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {(['any', 'light', 'dark'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`rounded-full border px-3 py-1.5 text-xs ${mood === m ? 'border-ed-ink bg-ed-ink text-ed-field' : 'border-ed-line text-ed-muted'}`}
            >
              {m === 'any' ? 'All' : m === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
        <button type="button" onClick={surprise} className="flex items-center gap-1.5 rounded-full border border-ed-line px-3 py-1.5 text-sm font-medium text-ed-fg hover:border-ed-muted">
          <Shuffle size={13} /> Surprise me
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 xl:grid-cols-6">
        {list.map((t) => {
          const locked = !t.free && !all;
          const on = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => pick(t)}
              className={`overflow-hidden rounded-xl border text-left ${on ? 'border-ed-ink ring-1 ring-ed-ink' : 'border-ed-line hover:border-ed-faint'}`}
            >
              <Thumb id={t.id} />
              <div className="flex items-center justify-between gap-1 bg-ed-field px-2 py-1.5 text-[11px] text-ed-fg">
                <span className="truncate">{t.name}</span>
                {on && <Check size={12} className="shrink-0" />}
                {locked && <Lock size={11} className="shrink-0 text-ed-faint" />}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-ed-faint">Pick a starting point, then make it yours under Header, Wallpaper, Text and Buttons.</p>
    </>
  );
}

// A tiny page preview drawn with the same resolver the real page uses.
function Thumb({ id }: { id: string }) {
  const r = resolveTheme({ preset: id }, 'business');
  const radius = r.radiusId === 'full' ? '999px' : r.radiusId === 'square' ? '2px' : '5px';
  const shadow = r.shadow === 'hard' ? `2px 2px 0 ${r.text}` : r.button.boxShadow ? '0 2px 5px rgba(0,0,0,0.15)' : undefined;
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-1.5 px-3" style={{ background: r.background }}>
      <span className="h-5 w-5 rounded-full" style={{ background: r.accent }} />
      <span className="mb-0.5 h-1.5 w-10 rounded-full" style={{ background: r.titleColor, opacity: 0.85 }} />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-3.5 w-full"
          style={{ background: r.button.background, border: String(r.button.border).replace(/^[\d.]+px/, '1px'), borderRadius: radius, boxShadow: shadow, backdropFilter: r.button.backdropFilter }}
        />
      ))}
    </div>
  );
}

// ---------- Header ----------

function HeaderPanel({ page, theme, setTheme, has, onUpgrade, demo, userId }: PanelProps & { page: CardPage; demo: boolean; userId: string | null }) {
  const heroOk = has('heroHeader');
  const logoOk = has('logoTitle');
  const hero = theme.header === 'hero';
  const [useLogo, setUseLogo] = useState(!!theme.logo);
  return (
    <>
      <Group label="Layout" pro={!heroOk}>
        <div className="grid grid-cols-2 gap-2">
          <Choice on={!hero} onClick={() => setTheme({ header: 'classic' })} onUpgrade={onUpgrade} className="p-3">
            <LayoutIcon hero={false} />
            Classic
          </Choice>
          <Choice on={hero} locked={!heroOk} onClick={() => setTheme({ header: 'hero' })} onUpgrade={onUpgrade} className="p-3">
            <LayoutIcon hero />
            Hero
          </Choice>
        </div>
        {hero && heroOk && !page.avatar_url && (
          <p className="mt-2 text-xs text-ed-warn">Hero uses your profile photo. Add one on the Page tab.</p>
        )}
      </Group>

      <Group label="Title" pro={!logoOk}>
        <div className="grid grid-cols-2 gap-2">
          <Choice on={!useLogo} onClick={() => { setUseLogo(false); setTheme({ logo: undefined }); }} onUpgrade={onUpgrade} className="py-2.5">Text</Choice>
          <Choice on={useLogo} locked={!logoOk} onClick={() => setUseLogo(true)} onUpgrade={onUpgrade} className="py-2.5">Logo</Choice>
        </div>
        {logoOk && useLogo && (
          <div className="mt-3">
            <MediaInput
              kind="logo"
              value={theme.logo}
              onChange={(v) => setTheme({ logo: v })}
              demo={demo}
              userId={userId}
              pageId={page.id}
              hint="PNG with a transparent background looks best. Your name is still read out to screen readers."
            />
          </div>
        )}
      </Group>

      <Group label="Title size">
        <div className="grid grid-cols-2 gap-2">
          {(['small', 'large'] as const).map((s) => (
            <Choice key={s} on={(theme.titleSize ?? 'small') === s} onClick={() => setTheme({ titleSize: s })} onUpgrade={onUpgrade} className="py-2.5 capitalize">
              {s}
            </Choice>
          ))}
        </div>
      </Group>

      {!useLogo && (
        <>
          <Group label="Title font">
            <FontGrid value={theme.titleFont} onChange={(f) => setTheme({ titleFont: f })} defaultLabel="Same as page" />
          </Group>
          <Group label="Title color">
            <ColorField value={theme.titleColor} onChange={(v) => setTheme({ titleColor: v })} label="Same as text" />
          </Group>
        </>
      )}
    </>
  );
}

function LayoutIcon({ hero }: { hero: boolean }) {
  return (
    <span className="mx-auto mb-2 flex h-16 w-11 flex-col items-center gap-1 overflow-hidden rounded rounded-xl border border-ed-line bg-ed-field">
      {hero ? <span className="h-7 w-full bg-ed-faint" /> : <span className="mt-2 h-3.5 w-3.5 rounded-full bg-ed-faint" />}
      <span className="h-1 w-6 rounded bg-ed-muted" />
      <span className="h-1.5 w-8 rounded bg-ed-line" />
      <span className="h-1.5 w-8 rounded bg-ed-line" />
    </span>
  );
}

// ---------- Wallpaper ----------

function WallpaperPanel({ page, theme, setTheme, has, onUpgrade, demo, userId }: PanelProps & { page: CardPage; demo: boolean; userId: string | null }) {
  const pro = has('mediaWallpaper');
  const current = theme.wallpaper ?? getPreset(theme.preset).wallpaper;
  return (
    <>
      <Group label="Wallpaper style">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {(Object.keys(WALLPAPERS) as Wallpaper[]).map((w) => (
            <Choice
              key={w}
              on={current === w}
              locked={WALLPAPERS[w].pro && !pro}
              onClick={() => setTheme({ wallpaper: w })}
              onUpgrade={onUpgrade}
              className="flex flex-col items-center gap-1.5 px-1 py-2 text-xs"
            >
              <WallpaperSwatch w={w} theme={theme} />
              {WALLPAPERS[w].name}
            </Choice>
          ))}
        </div>
        {!pro && <p className="mt-2 text-xs text-ed-faint">Blur, photo and video wallpapers come with <PlanBadge plan="pro" /></p>}
      </Group>

      {current === 'blur' && pro && (
        <p className="text-xs text-ed-muted">{page.avatar_url ? 'Uses a soft blur of your profile photo.' : 'Add a profile photo on the Page tab to use Blur.'}</p>
      )}
      {current === 'image' && pro && (
        <Group label="Your image">
          <MediaInput kind="image" value={theme.wallpaperImage} onChange={(v) => setTheme({ wallpaperImage: v })} demo={demo} userId={userId} pageId={page.id} hint="JPG or PNG up to 10 MB. Tall photos work best." />
        </Group>
      )}
      {current === 'video' && pro && (
        <Group label="Your video">
          <MediaInput kind="video" value={theme.wallpaperVideo} onChange={(v) => setTheme({ wallpaperVideo: v })} demo={demo} userId={userId} pageId={page.id} hint="MP4, MOV or WebM up to 50 MB. Plays on a muted loop." />
        </Group>
      )}

      {!['image', 'video', 'blur'].includes(current) && (
        <Group label="Wallpaper color">
          <ColorField value={theme.bgColor} onChange={(v) => setTheme({ bgColor: v })} />
          <p className="mt-2 text-xs text-ed-faint">Text and buttons adjust automatically so they stay readable.</p>
        </Group>
      )}
    </>
  );
}

function WallpaperSwatch({ w, theme }: { w: Wallpaper; theme: CardTheme }) {
  const icon = w === 'image' ? <ImagePlus size={14} /> : w === 'video' ? <Video size={14} /> : null;
  const r = resolveTheme({ ...theme, wallpaper: w }, 'business', null);
  const bg = icon ? undefined : w === 'blur' ? `radial-gradient(circle at 40% 40%, ${r.accent}, ${r.base})` : r.background;
  return (
    <span className="flex h-10 w-full items-center justify-center rounded-sm border border-ed-line text-ed-muted" style={{ background: bg, filter: w === 'blur' ? 'blur(1.5px)' : undefined }}>
      {icon}
    </span>
  );
}

// ---------- Text ----------

function TextPanel({ theme, setTheme }: Pick<PanelProps, 'theme' | 'setTheme'>) {
  return (
    <>
      <Group label="Page font" id="font">
        <FontGrid value={theme.font} onChange={(f) => setTheme({ font: f })} />
      </Group>
      <Group label="Page text color">
        <ColorField value={theme.textColor} onChange={(v) => setTheme({ textColor: v })} />
        <p className="mt-2 text-xs text-ed-faint">Your bio, headline and social icons. Title and buttons have their own colors.</p>
      </Group>
    </>
  );
}

function FontGrid({ value, onChange, defaultLabel }: { value?: FontId; onChange: (f?: FontId) => void; defaultLabel?: string }) {
  const ids = Object.keys(FONTS) as FontId[];
  return (
    <div className="space-y-3">
      {defaultLabel && (
        <button type="button" onClick={() => onChange(undefined)} className={`w-full px-3 py-2 ${opt(!value)}`}>
          {defaultLabel}
        </button>
      )}
      {(['Clean', 'Unique'] as const).map((g) => (
        <div key={g}>
          <p className="mb-1.5 text-[10px] text-ed-faint">{g}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ids.filter((f) => FONTS[f].group === g).map((f) => (
              <button key={f} type="button" onClick={() => onChange(f)} className={`px-3 py-2.5 text-center ${opt((value ?? (defaultLabel ? undefined : 'inter')) === f)}`}>
                <span className="block" style={{ fontFamily: FONTS[f].heading, textTransform: FONTS[f].upper ? 'uppercase' : undefined, fontSize: 20 * (FONTS[f].scale ?? 1) }}>
                  Aa
                </span>
                <span className="text-xs">{FONTS[f].name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Buttons ----------

function ButtonsPanel({ theme, setTheme, has, onUpgrade, preset }: PanelProps & { preset: ThemePreset }) {
  const style = theme.button ?? preset.button;
  const radius = theme.radius ?? preset.radius;
  const shadow = theme.shadow ?? preset.shadow;
  const bold = has('boldShadows');
  return (
    <>
      <Group label="Button style">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(BUTTON_STYLES) as BtnStyle[]).map((b) => (
            <Choice key={b} on={style === b} onClick={() => setTheme({ button: b })} onUpgrade={onUpgrade} className="py-2.5">
              {BUTTON_STYLES[b]}
            </Choice>
          ))}
        </div>
      </Group>

      <Group label="Corner roundness" id="shape">
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(RADII) as Radius[]).map((k) => (
            <Choice key={k} on={radius === k} onClick={() => setTheme({ radius: k, shape: undefined })} onUpgrade={onUpgrade} className="py-2.5 text-xs capitalize" style={{ borderRadius: k === 'full' ? 999 : RADII[k] }}>
              {k}
            </Choice>
          ))}
        </div>
      </Group>

      <Group label="Shadow">
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(SHADOWS) as Shadow[]).map((k) => (
            <Choice key={k} on={shadow === k} locked={SHADOWS[k].pro && !bold} onClick={() => setTheme({ shadow: k })} onUpgrade={onUpgrade} className="py-2.5 text-xs">
              {SHADOWS[k].name}
            </Choice>
          ))}
        </div>
      </Group>

      <Group label="Button color">
        <ColorField value={theme.buttonColor} onChange={(v) => setTheme({ buttonColor: v })} />
      </Group>
      <Group label="Button text color">
        <ColorField value={theme.buttonText} onChange={(v) => setTheme({ buttonText: v })} label="Auto" />
      </Group>
      <Group label="“Save my contact” button" id="accent">
        <ColorField value={theme.accent} onChange={(v) => setTheme({ accent: v })} />
      </Group>
    </>
  );
}

// ---------- Uploads ----------

const MEDIA = {
  logo: { accept: 'image/*', max: 5, name: 'logo' },
  image: { accept: 'image/*', max: 10, name: 'wallpaper' },
  video: { accept: 'video/mp4,video/quicktime,video/webm', max: 50, name: 'wallpaper-video' },
} as const;

// The logo keeps its own proportions on the page (up to 260 wide), so let people pick the shape.
// Wallpaper fills a phone screen.
const CROP: Record<'logo' | 'image', CropSpec> = {
  logo: {
    shapes: [{ label: 'Original', aspect: 'original' }, { label: 'Square', aspect: 1 }, { label: 'Wide', aspect: 3 }],
    out: 1200,
    range: [0.5, 4.6],
  },
  image: { shapes: [{ label: 'Phone', aspect: 9 / 16 }], out: 1920 },
};

function MediaInput({
  kind, value, onChange, demo, userId, pageId, hint,
}: {
  kind: keyof typeof MEDIA;
  value?: string;
  onChange: (v?: string) => void;
  demo: boolean;
  userId: string | null;
  pageId: string;
  hint: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const m = MEDIA[kind];
  // Images go through the cropper; video uploads as-is.
  const cropped = useCropUpload({ name: m.name, spec: CROP[kind === 'video' ? 'image' : kind], maxMB: m.max, value, onChange, demo, userId, pageId });

  async function pick(file: File) {
    if (kind !== 'video') { cropped.pick(file); return; }
    setErr('');
    if (file.size > m.max * 1024 * 1024) { setErr(`Max ${m.max} MB`); return; }
    if (demo || !userId) { onChange(URL.createObjectURL(file)); return; }
    setBusy(true);
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${userId}/${pageId}/${m.name}-${Date.now()}.${ext}`;
    const supabase = getSupabase();
    const { error } = await supabase.storage.from('card-media').upload(path, file, { contentType: file.type, upsert: true });
    setBusy(false);
    if (error) { setErr('Upload failed. Please try again.'); return; }
    onChange(supabase.storage.from('card-media').getPublicUrl(path).data.publicUrl);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-ed-faint bg-ed-field text-ed-muted hover:border-ed-muted ${kind === 'logo' ? 'h-16 w-40' : 'h-28 w-[63px]'}`}
        >
          {value ? (
            kind === 'video' ? (
              <video src={value} muted loop autoPlay playsInline className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className={`h-full w-full ${kind === 'logo' ? 'object-contain p-2' : 'object-cover'}`} />
            )
          ) : kind === 'video' ? <Video size={20} /> : <ImagePlus size={20} />}
          {(busy || cropped.busy) && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs">Uploading…</span>}
        </button>
        <div className="space-y-1 text-xs">
          {value && kind !== 'video' && <button type="button" onClick={cropped.adjust} className="block text-ed-ink underline">Adjust</button>}
          <button type="button" onClick={() => ref.current?.click()} className={`block underline ${value && kind !== 'video' ? 'text-ed-muted hover:text-ed-ink' : 'text-ed-ink'}`}>{value ? 'Replace' : 'Upload'}</button>
          {value && <button type="button" onClick={() => onChange(undefined)} className="block text-ed-muted underline hover:text-ed-ink">Remove</button>}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-ed-faint">{hint}</p>
      {(err || cropped.err) && <p className="mt-1 text-xs text-ed-err">{err || cropped.err}</p>}
      <input ref={ref} type="file" accept={m.accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) pick(f); }} />
      {cropped.modal}
    </div>
  );
}
