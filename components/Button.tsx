'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

type Variant = 'primary' | 'ghost' | 'outline';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-white text-brand-black border border-brand-white hover:bg-brand-offwhite',
  ghost:
    'bg-transparent text-brand-white border border-brand-white hover:bg-brand-white/10',
  outline:
    'bg-transparent text-brand-light2 border border-brand-dark2 hover:border-brand-light1 hover:text-brand-white',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-semibold tracking-widest uppercase transition-colors duration-200 cursor-pointer select-none';

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  external = false,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-40 pointer-events-none' : ''}`;

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  };

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...motionProps}
        >
          {children}
        </motion.a>
      );
    }
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
