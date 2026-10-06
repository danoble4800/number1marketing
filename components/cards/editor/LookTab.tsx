'use client';

import { Check, ChevronRight, Lock } from 'lucide-react';
import type { CardPage, CardTheme } from '@/lib/cards/types';
import { FONTS, SHAPES, THEMES } from '@/lib/cards/themes';
import { can } from '@/lib/cards/plans';
import { PlanBadge, Section, Toggle, jumpTo } from './ui';

type Props = { page: CardPage; set: (patch: Partial<CardPage>) => void; onUpgrade: () => void };

const ACCENTS = ['#FFFFFF', '#D4AF63', '#FF6B4A', '#E8467C', '#7C5CFF', '#2F80ED', '#5CE1E6', '#27AE60', '#C6FF3D', '#111111'];
// Sub-settings are #hash targets too; the padding gives jumpTo's outline some room.
const anchor = 'scroll-mt-32 -m-2 p-2';

export default function LookTab({ page, set, onUpgrade }: Props) {
  const theme = page.theme ?? {};
  const setTheme = (patch: Partial<CardTheme>) => set({ theme: { ...theme, ...patch } });
  const allThemes = can(page.plan, 'allThemes');
  const custom = can(page.plan, 'customStyle');
  const active = THEMES.find((t) => t.id === (theme.preset ?? 'midnight')) ?? THEMES[0];

  // What each setting is right now, as the page actually renders it (Free ignores Style overrides).
  const summary: { id: string; label: string; value: React.ReactNode; locked?: boolean }[] = [
    { id: 'theme', label: 'Theme', value: active.name },
    {
      id: 'accent',
      label: 'Accent color',
      locked: !custom,
      value: custom && theme.accent ? (
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-brand-dark2" style={{ background: theme.accent }} />
          {theme.accent.toUpperCase()}
        </span>
      ) : 'Theme default',
    },
    { id: 'shape', label: 'Buttons', locked: !custom, value: <span className="capitalize">{(custom && theme.shape) || 'rounded'}</span> },
    { id: 'font', label: 'Font', locked: !custom, value: FONTS[(custom && theme.font) || 'inter'].name },
    { id: 'branding', label: 'N°1 badge', value: page.hide_badge && can(page.plan, 'hideBadge') ? 'Hidden' : 'Shown' },
  ];

  return (
    <div className="space-y-5">
      <Section title="Your look">
        <div className="-my-2 grid sm:grid-cols-2 sm:gap-x-8">
          {summary.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => jumpTo(r.id)}
              className="group flex items-center justify-between gap-3 border-b border-brand-dark2 py-3 text-left text-sm"
            >
              <span className="flex items-center gap-1.5 text-brand-light1">
                {r.label}
                {r.locked && <Lock size={11} className="text-brand-mid" />}
              </span>
              <span className="flex min-w-0 items-center gap-1 text-brand-white">
                <span className="truncate">{r.value}</span>
                <ChevronRight size={15} className="shrink-0 text-brand-mid transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section id="theme" title="Theme" hint={allThemes ? undefined : 'Free pages get Midnight and Paper. Pro unlocks every theme.'}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((t) => {
            const locked = !t.free && !allThemes;
            const active = (theme.preset ?? 'midnight') === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => (locked ? onUpgrade() : setTheme({ preset: t.id }))}
                className={`group relative overflow-hidden border text-left ${active ? 'border-brand-white' : 'border-brand-dark2 hover:border-brand-mid'}`}
              >
                <div className="flex h-24 flex-col items-center justify-center gap-1.5 p-3" style={{ background: t.background }}>
                  <span className="h-6 w-6 rounded-full" style={{ background: t.accent }} />
                  <span className="h-2.5 w-3/4 rounded" style={{ background: t.button, border: `1px solid ${t.border}` }} />
                  <span className="h-2.5 w-3/4 rounded" style={{ background: t.button, border: `1px solid ${t.border}` }} />
                </div>
                <div className="flex items-center justify-between bg-brand-black px-2.5 py-2 text-xs text-brand-offwhite">
                  {t.name}
                  {active && <Check size={14} />}
                  {locked && <Lock size={12} className="text-brand-mid" />}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section id="style" title="Style" locked={custom ? null : 'pro'} onUpgrade={onUpgrade}>
        <div className="space-y-6">
          <div id="accent" className={anchor}>
            <p className="mb-2 text-[11px] uppercase tracking-widest text-brand-mid">Accent color</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme({ accent: undefined })}
                className={`h-8 rounded-full border px-3 text-xs ${!theme.accent ? 'border-brand-white text-brand-white' : 'border-brand-dark2 text-brand-light1'}`}
              >
                Theme default
              </button>
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-label={a}
                  onClick={() => setTheme({ accent: a })}
                  className={`h-8 w-8 rounded-full border-2 ${theme.accent === a ? 'border-brand-white' : 'border-brand-dark2'}`}
                  style={{ background: a }}
                />
              ))}
              <input
                type="color"
                aria-label="Custom color"
                value={theme.accent ?? '#ffffff'}
                onChange={(e) => setTheme({ accent: e.target.value })}
                className="h-8 w-10 cursor-pointer border border-brand-dark2 bg-transparent"
              />
            </div>
          </div>

          <div id="shape" className={anchor}>
            <p className="mb-2 text-[11px] uppercase tracking-widest text-brand-mid">Buttons</p>
            <div className="flex gap-2">
              {(Object.keys(SHAPES) as (keyof typeof SHAPES)[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTheme({ shape: s })}
                  className={`flex-1 border px-3 py-2.5 text-sm capitalize ${(theme.shape ?? 'rounded') === s ? 'border-brand-white text-brand-white' : 'border-brand-dark2 text-brand-light1'}`}
                  style={{ borderRadius: SHAPES[s] }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div id="font" className={anchor}>
            <p className="mb-2 text-[11px] uppercase tracking-widest text-brand-mid">Font</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(FONTS) as (keyof typeof FONTS)[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTheme({ font: f })}
                  className={`border px-3 py-3 text-center ${(theme.font ?? 'inter') === f ? 'border-brand-white text-brand-white' : 'border-brand-dark2 text-brand-light1'}`}
                >
                  <span className="block text-xl" style={{ fontFamily: FONTS[f].heading, textTransform: f === 'display' ? 'uppercase' : undefined }}>Aa</span>
                  <span className="text-xs">{FONTS[f].name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="branding" title="Branding">
        <div className="space-y-2">
          <Toggle
            label="Hide “Get your own tap card” badge"
            hint="The small N°1 badge at the bottom of your page."
            checked={page.hide_badge}
            disabled={!can(page.plan, 'hideBadge')}
            onChange={(v) => set({ hide_badge: v })}
          />
          {!can(page.plan, 'hideBadge') && (
            <button type="button" onClick={onUpgrade} className="flex items-center gap-2 text-xs text-brand-white underline">
              Remove with <PlanBadge plan="pro" />
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}
