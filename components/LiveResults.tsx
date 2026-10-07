'use client';

import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LIVE_RESULTS, type LiveResult } from '@/content/liveResults';

interface LiveResultsProps {
  label: string;
  labels: Record<LiveResult['key'], string>;
  locale: string;
}

function format(value: number, kind: LiveResult['format'], locale: string) {
  if (kind === 'compact') {
    return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value) + '+';
  }
  if (kind === 'seconds') return `${Math.round(value)}s`;
  return new Intl.NumberFormat(locale).format(Math.round(value)) + '+';
}

// Counts up once the bar scrolls into view, then keeps creeping up by `tick`.
function Stat({ result, label, locale, index }: { result: LiveResult; label: string; locale: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(result.value);
      return;
    }
    const controls = animate(0, result.value, {
      duration: 1.8,
      delay: index * 0.12,
      ease: [0.25, 0, 0, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [inView, reduceMotion, result.value, index]);

  useEffect(() => {
    if (!inView || reduceMotion || !result.tick) return;
    const id = setInterval(
      () => setValue((v) => (v >= result.value ? v + 1 + Math.floor(Math.random() * result.tick) : v)),
      3500 + index * 700,
    );
    return () => clearInterval(id);
  }, [inView, reduceMotion, result.tick, result.value, index]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-2">
      <div className="font-display text-4xl sm:text-5xl tracking-tight text-brand-white tabular-nums">
        {format(value, result.format, locale)}
      </div>
      <p className="mt-1.5 max-w-[12rem] text-xs uppercase tracking-widest text-brand-light1 leading-snug">{label}</p>
    </div>
  );
}

export default function LiveResults({ label, labels, locale }: LiveResultsProps) {
  return (
    <div className="bg-brand-near-black border-t border-brand-dark2 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-light2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {label}
        </div>
        <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-brand-dark2">
          {LIVE_RESULTS.map((r, i) => (
            <Stat key={r.key} result={r} label={labels[r.key]} locale={locale} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
