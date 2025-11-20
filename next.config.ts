import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Basic configuration for stability
  compress: true,
  poweredByHeader: false,

  // Re-enable React Strict Mode for better performance and development
  reactStrictMode: true,

  // Performance optimizations
  swcMinify: true, // Use SWC for faster minification

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@tanstack/react-query',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
    // Optimize server components
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack configuration to fix module loading issues
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year - better for SEO and performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.jasper.ai',
      },
      {
        protocol: 'https',
        hostname: '**.copy.ai',
      },
      {
        protocol: 'https',
        hostname: 'writesonic.com',
      },
      {
        protocol: 'https',
        hostname: '**.tabnine.com',
      },
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: '**.descript.com',
      },
      {
        protocol: 'https',
        hostname: 'runwayml.com',
      },
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'zapier.com',
      },
      {
        protocol: 'https',
        hostname: 'boltai.com',
      },
      {
        protocol: 'https',
        hostname: '**.typingmind.com',
      },
      {
        protocol: 'https',
        hostname: 'fliki.ai',
      },
      {
        protocol: 'https',
        hostname: 'meku.dev',
      },
      {
        protocol: 'https',
        hostname: 'coupler.io',
      },
      {
        protocol: 'https',
        hostname: 'seoengine.ai',
      },
      {
        protocol: 'https',
        hostname: '**.audiovideototext.com',
      },
      {
        protocol: 'https',
        hostname: 'forms.app',
      },
    ],
  },

  // Headers for security and performance
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
