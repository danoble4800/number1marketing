'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { EASE, pop } from '@/components/illustrations/useLoop';
import type { ChatLine } from '@/components/mac-assistant/PhoneChat';

export type DashboardDemoCopy = {
  play: string;
  pause: string;
  replay: string;
  captions: string[];
  greeting: string;
  status: string;
  panels: { chat: string; todo: string; reminders: string; weather: string; working: string };
  weather: { city: string; temp: string; cond: string };
  todos: string[];
  newTodo: string;
  reminders: { time: string; text: string }[];
  newReminder: { time: string; text: string };
  site: { file: string; before: string; after: string; published: string };
  lines: ChatLine[]; // the phone thread, in order
};

// A captioned "video" drawn in code: an iPhone texting the Mac, and the Mac Assistant's
// dashboard (same look as MacAssistant-Template/dashboard) doing the work. Drawn on a fixed
// 1000×620 stage and scaled to fit, so it looks the same on a phone as on a desktop.

type Editor = 'none' | 'before' | 'after' | 'published';
type Step = { phone: number; working?: boolean; todo?: boolean; reminder?: boolean; editor?: Editor; caption: number };

// phone = how many lines of the thread are showing.
const SCRIPT: Step[] = [
  { phone: 0, caption: 0 },
  { phone: 1, caption: 0 },
  { phone: 1, working: true, caption: 0 },
  { phone: 1, working: true, todo: true, caption: 0 },
  { phone: 2, todo: true, caption: 0 },
  { phone: 3, todo: true, caption: 1 },
  { phone: 3, working: true, todo: true, reminder: true, caption: 1 },
  { phone: 4, todo: true, reminder: true, caption: 1 },
  { phone: 5, todo: true, reminder: true, caption: 2 },
  { phone: 5, working: true, todo: true, reminder: true, editor: 'before', caption: 2 },
  { phone: 5, working: true, todo: true, reminder: true, editor: 'after', caption: 2 },
  { phone: 6, todo: true, reminder: true, editor: 'after', caption: 2 },
  { phone: 7, todo: true, reminder: true, editor: 'after', caption: 3 },
  { phone: 7, working: true, todo: true, reminder: true, editor: 'published', caption: 3 },
  { phone: 8, todo: true, reminder: true, editor: 'published', caption: 3 },
  { phone: 8, todo: true, reminder: true, editor: 'published', caption: 4 },
  { phone: 8, todo: true, reminder: true, editor: 'published', caption: 4 },
];
const STEP_MS = 1700;
const W = 1000;
const H = 620;

