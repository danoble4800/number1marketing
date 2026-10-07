'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Play, Star, UserPlus, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Small "recent activity" card in the bottom-left of public pages. The events are
// sample copy in messages/*.json (activity.events); swap in real ones there.
// Dismissing it keeps it hidden for the rest of the visit.

const DISMISSED_KEY = 'n1_activity_dismissed';
const FIRST_DELAY = 12_000;
const SHOW_FOR = 6_000;
const GAP = 20_000;

// Pages where a popup would get in the way: forms people are filling in and logged-in areas.
const HIDDEN_ON = /^\/[a-z]{2}\/(audit|contact|onboarding|academy\/(dashboard|login|module|admin|reset-password|verify))(\/|$)/;

const ICONS = {
  calendar: CalendarCheck,
  users: Users,
  lead: UserPlus,
  play: Play,
  star: Star,
} as const;

type ActivityEvent = { icon: keyof typeof ICONS; text: string; time: string };

function isDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export default function ActivityToast() {
  const t = useTranslations('activity');
  const events = t.raw('events') as ActivityEvent[];
  const pathname = usePathname();
  const hidden = HIDDEN_ON.test(pathname);
  const [index, setIndex] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (hidden || isDismissed() || events.length === 0) return;
    let next = 0;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      // On phones and tablets the home hero has its own floating cards, so wait
      // until the visitor has scrolled past it.
      const onHomeHero = /^\/[a-z]{2}\/?$/.test(window.location.pathname) && window.innerWidth < 1280 && window.scrollY < window.innerHeight * 0.6;
      if (onHomeHero) {
        timer = setTimeout(show, 3000);
        return;
      }
      setIndex(next);
      next = (next + 1) % events.length;
      timer = setTimeout(hide, SHOW_FOR);
    };
    const hide = () => {
      setIndex(null);
      timer = setTimeout(show, GAP);
    };
    timer = setTimeout(show, FIRST_DELAY);
    return () => clearTimeout(timer);
  }, [hidden, events.length]);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {}
  };

  const event = index === null || dismissed || hidden ? null : events[index];
  const Icon = event ? ICONS[event.icon] ?? UserPlus : null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-40 sm:right-auto">
      <AnimatePresence>
        {event && Icon && (
          <motion.div
            key={index}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-brand-dark2 bg-brand-dark1/90 py-3 pl-3 pr-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] backdrop-blur-md sm:w-[340px]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark2 text-brand-white">
              <Icon size={16} {...(event.icon === 'star' || event.icon === 'play' ? { fill: 'currentColor', strokeWidth: 0 } : {})} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-brand-white">{event.text}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-brand-light1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {event.time}
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t('close')}
              className="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full text-brand-light1 transition-colors hover:bg-brand-dark2 hover:text-brand-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
