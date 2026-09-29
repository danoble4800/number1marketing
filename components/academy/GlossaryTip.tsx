'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTerm, toLocale } from '@/content/academy/glossary';

// A glossary term inside a lesson: tap it to see the definition without leaving the page.
export default function GlossaryTip({ id, locale, children }: { id: string; locale: string; children: React.ReactNode }) {
  const t = useTranslations('academy.glossary');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const term = getTerm(id);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  if (!term) return <>{children}</>;
  const [name, definition] = term[toLocale(locale)];

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-brand-offwhite underline decoration-dotted decoration-brand-mid underline-offset-4 hover:decoration-brand-light1"
      >
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 block w-72 max-w-[80vw] border border-brand-dark2 bg-brand-black p-4 text-left text-sm shadow-xl"
        >
          <span className="block font-semibold text-brand-white">{name}</span>
          <span className="mt-1 block text-brand-light1 leading-relaxed">{definition}</span>
          <Link
            href={`/${locale}/academy/glossary#${term.id}`}
            className="mt-3 inline-block text-xs uppercase tracking-widest text-brand-light2 hover:text-brand-white"
          >
            {t('openGlossary')} →
          </Link>
        </span>
      )}
    </span>
  );
}