// Dashboard palette (MacAssistant-Template/dashboard/index.html)
const C = {
  bg: '#04070c',
  panel: 'rgba(9,22,34,0.72)',
  line: 'rgba(63,216,255,0.18)',
  cyan: '#3fd8ff',
  ink: '#dcf4ff',
  ink2: '#9cbccb',
  ink3: '#5f7f90',
  green: '#5dffb0',
  amber: '#ffb648',
};
const label = "'Rajdhani','Arial Narrow',sans-serif";

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-md p-3 ${className}`} style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.cyan, fontFamily: label }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function DashboardDemo({ copy }: { copy: DashboardDemoCopy }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [scale, setScale] = useState(0.6);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setStep(SCRIPT.length - 1);
      setPlaying(false);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % SCRIPT.length), STEP_MS);
    return () => clearInterval(id);
  }, [playing, inView]);

  const s = SCRIPT[step];
  const phoneLines = copy.lines.slice(0, s.phone);
  const atEnd = step === SCRIPT.length - 1;

  return (
    <div>
      <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ height: H * scale }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          {/* Mac */}
          <div className="absolute left-0 top-0" style={{ width: 800 }}>
            <div className="rounded-[18px] border-[10px] border-neutral-800 bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
              <div className="relative overflow-hidden rounded-[6px]" style={{ height: 470, background: C.bg }}>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(63,216,255,0.12), transparent 60%), linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
                    backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                    opacity: 0.55,
                  }}
                />
                {/* Top bar */}
                <div className="relative flex items-center justify-between px-4 pt-3" style={{ fontFamily: label }}>
                  <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: C.cyan }}>Jarvis</p>
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em]" style={{ color: C.green }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.green }} /> {copy.status}
                  </p>
                  <p className="text-sm tabular-nums" style={{ color: C.ink2 }}>2:41 PM</p>
                </div>

                {/* Right padding keeps the panels clear of the iPhone, which overlaps the Mac's right edge */}
                <div className="relative grid gap-3 py-4 pl-4" style={{ gridTemplateColumns: '160px 1fr 170px', paddingRight: 66 }}>
                  {/* Left: weather */}
                  <div className="flex flex-col gap-3">
                    <Panel title={copy.panels.weather}>
                      <p className="text-3xl font-light" style={{ color: C.ink }}>{copy.weather.temp}</p>
                      <p className="text-xs" style={{ color: C.ink2 }}>{copy.weather.cond}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest" style={{ color: C.ink3 }}>{copy.weather.city}</p>
                    </Panel>
                    <Panel title={copy.panels.reminders}>
                      <ul className="flex flex-col gap-2">
                        <AnimatePresence initial={false}>
                          {s.reminder && (
                            <motion.li key="new" {...pop} className="rounded px-1.5 py-1" style={{ background: 'rgba(255,182,72,0.12)' }}>
                              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.amber }}>{copy.newReminder.time}</p>
                              <p className="text-xs" style={{ color: C.ink }}>{copy.newReminder.text}</p>
                            </motion.li>
                          )}
                        </AnimatePresence>
                        {copy.reminders.map((r) => (
                          <li key={r.text}>
                            <p className="text-[10px] uppercase tracking-wider" style={{ color: C.ink3 }}>{r.time}</p>
                            <p className="text-xs" style={{ color: C.ink2 }}>{r.text}</p>
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  </div>

                  {/* Center: core + chat */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 rounded-md px-4 py-3" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
                      <motion.div
                        className="h-14 w-14 shrink-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${C.cyan} 0%, rgba(63,216,255,0.25) 45%, transparent 70%)`,
                          boxShadow: `0 0 24px rgba(63,216,255,0.45)`,
                        }}
                        animate={s.working ? { scale: [1, 1.18, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 0.75 }}
                        transition={s.working ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                      />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: C.ink3, fontFamily: label }}>Mac Assistant</p>
                        <p className="text-xl font-light" style={{ color: C.ink }}>{copy.greeting}</p>
                      </div>
                    </div>
                    <Panel title={copy.panels.chat} className="flex-1">
                      <div className="flex h-[226px] flex-col justify-end gap-1.5 overflow-hidden">
                        <AnimatePresence initial={false}>
                          {phoneLines.slice(-5).map((l, i) => (
                            <motion.p
                              key={Math.max(0, s.phone - 5) + i}
                              layout
                              {...pop}
                              className={`max-w-[85%] whitespace-pre-line rounded px-2 py-1 text-[11px] leading-snug ${l.from === 'me' ? 'self-end' : 'self-start'}`}
                              style={
                                l.from === 'me'
                                  ? { background: 'rgba(63,216,255,0.14)', color: C.ink, border: `1px solid ${C.line}` }
                                  : { background: 'rgba(255,255,255,0.04)', color: C.ink2 }
                              }
                            >
                              {l.text}
                            </motion.p>
                          ))}
                        </AnimatePresence>
                        <p className="h-4 text-[10px] uppercase tracking-[0.2em]" style={{ color: C.cyan, fontFamily: label }}>
                          {s.working ? `● ${copy.panels.working}` : ''}
                        </p>
                      </div>
                    </Panel>
                  </div>

                  {/* Right: to-dos */}
                  <Panel title={copy.panels.todo}>
                    <ul className="flex flex-col gap-2">
                      <AnimatePresence initial={false}>
                        {s.todo && (
                          <motion.li key="new" {...pop} className="flex items-start gap-2 rounded px-1.5 py-1 text-xs" style={{ background: 'rgba(93,255,176,0.1)', color: C.ink }}>
                            <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border" style={{ borderColor: C.green }} />
                            {copy.newTodo}
                          </motion.li>
                        )}
                      </AnimatePresence>
                      {copy.todos.map((t) => (
                        <li key={t} className="flex items-start gap-2 px-1.5 text-xs" style={{ color: C.ink2 }}>
                          <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border" style={{ borderColor: C.ink3 }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>

                {/* The website fix, in an editor window over the dashboard */}
                <AnimatePresence>
                  {s.editor && s.editor !== 'none' && (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="absolute left-[188px] top-[150px] w-[392px] overflow-hidden rounded-lg border border-neutral-700 bg-[#1e1e22] shadow-2xl"
                    >
                      <div className="flex items-center gap-1.5 border-b border-neutral-700 bg-[#2a2a2f] px-3 py-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        <span className="ml-3 font-mono text-[11px] text-neutral-400">{copy.site.file}</span>
                      </div>
                      <div className="space-y-1 p-4 font-mono text-[12px] leading-relaxed">
                        <p className="text-neutral-500">&lt;section class=&quot;hero&quot;&gt;</p>
                        {s.editor === 'before' ? (
                          <p className="pl-4 text-neutral-200">&lt;h1&gt;{copy.site.before}&lt;/h1&gt;</p>
                        ) : (
                          <>
                            <p className="bg-[rgba(255,100,100,0.12)] pl-4 text-[#ff8a8a] line-through decoration-[#ff8a8a]/60">- &lt;h1&gt;{copy.site.before}&lt;/h1&gt;</p>
                            <p className="bg-[rgba(93,255,176,0.1)] pl-4 text-[#5dffb0]">+ &lt;h1&gt;{copy.site.after}&lt;/h1&gt;</p>
                          </>
                        )}
                        <p className="text-neutral-500">&lt;/section&gt;</p>
                      </div>
                      <AnimatePresence>
                        {s.editor === 'published' && (
                          <motion.p
                            {...pop}
                            className="border-t border-neutral-700 px-4 py-2 font-mono text-[11px]"
                            style={{ color: C.green }}
                          >
                            ✓ {copy.site.published}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Stand */}
            <div className="mx-auto h-[26px] w-[120px] bg-gradient-to-b from-neutral-400 to-neutral-500 [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
            <div className="mx-auto h-[6px] w-[220px] rounded-full bg-neutral-400" />
          </div>

          {/* iPhone */}
          <div
            className="absolute rounded-[34px] border-[6px] border-neutral-800 bg-black p-2.5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]"
            style={{ left: 742, top: 70, width: 250, height: 520 }}
          >
            <div className="mx-auto mb-2 h-4 w-20 rounded-full bg-neutral-900" aria-hidden="true" />
            <div className="flex flex-col items-center border-b border-neutral-800 pb-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-neutral-500 to-neutral-700 text-sm font-bold text-white">J</span>
              <p className="mt-0.5 text-[11px] font-medium text-white">Jarvis</p>
            </div>
            <div className="flex h-[380px] flex-col justify-end gap-1.5 overflow-hidden px-0.5 pb-1 pt-2">
              <AnimatePresence initial={false}>
                {phoneLines.slice(-6).map((l, i) => (
                  <motion.p
                    key={Math.max(0, s.phone - 6) + i}
                    layout
                    {...pop}
                    className={`max-w-[86%] whitespace-pre-line rounded-[1rem] px-2.5 py-1.5 text-[12px] leading-snug ${
                      l.from === 'me' ? 'self-end bg-[#0a84ff] text-white' : 'self-start bg-neutral-800 text-neutral-100'
                    }`}
                  >
                    {l.text}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-1 flex items-center gap-1.5" aria-hidden="true">
              <span className="h-7 flex-1 rounded-full border border-neutral-800" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a84ff] text-xs text-white">↑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caption + controls, like a video player */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (atEnd && !playing) setStep(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? copy.pause : copy.play}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-white text-brand-black transition-opacity hover:opacity-90"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-px" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setPlaying(true);
          }}
          aria-label={copy.replay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-dark2 text-brand-light1 transition-colors hover:text-brand-white"
        >
          <RotateCcw size={15} />
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-brand-dark2">
          <div className="h-full bg-[#0a84ff] transition-[width] duration-300" style={{ width: `${((step + 1) / SCRIPT.length) * 100}%` }} />
        </div>
      </div>
      <div className="mt-3 min-h-[3.5rem] text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={s.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-lg font-semibold leading-snug text-brand-white sm:text-xl"
          >
            {copy.captions[s.caption]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
