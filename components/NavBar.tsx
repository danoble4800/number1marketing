'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/case-studies`, label: t('caseStudies') },
    { href: `/${locale}/contact`, label: t('contact') },
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
                className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-brand-white'
                    : 'text-brand-light1 hover:text-brand-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: locale switcher + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LocaleSwitcher locale={locale} />
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
                  className={`py-3 px-2 text-sm tracking-wider uppercase border-b border-brand-dark2 last:border-0 transition-colors ${
                    pathname === link.href
                      ? 'text-brand-white'
                      : 'text-brand-light1 hover:text-brand-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Button href={`/${locale}/contact`} variant="primary" className="w-full text-xs">
                  {t('bookCall')}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
