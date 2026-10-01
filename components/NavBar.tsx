'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Lock, GraduationCap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import LocaleSwitcher from './LocaleSwitcher';

interface NavBarProps {
  locale: string;
}

export default function NavBar({ locale }: NavBarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSignInOpen(false);
  }, [pathname]);

  // Close the sign-in menu on an outside click or Escape.
  useEffect(() => {
    if (!signInOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!signInRef.current?.contains(e.target as Node)) setSignInOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSignInOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [signInOpen]);

  // Team (sales reps) and Admin share one Sign in button in the header.
  const signInLinks = [
    { href: `/${locale}/team`, label: 'Team' },
    { href: `/${locale}/admin`, label: 'Admin' },
  ];

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/case-studies`, label: t('caseStudies') },
    // Only on wide screens in the top bar (no room at 1024px); always in the mobile menu.
    { href: `/${locale}/cards`, label: t('tapCards'), wideOnly: true },
    { href: `/${locale}/contact`, label: t('contact') },
    { href: `/${locale}/shop`, label: t('shop') },
    { href: `/${locale}/academy`, label: t('academy'), highlight: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-near-black/95 backdrop-blur-md border-b border-brand-dark2' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-display text-2xl text-brand-white tracking-tight">
            N°<span className="text-brand-light2">1</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wider uppercase transition-colors duration-200 ${link.wideOnly ? 'hidden xl:inline' : ''} ${
                  link.highlight
                    ? pathname.startsWith(`/${locale}/academy`)
                      ? 'text-brand-white flex items-center gap-1.5'
                      : 'text-brand-light2 hover:text-brand-white flex items-center gap-1.5'
                    : pathname === link.href
                    ? 'text-brand-white'
                    : 'text-brand-light1 hover:text-brand-white'
                }`}
              >
                {link.highlight && <GraduationCap size={13} />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: locale switcher + sign in + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LocaleSwitcher locale={locale} />
            <div ref={signInRef} className="relative">
              <button
                type="button"
                onClick={() => setSignInOpen(!signInOpen)}
                aria-expanded={signInOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 text-brand-mid hover:text-brand-light2 transition-colors"
              >
                <Lock size={13} />
                <span className="text-xs uppercase tracking-widest">Sign in</span>
                <ChevronDown size={12} className={`transition-transform ${signInOpen ? 'rotate-180' : ''}`} />
              </button>
              {signInOpen && (
                <div className="absolute right-0 top-full mt-3 w-40 border border-brand-dark2 bg-brand-near-black shadow-lg flex flex-col py-1">
                  {signInLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="px-4 py-2.5 text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white hover:bg-brand-dark1 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Button href={`/${locale}/contact`} variant="primary" className="text-xs">
              {t('bookCall')}
            </Button>
          </div>

          {/* Mobile: locale + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-brand-light2 hover:text-brand-white transition-colors p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-brand-dark1 border-b border-brand-dark2"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-2 text-sm tracking-wider uppercase border-b border-brand-dark2 last:border-0 transition-colors flex items-center gap-2 ${
                    link.highlight
                      ? pathname.startsWith(`/${locale}/academy`)
                        ? 'text-brand-white'
                        : 'text-brand-light2 hover:text-brand-white'
                      : pathname === link.href
                      ? 'text-brand-white'
                      : 'text-brand-light1 hover:text-brand-white'
                  }`}
                >
                  {link.highlight && <GraduationCap size={13} />}
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Button href={`/${locale}/contact`} variant="primary" className="w-full text-xs">
                  {t('bookCall')}
                </Button>
                <div className="flex items-center justify-center gap-5 py-2 text-brand-mid">
                  <Lock size={12} aria-hidden />
                  <span className="text-xs uppercase tracking-widest">Sign in:</span>
                  {signInLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="text-xs uppercase tracking-widest text-brand-light1 hover:text-brand-white transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
