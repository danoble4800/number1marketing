'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck, CreditCard, DollarSign, FileText, Megaphone, Package, ShoppingCart, Smartphone, Star, Video,
  type LucideIcon,
} from 'lucide-react';
import { useRef } from 'react';
import { EASE, pop, useLoop } from './useLoop';

// Icons are passed by name so server pages can pick them.
const ICONS: Record<string, LucideIcon> = {
  application: FileText,
  approved: BadgeCheck,
  paid: DollarSign,
  plan: CreditCard,
  campaign: Megaphone,
  videos: Video,
  order: ShoppingCart,
  test: Smartphone,
  ship: Package,
  review: Star,
};

type Step = { title: string; desc: string };

// A "how it works" list with a strip above it: the steps light up one after
// another, a dot travels along the line and each step shows what just happened.
export default function StepFlow({
  steps,
  icons,
  toasts,
  title,
  layout = 'list',
}: {
  steps: Step[];
  icons: string[];
  toasts: string[];
  title?: string;
  layout?: 'list' | 'cards';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const tick = useLoop(ref, n + 1, 1700);
  const active = Math.min(tick, n - 1);
  const progress = n > 1 ? active / (n - 1) : 1;

  const strip = (
    <div aria-hidden="true" className="mb-8 select-none border border-brand-dark2 bg-brand-dark1 px-6 pb-5 pt-6">
      <div className="relative flex items-center justify-between">
        <span className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-brand-dark2" />
        <motion.span
          className="absolute left-5 top-1/2 h-px -translate-y-1/2 bg-emerald-400"
          initial={false}
          animate={{ width: `calc((100% - 2.5rem) * ${progress})` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        {icons.map((name, i) => {
          const Icon = ICONS[name] ?? FileText;
          const lit = i <= active;
          return (
            <motion.span
              key={name}
              initial={false}
              animate={{ scale: i === active ? 1.12 : 1 }}
              transition={{ duration: 0.3 }}
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
                lit ? 'border-emerald-400 bg-brand-near-black text-emerald-500' : 'border-brand-dark2 bg-brand-near-black text-brand-mid'
              }`}
            >
              <Icon size={17} />
            </motion.span>
          );
        })}
      </div>
      <div className="mt-4 flex h-7 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            {...pop}
            className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-500"
          >
            {toasts[active]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      {title && <h3 className="font-display text-xl text-brand-white uppercase tracking-tight mb-6">{title}</h3>}
      {strip}
      {layout === 'list' ? (
        <ol className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <span className={`font-display text-3xl leading-none transition-colors duration-300 ${i === active ? 'text-emerald-500' : 'text-brand-dark2'}`}>
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-brand-white">{step.title}</p>
                <p className="mt-1 text-sm text-brand-light1 leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`border p-6 transition-colors duration-300 ${i === active ? 'border-brand-light1' : 'border-brand-dark2'}`}
            >
              <div className={`font-display text-5xl transition-colors duration-300 ${i === active ? 'text-emerald-500' : 'text-brand-dark2'}`}>
                0{i + 1}
              </div>
              <p className="mt-4 text-brand-offwhite font-semibold">{step.title}</p>
              <p className="mt-2 text-brand-light1 text-sm leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
