'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface StatBlockProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export default function StatBlock({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2,
}: StatBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const controls = animate(count, value, { duration, ease: 'easeOut' });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, duration, started, value]);

  useEffect(() => {
    return count.on('change', (v) => setDisplayValue(Math.round(v)));
  }, [count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <div className="font-display text-5xl lg:text-6xl text-brand-white tracking-tight">
        {prefix}{displayValue}{suffix}
      </div>
      <p className="mt-2 text-brand-light1 text-sm uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}
