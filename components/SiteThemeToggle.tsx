'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Light/dark switch for the whole site, remembered on this device.
const KEY = 'n1-site-theme';

export default function SiteThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private mode */ }
    const t = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.siteTheme = t;
    setTheme(t);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.siteTheme = next;
    try { localStorage.setItem(KEY, next); } catch { /* private mode */ }
    setTheme(next);
  }

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className="flex h-10 w-10 items-center justify-center rounded-full text-brand-light2 transition-colors hover:bg-brand-dark1 hover:text-brand-white">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
