import type { Metadata, Viewport } from 'next';
import { Inter, Anton, Playfair_Display, Space_Grotesk, Fraunces, Nunito, Space_Mono, Caveat } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton', display: 'swap' });
const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com'),
  title: { template: '%s', default: 'N°1 Tap Cards' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

// Customer pages and the card editor: no site nav or footer.
export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} ${serif.variable} ${grotesk.variable} ${fraunces.variable} ${nunito.variable} ${mono.variable} ${caveat.variable}`}>
      <body className="min-h-[100dvh] font-body antialiased">{children}</body>
    </html>
  );
}
