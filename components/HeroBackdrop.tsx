'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// Back layer of the hero: large, blurred, faint product shapes that sit behind the
// headline and give the background depth. Mostly bars and shapes, not words, so it
// reads as texture and needs no translation. The readable cards are HeroCards.

interface GhostProps {
  children: ReactNode;
  className: string;
  delay: number;
  drift: number;
}

function Ghost({ children, className, delay, drift }: GhostProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay, ease: [0.25, 0, 0, 1] }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{ duration: drift, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-3xl border border-brand-dark2 bg-brand-dark1 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Bar({ className }: { className: string }) {
  return <div className={`h-2.5 rounded-full bg-brand-dark2 ${className}`} />;
}

export default function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none blur-[3px] opacity-90 sm:opacity-80 [[data-site-theme=light]_&]:opacity-70 sm:[[data-site-theme=light]_&]:opacity-75"
    >
      {/* Phone with a text conversation, right of center */}
      <Ghost className="top-[18%] right-[-14%] sm:right-[6%] lg:right-[16%] rotate-[8deg]" delay={0.3} drift={14}>
        <div className="w-[230px] h-[460px] p-4 flex flex-col">
          <div className="mx-auto h-1.5 w-16 rounded-full bg-brand-dark2" />
          <div className="mt-6 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-dark2" />
            <Bar className="w-24" />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <div className="self-start rounded-2xl rounded-bl-sm bg-brand-dark2 px-3 py-2.5 w-40"><Bar className="w-full bg-brand-mid/40" /></div>
            <div className="self-end rounded-2xl rounded-br-sm bg-brand-mid/40 px-3 py-2.5 w-44 space-y-2"><Bar className="w-full bg-brand-light1/40" /><Bar className="w-2/3 bg-brand-light1/40" /></div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-brand-dark2 px-3 py-2.5 w-32"><Bar className="w-full bg-brand-mid/40" /></div>
            <div className="self-end rounded-2xl rounded-br-sm bg-brand-mid/40 px-3 py-2.5 w-36"><Bar className="w-full bg-brand-light1/40" /></div>
          </div>
          <div className="mt-auto h-9 rounded-full border border-brand-dark2" />
        </div>
      </Ghost>

      {/* Big leads chart, left of center behind the headline */}
      <Ghost className="top-[30%] left-[-30%] sm:left-[2%] lg:left-[12%] -rotate-[6deg]" delay={0.5} drift={16}>
        <div className="w-[440px] p-6">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Bar className="w-24" />
              <div className="h-7 w-28 rounded-lg bg-brand-mid/40" />
            </div>
            <div className="h-6 w-16 rounded-full bg-emerald-400/30" />
          </div>
          <div className="mt-6 flex h-36 items-end gap-3">
            {[30, 42, 38, 55, 50, 68, 74, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-brand-mid/40" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </Ghost>

      {/* Calendar, lower left */}
      <Ghost className="hidden sm:block bottom-[-6%] left-[18%] lg:left-[26%] rotate-[4deg]" delay={0.8} drift={18}>
        <div className="w-[300px] p-5">
          <Bar className="w-28" />
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md ${[9, 12, 16, 19, 23].includes(i) ? 'bg-brand-mid/60' : 'bg-brand-dark2'}`}
              />
            ))}
          </div>
        </div>
      </Ghost>

      {/* Inbox of new leads, upper center */}
      <Ghost className="hidden md:block top-[11%] left-[38%] -rotate-[3deg]" delay={1.0} drift={15}>
        <div className="w-[340px] p-5 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-brand-dark2" />
              <div className="flex-1 space-y-2">
                <Bar className="w-1/2" />
                <Bar className="w-5/6 bg-brand-dark2/70" />
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400/60" />
            </div>
          ))}
        </div>
      </Ghost>

      {/* Review card, lower right */}
      <Ghost className="bottom-[4%] right-[-10%] sm:right-[10%] lg:right-[22%] -rotate-[5deg]" delay={1.2} drift={17}>
        <div className="w-[280px] p-5">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded-sm bg-brand-mid/60" />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <Bar className="w-full" />
            <Bar className="w-4/5" />
            <Bar className="w-2/5" />
          </div>
        </div>
      </Ghost>
    </div>
  );
}
