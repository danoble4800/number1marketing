'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowRight, Bot, ChevronDown, Compass, CreditCard, GraduationCap, LayoutTemplate, Menu, Search, ShieldCheck,
  TrendingUp, UserRound, Users, Workflow, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LocaleSwitcher from './LocaleSwitcher';
import SiteThemeToggle from './SiteThemeToggle';

interface NavBarProps {
  locale: string;
}

export default function NavBar({ locale }: NavBarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSignInOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Close the header menus on an outside click or Escape.
  useEffect(() => {
    if (!signInOpen && !servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!signInRef.current?.contains(t)) setSignInOpen(false);
      if (!servicesRef.current?.contains(t)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSignInOpen(false); setServicesOpen(false); }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [signInOpen, servicesOpen]);

  // Customers, sales reps and admins share one Sign in menu (the person icon).
  const signInLinks = [
    { href: '/card', label: t('myTapCard'), hint: t('customers'), icon: CreditCard },
    { href: `/${locale}/team`, label: t('team'), icon: Users },
    { href: `/${locale}/admin`, label: t('admin'), icon: ShieldCheck },
  ];

  const services = [
    { slug: 'ai-agents', icon: Bot },
    { slug: 'ai-consulting', icon: Compass },
    { slug: 'seo', icon: Search },
    { slug: 'web-design', icon: LayoutTemplate },
    { slug: 'workflow-automation', icon: Workflow },
    { slug: 'growth-marketing', icon: TrendingUp },
  ].map((s) => ({
    ...s,
    href: `/${locale}/services#${s.slug}`,
    name: t(`svc.${s.slug.replace('-', '_')}.name`),
    desc: t(`svc.${s.slug.replace('-', '_')}.desc`),
  }));

  // Home lives on the logo, Contact on "Book a call", Case Studies in the Services menu.
  const navLinks = [
    { href: `/${locale}/cards`, label: t('tapCards') },
    { href: `/${locale}/shop`, label: t('shop') },
    { href: `/${locale}/about`, label: t('about') },
  ];
  const academyHref = `/${locale}/academy`;
  const servicesActive = pathname.startsWith(`/${locale}/services`) || pathname.startsWith(`/${locale}/case-studies`);

  const pill = (active: boolean) =>
    `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${
      active ? 'bg-brand-dark1 text-brand-white' : 'text-brand-light2 hover:bg-brand-dark1 hover:text-brand-white'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? 'bg-brand-near-black/95 backdrop-blur-md border-b border-brand-dark2' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-2">
          {/* Logo (also the way home) */}
          <Link href={`/${locale}`} aria-label={t('home')} className="font-display text-2xl text-brand-white tracking-tight">
            N°<span className="text-brand-light2">1</span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-6 hidden lg:flex items-center gap-1 xl:ml-10">
            <div ref={servicesRef} className="relative">
              <button
                type="button"
                onClick={() => { setServicesOpen(!servicesOpen); setSignInOpen(false); }}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className={pill(servicesActive || servicesOpen)}
              >
                {t('services')}
                <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div onClick={() => setServicesOpen(false)} className="absolute left-0 top-full mt-3 grid w-[560px] grid-cols-2 gap-0.5 rounded-2xl border border-brand-dark2 bg-brand-dark1 p-2.5 shadow-2xl">
                  {services.map((s) => (
                    <Link key={s.slug} href={s.href} className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-near-black">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-near-black text-brand-light2 group-hover:bg-brand-dark1">
                        <s.icon size={17} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-brand-white">{s.name}</span>
                        <span className="block text-[13px] leading-snug text-brand-light1">{s.desc}</span>
                      </span>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-1.5 flex items-center justify-between rounded-xl bg-brand-near-black px-3.5 py-3 text-sm">
                    <span className="text-brand-light1">{t('seeResults')}</span>
                    <Link href={`/${locale}/case-studies`} className="flex items-center gap-1 font-semibold text-brand-white hover:underline">
                      {t('caseStudiesLink')} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={pill(pathname.startsWith(link.href))}>
                {link.label}
              </Link>
            ))}
            <Link
              href={academyHref}
              className={`ml-1 flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${
                pathname.startsWith(academyHref)
                  ? 'bg-amber-400/25 text-amber-700 [[data-site-theme=dark]_&]:text-amber-200'
                  : 'bg-amber-400/15 text-amber-700 hover:bg-amber-400/25 [[data-site-theme=dark]_&]:text-amber-200'
              }`}
            >
              <GraduationCap size={15} />
              {t('academy')}
            </Link>
          </nav>

          {/* Right side: language, light/dark, sign in, Book a call */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <LocaleSwitcher locale={locale} />
            <SiteThemeToggle />
            <div ref={signInRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => { setSignInOpen(!signInOpen); setServicesOpen(false); }}
                aria-expanded={signInOpen}
                aria-haspopup="true"
                aria-label={t('signIn')}
                title={t('signIn')}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  signInOpen ? 'border-brand-light1 text-brand-white' : 'border-brand-dark2 text-brand-light2 hover:border-brand-light1 hover:text-brand-white'
                }`}
              >
                <UserRound size={18} />
              </button>
              {signInOpen && (
                <div onClick={() => setSignInOpen(false)} className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-brand-dark2 bg-brand-dark1 p-2 shadow-2xl">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-brand-mid">{t('signIn')}</p>
                  {signInLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-brand-offwhite hover:bg-brand-near-black">
                      <l.icon size={16} className="text-brand-light1" />
                      {l.label}
                      {l.hint && <span className="ml-auto text-xs text-brand-mid">{l.hint}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href={`/${locale}/contact`}
              className="ml-1 whitespace-nowrap rounded-full bg-brand-white px-3.5 py-2 text-[13px] font-semibold text-brand-black transition-colors hover:bg-brand-offwhite sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {t('bookCall')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark2 text-brand-light2 hover:text-brand-white lg:hidden"
              aria-label={t('menu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Phone menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto bg-brand-near-black border-b border-brand-dark2"
          >
            <nav className="flex flex-col px-5 pb-6 pt-2" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setMobileOpen(false); }}>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                aria-expanded={mobileServicesOpen}
                className="flex items-center justify-between border-b border-brand-dark2 py-3.5 text-left text-lg font-semibold text-brand-white"
              >
                {t('services')}
                <ChevronDown size={18} className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileServicesOpen && (
                <div className="flex flex-col border-b border-brand-dark2 py-1.5 pl-3">
                  {services.map((s) => (
                    <Link key={s.slug} href={s.href} className="py-2 text-[15px] text-brand-light2 hover:text-brand-white">{s.name}</Link>
                  ))}
                  <Link href={`/${locale}/case-studies`} className="py-2 text-[15px] text-brand-light2 hover:text-brand-white">{t('caseStudiesLink')}</Link>
                </div>
              )}
              {[...navLinks, { href: `/${locale}/contact`, label: t('contact') }].map((link) => (
                <Link key={link.href} href={link.href} className="border-b border-brand-dark2 py-3.5 text-lg font-semibold text-brand-white">
                  {link.label}
                </Link>
              ))}
              <Link href={academyHref} className="flex items-center gap-2 border-b border-brand-dark2 py-3.5 text-lg font-semibold text-amber-700 [[data-site-theme=dark]_&]:text-amber-200">
                <GraduationCap size={18} /> {t('academy')}
              </Link>
              <p className="pb-2 pt-5 text-[11px] font-semibold uppercase tracking-widest text-brand-mid">{t('signIn')}</p>
              <div className="flex gap-2">
                {signInLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="flex-1 rounded-full border border-brand-dark2 py-2 text-center text-sm font-medium text-brand-light2 hover:border-brand-light1 hover:text-brand-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
