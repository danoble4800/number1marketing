import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Check, Nfc, Pencil, Star, TrendingUp } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import CardView from '@/components/cards/CardView';
import { DEMO_PAGES } from '@/lib/cards/demo';
import { PLANS, PLAN_ORDER } from '@/lib/cards/plans';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';

// Fonts the customer-page themes use (the site layout only loads Inter and Anton).
const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });

export const metadata: Metadata = {
  title: 'Tap Cards',
  description:
    'NFC business cards and review cards with a page you edit yourself. Free page included, Pro and Business plans for more.',
};

const STEPS = [
  { icon: Nfc, title: 'Tap', body: 'Hold the card near any phone. No app needed. iPhone and Android open your page instantly.' },
  { icon: Pencil, title: 'Edit any time', body: 'Change your links, photo, colors or special from your phone. Your card updates right away.' },
  { icon: TrendingUp, title: 'See what works', body: 'Count taps, clicks and new contacts, and know which buttons people actually use.' },
];

const FAQ = [
  ['Do people need an app?', 'No. Every modern iPhone and Android reads the card with the camera off. There’s also a QR code for older phones.'],
  ['What if I lose my card?', 'Switch it off from your dashboard in one tap, and link a new card to the same page.'],
  ['Can I change what the card opens?', 'Yes, as often as you like. The card never needs to be reprogrammed.'],
  ['What’s a review card?', 'A card or counter stand that opens your Google review page in one tap. Businesses use it at the register to collect reviews every day.'],
  ['Can I cancel?', 'Yes, any time. Your page drops to the Free plan and keeps working.'],
];

export default async function CardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={`${serif.variable} ${grotesk.variable}`}>
      <Section className="bg-brand-near-black pt-28 lg:pt-36">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-light1">N°1 Tap Cards</p>
              <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-tight text-brand-white sm:text-6xl lg:text-7xl">
                One tap. <span className="text-brand-light2">Your whole business.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-brand-light1">
                A card that opens a page you design yourself: contact info, links, reviews, specials. Hand it out once and update it
                forever. Every card comes with a free page.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/shop`} className="bg-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite">
                  Get your card
                </Link>
                <Link href="/card/edit?demo=pizza" className="border border-brand-mid px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-white hover:border-brand-white">
                  Try the editor
                </Link>
              </div>
              <p className="mt-4 text-sm text-brand-mid">
                Already have a card? <Link href="/card" className="text-brand-light2 underline">Sign in</Link>
              </p>
            </div>
            <div className="flex justify-center gap-4">
              {[DEMO_PAGES[1], DEMO_PAGES[2]].map((p, i) => (
                <div
                  key={p.id}
                  className={`relative h-[520px] w-[250px] shrink-0 overflow-hidden rounded-[36px] border-[8px] border-[#222226] bg-black shadow-2xl sm:h-[580px] sm:w-[280px] ${i === 1 ? 'mt-10 hidden sm:block' : ''}`}
                >
                  <div className="pointer-events-none h-full overflow-hidden" aria-hidden="true">
                    <CardView page={p} preview />
                  </div>
                  <a href={`/c/${p.slug}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={`Open example page: ${p.display_name}`} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-brand-dark2 bg-brand-near-black">
        <Container>
          <div className="grid gap-px bg-brand-dark2 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.title} className="bg-brand-near-black p-8">
                <s.icon className="text-brand-white" size={26} />
                <h2 className="mt-5 font-display text-2xl uppercase text-brand-white">{s.title}</h2>
                <p className="mt-2 text-brand-light1">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-dark1">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-light1">For local businesses</p>
              <h2 className="font-display text-4xl uppercase leading-none text-brand-white sm:text-5xl">More Google reviews, every day</h2>
              <p className="mt-5 text-brand-light1">
                Put a review card at the register or on every table. One tap opens your Google review page. With Business, customers
                rate you first, and anyone who had a bad experience can also message you privately so you can make it right.
              </p>
              <ul className="mt-6 space-y-2 text-brand-light2">
                {['Counter stands, table stickers and cards', 'See how many people tapped and how they rated you', 'Add a weekly special or coupon to bring them back'].map((x) => (
                  <li key={x} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-brand-white" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="flex w-full max-w-sm flex-col items-center border border-brand-dark2 bg-brand-near-black p-10 text-center">
                <div className="flex gap-1 text-brand-white">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={28} fill="currentColor" />)}</div>
                <p className="mt-5 font-display text-2xl uppercase text-brand-white">Tap to review us</p>
                <p className="mt-2 text-sm text-brand-light1">Hold your phone here</p>
                <Nfc className="mt-6 text-brand-light2" size={40} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-near-black" id="pricing">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl uppercase text-brand-white sm:text-5xl">Plans</h2>
            <p className="mt-3 text-brand-light1">Buy the card once. The Free page is yours to keep. Upgrade when you want more.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PLAN_ORDER.map((p) => {
              const plan = PLANS[p];
              return (
                <div key={p} className={`flex flex-col border p-7 ${p === 'pro' ? 'border-brand-white bg-brand-dark1' : 'border-brand-dark2 bg-brand-dark1'}`}>
                  <p className="text-xs uppercase tracking-widest text-brand-light1">{plan.name}{p === 'pro' && ' · Most popular'}</p>
                  <p className="mt-3 font-display text-4xl text-brand-white">{plan.price}</p>
                  <p className="text-sm text-brand-mid">{plan.yearly}</p>
                  <p className="mt-3 text-sm text-brand-light1">{plan.blurb}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm text-brand-light2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-brand-white" />{f}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/c/demo-${p === 'free' ? 'free' : p === 'pro' ? 'realtor' : 'pizza'}`}
                    className="mt-6 border border-brand-mid py-3 text-center text-xs font-semibold uppercase tracking-widest text-brand-white hover:border-brand-white"
                  >
                    See an example
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-brand-dark2 bg-brand-near-black">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-4xl uppercase text-brand-white">Questions</h2>
            <div className="mt-8 divide-y divide-brand-dark2 border-y border-brand-dark2">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group py-5">
                  <summary className="cursor-pointer list-none text-lg text-brand-white">{q}</summary>
                  <p className="mt-2 text-brand-light1">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-12 border border-brand-dark2 bg-brand-dark1 p-8 text-center">
              <h3 className="font-display text-3xl uppercase text-brand-white">Want the card to bring in customers, too?</h3>
              <p className="mx-auto mt-3 max-w-xl text-brand-light1">
                We build the website, reviews and follow-up system behind your card. Start with a free 30-minute audit.
              </p>
              <Link href={`/${locale}/audit?utm_source=tapcards`} className="mt-6 inline-block bg-brand-white px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-brand-black">
                Book a free audit
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
