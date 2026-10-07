'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Nfc, Star } from 'lucide-react';
import { useRef } from 'react';
import { EASE, pop, useLoop } from './useLoop';

// /cards: a phone taps the counter stand, the review page opens, five stars
// fill in and the review count ticks up.
export default function ReviewTapArt() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 10, 650);
  const tapped = step >= 2;
  const stars = Math.max(0, Math.min(5, step - 2));
  const posted = step >= 8;

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full max-w-sm select-none">
      <div className="relative flex h-[340px] items-end justify-center overflow-hidden border border-brand-dark2 bg-brand-near-black pb-8">
        {/* Counter stand */}
        <div className="relative flex w-44 flex-col items-center border border-brand-dark2 bg-brand-dark1 px-4 pb-5 pt-4 text-center">
          <div className="flex gap-0.5 text-brand-white">
            {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={14} fill="currentColor" strokeWidth={0} />)}
          </div>
          <p className="mt-2 font-display text-lg uppercase leading-none text-brand-white">Tap to review us</p>
          <Nfc size={26} className="mt-3 text-brand-light2" />
          {tapped && step < 5 && (
            <>
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-4 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border-2 border-emerald-400"
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 1, delay: i * 0.3, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </div>

        {/* Phone */}
        <motion.div
          initial={false}
          animate={{ x: tapped ? 34 : 140, y: tapped ? -126 : -96, rotate: tapped ? -6 : 8 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute bottom-0 left-1/2 h-48 w-28 -ml-14 rounded-[18px] border-[3px] border-brand-light1 bg-brand-dark1 p-2 shadow-xl"
        >
          <div className="mx-auto mb-2 h-1 w-6 rounded-full bg-brand-dark2" />
          <AnimatePresence mode="wait">
            {tapped ? (
              <motion.div key="review" {...pop} className="flex flex-col items-center gap-2 text-center">
                <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-brand-mid">Google review</span>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <motion.span
                      key={n}
                      initial={false}
                      animate={{ scale: n === stars - 1 ? [0.6, 1.25, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      className={n < stars ? 'text-amber-400' : 'text-brand-dark2'}
                    >
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                    </motion.span>
                  ))}
                </div>
                <span className="mt-1 block h-1.5 w-14 rounded bg-brand-dark2" />
                <span className="block h-1.5 w-10 rounded bg-brand-dark2" />
                {posted && (
                  <motion.span {...pop} className="mt-2 flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-500">
                    <Check size={9} strokeWidth={3} />
                    Posted
                  </motion.span>
                )}
              </motion.div>
            ) : (
              <motion.div key="idle" {...pop} className="space-y-1.5 pt-2">
                {[70, 50, 60].map((w) => <span key={w} className="block h-1.5 rounded bg-brand-dark2" style={{ width: `${w}%` }} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Running count */}
        <div className="absolute left-4 top-4 border border-brand-dark2 bg-brand-dark1 px-3 py-2">
          <div className="text-[10px] uppercase tracking-widest text-brand-mid">Google reviews</div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl tabular-nums text-brand-white">{posted ? 129 : 128}</span>
            <AnimatePresence>
              {posted && (
                <motion.span {...pop} className="text-xs font-semibold text-emerald-500">+1</motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
