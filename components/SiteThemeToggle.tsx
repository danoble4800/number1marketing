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
    <button type="button" onClick={toggle} aria-label={label} title={label} className="p-1 text-brand-light1 transition-colors hover:text-brand-white">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
