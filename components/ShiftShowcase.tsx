'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { CheckCircle, Clock, HelpCircle, MapPin, MessageSquare, Phone, PhoneMissed, Play, Receipt, Search, Voicemail, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Heading from './Heading';
import { EASE, pop, useLoop } from './illustrations/useLoop';

// Home "Which one are you?": the before/after lists cycle through each pair,
// and each side plays a small scene of that pair. Tapping a row picks it.

export interface ShiftCopy {
  heading: string;
  subheading: string;
  beforeLabel: string;
  afterLabel: string;
  pairs: { before: string; after: string }[];
  scenes: {
    missedCall: string;
    voicemail: string;
    textIn: string;
    textOut: string;
    replied: string;
    perMonth: string;
    lastPost: string;
    newVideo: string;
    visitors: string;
    page3: string;
    you: string;
    competitor: string;
    topNearYou: string;
    whereFrom: string;
    sources: string[];
  };
}

type Scenes = ShiftCopy['scenes'];
const CYCLE_MS = 4200;

function SceneBox({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="relative mb-8 h-44 select-none overflow-hidden border border-brand-dark2 bg-brand-dark1 p-4">
      {children}
    </div>
  );
}

// ---- Before scenes ---------------------------------------------------------

function MissedCalls({ s }: { s: Scenes }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 5, 750);
  const times = ['9:12 AM', '11:40 AM', '2:05 PM'];
  return (
    <div ref={ref} className="flex h-full flex-col gap-2">
      {times.map((time, i) =>
        step > i ? (
          <motion.div key={time} {...pop} className="flex items-center gap-2.5 text-sm">
            <PhoneMissed size={14} className="text-rose-400" />
            <span className="text-brand-light2">{s.missedCall}</span>
            <span className="ml-auto text-xs tabular-nums text-brand-mid">{time}</span>
          </motion.div>
        ) : null,
      )}
      {step >= 4 && (
        <motion.div {...pop} className="mt-auto flex items-center gap-2 self-start rounded-full border border-brand-dark2 px-3 py-1 text-xs text-brand-mid">
          <Voicemail size={13} />
          {s.voicemail}
        </motion.div>
      )}
    </div>
  );
}

function BigBill({ amount, s, checks }: { amount: string; s: Scenes; checks: 'few' | 'all' }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 6, 600);
  const done = checks === 'few' ? Math.min(step, 2) : step;
  return (
    <div ref={ref} className="flex h-full flex-col justify-between">
      <div className="flex items-start gap-3">
        <Receipt size={22} className={checks === 'few' ? 'text-rose-400' : 'text-emerald-500'} />
        <div>
          <div className="font-display text-4xl leading-none tracking-tight text-brand-white">{amount}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-brand-mid">{s.perMonth}</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: i === done - 1 ? [0.8, 1] : 1 }}
            className={`flex h-8 flex-1 items-center justify-center border transition-colors duration-300 ${
              i < done
                ? checks === 'all'
                  ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-500'
                  : 'border-brand-mid/40 bg-brand-dark2 text-brand-light1'
                : 'border-brand-dark2 text-transparent'
            }`}
          >
            <CheckCircle size={14} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function StalePosts({ s }: { s: Scenes }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-1 grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className={`rounded-sm ${i === 0 ? 'bg-brand-mid/40' : 'border border-dashed border-brand-dark2'}`}
            animate={i === 0 ? undefined : { opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-brand-mid">
        <Clock size={12} />
        {s.lastPost}
      </div>
    </div>
  );
}

function LostSite({ s }: { s: Scenes }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2 rounded-full border border-brand-dark2 px-3 py-1.5">
        <motion.span animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <Search size={13} className="text-brand-mid" />
        </motion.span>
        <span className="h-2 w-24 rounded bg-brand-dark2" />
        <span className="ml-auto text-[11px] text-brand-mid">{s.page3}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 opacity-60">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 rounded bg-brand-dark2" style={{ width: `${85 - i * 15}%` }} />
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl leading-none text-brand-white">0</span>
        <span className="text-xs uppercase tracking-widest text-brand-mid">{s.visitors}</span>
      </div>
    </div>
  );
}

function Guessing({ s }: { s: Scenes }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-2.5">
        {s.sources.map((src, i) => (
          <div key={src} className="flex items-center gap-3 text-sm">
            <span className="w-20 text-brand-light1">{src}</span>
            <span className="h-2 flex-1 rounded-full bg-brand-dark2" />
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
              <HelpCircle size={15} className="text-brand-mid" />
            </motion.span>
          </div>
        ))}
      </div>
      <p className="text-xs text-brand-mid">{s.whereFrom}</p>
    </div>
  );
}

// ---- After scenes ----------------------------------------------------------

function InstantReply({ s }: { s: Scenes }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 5, 900);
  return (
    <div ref={ref} className="flex h-full flex-col gap-2">
      {step >= 1 && (
        <motion.div {...pop} className="flex max-w-[80%] items-center gap-2 self-start rounded-2xl rounded-bl-sm bg-brand-dark2 px-3 py-2 text-sm text-brand-white">
          <MessageSquare size={12} className="shrink-0 text-brand-mid" />
          {s.textIn}
        </motion.div>
      )}
      {step >= 2 && (
        <motion.div {...pop} className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-brand-white px-3 py-2 text-sm text-brand-black">
          {s.textOut}
        </motion.div>
      )}
      {step >= 3 && (
        <motion.div {...pop} className="mt-auto flex items-center gap-1.5 self-end rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-500">
          <Phone size={12} />
          {s.replied}
        </motion.div>
      )}
    </div>
  );
}

