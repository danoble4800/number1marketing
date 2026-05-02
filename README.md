# Number 1 Digital Marketing

Production-ready website for Number 1 Digital Marketing — built with Next.js 14 App Router, Tailwind CSS v3, Framer Motion, and next-intl (EN / ES / FR).

## Prerequisites

- Node.js v18+ (project was built with v20)
- npm v9+

> **Note:** Due to a known issue with the `.bin/next` wrapper on this machine, all npm scripts use `node node_modules/next/dist/bin/next` directly. This is safe and functionally identical to `next`.

## Install

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | API key from resend.com for contact form emails |
| `NEXT_PUBLIC_CALENDLY_URL` | Your Calendly scheduling URL |
| `NEXT_PUBLIC_SITE_URL` | Production domain (used for sitemap + OG tags) |

## Development

```bash
npm run dev
# → http://localhost:3000
```

The root `/` redirects to `/en` by default. Visit `/es` or `/fr` for other locales.

## Build & start

```bash
npm run build   # builds + generates sitemap
npm start       # serves the production build
```

Build must complete with zero TypeScript errors and zero warnings.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard (same keys as `.env.example`)
4. Deploy — Vercel auto-detects Next.js

No `vercel.json` is needed.

## Adding a new locale

1. Create `messages/<locale>.json` — copy the structure from `messages/en.json` and translate every key
2. Add the locale to the `locales` array in `middleware.ts`
3. Add the locale to `generateStaticParams` in `app/[locale]/layout.tsx`
4. Add the locale to the `locales` array in `i18n.ts` (the validation guard)
5. Add `hreflang` entries in `next-sitemap.config.js`
6. Add the locale to `LocaleSwitcher.tsx`

That's it — no code changes elsewhere.

## Pages

| Route | Description |
|---|---|
| `/[locale]` | Home — hero, services grid, before/after, case study teaser, process, Calendly |
| `/[locale]/services` | All 6 services with sticky side nav |
| `/[locale]/about` | Brand story, beliefs, agency comparison, team |
| `/[locale]/case-studies` | Grid of 3 case studies |
| `/[locale]/case-studies/[slug]` | Full case study detail with stat counters |
| `/[locale]/contact` | Calendly embed + contact form |
| `/api/contact` | Server route — sends email via Resend |

## Tech stack

- **Next.js 14** App Router (TypeScript)
- **Tailwind CSS v3** — monochrome brand palette
- **Framer Motion** — scroll animations, stagger effects, stat counters
- **Lucide React** — icons
- **next-intl v4** — EN / ES / FR i18n
- **Resend** — transactional email
- **next-sitemap** — multilingual sitemap + robots.txt
