'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pop, useLoop } from '@/components/illustrations/useLoop';

export type ChatLine = { from: 'me' | 'mac'; text: string };
export type PhoneChatCopy = { contact: string; status: string; lines: ChatLine[] };

// An iPhone Messages thread with the Mac. Bubbles appear one at a time, hold, then the
// thread starts over. Stays dark in light mode (brand-dark), like a real phone screen.
export default function PhoneChat({ copy, compact = false }: { copy: PhoneChatCopy; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const hold = 3; // extra steps with the whole thread showing
  const step = useLoop(ref, copy.lines.length + hold, 1500);
  const shown = Math.min(step + 1, copy.lines.length);

  return (
    <div
      ref={ref}
      className={`brand-dark mx-auto w-full ${compact ? 'max-w-[300px]' : 'max-w-[340px]'} rounded-[2.4rem] border-[6px] border-neutral-800 bg-black p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]`}
    >
      <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-neutral-900" aria-hidden="true" />
      <div className="flex flex-col items-center border-b border-neutral-800 pb-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-neutral-500 to-neutral-700 font-display text-lg text-white">
          {copy.contact.slice(0, 1)}
        </span>
        <p className="mt-1 text-xs font-medium text-white">{copy.contact}</p>
        <p className="text-[10px] text-neutral-500">{copy.status}</p>
      </div>
      <div className="flex h-[390px] flex-col gap-2 overflow-hidden px-1 pt-3" aria-live="off">
        <AnimatePresence initial={false}>
          {copy.lines.slice(0, shown).map((l, i) => (
            <motion.p
              key={i}
              {...pop}
              className={`max-w-[82%] whitespace-pre-line rounded-[1.1rem] px-3 py-2 text-[13px] leading-snug ${
                l.from === 'me' ? 'self-end bg-[#0a84ff] text-white' : 'self-start bg-neutral-800 text-neutral-100'
              }`}
            >
              {l.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center gap-2 px-1" aria-hidden="true">
        <span className="h-8 flex-1 rounded-full border border-neutral-800" />
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a84ff] text-sm text-white">↑</span>
      </div>
    </div>
  );
}
