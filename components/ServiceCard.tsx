'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot, Brain, Search, Monitor, Workflow, TrendingUp, ArrowRight, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Brain,
  Search,
  Monitor,
  Workflow,
  TrendingUp,
};

interface ServiceCardProps {
  icon: string;
  name: string;
  tagline: string;
  href: string;
  ctaLabel?: string;
  index?: number;
}

export default function ServiceCard({ icon, name, tagline, href, ctaLabel = 'Learn more', index = 0 }: ServiceCardProps) {
  const Icon = iconMap[icon] || Bot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-brand-dark1 border border-brand-dark2 p-6 transition-colors duration-200 hover:border-brand-mid cursor-pointer"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-brand-dark2 group-hover:bg-brand-mid/20 transition-colors mb-4">
        <Icon size={20} className="text-brand-light2 group-hover:text-brand-white transition-colors" />
      </div>
      <h3 className="font-display text-lg text-brand-white uppercase tracking-tight mb-2">
        {name}
      </h3>
      <p className="text-brand-light1 text-sm leading-relaxed flex-1">
        {tagline}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-brand-light2 hover:text-brand-white transition-colors text-xs uppercase tracking-widest font-semibold"
      >
        {ctaLabel}
        <ArrowRight size={13} />
      </Link>
    </motion.div>
  );
}
