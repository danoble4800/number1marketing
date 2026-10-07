'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BellRing, CalendarCheck, Eye, Heart, Play, Star, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

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
  followersTitle: string;
  followersMeta: string;
  videoUploading: string;
  videoPosted: string;
  videoBody: string;
  likesTitle: string;
  likesMeta: string;
  subscriberTitle: string;
  subscriberBody: string;
  followersChartTitle: string;
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
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.25, 0, 0, 1] }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.7 }}
          className="hero-card rounded-2xl border border-brand-dark2 bg-brand-dark1/70 backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] px-4 py-3 text-left"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="hero-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark2 text-brand-white">
      {children}
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  );
}

// Steps through `count` slides every `period` ms, starting after `offset` ms so
// the four corners don't all change at once. Reduced motion stays on slide 0.
function useCycle(count: number, period: number, offset: number) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setIndex((i) => (i + 1) % count);
      interval = setInterval(() => setIndex((i) => (i + 1) % count), period);
    }, offset);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [count, period, offset, reduceMotion]);

  return index;
}

// A number that keeps climbing by a small random step, like a live follower count.
function useClimbing(start: number, maxStep: number, every: number) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setValue((v) => v + 1 + Math.floor(Math.random() * maxStep)), every);
    return () => clearInterval(id);
  }, [maxStep, every, reduceMotion]);

  return value;
}

function useFormat(locale: string) {
  return useMemo(() => new Intl.NumberFormat(locale), [locale]);
}

function Slides({ index, children }: { index: number; children: ReactNode[] }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }}
      >
        {children[index]}
      </motion.div>
    </AnimatePresence>
  );
}

// Hearts that drift up and fade, like reactions on a live post.
function RisingHearts({ className }: { className: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <span className={`pointer-events-none absolute h-12 w-6 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 text-rose-400"
          style={{ left: i * 6 }}
          animate={{ y: [0, -40], opacity: [0, 1, 0], scale: [0.6, 1, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
        >
          <Heart size={10} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </span>
  );
}

function FollowersSlide({ copy, locale }: { copy: HeroCardsCopy; locale: string }) {
  const count = useClimbing(1204, 4, 900);
  const fmt = useFormat(locale);

  return (
    <div className="flex items-center gap-3">
      <IconBadge>
        <Users size={16} />
      </IconBadge>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-white">
          <LiveDot />
          {copy.followersTitle}
        </div>
        <div className="text-lg font-semibold tabular-nums leading-tight text-brand-white">+{fmt.format(count)}</div>
        <div className="text-[11px] text-brand-light1">{copy.followersMeta}</div>
      </div>
    </div>
  );
}

function VideoSlide({ copy, locale }: { copy: HeroCardsCopy; locale: string }) {
  const reduceMotion = useReducedMotion();
  const [posted, setPosted] = useState(!!reduceMotion);
  const views = useClimbing(24_812, 40, 700);
  const likes = useClimbing(1_986, 6, 800);
  const fmt = useFormat(locale);

  return (
    <div className="flex gap-3">
      <div className="hero-icon relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-dark2 text-brand-white">
        <Play size={16} fill="currentColor" strokeWidth={0} />
        {posted && <RisingHearts className="bottom-0 right-0" />}
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-white">
          {posted && <LiveDot />}
          {posted ? copy.videoPosted : copy.videoUploading}
        </div>
        <div className="truncate text-sm text-brand-light2">{copy.videoBody}</div>
        {posted ? (
          <div className="mt-1 flex items-center gap-3 text-[11px] tabular-nums text-brand-light1">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {fmt.format(views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {fmt.format(likes)}
            </span>
          </div>
        ) : (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-dark2">
            <motion.div
              className="h-full rounded-full bg-emerald-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: [0.25, 0, 0, 1] }}
              onAnimationComplete={() => setPosted(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LikesSlide({ copy, locale }: { copy: HeroCardsCopy; locale: string }) {
  const count = useClimbing(248, 3, 600);
  const fmt = useFormat(locale);

  return (
    <div className="relative flex items-center gap-3">
      <IconBadge>
        <Heart size={16} className="text-rose-400" fill="currentColor" strokeWidth={0} />
      </IconBadge>
      <div>
        <div className="text-xs font-semibold text-brand-white">{copy.likesTitle}</div>
        <div className="text-sm tabular-nums text-brand-light2">
          +{fmt.format(count)} <span className="text-brand-light1">{copy.likesMeta}</span>
        </div>
      </div>
      <RisingHearts className="bottom-1 right-1" />
    </div>
  );
}

function SubscriberSlide({ copy }: { copy: HeroCardsCopy }) {
  return (
    <div className="flex items-center gap-3">
      <IconBadge>
        <BellRing size={16} />
      </IconBadge>
      <div>
        <div className="text-xs font-semibold text-brand-white">{copy.subscriberTitle}</div>
        <div className="text-sm text-brand-light2">{copy.subscriberBody}</div>
      </div>
    </div>
  );
}

const CHART_PATHS = [
  'M0 52 L25 48 L50 50 L75 40 L100 42 L125 30 L150 26 L175 14 L200 6',
  'M0 54 L25 52 L50 46 L75 44 L100 34 L125 30 L150 20 L175 12 L200 4',
];

function ChartSlide({ title, meta, line }: { title: string; meta: string; line: string }) {
  return (
    <>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-brand-white">{title}</span>
        <span className="flex items-center gap-1 text-brand-light1">
          <TrendingUp size={12} />
          <span className="hero-meta">{meta}</span>
        </span>
      </div>
      <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full text-brand-white">
        <defs>
          <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L200 60 L0 60 Z`} fill="url(#heroChartFill)" />
        <motion.path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0, 0, 1] }}
        />
      </svg>
    </>
  );
}

