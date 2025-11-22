import { ArrowRight, BookOpen, CheckCircle2, Globe, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Getting Started — Prompt Manage',
  description:
    'Quick start guide for Prompt Manage. Learn how to create your account, save prompts, organize your library, and leverage the public prompt directory.',
  keywords: [
    'prompt manage getting started',
    'how to use prompt manage',
    'prompt management tutorial',
    'AI prompt organization guide',
    'quick start guide',
  ],
  openGraph: {
    title: 'Getting Started — Prompt Manage',
    description: 'Start managing your AI prompts effectively in minutes.',
    type: 'website',
  },
}

const gettingStartedSteps = [
  {
    title: 'Create Your Account',
    description: 'Sign in with Google or Email to get started instantly with zero setup time. Both methods are password-free and secure.',
    icon: Sparkles,
    links: [
      { href: '/docs/authentication', text: 'Authentication Guide' },
      { href: '/', text: 'Get Started' },
    ],
  },
  {
    title: 'Explore the Library',
    description:
      'Browse 300+ community-shared prompts in our public directory. Free to copy and customize.',
    icon: BookOpen,
    links: [
      { href: '/p', text: 'Browse Public Directory' },
      { href: '/trending', text: 'View Trending' },
    ],
  },
  {
    title: 'Save Your First Prompt',
    description:
      'Create a prompt from scratch or copy one from the public directory to your library.',
    icon: CheckCircle2,
    links: [
      { href: '/docs', text: 'Learn How to Save' },
      { href: '/dashboard', text: 'Go to Dashboard' },
    ],
  },
  {
    title: 'Organize with Tags',
    description:
      'Add tags to categorize your prompts for easy discovery. Tag by use case, model, or project.',
    icon: Globe,
    links: [
      { href: '/docs/best-practices', text: 'Best Practices' },
      { href: '/p/tags', text: 'Browse by Tags' },
    ],
  },
]

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Getting Started
          </h1>
          <p className="mb-4 text-xl leading-8 text-gray-600 dark:text-gray-400">
            Start managing your AI prompts effectively in minutes. Everything you need to know to
            get the most out of Prompt Manage.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/">
              <Button size="lg">Start Free</Button>
            </Link>
            <Link href="/p">
              <Button variant="outline" size="lg">
                Browse Public Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Start Steps */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quick Start in 4 Steps
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Get up and running with Prompt Manage in under 5 minutes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {gettingStartedSteps.map((step, index) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              <div className="mb-6 flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                  <step.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Step {index + 1}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{step.description}</p>
              <div className="flex flex-wrap gap-3">
                {step.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    {link.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            What Makes Prompt Manage Different
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">300+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ready-to-Use Prompts
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Community-shared prompts for every use case
              </div>
            </div>
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">20+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                AI Models Supported
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                ChatGPT, Claude, Gemini, and all major models
              </div>
            </div>
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">100%</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Secure Storage
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Your prompts are encrypted and protected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Use Cases */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Common Use Cases
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Content Marketing',
              description:
                'Create email sequences, social posts, ad copy, and blog content at scale with consistent voice.',
              examples: ['Email marketing', 'Social media posts', 'Ad copy', 'Blog articles'],
            },
            {
              title: 'Software Development',
              description:
                'Generate code snippets, write documentation, create tests, and debug with AI assistance.',
              examples: ['Code generation', 'Documentation', 'Testing', 'Code review'],
            },
            {
              title: 'Product Development',
              description:
                'Write product descriptions, user stories, requirement docs, and technical specifications.',
              examples: ['Product descriptions', 'User stories', 'Requirements', 'Technical specs'],
            },
            {
              title: 'Customer Support',
              description:
                'Create help articles, FAQ responses, email templates, and escalation workflows.',
              examples: ['Help articles', 'FAQ responses', 'Email templates', 'Support workflows'],
            },
          ].map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {useCase.title}
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{useCase.description}</p>
              <div className="flex flex-wrap gap-2">
                {useCase.examples.map((example) => (
                  <span
                    key={example}
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Ready to Get Started?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                View Full Documentation
              </Button>
            </Link>
            <Link href="/docs/best-practices">
              <Button variant="outline" size="lg">
                Learn Best Practices
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
