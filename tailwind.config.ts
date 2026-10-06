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
        'brand-black': 'rgb(var(--brand-black) / <alpha-value>)',
        'brand-near-black': 'rgb(var(--brand-near-black) / <alpha-value>)',
        'brand-dark1': 'rgb(var(--brand-dark1) / <alpha-value>)',
        'brand-dark2': 'rgb(var(--brand-dark2) / <alpha-value>)',
        'brand-mid': 'rgb(var(--brand-mid) / <alpha-value>)',
        'brand-light1': 'rgb(var(--brand-light1) / <alpha-value>)',
        'brand-light2': 'rgb(var(--brand-light2) / <alpha-value>)',
        'brand-offwhite': 'rgb(var(--brand-offwhite) / <alpha-value>)',
        'brand-white': 'rgb(var(--brand-white) / <alpha-value>)',
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