function FreshVideos({ s }: { s: Scenes }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 9, 450);
  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <div className="grid flex-1 grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ opacity: i < step ? 1 : 0.2, scale: i === step - 1 ? [0.85, 1] : 1 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center rounded-sm bg-brand-dark2"
          >
            {i < step && <Play size={11} fill="currentColor" strokeWidth={0} className="text-brand-light1" />}
          </motion.span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
        <Play size={12} fill="currentColor" strokeWidth={0} />
        {s.newVideo}
      </div>
    </div>
  );
}

function TopOfMap({ s }: { s: Scenes }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 4, 1000);
  const youAt = [2, 2, 1, 0][step];
  const rows = ['a', 'b'].map((id) => ({ id, you: false }));
  rows.splice(youAt, 0, { id: 'you', you: true });
  return (
    <div ref={ref} className="flex h-full flex-col gap-1.5">
      {rows.map((row) => (
        <motion.div
          key={row.id}
          layout
          transition={{ duration: 0.5, ease: EASE }}
          className={`flex items-center gap-2.5 px-3 py-2 text-sm ${row.you ? 'border border-brand-mid/60 bg-brand-dark2 font-semibold text-brand-white' : 'border border-transparent text-brand-light1'}`}
        >
          <MapPin size={14} className={row.you ? 'text-rose-400' : 'text-brand-mid'} />
          {row.you ? s.you : s.competitor}
          {row.you && youAt === 0 && (
            <motion.span {...pop} className="ml-auto rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-500">
              {s.topNearYou}
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function KnownSources({ s }: { s: Scenes }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 5, 700);
  const pcts = [46, 32, 22];
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-3">
      {s.sources.map((src, i) => {
        const shown = step > i;
        return (
          <div key={src} className="flex items-center gap-3 text-sm">
            <span className="w-20 text-brand-light1">{src}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-brand-dark2">
              <motion.span
                initial={false}
                animate={{ width: shown ? `${pcts[i] * 2}%` : '0%' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="block h-full rounded-full bg-emerald-400"
              />
            </span>
            <span className="w-9 text-right text-xs font-semibold tabular-nums text-brand-white">{shown ? `${pcts[i]}%` : ''}</span>
          </div>
        );
      })}
    </div>
  );
}

function BeforeScene({ i, s }: { i: number; s: Scenes }) {
  switch (i) {
    case 0: return <MissedCalls s={s} />;
    case 1: return <BigBill amount="$15,000" s={s} checks="few" />;
    case 2: return <StalePosts s={s} />;
    case 3: return <LostSite s={s} />;
    default: return <Guessing s={s} />;
  }
}

function AfterScene({ i, s }: { i: number; s: Scenes }) {
  switch (i) {
    case 0: return <InstantReply s={s} />;
    case 1: return <BigBill amount="$3,000" s={s} checks="all" />;
    case 2: return <FreshVideos s={s} />;
    case 3: return <TopOfMap s={s} />;
    default: return <KnownSources s={s} />;
  }
}

export default function ShiftShowcase({ copy }: { copy: ShiftCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-120px' });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const count = copy.pairs.length;

  useEffect(() => {
    if (!inView || reduceMotion || pinned) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), CYCLE_MS);
    return () => clearInterval(id);
  }, [inView, reduceMotion, pinned, count]);

  // A tap pins that pair for a while, then the cycle picks back up.
  useEffect(() => {
    if (!pinned) return;
    const id = setTimeout(() => setPinned(false), CYCLE_MS * 2.5);
    return () => clearTimeout(id);
  }, [pinned, active]);

  const pick = (i: number) => {
    setActive(i);
    setPinned(true);
  };

  const column = (side: 'before' | 'after') => {
    const isBefore = side === 'before';
    return (
      <div className={`${isBefore ? 'bg-brand-dark2' : 'bg-brand-near-black'} px-8 py-16 lg:px-16`}>
        <div className={isBefore ? '' : 'hidden lg:block'} aria-hidden={!isBefore}>
          <Heading as="h2" size="md" className={`mb-4 text-brand-white ${isBefore ? '' : 'invisible'}`}>
            {copy.heading}
          </Heading>
          <p className={`mb-8 text-brand-light1 ${isBefore ? '' : 'invisible'}`}>{copy.subheading}</p>
        </div>
        <div className="mb-4">
          <span className={`text-xs font-semibold uppercase tracking-widest ${isBefore ? 'text-brand-mid' : 'text-brand-white'}`}>
            {isBefore ? copy.beforeLabel : copy.afterLabel}
          </span>
        </div>
        <SceneBox>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="h-full"
            >
              {isBefore ? <BeforeScene i={active} s={copy.scenes} /> : <AfterScene i={active} s={copy.scenes} />}
            </motion.div>
          </AnimatePresence>
        </SceneBox>
        <ul className="space-y-1">
          {copy.pairs.map((pair, i) => {
            const on = i === active;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-3 border-l-2 py-2 pl-3 text-left text-sm transition-colors duration-300 ${
                    on ? (isBefore ? 'border-rose-400' : 'border-emerald-400') : 'border-transparent'
                  }`}
                >
                  {isBefore ? (
                    <X size={16} className={`mt-0.5 flex-shrink-0 ${on ? 'text-rose-400' : 'text-brand-mid'}`} />
                  ) : (
                    <CheckCircle size={16} className={`mt-0.5 flex-shrink-0 ${on ? 'text-emerald-500' : 'text-brand-light2'}`} />
                  )}
                  <span className={on ? 'text-brand-white' : isBefore ? 'text-brand-light1' : 'text-brand-offwhite'}>
                    {isBefore ? pair.before : pair.after}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div ref={ref} className="lg:grid lg:grid-cols-2">
      {column('before')}
      {column('after')}
    </div>
  );
}
