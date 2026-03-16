/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only for production builds (Capacitor).
  // Dev server needs dynamic routing to work normally.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig;