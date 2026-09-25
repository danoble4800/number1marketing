'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

// Shown once per browser session so returning to the homepage doesn't re-trigger it.
const SEEN_KEY = 'n1_audit_popup_seen';

function hasSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked (private mode etc.) — popup may show again, which is fine.
  }
}

export default function AuditPopup({ locale }: { locale: string }) {
  const t = useTranslations('auditPopup');
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const points = t.raw('points') as string[];

  useEffect(() => {
    if (hasSeen()) return;
    setOpen(true);
    markSeen();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="audit-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-black/80 px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
              className="absolute top-3 right-3 p-2 text-brand-light1 hover:text-brand-white transition-colors"
            >
              <X size={20} />
            </button>

            <p className="text-xs uppercase tracking-widest text-brand-light1 font-semibold mb-3">
              {t('eyebrow')}
            </p>
            <h2
              id="audit-popup-title"
              className="font-display uppercase text-3xl sm:text-4xl leading-none tracking-tight text-brand-white pr-6"
            >
              {t('headline')}
            </h2>
            <p className="mt-4 text-brand-light1 text-sm leading-relaxed">{t('body')}</p>

            <ul className="mt-5 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-brand-light2" />
                  <span className="text-brand-offwhite text-sm">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                href={`/${locale}/audit`}
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-brand-white text-brand-black border border-brand-white hover:bg-brand-offwhite text-sm font-semibold tracking-widest uppercase transition-colors"
              >
                {t('cta')}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light1 transition-colors py-2"
              >
                {t('dismiss')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
