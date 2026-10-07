'use client';

import { motion } from 'framer-motion';
import { Award, Check, Image as ImageIcon, Mail, Sparkles, Video } from 'lucide-react';
import { useRef } from 'react';
import { EASE, useLoop } from './useLoop';

// Academy "What you'll learn": one small moving picture per module.

// AI Foundations: a tiny network with a signal passing through.
function NetworkGlyph() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 3, 700);
  const cols = [[16, 48], [12, 32, 52], [32]];
  const xs = [10, 50, 90];
  return (
    <div ref={ref} className="h-full">
      <svg viewBox="0 0 100 64" className="h-full w-auto" fill="none">
        {cols.slice(0, -1).map((col, c) =>
          col.flatMap((y1, a) =>
            cols[c + 1].map((y2, b) => (
              <line key={`${c}-${a}-${b}`} x1={xs[c]} y1={y1} x2={xs[c + 1]} y2={y2} strokeWidth="1"
                className={step === c ? 'stroke-emerald-400' : 'stroke-brand-dark2'} />
            )),
          ),
        )}
        {cols.map((col, c) =>
          col.map((y, i) => (
            <circle key={`${c}-${i}`} cx={xs[c]} cy={y} r="5"
              className={`transition-colors duration-300 ${step >= c ? 'fill-emerald-400' : 'fill-brand-dark2'}`} />
          )),
        )}
      </svg>
    </div>
  );
}

// Hands-On AI Tools: tool tiles pop up one by one.
function ToolsGlyph() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 4, 650);
  const tools = [Sparkles, ImageIcon, Video];
  return (
    <div ref={ref} className="flex h-full items-center gap-2">
      {tools.map((Icon, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ y: step > i ? 0 : 8, opacity: step > i ? 1 : 0.25 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="flex h-10 w-10 items-center justify-center border border-brand-dark2 bg-brand-near-black text-brand-light2"
        >
          <Icon size={17} />
        </motion.span>
      ))}
    </div>
  );
}

// Prompt Engineering: a prompt types itself, then a clean answer appears.
function PromptGlyph() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 5, 600);
  return (
    <div ref={ref} className="flex h-full w-40 flex-col justify-center gap-2 font-mono text-[11px]">
      <div className="flex items-center gap-1.5 text-brand-light1">
        <span className="text-emerald-500">&gt;</span>
        <motion.span
          initial={false}
          animate={{ width: `${Math.min(step, 2) * 50}%` }}
          transition={{ duration: 0.5, ease: EASE }}
          className="h-2 rounded bg-brand-mid/60"
        />
        <motion.span className="h-3 w-px bg-brand-white" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
      </div>
      {[80, 60].map((w, i) => (
        <motion.span
          key={w}
          initial={false}
          animate={{ width: step >= 3 + i ? `${w}%` : '0%' }}
          transition={{ duration: 0.4, ease: EASE }}
          className="block h-2 rounded bg-emerald-400/60"
        />
      ))}
    </div>
  );
}

// AI Content at Scale: one post multiplies into many.
function ScaleGlyph() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 4, 650);
  const counts = [1, 3, 6, 6];
  return (
    <div ref={ref} className="grid h-full w-28 grid-cols-3 content-center gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ opacity: i < counts[step] ? 1 : 0.15, scale: i < counts[step] ? 1 : 0.8 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="flex h-7 items-center justify-center bg-brand-dark2 text-brand-light1"
        >
          {i % 3 === 0 ? <Video size={11} /> : <Mail size={11} />}
        </motion.span>
      ))}
    </div>
  );
}

// Analytics: bars rise to their values.
function BarsGlyph() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 3, 1000);
  const bars = [35, 55, 45, 75, 95];
  return (
    <div ref={ref} className="flex h-full w-28 items-end gap-1.5">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ height: step === 0 ? '10%' : `${h}%` }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
          className={`flex-1 ${i === bars.length - 1 ? 'bg-emerald-400' : 'bg-brand-mid/50'}`}
        />
      ))}
    </div>
  );
}

// Certification Project: the badge gets its check mark.
function BadgeGlyph() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 3, 1000);
  return (
    <div ref={ref} className="relative flex h-full w-16 items-center">
      <motion.span
        initial={false}
        animate={{ rotate: step === 1 ? [0, -8, 8, 0] : 0 }}
        transition={{ duration: 0.5 }}
        className="text-brand-light2"
      >
        <Award size={44} strokeWidth={1.5} />
      </motion.span>
      <motion.span
        initial={false}
        animate={{ scale: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 18 }}
        className="absolute right-0 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-white"
      >
        <Check size={12} strokeWidth={3} />
      </motion.span>
    </div>
  );
}

const GLYPHS = [NetworkGlyph, ToolsGlyph, PromptGlyph, ScaleGlyph, BarsGlyph, BadgeGlyph];

export default function ModuleGlyph({ index }: { index: number }) {
  const Glyph = GLYPHS[index % GLYPHS.length];
  return (
    <div aria-hidden="true" className="h-16 select-none">
      <Glyph />
    </div>
  );
}
