'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe, ChevronDown } from 'lucide-react';

interface LocaleSwitcherProps {
  locale: string;
}

const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const t = useTranslations('localeSwitcher');
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const switchLocale = (newLocale: string) => {
    // Replace current locale prefix with new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || '/';

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    router.push(newPath);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-10 items-center gap-1 rounded-full px-2.5 text-sm transition-colors ${open ? 'bg-brand-dark1 text-brand-white' : 'text-brand-light2 hover:bg-brand-dark1 hover:text-brand-white'}`}
        aria-label={t('label')}
        aria-expanded={open}
        title={t('label')}
      >
        <Globe size={16} />
        <span className="font-semibold uppercase">{locale}</span>
        <ChevronDown size={13} className={`hidden transition-transform duration-200 sm:block ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-2xl border border-brand-dark2 bg-brand-dark1 p-1.5 shadow-2xl">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                loc.code === locale
                  ? 'bg-brand-near-black font-semibold text-brand-white'
                  : 'text-brand-light1 hover:bg-brand-near-black hover:text-brand-white'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