function LeadSlide({ copy }: { copy: HeroCardsCopy }) {
  return (
    <div className="flex items-center gap-3">
      <IconBadge>
        <UserPlus size={16} />
      </IconBadge>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-white">
          <LiveDot />
          {copy.leadTitle}
        </div>
        <div className="truncate text-sm text-brand-light2">{copy.leadBody}</div>
        <div className="text-[11px] text-brand-light1">{copy.leadMeta}</div>
      </div>
    </div>
  );
}

function ReviewSlide({ copy }: { copy: HeroCardsCopy }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className="text-xs font-semibold text-brand-white">{copy.reviewTitle}</span>
        <span className="flex gap-0.5 text-brand-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
      </div>
      <p className="hero-clamp mt-1.5 text-sm italic leading-snug text-brand-light2">{copy.reviewBody}</p>
    </div>
  );
}

function BookedSlide({ copy }: { copy: HeroCardsCopy }) {
  return (
    <div className="flex items-center gap-3">
      <IconBadge>
        <CalendarCheck size={16} />
      </IconBadge>
      <div>
        <div className="text-xs font-semibold text-brand-white">{copy.bookedTitle}</div>
        <div className="text-sm text-brand-light2">{copy.bookedBody}</div>
      </div>
    </div>
  );
}

// Each corner alternates between a business win (leads, reviews, calls) and a
// social win (followers, videos, likes, subscribers), on staggered timers.
export default function HeroCards({ copy, locale }: { copy: HeroCardsCopy; locale: string }) {
  const topLeft = useCycle(2, 7000, 6000);
  const topRight = useCycle(2, 7000, 7800);
  const bottomLeft = useCycle(2, 7000, 9600);
  const bottomRight = useCycle(3, 7000, 11400);

  return (
    <div aria-hidden="true" className="absolute inset-0 hidden xl:block pointer-events-none select-none">
      {/* New lead / new followers, top left */}
      <FloatingCard className="absolute top-[15%] left-[4%]" delay={1.1} floatDuration={7} opacity={0.55}>
        <div className="w-56 min-h-[3.75rem]">
          <Slides index={topLeft}>
            {[<LeadSlide key="lead" copy={copy} />, <FollowersSlide key="followers" copy={copy} locale={locale} />]}
          </Slides>
        </div>
      </FloatingCard>

      {/* Google review / video posted, top right */}
      <FloatingCard className="absolute top-[13%] right-[4%]" delay={1.4} floatDuration={8} opacity={0.5}>
        <div className="w-60 min-h-[4rem]">
          <Slides index={topRight}>
            {[<ReviewSlide key="review" copy={copy} />, <VideoSlide key="video" copy={copy} locale={locale} />]}
          </Slides>
        </div>
      </FloatingCard>

      {/* Leads chart / followers chart, bottom left */}
      <FloatingCard className="absolute bottom-[14%] left-[5%]" delay={1.7} floatDuration={9} opacity={0.45}>
        <div className="w-56">
          <Slides index={bottomLeft}>
            {[
              <ChartSlide key="leads" title={copy.chartTitle} meta={copy.chartMeta} line={CHART_PATHS[0]} />,
              <ChartSlide key="followers" title={copy.followersChartTitle} meta={copy.chartMeta} line={CHART_PATHS[1]} />,
            ]}
          </Slides>
        </div>
      </FloatingCard>

      {/* Call booked / new subscriber / new likes, bottom right */}
      <FloatingCard className="absolute bottom-[16%] right-[4%]" delay={2.0} floatDuration={7.5} opacity={0.55}>
        <div className="w-56">
          <Slides index={bottomRight}>
            {[
              <BookedSlide key="booked" copy={copy} />,
              <SubscriberSlide key="subscriber" copy={copy} />,
              <LikesSlide key="likes" copy={copy} locale={locale} />,
            ]}
          </Slides>
        </div>
      </FloatingCard>
    </div>
  );
}

