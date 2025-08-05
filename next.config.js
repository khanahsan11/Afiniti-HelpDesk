/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Required for Docker deployment
  output: 'standalone',
  // Enable if using Docker
  // experimental: {
  //   outputFileTracingRoot: path.join(__dirname, '../../'),
  // },
}

module.exports = nextConfig