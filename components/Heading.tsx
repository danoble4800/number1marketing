'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  xl: 'text-5xl sm:text-6xl lg:text-8xl leading-none tracking-tight',
  lg: 'text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight',
  md: 'text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight',
  sm: 'text-2xl sm:text-3xl leading-tight tracking-tight',
};

export default function Heading({
  children,
  as: Tag = 'h2',
  size = 'lg',
  className = '',
  animate = true,
}: HeadingProps) {
  const classes = `font-display uppercase ${sizeClasses[size]} text-brand-white ${className}`;

  if (!animate) {
    return <Tag className={classes}>{children}</Tag>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Tag className={classes}>{children}</Tag>
    </motion.div>
  );
}
