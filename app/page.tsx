import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock, Search, Users, Zap, Shield, GitBranch } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Manage - The Central Platform for Teams to Organize, Test, and Collaborate on AI Prompts at Scale',
  description:
    'Stop losing time to prompt chaos. Prompt Manage is the central platform for product teams, AI engineers, marketers, and support teams to organize, test, and collaborate on AI prompts at scale.',
  keywords:
    'AI prompts, prompt management, ChatGPT prompts, Claude prompts, AI tools, prompt sharing, team collaboration, prompt testing, version control',
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
    canonical: '/',
  },
      openGraph: {
      title: 'Prompt Manage - The Central Platform for Teams to Organize, Test, and Collaborate on AI Prompts at Scale',
      description:
        'Stop losing time to prompt chaos. Prompt Manage is the central platform for product teams, AI engineers, marketers, and support teams to organize, test, and collaborate on AI prompts at scale.',
    url: 'https://promptmanage.com',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage - AI Prompt Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
      twitter: {
      card: 'summary_large_image',
      title: 'Prompt Manage - The Central Platform for Teams to Organize, Test, and Collaborate on AI Prompts at Scale',
      description:
        'Stop losing time to prompt chaos. Prompt Manage is the central platform for product teams, AI engineers, marketers, and support teams to organize, test, and collaborate on AI prompts at scale.',
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

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 10,000+ teams worldwide
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Stop Losing Time to<br />
            <span className="text-blue-600 dark:text-blue-400">Prompt Chaos</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            The central platform for product teams, AI engineers, marketers, and support teams to organize, test, and collaborate on AI prompts at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/p">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Search className="mr-2 h-5 w-5" />
                Explore Prompt Library
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>

        {/* Top Use Cases */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Built for Teams That Use AI Every Day
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Support Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage chatbot prompts, ensure compliance, reduce escalations
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Marketing Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                A/B test campaign copy, reuse best prompts, collaborate across departments
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Engineers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Version control system prompts, test variants, track performance
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Product Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Centralize prompt libraries, ensure consistency, scale AI features
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Enterprise-Grade Security
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All your prompt libraries are private by default with granular access controls. SOC 2 compliant with enterprise SSO support.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Version Control & Testing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track every change, test prompt variants, and rollback instantly. Built-in A/B testing and performance analytics.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share prompts across teams, comment on changes, and maintain a single source of truth for all your AI prompts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to solve prompt chaos?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join 10,000+ teams who&rsquo;ve already streamlined their AI prompt management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
