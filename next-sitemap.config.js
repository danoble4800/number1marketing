// Sign-in, dashboard, admin and form-only pages stay out of the sitemap and out of search.
const PRIVATE = [
  '/api/*',
  '/card',
  '/card/*',
  '/t/*',
  '/c/*',
  '/*/admin',
  '/*/team',
  '/*/onboarding',
  '/*/nfc-lead',
  '/*/academy/login',
  '/*/academy/dashboard',
  '/*/academy/admin',
  '/*/academy/reset-password',
  '/*/academy/verify',
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com',
  generateRobotsTxt: true,
  exclude: PRIVATE,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/card', '/*/admin', '/*/team', '/*/onboarding', '/*/academy/admin', '/*/academy/dashboard'],
      },
    ],
  },
};
