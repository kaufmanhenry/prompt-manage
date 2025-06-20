import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Globe, Lock, Users, Zap } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Prompt Manage | AI Prompt Management Platform',
  description: 'Learn about Prompt Manage, the platform for organizing, sharing, and discovering AI prompts. Built for privacy-first prompt management with Notion-like sharing.',
  keywords: 'about Prompt Manage, AI prompt management, prompt sharing platform, ChatGPT prompts, Claude prompts',
  authors: [{ name: 'Prompt Manage' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://promptmanage.com'),
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About - Prompt Manage | AI Prompt Management Platform',
    description: 'Learn about Prompt Manage, the platform for organizing, sharing, and discovering AI prompts.',
    url: 'https://promptmanage.com/about',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'About Prompt Manage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Prompt Manage | AI Prompt Management Platform',
    description: 'Learn about Prompt Manage, the platform for organizing, sharing, and discovering AI prompts.',
    images: ['https://promptmanage.com/og-image.svg'],
    creator: '@promptmanage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Prompt Manage
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            The platform for organizing, sharing, and discovering AI prompts
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            We believe that AI prompts are the new programming language of the future. 
            As AI becomes more integrated into our daily workflows, having a reliable 
            way to organize, share, and discover prompts is essential.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Prompt Manage was built to solve this problem. We provide a platform where 
            you can safely store your prompts, share them when you want to, and discover 
            amazing prompts from the community.
          </p>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 flex-shrink-0">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Privacy First
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All your prompts are private by default. You have complete control 
                  over what you share and what stays private.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 flex-shrink-0">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Notion-like Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share individual prompts with unique URLs, just like Notion. 
                  Each prompt gets its own public page when shared.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Community Driven
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover and use prompts shared by the community. Our public 
                  directory is growing every day with amazing prompts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 flex-shrink-0">
                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Built for Productivity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize prompts with tags, search functionality, and easy 
                  copy-paste. Everything is designed for speed and efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Built by AI Enthusiasts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Prompt Manage was created by a team of developers and AI enthusiasts 
            who understand the challenges of managing AI prompts in today's fast-paced world.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We're committed to building the best platform for prompt management, 
            with a focus on privacy, usability, and community.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join thousands of users managing their AI prompts
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg">
                Create Your Account
              </Button>
            </Link>
            <Link href="/public">
              <Button variant="outline" size="lg">
                Browse Public Prompts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 