/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.prasasta.co.id', 'prasasta.co.id', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.prasasta.co.id',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'prasasta.co.id',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.prasasta.co.id/api/v1',
  },
  // Untuk static export (jika menggunakan static hosting)
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
}

module.exports = nextConfig

