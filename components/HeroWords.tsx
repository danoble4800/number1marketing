'use client';

import { motion, type Variants } from 'framer-motion';

interface HeroWordsProps {
  headline: string;
  headlineAccent: string;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0, 0, 1] } },
};

export default function HeroWords({ headline, headlineAccent }: HeroWordsProps) {
  const words1 = headline.split(' ');
  const words2 = headlineAccent.split(' ');

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className="font-display text-5xl sm:text-6xl lg:text-8xl text-brand-white uppercase tracking-tighter leading-none"
    >
      <span className="block">
        {words1.map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block mr-[0.2em]">
            {w}
          </motion.span>
        ))}
      </span>
      <span className="block text-brand-light2">
        {words2.map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block mr-[0.2em]">
            {w}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}
