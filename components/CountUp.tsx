'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Counts the number inside a stat like "+312%" up from zero when it scrolls
// into view, keeping whatever comes before and after the number.
export default function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();
  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, '')) : NaN;
  const [shown, setShown] = useState<number | null>(null);

  // The server renders the real value; once hydrated, reset to zero off screen.
  useEffect(() => {
    if (!reduceMotion && !Number.isNaN(target)) setShown((s) => (s === null ? 0 : s));
  }, [reduceMotion, target]);

  useEffect(() => {
    if (!inView || reduceMotion || Number.isNaN(target)) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.25, 0, 0, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target]);

  const text = match && shown !== null ? `${match[1]}${shown.toLocaleString('en-US')}${match[3]}` : value;
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {text}
    </span>
  );
}
