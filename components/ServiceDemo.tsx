'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, Check, Heart, MapPin, MessageSquare, MousePointer2, Phone, Play, Star, UserPlus, Users } from 'lucide-react';
import { useRef, type ReactNode, type RefObject } from 'react';
import { EASE, pop, useLoop } from './illustrations/useLoop';

// Small looping animations on /services that show each service doing its job.
// Each demo is a list of steps on a timer; the timer only runs while the demo is
// on screen, and reduced motion shows the finished last step.

export interface ServiceDemoCopy {
  label: string;
  chatIn: string;
  chatOut: string;
  chatBooked: string;
  replied: string;
  webCta: string;
  webCalling: string;
  searchQuery: string;
  searchYou: string;
  searchOther: string;
  searchTop: string;
  socialFollowers: string;
  socialPosted: string;
  adsSent: string;
  adsOpened: string;
  adsClicked: string;
  adsBooked: string;
  flowLead: string;
  flowCrm: string;
  flowText: string;
  flowTeam: string;
  flowDone: string;
}

function Frame({ label, children, innerRef }: { label: string; children: ReactNode; innerRef: RefObject<HTMLDivElement> }) {
  return (
    <div ref={innerRef} aria-hidden="true" className="select-none border border-brand-dark2 bg-brand-dark1 p-5">
      <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-brand-mid">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {label}
      </div>
      <div className="relative h-[220px] overflow-hidden">{children}</div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-brand-light1"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

// Never Miss a Lead: a text comes in, gets an instant reply, call gets booked.
function ChatDemo({ copy }: { copy: ServiceDemoCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 6, 1300);

  return (
    <Frame label={copy.label} innerRef={ref}>
      <div className="flex h-full flex-col gap-2.5">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div key="in" {...pop} className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-brand-dark2 px-3.5 py-2.5 text-sm text-brand-white">
              {copy.chatIn}
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="typing" {...pop} className="self-end rounded-2xl rounded-br-sm bg-brand-mid/30 px-3.5 py-3">
              <TypingDots />
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div key="out" {...pop} className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-brand-white px-3.5 py-2.5 text-sm text-brand-black">
              {copy.chatOut}
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div key="replied" {...pop} className="self-end text-[11px] text-brand-light1">
              {copy.replied}
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div key="booked" {...pop} className="mt-auto flex items-center gap-2 self-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
              <Check size={14} />
              {copy.chatBooked}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}

// Websites: a page builds itself, then a visitor taps "Call now".
function WebDemo({ copy }: { copy: ServiceDemoCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 7, 900);
  const block = (n: number) => ({
    initial: false as const,
    animate: { opacity: step >= n ? 1 : 0, y: step >= n ? 0 : 8 },
    transition: { duration: 0.4, ease: EASE },
  });

  return (
    <Frame label={copy.label} innerRef={ref}>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-brand-dark2 bg-brand-near-black">
        <div className="flex items-center gap-1.5 border-b border-brand-dark2 px-3 py-2">
          {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-brand-dark2" />)}
          <span className="ml-2 h-3 flex-1 rounded bg-brand-dark2" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <motion.div {...block(1)} className="flex items-center justify-between">
            <span className="h-3 w-16 rounded bg-brand-mid/50" />
            <span className="flex gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-8 rounded bg-brand-dark2" />)}</span>
          </motion.div>
          <motion.div {...block(2)} className="space-y-2">
            <span className="block h-5 w-3/4 rounded bg-brand-mid/40" />
            <span className="block h-2.5 w-1/2 rounded bg-brand-dark2" />
          </motion.div>
          <motion.div {...block(3)} className="relative self-start">
            <motion.span
              animate={step === 5 ? { scale: [1, 0.94, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 rounded-md bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-black"
            >
              <Phone size={12} />
              {step >= 5 ? copy.webCalling : copy.webCta}
            </motion.span>
            {step >= 4 && (
              <motion.span
                initial={{ x: 90, y: 40, opacity: 0 }}
                animate={{ x: 52, y: 14, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute left-0 top-0 drop-shadow"
              >
                <MousePointer2 size={18} className="fill-brand-white text-brand-black" />
              </motion.span>
            )}
          </motion.div>
          <motion.div {...block(3)} className="mt-auto grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => <span key={i} className="h-10 rounded bg-brand-dark2" />)}
          </motion.div>
        </div>
      </div>
    </Frame>
  );
}

// Google Search: your business climbs from 4th to the top result.
function SearchDemo({ copy }: { copy: ServiceDemoCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 5, 1200);
  const youAt = [3, 3, 2, 1, 0][step];
  const order = [0, 1, 2].map((i) => ({ id: `c${i}`, you: false }));
  order.splice(youAt, 0, { id: 'you', you: true });

  return (
    <Frame label={copy.label} innerRef={ref}>
      <div className="flex items-center gap-2 rounded-full border border-brand-dark2 px-3 py-2 text-sm text-brand-light2">
        <span className="h-3 w-3 rounded-full border-2 border-brand-mid" />
        {copy.searchQuery}
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {order.map((row, i) => (
          <motion.div
            key={row.id}
            layout
            transition={{ duration: 0.5, ease: EASE }}
            className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ${row.you ? 'border border-brand-mid/60 bg-brand-dark2' : 'border border-transparent'}`}
          >
            <MapPin size={14} className={row.you ? 'text-rose-400' : 'text-brand-mid'} />
            <span className={`text-sm ${row.you ? 'font-semibold text-brand-white' : 'text-brand-light1'}`}>
              {row.you ? copy.searchYou : copy.searchOther}
            </span>
            {row.you && youAt === 0 ? (
              <motion.span {...pop} className="ml-auto rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500">
                {copy.searchTop}
              </motion.span>
            ) : (
              <span className="ml-auto flex gap-0.5 text-brand-light2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={9} fill="currentColor" strokeWidth={0} className={!row.you && s > 2 + (i % 2) ? 'opacity-30' : ''} />
                ))}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

// Social Media: follower count climbs, posts fill the grid, likes float up.
function SocialDemo({ copy, locale }: { copy: ServiceDemoCopy; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 7, 1000);
  const followers = [1820, 1960, 2140, 2390, 2710, 3080, 3460][step];

  return (
    <Frame label={copy.label} innerRef={ref}>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full border-2 border-brand-mid/60 bg-brand-dark2" />
        <div>
          <div className="font-display text-2xl tabular-nums text-brand-white">{new Intl.NumberFormat(locale).format(followers)}</div>
          <div className="flex items-center gap-1 text-[11px] text-brand-light1">
            <Users size={11} />
            {copy.socialFollowers}
          </div>
        </div>
        <div className="relative ml-auto h-12 w-8">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 text-rose-400"
              style={{ left: i * 8 }}
              animate={{ y: [0, -44], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
            >
              <Heart size={12} fill="currentColor" strokeWidth={0} />
            </motion.span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i < step ? 1 : 0.25, scale: i === step - 1 ? [0.9, 1] : 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex h-14 items-center justify-center rounded-md bg-brand-dark2"
          >
            {i % 2 === 0 && <Play size={14} className="text-brand-light1" fill="currentColor" strokeWidth={0} />}
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} {...pop} className="absolute bottom-0 left-0 flex items-center gap-1.5 text-[11px] text-brand-light1">
          {step % 2 === 0 ? <BellRing size={12} /> : <Play size={12} />}
          {copy.socialPosted}
        </motion.div>
      </AnimatePresence>
    </Frame>
  );
}

// Ads & Email: a funnel that fills from sent to booked.
function FunnelDemo({ copy, locale }: { copy: ServiceDemoCopy; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 6, 1100);
  const fmt = new Intl.NumberFormat(locale);
  const rows = [
    { label: copy.adsSent, value: 2400, pct: 100 },
    { label: copy.adsOpened, value: 1390, pct: 58 },
    { label: copy.adsClicked, value: 312, pct: 22 },
    { label: copy.adsBooked, value: 31, pct: 9 },
  ];

  return (
    <Frame label={copy.label} innerRef={ref}>
      <div className="flex h-full flex-col justify-center gap-4">
        {rows.map((row, i) => {
          const shown = step > i;
          return (
            <div key={row.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-brand-light1">{row.label}</span>
                <span className="font-semibold tabular-nums text-brand-white">{shown ? fmt.format(row.value) : '—'}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-brand-dark2">
                <motion.div
                  initial={false}
                  animate={{ width: shown ? `${row.pct}%` : '0%' }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className={`h-full rounded-full ${i === rows.length - 1 ? 'bg-emerald-400' : 'bg-brand-mid/60'}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

// Less Busywork: a new lead runs through an automation, step by step.
function FlowDemo({ copy }: { copy: ServiceDemoCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, 7, 800);
  const nodes = [
    { icon: <UserPlus size={14} />, label: copy.flowLead },
    { icon: <Check size={14} />, label: copy.flowCrm },
    { icon: <MessageSquare size={14} />, label: copy.flowText },
    { icon: <BellRing size={14} />, label: copy.flowTeam },
  ];

  return (
    <Frame label={copy.label} innerRef={ref}>
      <div className="flex flex-col">
        {nodes.map((node, i) => {
          const done = step > i;
          return (
            <div key={node.label}>
              <motion.div
                initial={false}
                animate={{ opacity: done ? 1 : 0.4 }}
                className="flex items-center gap-3"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${done ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-500' : 'border-brand-dark2 text-brand-light1'}`}
                >
                  {node.icon}
                </span>
                <span className="text-sm text-brand-white">{node.label}</span>
                {done && <Check size={14} className="ml-auto text-emerald-500" />}
              </motion.div>
              {i < nodes.length - 1 && (
                <div className="relative ml-4 h-4 w-px bg-brand-dark2">
                  <motion.span
                    initial={false}
                    animate={{ height: step > i + 1 ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 w-px bg-emerald-400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {step >= 5 && (
          <motion.div key="done" {...pop} className="absolute bottom-0 left-0 text-xs font-semibold text-emerald-500">
            {copy.flowDone}
          </motion.div>
        )}
      </AnimatePresence>
    </Frame>
  );
}

export default function ServiceDemo({ slug, copy, locale }: { slug: string; copy: ServiceDemoCopy; locale: string }) {
  switch (slug) {
    case 'ai-agents':
      return <ChatDemo copy={copy} />;
    case 'web-design':
      return <WebDemo copy={copy} />;
    case 'seo':
      return <SearchDemo copy={copy} />;
    case 'social-media':
      return <SocialDemo copy={copy} locale={locale} />;
    case 'growth-marketing':
      return <FunnelDemo copy={copy} locale={locale} />;
    case 'workflow-automation':
      return <FlowDemo copy={copy} />;
    default:
      return null;
  }
}
