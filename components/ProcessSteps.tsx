'use client';

import { motion } from 'framer-motion';
import { Check, Search, UserRound } from 'lucide-react';
import { useRef } from 'react';
import { EASE, useLoop } from './illustrations/useLoop';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps: Step[];
}

// LOOK: a magnifier sweeps over incoming customers and spots the ones slipping away.
function LookArt() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 4, 900);
  const lost = [1, 4];
  return (
    <div ref={ref} className="relative h-full">
      <div className="grid h-full grid-cols-3 place-items-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => {
          const flagged = step >= 2 && lost.includes(i);
          return (
            <motion.span
              key={i}
              initial={false}
              animate={{ x: flagged ? 10 : 0, opacity: flagged ? 0.9 : 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={flagged ? 'text-rose-400' : 'text-brand-light1'}
            >
              <UserRound size={18} />
            </motion.span>
          );
        })}
      </div>
      <motion.span
        initial={false}
        animate={{ x: ['0%', '220%', '110%', '0%'][step], y: [0, 10, 26, 6][step] }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute left-2 top-1 text-brand-white"
      >
        <Search size={30} strokeWidth={1.75} />
      </motion.span>
    </div>
  );
}

// PLAN: a short to-do list writes itself, most important first.
function PlanArt() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 5, 700);
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-2.5">
      {[78, 60, 70].map((w, i) => {
        const done = step > i;
        return (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300 ${
                done ? 'border-emerald-400 bg-emerald-400/15 text-emerald-500' : 'border-brand-dark2 text-transparent'
              }`}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded bg-brand-dark2">
              <motion.span
                initial={false}
                animate={{ width: done ? `${w}%` : '0%' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="block h-full rounded bg-brand-mid/60"
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

// BUILD: blocks drop in and lock together.
function BuildArt() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 6, 550);
  const blocks = [
    { col: 'col-span-2', row: 'row-start-3' },
    { col: 'col-span-2', row: 'row-start-3' },
    { col: 'col-span-3', row: 'row-start-2' },
    { col: 'col-span-1', row: 'row-start-2' },
    { col: 'col-span-4', row: 'row-start-1' },
  ];
  return (
    <div ref={ref} className="grid h-full grid-cols-4 grid-rows-3 gap-1">
      {blocks.map((b, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ opacity: step > i ? 1 : 0, y: step > i ? 0 : -18 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`${b.col} ${b.row} ${i === blocks.length - 1 ? 'bg-brand-white' : 'bg-brand-mid/50'}`}
        />
      ))}
    </div>
  );
}

// GROW: a line chart draws upward and the latest point pulses.
function GrowArt() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 3, 1400);
  const drawn = step === 0 ? 0.15 : 1;
  return (
    <div ref={ref} className="h-full">
      <svg viewBox="0 0 120 60" className="h-full w-full overflow-visible" fill="none">
        {[15, 30, 45].map((y) => (
          <line key={y} x1="0" x2="120" y1={y} y2={y} className="stroke-brand-dark2" strokeWidth="0.75" />
        ))}
        <motion.path
          d="M2 52 L28 44 L50 47 L74 30 L96 22 L116 6"
          className="stroke-emerald-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: drawn }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <motion.circle
          cx="116"
          cy="6"
          r="3.5"
          className="fill-emerald-400"
          initial={false}
          animate={{ opacity: step === 0 ? 0 : 1, scale: step === 2 ? [1, 1.6, 1] : 1 }}
          transition={{ duration: 0.6 }}
        />
      </svg>
    </div>
  );
}

const ART = [LookArt, PlanArt, BuildArt, GrowArt];

export default function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark2">
      {steps.map((step, i) => {
        const Art = ART[i % ART.length];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-near-black p-8"
          >
            <div aria-hidden="true" className="mb-6 h-20 select-none">
              <Art />
            </div>
            <div className="font-display text-4xl text-brand-dark2 mb-4">{step.number}</div>
            <h3 className="font-display text-xl text-brand-white uppercase tracking-tight mb-3">
              {step.title}
            </h3>
            <p className="text-brand-light1 text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
