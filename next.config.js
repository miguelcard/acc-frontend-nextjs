/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
}

// set up the plugin which links your i18n/request.ts file to next-intl.
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
 
module.exports = withNextIntl(nextConfig);