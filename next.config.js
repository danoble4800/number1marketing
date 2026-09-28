const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Tap Cards admin moved into the admin CRM as the "Tap Cards" tab.
      { source: '/card/admin', destination: '/en/admin?tab=cards', permanent: false },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
