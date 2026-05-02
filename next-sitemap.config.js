/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com',
  generateRobotsTxt: true,
  i18n: { locales: ['en', 'es', 'fr'], defaultLocale: 'en' },
};
