import { Folder, Search, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { DashboardPreview } from '@/components/DashboardPreview'
import { EmailSignInButton } from '@/components/EmailSignInButton'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Prompt Manage — Secure Prompt Management & Library Tool',
  description:
    'Organize, tag, and filter AI prompts in your secure library. Manage prompts for any use case with our high-quality prompt management tool.',
  keywords:
    'AI prompts, prompt management, ChatGPT prompts, Claude prompts, AI tools, prompt library, secure prompts, tag and filter prompts',
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
    title: 'Prompt Manage — Secure Prompt Management & Library Tool',
    description:
      'Organize, tag, and filter AI prompts in your secure library. Manage prompts for any use case with our high-quality prompt management tool.',
    url: 'https://promptmanage.com',
    siteName: 'Prompt Manage',
    images: [
      {
        url: '/og-image.svg',
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
    title: 'Prompt Manage — Secure Prompt Management & Library Tool',
    description:
      'Organize, tag, and filter AI prompts in your secure library. Manage prompts for any use case with our high-quality prompt management tool.',
    images: ['/og-image.svg'],
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
  // Check for session if Supabase is configured
  let session = null
  try {
    const supabase = await createClient()
    const result = await supabase.auth.getSession()
    session = result.data.session
  } catch (_) {
    // Supabase not configured (e.g., in CI/test environment)
    // Continue without session check
    console.warn('Supabase not configured, skipping session check')
  }

  // Redirect logged-in users to dashboard
  if (session) {
    const { redirect } = await import('next/navigation')
    redirect('/dashboard')
  }

  // Schema.org structured data for SEO and LLMs
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Prompt Manage',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    description:
      'High-quality and secure prompt management tool for organizing AI prompts. Tag, sort, and filter prompts in your library.',
    featureList: [
      'Secure prompt library',
      'Tag and filter prompts',
      'Organize by category',
      'Multi-model support (ChatGPT, Claude, Gemini, Grok)',
      'Version control',
      'Team collaboration',
    ],
    url: 'https://promptmanage.com',
    screenshot: '/og-image.svg',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Prompt Manage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prompt Manage is a high-quality and secure prompt management tool that helps you organize, tag, and filter AI prompts in your library. It supports ChatGPT, Claude, Gemini, Grok, and 20+ other AI models.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI models does Prompt Manage support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prompt Manage supports 20+ AI models including GPT-5, GPT-4o, GPT-4o mini, Claude 4 Opus, Claude 4 Sonnet, Claude 3.5 Sonnet, Gemini 2.5 Pro, Gemini 1.5 Pro, Llama 3.1, DeepSeek R1, Mixtral 8x22B, Mistral Large, Grok 4, Qwen 2.5, and Cohere Command R+.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do teams use Prompt Manage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Teams use Prompt Manage to organize and manage their prompt libraries. You can tag, sort, and filter prompts for easy discovery, maintain version control, and securely share prompts with team members.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Prompt Manage free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Prompt Manage offers a free tier to get started. You can create prompt libraries, organize your prompts, and access the public prompt directory with 300+ community-shared prompts for free.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Public Prompt Directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Public Prompt Directory is a community-driven database featuring 300+ curated AI prompts ready to use with any major AI model. You can browse prompts by model, tags, or search for specific use cases like content creation, coding, analysis, and automation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I share prompts with my team?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Prompt Manage is built for team collaboration. You can create shared prompt libraries, invite team members, organize prompts by category or use case, and securely share your prompt collection.',
        },
      },
    ],
  }

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: 'Prompt Manage',
    },
    author: {
      '@type': 'Person',
      name: 'Michael Moloney',
      jobTitle: 'Co-Founder',
      worksFor: {
        '@type': 'Organization',
        name: 'Moloney Creative Agency',
        url: 'https://moloneycreativeagency.com/',
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
    reviewBody:
      'Prompt Manage turned our scattered prompt docs into a well-organized library. Tagging and filtering make it easy to find exactly what we need, and version control keeps everything in sync.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          {/* Hero Section - split layout */}
          <section className="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-10 md:py-24 lg:gap-16">
            {/* Left: Copy */}
            <div className="order-1 text-left md:order-1">
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mb-6 md:text-5xl lg:text-[3.5rem]">
                Stop Losing Your Best Prompts
              </h1>
              <p className="mb-3 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Create, store, and safely share your prompts, all in one place. Build your secure
                prompt library with our{' '}
                <Link
                  href="/p"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  public prompt directory
                </Link>{' '}
                featuring 400+ ready-to-use templates you can copy to your account!
              </p>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Tag, sort, and filter prompts to organize your workspace. Then share prompts with
                your team. Prompt Manage is the CMS for your prompts.
              </p>
              <div className="mb-6 flex flex-wrap items-center gap-2 md:mb-8 md:gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Folder className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300 sm:h-4 sm:w-4" />{' '}
                  Organized libraries
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs sm:gap-2 sm:text-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300 sm:h-4 sm:w-4" />{' '}
                  Secure & private
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Search className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300 sm:h-4 sm:w-4" />{' '}
                  Tag & filter
                </span>
              </div>
              {session ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full px-6 py-5 text-sm sm:px-7 sm:py-6 sm:text-base">
                      Open your Library
                    </Button>
                  </Link>
                  <Link href="/p" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full px-6 py-5 text-sm sm:px-7 sm:py-6 sm:text-base"
                    >
                      <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Browse Templates
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <GoogleSignInButton
                      redirectPath="/dashboard"
                      size="lg"
                      className="w-full px-6 py-5 text-sm font-medium sm:h-12 sm:w-auto sm:text-base"
                    >
                      Sign in with Google
                    </GoogleSignInButton>
                    <EmailSignInButton
                      redirectPath="/dashboard"
                      variant="outline"
                      size="lg"
                      className="w-full px-6 py-5 text-sm font-medium sm:h-12 sm:w-auto sm:text-base"
                    >
                      Sign in with Email
                    </EmailSignInButton>
                  </div>
                  <Link href="/p" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full px-6 py-5 text-sm font-medium sm:h-12 sm:w-auto sm:text-base"
                    >
                      <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Browse Templates
                    </Button>
                  </Link>
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Popular models:</span>
                {[
                  'gpt-4',
                  'gpt-4o',
                  'Claude 4 Opus',
                  'Gemini 2.5 Pro',
                  'Llama 4 Series',
                  'Mistral Large',
                ].map((m) => (
                  <Badge key={m} variant="outline" className="px-2 py-1 text-[10px] sm:text-xs">
                    {m}
                  </Badge>
                ))}
                <Link
                  href="/models"
                  className="ml-1 text-xs text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  Models →
                </Link>
              </div>
            </div>

            {/* Right: Interactive Dashboard Preview */}
            <div className="order-2 md:order-2">
              <DashboardPreview />
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-20 md:mt-32">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Organize and manage your prompt library
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base md:mt-6">
                  A secure, high-quality prompt management tool with tagging, sorting, and filtering
                  capabilities.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-8">
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center md:mb-6">
                      <div className="rounded-lg border-2 border-border bg-muted p-2.5 md:p-3">
                        <Folder className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold md:text-lg">Organize & Tag</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3">
                      Create libraries, add tags, and categorize prompts for easy discovery and
                      quick access.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center md:mb-6">
                      <div className="rounded-lg border-2 border-border bg-muted p-2.5 md:p-3">
                        <Search className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold md:text-lg">Search & Filter</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3">
                      Quickly find prompts by tag, keyword, category, or model. Instant access to
                      exactly what you need.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center md:mb-6">
                      <div className="rounded-lg border-2 border-border bg-muted p-2.5 md:p-3">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold md:text-lg">Secure & Private</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3">
                      Keep your prompts secure. Private collections with enhanced permissions coming
                      soon.
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-10 sm:gap-6 md:mt-20 md:grid-cols-4 md:pt-16">
                <div className="text-center">
                  <div className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                    100%
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-muted-foreground sm:mt-2 sm:text-sm">
                    Secure Storage
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold leading-tight tracking-tight sm:text-2xl md:text-4xl">
                    Tag & Filter
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-muted-foreground sm:mt-2 sm:text-sm">
                    Easy Discovery
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold leading-tight tracking-tight sm:text-2xl md:text-4xl">
                    Collections
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-muted-foreground sm:mt-2 sm:text-sm">
                    Organize & Share
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                    1000s
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-muted-foreground sm:mt-2 sm:text-sm">
                    Prompts Organized
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-16 md:mt-24">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  How it works
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base md:mt-4 md:text-lg">
                  Get started in minutes. Organize your prompts with tags, search with filters, and
                  maintain version control.
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-4xl md:mt-12">
                <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                  {[
                    {
                      title: 'Organize & tag',
                      desc: 'Create libraries, add tags, and categorize prompts for easy discovery.',
                      icon: Folder,
                      color: 'emerald',
                    },
                    {
                      title: 'Search & filter',
                      desc: 'Quickly find prompts by tag, category, or model.',
                      icon: Search,
                      color: 'sky',
                    },
                    {
                      title: 'Secure & private',
                      desc: 'Keep your prompts secure with team-based access control.',
                      icon: ShieldCheck,
                      color: 'purple',
                    },
                  ].map((s, i) => (
                    <div
                      key={s.title}
                      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:rounded-2xl md:p-8"
                    >
                      <div className="mb-3 text-3xl font-bold text-gray-200 dark:text-gray-800 md:mb-4 md:text-4xl">
                        0{i + 1}
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white md:mb-3 md:text-xl">
                        {s.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center md:mt-12">
                <Link href="/pricing" className="inline-block w-full sm:w-auto">
                  <Button size="lg" className="w-full px-8 sm:w-auto">
                    See Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="relative mt-16 md:mt-24">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 via-transparent to-gray-50 dark:from-gray-950 dark:via-transparent dark:to-gray-950" />
            <div className="mx-auto max-w-3xl px-4 text-center">
              <blockquote className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white sm:text-xl md:text-2xl">
                "Prompt Manage turned our scattered prompt docs into a well-organized library.
                Tagging and filtering make it easy to find exactly what we need, and version control
                keeps everything in sync."
              </blockquote>
              <div className="mt-6 md:mt-8">
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 sm:text-sm">
                  Michael Moloney, Co-Founder of{' '}
                  <a
                    href="https://moloneycreativeagency.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-emerald-300/50 underline-offset-2 hover:decoration-emerald-400"
                  >
                    MCA
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Learn More / Internal Links Section */}
          <section className="mx-auto mt-20 max-w-5xl border-t pb-12 pt-10 md:mt-32 md:pb-16 md:pt-12">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white sm:text-2xl md:mb-8">
              Explore Prompt Manage
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              <Link
                href="/p"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Public Prompt Directory →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Browse 300+ community-shared AI prompts for ChatGPT, Claude, Gemini, and more.
                  Free to use and copy.
                </p>
              </Link>
              <Link
                href="/trending"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Trending Prompts →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Discover the most popular and recently added AI prompt templates used by thousands
                  of creators.
                </p>
              </Link>
              <Link
                href="/categories"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Browse by Category →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Find prompts organized by use case: coding, marketing, writing, design, business,
                  and more.
                </p>
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3">
              <Link
                href="/p/tags"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Browse by Tag →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Explore prompts by specific tags and keywords to find exactly what you need.
                </p>
              </Link>
              <Link
                href="/models"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Supported AI Models →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  See the complete list of 20+ AI models we support, including GPT-5, Claude 4,
                  Gemini 2.5 Pro, and more.
                </p>
              </Link>
              <Link
                href="/docs/best-practices"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Prompt Best Practices →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Learn expert tips for writing effective prompts, organizing your library, and
                  scaling team workflows.
                </p>
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-2">
              <Link
                href="/docs"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  Documentation →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Complete guides on how to use Prompt Manage, from creating your first prompt to
                  advanced team collaboration.
                </p>
              </Link>
              <Link
                href="/about"
                className="group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1.5 text-base font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 md:mb-2">
                  About Prompt Manage →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Learn about our mission to help teams organize, test, and collaborate on AI
                  prompts at scale.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
