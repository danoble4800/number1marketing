import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const locales = ['en', 'es', 'pt'] as const;
type Locale = (typeof locales)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: '%s | Number 1 Digital Marketing',
      default: 'Number 1 Digital Marketing',
    },
    icons: {
      apple: '/apple-touch-icon.png',
    },
    description:
      'The #1 Growth & AI Marketing Partner. Custom AI agents, automation systems, SEO, and web design for modern businesses.',
    openGraph: {
      siteName: 'Number 1 Digital Marketing',
      locale,
      type: 'website',
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        fr: `${siteUrl}/fr`,
        'x-default': `${siteUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${anton.variable}`}>
      <body className="bg-brand-near-black text-brand-offwhite font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <NavBar locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
