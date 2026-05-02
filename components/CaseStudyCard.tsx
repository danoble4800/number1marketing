'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CaseStudyCardProps {
  stat: string;
  statLabel: string;
  title: string;
  client: string;
  industry: string;
  href: string;
  ctaLabel?: string;
  index?: number;
}

export default function CaseStudyCard({
  stat,
  statLabel,
  title,
  client,
  industry,
  href,
  ctaLabel = 'Read the story',
  index = 0,
}: CaseStudyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col bg-brand-dark1 border border-brand-dark2 hover:border-brand-mid transition-colors duration-200"
    >
      <div className="p-6 border-b border-brand-dark2 bg-brand-dark2/40">
        <div className="font-display text-4xl text-brand-white tracking-tight">{stat}</div>
        <div className="text-brand-light1 text-xs uppercase tracking-widest mt-1">{statLabel}</div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs text-brand-mid uppercase tracking-widest mb-3">{industry}</p>
        <h3 className="text-brand-offwhite font-semibold text-lg leading-snug mb-2">{title}</h3>
        <p className="text-brand-light1 text-sm">{client}</p>
        <div className="mt-auto pt-5">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-brand-light2 hover:text-brand-white transition-colors text-xs uppercase tracking-widest font-semibold"
          >
            {ctaLabel}
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
