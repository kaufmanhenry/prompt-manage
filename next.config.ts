import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Basic configuration for stability
  compress: true,
  poweredByHeader: false,

  // Temporarily disable React Strict Mode to fix development errors
  reactStrictMode: false,
  
  // Webpack configuration for Node.js polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Basic headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
