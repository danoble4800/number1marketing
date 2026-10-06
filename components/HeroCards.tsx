'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, Star, TrendingUp, UserPlus } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

export interface HeroCardsCopy {
  leadTitle: string;
  leadBody: string;
  leadMeta: string;
  reviewTitle: string;
  reviewBody: string;
  bookedTitle: string;
  bookedBody: string;
  chartTitle: string;
  chartMeta: string;
}

interface FloatingCardProps {
  children: ReactNode;
  className: string;
  delay: number;
  floatDuration: number;
  opacity: number;
}

function FloatingCard({ children, className, delay, floatDuration, opacity }: FloatingCardProps) {
  const reduceMotion = useReducedMotion();

  // Position and scale live on a plain div: Framer Motion's inline transform would override them.
  return (
    <div className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.25, 0, 0, 1] }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.7 }}
          className="rounded-2xl border border-brand-dark2 bg-brand-dark1/70 backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] px-4 py-3 text-left"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark2 text-brand-white">
      {children}
    </div>
  );
}

export default function HeroCards({ copy }: { copy: HeroCardsCopy }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 hidden xl:block pointer-events-none select-none">
      {/* New lead, top left */}
      <FloatingCard
        className="top-[15%] left-[4%]"
        delay={1.1}
        floatDuration={7}
        opacity={0.55}
      >
        <div className="flex items-center gap-3 w-56">
          <IconBadge>
            <UserPlus size={16} />
          </IconBadge>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {copy.leadTitle}
            </div>
            <div className="truncate text-sm text-brand-light2">{copy.leadBody}</div>
            <div className="text-[11px] text-brand-light1">{copy.leadMeta}</div>
          </div>
        </div>
      </FloatingCard>

      {/* Google review, top right */}
      <FloatingCard
        className="top-[13%] right-[4%]"
        delay={1.4}
        floatDuration={8}
        opacity={0.5}
      >
        <div className="w-60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-white">{copy.reviewTitle}</span>
            <span className="flex gap-0.5 text-brand-white">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
          </div>
          <p className="mt-1.5 text-sm italic leading-snug text-brand-light2">{copy.reviewBody}</p>
        </div>
      </FloatingCard>

      {/* Leads chart, bottom left */}
      <FloatingCard
        className="bottom-[14%] left-[5%]"
        delay={1.7}
        floatDuration={9}
        opacity={0.45}
      >
        <div className="w-56">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-white">{copy.chartTitle}</span>
            <span className="flex items-center gap-1 text-brand-light1">
              <TrendingUp size={12} />
              {copy.chartMeta}
            </span>
          </div>
          <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full text-brand-white">
            <defs>
              <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 52 L25 48 L50 50 L75 40 L100 42 L125 30 L150 26 L175 14 L200 6 L200 60 L0 60 Z"
              fill="url(#heroChartFill)"
            />
            <motion.path
              d="M0 52 L25 48 L50 50 L75 40 L100 42 L125 30 L150 26 L175 14 L200 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 2.1, ease: [0.25, 0, 0, 1] }}
            />
          </svg>
        </div>
      </FloatingCard>

      {/* Call booked, bottom right */}
      <FloatingCard
        className="bottom-[16%] right-[4%]"
        delay={2.0}
        floatDuration={7.5}
        opacity={0.55}
      >
        <div className="flex items-center gap-3 w-52">
          <IconBadge>
            <CalendarCheck size={16} />
          </IconBadge>
          <div>
            <div className="text-xs font-semibold text-brand-white">{copy.bookedTitle}</div>
            <div className="text-sm text-brand-light2">{copy.bookedBody}</div>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}

// Phones and tablets have no side space for floating cards, so they get one
// notification pill above the headline that cycles through the same events.
export function HeroTicker({ copy }: { copy: HeroCardsCopy }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const items = [
    { icon: <UserPlus size={14} />, title: copy.leadTitle, body: copy.leadMeta },
    { icon: <Star size={14} fill="currentColor" strokeWidth={0} />, title: copy.reviewTitle, body: '★★★★★' },
    { icon: <CalendarCheck size={14} />, title: copy.bookedTitle, body: copy.bookedBody },
  ];

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % 3), 3200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const item = items[index];

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 }}
      className="xl:hidden mb-6 flex justify-center select-none"
    >
      <div className="inline-flex h-9 items-center gap-2 overflow-hidden rounded-full border border-brand-dark2 bg-brand-dark1/70 pl-1.5 pr-4 backdrop-blur-md">
        <span className="relative flex h-1.5 w-1.5 ml-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 whitespace-nowrap text-xs"
          >
            <span className="text-brand-white">{item.icon}</span>
            <span className="font-semibold text-brand-white">{item.title}</span>
            <span className="text-brand-light1">{item.body}</span>
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
