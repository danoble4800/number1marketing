'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Lock, Mail, MessageSquare, Phone, Star, UserPlus } from 'lucide-react';
import { useRef } from 'react';
import { EASE, useLoop } from './useLoop';

export interface RingingCopy {
  now: string;
  items: { title: string; detail: string }[];
}

const NOTE_ICONS = [Phone, MessageSquare, Star, UserPlus];

// About hero: a phone that keeps lighting up with calls, texts, reviews and leads.
export function RingingPhoneArt({ copy }: { copy: RingingCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = copy.items.length;
  const step = useLoop(ref, count + 2, 1100);
  const shown = copy.items.slice(0, Math.min(step, count)).map((item, i) => ({ ...item, i })).reverse();

  return (
    <div ref={ref} aria-hidden="true" className="mx-auto w-full max-w-[290px] select-none">
      <div className="relative h-[460px] rounded-[38px] border-[5px] border-brand-light1/70 bg-brand-dark1 p-4 shadow-2xl">
        <div className="mx-auto mb-6 h-5 w-24 rounded-full bg-brand-near-black" />
        <div className="mb-5 text-center">
          <div className="font-display text-5xl leading-none text-brand-white">9:41</div>
          <div className="mt-1 text-xs text-brand-mid">{copy.now}</div>
        </div>
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {shown.map(({ title, detail, i }) => {
              const Icon = NOTE_ICONS[i % NOTE_ICONS.length];
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: -14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex items-center gap-3 rounded-2xl border border-brand-dark2 bg-brand-near-black/80 px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-500">
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-brand-white">{title}</span>
                    <span className="block truncate text-[11px] text-brand-light1">{detail}</span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <motion.span
          className="absolute -right-3 top-16 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-white shadow-lg"
          animate={{ rotate: [0, -14, 14, -10, 10, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1.2 }}
        >
          <Phone size={18} />
        </motion.span>
      </div>
    </div>
  );
}

// "Why we're different" column headers: locked-in contract, everything
// connected, and a pile of apps that don't talk to each other.
function ContractArt() {
  return (
    <div className="relative mx-auto h-full w-20">
      <div className="absolute inset-y-1 left-1 right-5 space-y-1.5 border border-brand-dark2 bg-brand-near-black p-2">
        {[90, 70, 85, 60, 75].map((w, i) => <span key={i} className="block h-1 rounded bg-brand-dark2" style={{ width: `${w}%` }} />)}
      </div>
      <motion.span
        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark2 bg-brand-dark1 text-brand-mid"
        animate={{ rotate: [0, -10, 10, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.8 }}
      >
        <Lock size={16} />
      </motion.span>
    </div>
  );
}

function ConnectedArt() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 4, 700);
  const nodes = [
    { x: 20, y: 40, Icon: Phone },
    { x: 60, y: 14, Icon: Calendar },
    { x: 100, y: 40, Icon: Mail },
    { x: 60, y: 66, Icon: Star },
  ];
  return (
    <div ref={ref} className="relative mx-auto h-full w-[120px]">
      <svg viewBox="0 0 120 80" className="absolute inset-0 h-full w-full" fill="none">
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <motion.line
              key={i}
              x1={n.x} y1={n.y} x2={next.x} y2={next.y}
              strokeWidth="1.5"
              initial={false}
              animate={{ opacity: step === i ? 1 : 0.35 }}
              className={step === i ? 'stroke-emerald-400' : 'stroke-brand-mid'}
            />
          );
        })}
      </svg>
      {nodes.map(({ x, y, Icon }, i) => (
        <span
          key={i}
          className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-brand-near-black transition-colors duration-300 ${
            step === i || step === (i + 3) % 4 ? 'border-emerald-400 text-emerald-500' : 'border-brand-dark2 text-brand-light1'
          }`}
          style={{ left: `${(x / 120) * 100}%`, top: `${(y / 80) * 100}%` }}
        >
          <Icon size={13} />
        </span>
      ))}
    </div>
  );
}

function AppPileArt() {
  const tiles = [
    { x: 4, y: 30, r: -12 }, { x: 34, y: 6, r: 8 }, { x: 62, y: 34, r: -4 },
    { x: 18, y: 54, r: 16 }, { x: 70, y: 2, r: -18 }, { x: 48, y: 58, r: 6 },
  ];
  return (
    <div className="relative mx-auto h-full w-24">
      {tiles.map((t, i) => (
        <motion.span
          key={i}
          className="absolute h-7 w-7 rounded-md border border-brand-dark2 bg-brand-dark2/70"
          style={{ left: t.x, top: t.y }}
          animate={{ rotate: [t.r, t.r + 6, t.r - 6, t.r] }}
          transition={{ duration: 2 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function DifferentArt({ index }: { index: number }) {
  const Art = [ContractArt, ConnectedArt, AppPileArt][index] ?? ContractArt;
  return (
    <div aria-hidden="true" className="mb-6 h-20 select-none">
      <Art />
    </div>
  );
}