// Phones and tablets: the side columns are taken by the headline, so two of the
// same cards float side by side under the buttons and cycle through every event.
export function HeroMiniCards({ copy, locale }: { copy: HeroCardsCopy; locale: string }) {
  const left = useCycle(5, 4500, 4500);
  const right = useCycle(4, 4500, 6700);

  return (
    <div
      aria-hidden="true"
      className="xl:hidden mt-10 mx-auto grid max-w-md grid-cols-2 gap-3 pointer-events-none select-none [&_.hero-card]:px-3 [&_.hero-meta]:hidden [&_.hero-clamp]:line-clamp-2 max-[459px]:[&_.hero-icon]:hidden"
    >
      <FloatingCard className="-rotate-2" delay={1.2} floatDuration={6} opacity={0.95}>
        <div className="flex h-[6.5rem] items-center">
          <div className="w-full">
            <Slides index={left}>
              {[
                <LeadSlide key="lead" copy={copy} />,
                <FollowersSlide key="followers" copy={copy} locale={locale} />,
                <BookedSlide key="booked" copy={copy} />,
                <LikesSlide key="likes" copy={copy} locale={locale} />,
                <SubscriberSlide key="subscriber" copy={copy} />,
              ]}
            </Slides>
          </div>
        </div>
      </FloatingCard>
      <FloatingCard className="mt-6 rotate-2" delay={1.5} floatDuration={7} opacity={0.95}>
        <div className="flex h-[6.5rem] items-center">
          <div className="w-full">
            <Slides index={right}>
              {[
                <ChartSlide key="leads" title={copy.chartTitle} meta={copy.chartMeta} line={CHART_PATHS[0]} />,
                <ReviewSlide key="review" copy={copy} />,
                <ChartSlide key="followers" title={copy.followersChartTitle} meta={copy.chartMeta} line={CHART_PATHS[1]} />,
                <VideoSlide key="video" copy={copy} locale={locale} />,
              ]}
            </Slides>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}

// Phones and tablets have no side space for floating cards, so they get one
// notification pill above the headline that cycles through the same events.
export function HeroTicker({ copy, locale }: { copy: HeroCardsCopy; locale: string }) {
  const fmt = useFormat(locale);
  const items = [
    { icon: <UserPlus size={14} />, title: copy.leadTitle, body: copy.leadMeta },
    { icon: <Users size={14} />, title: copy.followersTitle, body: `+${fmt.format(1204)} ${copy.followersMeta}` },
    { icon: <Star size={14} fill="currentColor" strokeWidth={0} />, title: copy.reviewTitle, body: '★★★★★' },
    { icon: <Play size={14} fill="currentColor" strokeWidth={0} />, title: copy.videoPosted, body: copy.videoBody },
    { icon: <CalendarCheck size={14} />, title: copy.bookedTitle, body: copy.bookedBody },
    { icon: <Heart size={14} fill="currentColor" strokeWidth={0} />, title: copy.likesTitle, body: `+248 ${copy.likesMeta}` },
    { icon: <BellRing size={14} />, title: copy.subscriberTitle, body: copy.subscriberBody },
  ];
  const index = useCycle(items.length, 3200, 3200);
  const item = items[index];

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 }}
      className="xl:hidden mb-6 flex justify-center select-none"
    >
      <div className="inline-flex h-9 max-w-full items-center gap-2 overflow-hidden rounded-full border border-brand-dark2 bg-brand-dark1/70 pl-1.5 pr-4 backdrop-blur-md">
        <span className="ml-1.5">
          <LiveDot />
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex min-w-0 items-center gap-2 whitespace-nowrap text-xs"
          >
            <span className="text-brand-white">{item.icon}</span>
            <span className="font-semibold text-brand-white">{item.title}</span>
            <span className="truncate text-brand-light1">{item.body}</span>
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
