import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-near-black': '#0E0E10',
        'brand-dark1': '#1A1A1E',
        'brand-dark2': '#2D2D32',
        'brand-mid': '#5F5F64',
        'brand-light1': '#8C8C91',
        'brand-light2': '#B9B9BE',
        'brand-offwhite': '#F5F5F6',
        'brand-white': '#FFFFFF',
        // Card editor: light by default, dark on request (values in globals.css).
        'ed-bg': 'rgb(var(--ed-bg) / <alpha-value>)',
        'ed-surface': 'rgb(var(--ed-surface) / <alpha-value>)',
        'ed-field': 'rgb(var(--ed-field) / <alpha-value>)',
        'ed-line': 'rgb(var(--ed-line) / <alpha-value>)',
        'ed-faint': 'rgb(var(--ed-faint) / <alpha-value>)',
        'ed-muted': 'rgb(var(--ed-muted) / <alpha-value>)',
        'ed-soft': 'rgb(var(--ed-soft) / <alpha-value>)',
        'ed-fg': 'rgb(var(--ed-fg) / <alpha-value>)',
        'ed-ink': 'rgb(var(--ed-ink) / <alpha-value>)',
        'ed-ok': 'rgb(var(--ed-ok) / <alpha-value>)',
        'ed-warn': 'rgb(var(--ed-warn) / <alpha-value>)',
        'ed-err': 'rgb(var(--ed-err) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-anton)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
