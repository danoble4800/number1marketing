import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SiteChrome from '@/components/SiteChrome';
import ActivityToast from '@/components/ActivityToast';

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

// Business details for Google rich results. No street address (no office yet);
// add `telephone` once the Google Voice number is set up.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Number 1 Digital Marketing',
  url: siteUrl,
  logo: `${siteUrl}/apple-touch-icon.png`,
  image: `${siteUrl}/og-image.png`,
  description:
    'Websites, instant lead follow-up, Google reviews, SEO and automation that turn searches into booked jobs.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Boston',
    addressRegion: 'MA',
    addressCountry: 'US',
  },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  sameAs: ['https://instagram.com/number1marketing'],
};
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
      'More calls, customers and followers for your business. Websites, Google, ads, social media and instant replies to every new lead.',
    openGraph: {
      siteName: 'Number 1 Digital Marketing',
      locale,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        pt: `${siteUrl}/pt`,
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
    <html data-site-theme="light" suppressHydrationWarning lang={locale} className={`${inter.variable} ${anton.variable}`}>
      <body className="bg-brand-near-black text-brand-offwhite font-body antialiased">
        {/* Apply a saved dark choice before first paint so the page doesn't flash light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('n1-site-theme')==='dark')document.documentElement.dataset.siteTheme='dark'}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SiteChrome><NavBar locale={locale} /></SiteChrome>
          <main>{children}</main>
          <SiteChrome><Footer locale={locale} /></SiteChrome>
          <SiteChrome><ActivityToast /></SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
