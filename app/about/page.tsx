import { ArrowLeft, Globe, Lock, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About - Prompt Manage | Create, manage, and run AI prompts. All in one place.',
  description: 'Learn about Prompt Manage. Create, manage, and run AI prompts all in one place.',
  keywords:
    'about Prompt Manage, AI prompt management, prompt sharing platform, ChatGPT prompts, Claude prompts',
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
    title: 'About - Prompt Manage | Create, manage, and run AI prompts. All in one place.',
    description: 'Learn about Prompt Manage. Create, manage, and run AI prompts all in one place.',
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
    title: 'About - Prompt Manage | Create, manage, and run AI prompts. All in one place.',
    description: 'Learn about Prompt Manage. Create, manage, and run AI prompts all in one place.',
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
};

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
            Create, manage, and run AI prompts.
            <br />
            All in one place.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            We believe that AI prompts are the new programming language of the future, and effective
            prompt engineering is critical for leveraging AI at scale. As AI becomes more integrated
            into enterprise workflows, having a reliable platform to manage, share, and discover
            high-quality prompts is essential.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Prompt Manage was built to solve this challenge. We provide a secure platform where you
            can centralize your prompt libraries, collaborate seamlessly with your team, and
            accelerate prompt engineering workflows.
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
                  Enterprise-Grade Privacy & Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All your prompt libraries are private by default. You maintain granular control
                  over access permissions and what content is shared, ensuring data governance and
                  compliance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 flex-shrink-0">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Collaborative Prompt Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Publish and share individual prompts or entire prompt collections with colleagues,
                  departments, or external partners. Each prompt gets its own dedicated page for
                  easy access and version control. COMING SOON: Comprehensive Prompt Collection
                  Management.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Best Practice Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover and leverage best-in-class prompts shared by our network of AI
                  professionals. Our curated directory is continually expanding with optimized
                  prompt engineering examples.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 flex-shrink-0">
                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Built for Prompt Engineering Productivity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize prompts with advanced tagging, full-text search, and one-click copy
                  functionality. Every feature is engineered for speed, efficiency, and seamless
                  integration into your prompt development lifecycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Developed by AI Engineering Experts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Prompt Manage was created by a team of developers and AI engineers who deeply understand
            the complexities of managing AI prompts and prompt libraries in today&apos;s rapidly
            evolving technological landscape.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We are committed to building the leading platform for prompt management, with a focus on
            security, scalability, and enhanced team collaboration.
          </p>
        </div>

        {/* Social Media */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect With Us</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Follow us for updates, prompt engineering best practices, and the latest in AI prompt
            management solutions
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="https://x.com/promptmanage"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-medium">X</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/prompt-manage/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="font-medium">LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join leading enterprises in streamlining their AI prompt management
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg">Create Your Account</Button>
            </Link>
            <Link href="/p">
              <Button variant="outline" size="lg">
                Explore Sample Prompts
              </Button>
            </Link>
            <Link href="/models">
              <Button variant="outline" size="lg">
                View Supported Models
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
