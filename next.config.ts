import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const config: NextConfig = {
  reactStrictMode: true,
}

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(config)

export default nextConfig

