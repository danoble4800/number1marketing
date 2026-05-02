'use client';

import { motion } from 'framer-motion';
import Button from './Button';
import HeroWords from './HeroWords';

interface HeroSectionProps {
  headline: string;
  headlineAccent: string;
  subline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  locale: string;
}

export default function HeroSection({
  headline,
  headlineAccent,
  subline,
  ctaPrimary,
  ctaSecondary,
  locale,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-near-black">
      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
        }}
      />
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-brand-dark2/30 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <HeroWords headline={headline} headlineAccent={headlineAccent} />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-brand-light1 text-lg leading-relaxed"
        >
          {subline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href={`/${locale}/contact`} variant="primary" className="text-sm px-8 py-4">
            {ctaPrimary}
          </Button>
          <Button href={`/${locale}/case-studies`} variant="ghost" className="text-sm px-8 py-4">
            {ctaSecondary}
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-brand-mid" />
      </motion.div>
    </section>
  );
}
