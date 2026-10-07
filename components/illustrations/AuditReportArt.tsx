'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { useRef } from 'react';
import { EASE, pop, useLoop } from './useLoop';

export interface AuditArtCopy {
  title: string;
  scanning: string;
  leaks: string[];
  planTitle: string;
  plan: string[];
}

// /audit: a report scans the business, flags where customers leak away,
// then writes the 90-day plan.
export default function AuditReportArt({ copy }: { copy: AuditArtCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const leaks = copy.leaks.length;
  const total = 2 + leaks + copy.plan.length + 2;
  const step = useLoop(ref, total, 800);
  const planStart = 1 + leaks + 1;

  return (
    <div ref={ref} aria-hidden="true" className="relative mb-8 select-none overflow-hidden border border-brand-dark2 bg-brand-dark1 p-5">
      <div className="flex items-center gap-2.5 border-b border-brand-dark2 pb-3">
        <FileText size={16} className="text-brand-light2" />
        <span className="text-sm font-semibold text-brand-white">{copy.title}</span>
        <AnimatePresence>
          {step === 0 && (
            <motion.span {...pop} className="ml-auto text-[11px] uppercase tracking-widest text-brand-mid">
              {copy.scanning}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {step === 0 && (
        <motion.span
          className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-emerald-400/15 to-transparent"
          initial={{ top: 40 }}
          animate={{ top: 220 }}
          transition={{ duration: 0.8, ease: 'linear' }}
        />
      )}

      <ul className="mt-3 min-h-[84px] space-y-2">
        {copy.leaks.map((leak, i) =>
          step > i ? (
            <motion.li key={leak} {...pop} className="flex items-center gap-2.5 text-sm text-brand-light2">
              <AlertTriangle size={14} className="shrink-0 text-rose-400" />
              {leak}
            </motion.li>
          ) : null,
        )}
      </ul>

      <div className="mt-4 border-t border-brand-dark2 pt-3">
        <motion.p
          initial={false}
          animate={{ opacity: step >= planStart - 1 ? 1 : 0.3 }}
          className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-brand-mid"
        >
          {copy.planTitle}
        </motion.p>
        <ul className="space-y-2">
          {copy.plan.map((item, i) => {
            const done = step >= planStart + i;
            return (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300 ${
                    done ? 'border-emerald-400 bg-emerald-400/15 text-emerald-500' : 'border-brand-dark2 text-transparent'
                  }`}
                >
                  <Check size={11} strokeWidth={3} />
                </span>
                <motion.span
                  initial={false}
                  animate={{ opacity: done ? 1 : 0.35 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="text-brand-light2"
                >
                  {item}
                </motion.span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
