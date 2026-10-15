'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, Check, Globe, Megaphone, MessageCircle, Pause, Phone, PhoneMissed, Play, RotateCcw, Search,
  Share2, TrendingUp, UserX, Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { EASE, pop } from '@/components/illustrations/useLoop';

export type ExplainerCopy = {
  label: string;
  play: string;
  pause: string;
  replay: string;
  toForm: string;
  scenes: { kicker: string; text: string }[];
  art: {
    missed: string; unread: string; competitor: string; jargon: string[]; handled: string; pieces: string[];
    leadIn: string; leadAsk: string; leadReply: string; replied: string; stats: string[];
    self: string; selfDesc: string; us: string; usDesc: string;
    auditTitle: string; auditItems: string[]; keep: string; free: string; cta: string;
  };
};

// Seconds each scene stays up, in order (75s total). Long enough to read the caption twice.
const DURATIONS = [7, 8, 6, 8, 9, 6, 9, 9, 7, 6].map((s) => s * 1000);
const TOTAL = DURATIONS.reduce((a, b) => a + b, 0);
const STARTS = DURATIONS.map((_, i) => DURATIONS.slice(0, i).reduce((a, b) => a + b, 0));
const TICK = 100;

const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// A captioned explainer that plays like a video (play/pause, scrub by scene) but is drawn
// in code, so it stays sharp and translated. Swap for a real video with NEXT_PUBLIC_FREE_AUDIT_VIDEO_URL.
export default function ExplainerVideo({ copy, formId }: { copy: ExplainerCopy; formId: string }) {
  const reduceMotion = useReducedMotion();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const ended = t >= TOTAL;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setT((prev) => {
        const next = prev + TICK;
        if (next >= TOTAL) setPlaying(false);
        return Math.min(next, TOTAL);
      });
    }, TICK);
    return () => clearInterval(id);
  }, [playing]);

  const scene = ended ? DURATIONS.length - 1 : STARTS.filter((s) => t >= s).length - 1;
  // Time into the current scene; reduced motion jumps straight to each scene's finished state.
  const local = reduceMotion || ended ? Infinity : t - STARTS[scene];

  const toggle = () => {
    if (ended) setT(0);
    setStarted(true);
    setPlaying((p) => (ended ? true : !p));
  };
  const jump = (i: number) => {
    setStarted(true);
    setT(STARTS[i]);
    setPlaying(true);
  };
  const toForm = () => {
    setPlaying(false);
    document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { kicker, text } = copy.scenes[scene];

  return (
    <div className="brand-dark relative aspect-[4/5] w-full select-none overflow-hidden border border-brand-dark2 bg-brand-near-black text-brand-offwhite sm:aspect-video">
      {/* Soft glow behind the scene art */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(52,211,153,0.10),transparent_60%)]" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? copy.pause : copy.play}
        className={`absolute inset-0 flex flex-col px-5 pb-16 pt-5 text-left transition-opacity duration-300 sm:px-10 sm:pb-20 sm:pt-8 ${
          started ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={`k${scene}`}
            {...pop}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:text-xs"
          >
            {kicker}
          </motion.p>
        </AnimatePresence>

        <div className="flex min-h-0 flex-1 items-center justify-center py-3" aria-hidden="true">
          <AnimatePresence mode="wait">
            <motion.div
              key={`s${scene}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex w-full items-center justify-center"
            >
              <SceneArt index={scene} local={local} art={copy.art} onCta={toForm} />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`t${scene}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
            className="font-display text-[1.6rem] uppercase leading-[1.05] tracking-tight text-brand-white sm:text-4xl"
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </button>

      {/* Poster before the first play */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
          >
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-white text-brand-black shadow-2xl">
              {!reduceMotion && <span className="absolute inset-0 animate-ping rounded-full bg-brand-white/30" />}
              <Play size={30} className="ml-1" fill="currentColor" />
            </span>
            <span>
              <span className="block font-display text-3xl uppercase tracking-tight text-brand-white sm:text-4xl">{copy.label}</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{clock(TOTAL)}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End card */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 bottom-12 flex flex-col items-center justify-center gap-3 bg-brand-near-black/90 px-6"
          >
            <button
              type="button"
              onClick={toForm}
              className="inline-flex items-center gap-2 bg-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-black"
            >
              {copy.toForm} <ArrowDown size={16} />
            </button>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-light2 hover:text-brand-white"
            >
              <RotateCcw size={14} /> {copy.replay}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center gap-3 bg-gradient-to-t from-brand-black/80 to-transparent px-3 sm:px-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? copy.pause : ended ? copy.replay : copy.play}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-brand-white"
        >
          {playing ? <Pause size={18} fill="currentColor" /> : ended ? <RotateCcw size={17} /> : <Play size={18} fill="currentColor" />}
        </button>
        <div className="flex flex-1 items-center gap-1">
          {DURATIONS.map((d, i) => {
            const fill = Math.max(0, Math.min(1, (t - STARTS[i]) / d));
            return (
              <button
                key={i}
                type="button"
                onClick={() => jump(i)}
                aria-label={`${i + 1} / ${DURATIONS.length}`}
                className="group flex h-6 items-center"
                style={{ flex: d }}
              >
                <span className="relative h-1 w-full overflow-hidden rounded-full bg-brand-white/20 transition-[height] group-hover:h-1.5">
                  <span className="absolute inset-y-0 left-0 bg-emerald-400" style={{ width: `${fill * 100}%` }} />
                </span>
              </button>
            );
          })}
        </div>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-brand-light2">
          {clock(t)} / {clock(TOTAL)}
        </span>
      </div>
    </div>
  );
}

// Things inside a scene appear once `local` (ms into the scene) passes their time.
function SceneArt({
  index, local, art, onCta,
}: { index: number; local: number; art: ExplainerCopy['art']; onCta: () => void }) {
  const at = (ms: number) => local >= ms;

  const chip = 'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium sm:text-base';
  const card = 'border border-brand-dark2 bg-brand-dark1';

  switch (index) {
    // Marketing jargon piling up
    case 0:
    case 2:
      return (
        <div className="relative flex w-full max-w-md flex-wrap items-center justify-center gap-2.5">
          {art.jargon.map((word, i) =>
            at(index === 2 ? 0 : 400 + i * 450) ? (
              <motion.span
                key={word}
                {...pop}
                animate={{ opacity: index === 2 && at(1200) ? 0.25 : 1, y: 0, scale: 1, rotate: (i % 2 ? 1 : -1) * (3 + i) }}
                className={`${chip} border-brand-dark2 bg-brand-dark1 text-brand-light2 ${index === 2 && at(1200) ? 'line-through' : ''}`}
              >
                {word}
              </motion.span>
            ) : null,
          )}
          {index === 0 && at(3000) && (
            <motion.span {...pop} className="absolute -right-1 -top-6 font-display text-6xl text-brand-mid sm:text-7xl">?</motion.span>
          )}
          {index === 2 && at(1800) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' as const, stiffness: 260, damping: 18 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className={`${chip} border-emerald-400 bg-brand-near-black px-5 py-3 text-lg text-emerald-400 shadow-2xl sm:text-xl`}>
                <Check size={20} /> {art.handled}
              </span>
            </motion.div>
          )}
        </div>
      );

    // Missed calls and lost customers
    case 1:
      return (
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          {[
            { at: 300, icon: PhoneMissed, label: art.missed, tone: 'text-rose-400' },
            { at: 1800, icon: MessageCircle, label: art.unread, tone: 'text-brand-light2' },
            { at: 3600, icon: UserX, label: art.competitor, tone: 'text-rose-400' },
          ].map(({ at: ms, icon: Icon, label, tone }) =>
            at(ms) ? (
              <motion.div key={label} {...pop} className={`${card} flex items-center gap-3 px-4 py-3`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark2 ${tone}`}>
                  <Icon size={17} />
                </span>
                <span className="text-sm font-medium text-brand-offwhite sm:text-base">{label}</span>
              </motion.div>
            ) : null,
          )}
        </div>
      );

    // Everything connected
    case 3: {
      const icons = [Globe, Search, Megaphone, Share2];
      return (
        <div className="grid w-full max-w-sm grid-cols-2 gap-2.5">
          {art.pieces.map((piece, i) => {
            const Icon = icons[i];
            const lit = at(600 + i * 900);
            return (
              <motion.div
                key={piece}
                initial={false}
                animate={{ opacity: lit ? 1 : 0.35 }}
                className={`flex items-center gap-2.5 border px-3.5 py-3 transition-colors duration-500 ${
                  lit ? 'border-emerald-400/60 bg-brand-dark1' : 'border-brand-dark2 bg-brand-dark1'
                }`}
              >
                <Icon size={18} className={lit ? 'text-emerald-400' : 'text-brand-mid'} />
                <span className="text-sm font-medium sm:text-base">{piece}</span>
                {lit && <Check size={15} className="ml-auto text-emerald-400" />}
              </motion.div>
            );
          })}
        </div>
      );
    }

    // Instant reply at 2 AM
    case 4:
      return (
        <div className={`${card} w-full max-w-xs p-3.5`}>
          <p className="mb-3 text-[11px] uppercase tracking-widest text-brand-mid">{art.leadIn}</p>
          <div className="flex flex-col gap-2 text-sm">
            {at(300) && (
              <motion.p {...pop} className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-brand-dark2 px-3.5 py-2 text-brand-offwhite">
                {art.leadAsk}
              </motion.p>
            )}
            {at(1300) && !at(2600) && (
              <motion.span {...pop} className="flex gap-1 self-end rounded-2xl bg-emerald-500/20 px-3.5 py-3">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </motion.span>
            )}
            {at(2600) && (
              <motion.p {...pop} className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-emerald-500 px-3.5 py-2 font-medium text-black">
                {art.leadReply}
              </motion.p>
            )}
          </div>
          {at(3600) && (
            <motion.p {...pop} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Check size={14} /> {art.replied}
            </motion.p>
          )}
        </div>
      );

    // Numbers going up
    case 5: {
      const icons = [Phone, Users, TrendingUp];
      const targets = [38, 21, 1240];
      return (
        <div className="grid w-full max-w-md grid-cols-3 gap-2.5">
          {art.stats.map((label, i) => {
            const Icon = icons[i];
            const shown = at(300 + i * 700);
            const p = Math.min(1, Math.max(0, (local - 300 - i * 700) / 1800));
            return (
              <motion.div
                key={label}
                initial={false}
                animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 10 }}
                className={`${card} flex flex-col items-center gap-1 px-2 py-4`}
              >
                <Icon size={18} className="text-emerald-400" />
                <span className="font-display text-2xl text-brand-white sm:text-3xl">
                  +{Math.round(targets[i] * (local === Infinity ? 1 : p)).toLocaleString()}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-brand-light1">{label}</span>
              </motion.div>
            );
          })}
        </div>
      );
    }

    // You run it, or we do
    case 6: {
      const pick = local === Infinity ? -1 : at(4500) ? 1 : at(1200) ? 0 : -1;
      return (
        <div className="grid w-full max-w-md grid-cols-2 gap-2.5">
          {[
            { title: art.self, desc: art.selfDesc },
            { title: art.us, desc: art.usDesc },
          ].map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={false}
              animate={{ scale: pick === i ? 1.04 : 1, opacity: pick === -1 || pick === i ? 1 : 0.45 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={`border bg-brand-dark1 px-4 py-5 text-center transition-colors duration-300 ${
                pick === i ? 'border-emerald-400' : 'border-brand-dark2'
              }`}
            >
              <p className="font-display text-xl uppercase text-brand-white sm:text-2xl">{title}</p>
              <p className="mt-1 text-xs text-brand-light1 sm:text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      );
    }

    // The audit checklist
    case 7:
      return (
        <div className={`${card} w-full max-w-xs p-4`}>
          <p className="mb-3 font-display text-lg uppercase text-brand-white">{art.auditTitle}</p>
          <ul className="flex flex-col gap-2.5">
            {art.auditItems.map((item, i) => {
              const done = at(700 + i * 1100);
              return (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      done ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-brand-mid'
                    }`}
                  >
                    {done && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={done ? 'text-brand-offwhite' : 'text-brand-mid'}>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );

    // Free, yours to keep
    case 8:
      return (
        <div className="flex flex-col items-center justify-center gap-3">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: at(200) ? 1 : 0, scale: at(200) ? 1 : 0.85 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-display text-8xl text-brand-white sm:text-9xl"
          >
            {art.free}
          </motion.span>
          {at(1400) && (
            <motion.span
              initial={{ opacity: 0, scale: 1.4, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 16 }}
              className="border-2 border-emerald-400 bg-brand-near-black px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400 sm:text-sm"
            >
              {art.keep}
            </motion.span>
          )}
        </div>
      );

    // Go to the form
    default:
      return (
        <div className="flex flex-col items-center gap-3">
          <span
            role="link"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onCta();
            }}
            className="inline-flex cursor-pointer items-center gap-2 bg-emerald-400 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-black"
          >
            {art.cta} <ArrowDown size={16} />
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-emerald-400"
          >
            <ArrowDown size={26} />
          </motion.span>
        </div>
      );
  }
}
