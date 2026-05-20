import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Container from './Container';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  const serviceLinks = [
    { href: `/${locale}/services#ai-agents`, label: 'AI Agents' },
    { href: `/${locale}/services#ai-consulting`, label: 'AI Consulting' },
    { href: `/${locale}/services#seo`, label: 'SEO' },
    { href: `/${locale}/services#web-design`, label: 'Web Design' },
    { href: `/${locale}/services#workflow-automation`, label: 'Workflow Automation' },
    { href: `/${locale}/services#growth-marketing`, label: 'Growth Marketing' },
  ];

  const companyLinks = [
    { href: `/${locale}/about`, label: nav('about') },
    { href: `/${locale}/case-studies`, label: nav('caseStudies') },
    { href: `/${locale}/contact`, label: nav('contact') },
  ];

  return (
    <footer className="bg-brand-black border-t border-brand-dark2">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="font-display text-3xl text-brand-white tracking-tight">
              N°<span className="text-brand-light2">1</span>
            </Link>
            <p className="mt-3 text-brand-light1 text-sm leading-relaxed">
              {t('tagline')}
            </p>
            <a
              href="https://instagram.com/number1marketing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-brand-light1 hover:text-brand-white transition-colors text-sm"
            >
              <span className="font-display text-xs">IG</span>
              {t('instagram')}
            </a>
          </div>

          {/* Services */}
          <div>
            <p className="text-brand-white font-semibold text-xs tracking-widest uppercase mb-4">
              {t('services')}
            </p>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-light1 hover:text-brand-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-brand-white font-semibold text-xs tracking-widest uppercase mb-4">
              {t('company')}
            </p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-light1 hover:text-brand-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-brand-white font-semibold text-xs tracking-widest uppercase mb-4">
              {t('legal')}
            </p>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-brand-light1 hover:text-brand-white transition-colors text-sm">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-brand-light1 hover:text-brand-white transition-colors text-sm">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-dark2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-brand-mid text-xs">
            {t('copyright', { year })}
          </p>
          <div className="flex items-center gap-6">
            <p className="text-brand-mid text-xs">
              {t('builtWith')}
            </p>
            <Link
              href={`/${locale}/admin`}
              className="flex items-center gap-1.5 text-brand-mid hover:text-brand-light2 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className="text-xs uppercase tracking-widest">Admin</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
