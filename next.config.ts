import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Basic configuration for stability
  compress: true,
  poweredByHeader: false,

  // Temporarily disable React Strict Mode to fix development errors
  reactStrictMode: false,
  
  // Disable experimental features that might cause issues
  experimental: {
    // optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
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
    
    // Fix for webpack module loading issues during hydration
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    // Additional configuration to fix webpack call errors
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: {
            ...config.optimization.splitChunks?.cacheGroups?.default,
            minChunks: 1,
          },
        },
      },
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
