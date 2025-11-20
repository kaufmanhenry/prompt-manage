import { Folder, Search, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { DashboardPreview } from '@/components/DashboardPreview'
import { EmailSignInButton } from '@/components/EmailSignInButton'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import RotatingAudience from '@/components/RotatingAudience'
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
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

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
          <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24 lg:gap-16">
            {/* Left: Copy */}
            <div className="order-2 text-left md:order-1">
              <h1 className="mb-6 text-[clamp(1.75rem,5vw,3.1rem)] font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white md:text-[clamp(2rem,4.4vw,3.4rem)] xl:text-[clamp(2.125rem,3.6vw,3.5rem)]">
                Stop Losing Your Best Prompts
              </h1>
              <p className="mb-3 max-w-xl text-lg leading-7 text-muted-foreground md:text-xl">
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
              <p className="mb-6 max-w-xl text-lg leading-7 text-muted-foreground md:text-xl">
                Tag, sort, and filter prompts to organize your workspace. Then share prompts with
                your team. Prompt Manage is the CMS for your prompts.
              </p>
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <Folder className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> Organized
                  libraries
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> Secure
                  & private
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> Tag & filter
                </span>
              </div>
              {session ? (
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="px-7 py-6 text-base">
                      Open your Library
                    </Button>
                  </Link>
                  <Link href="/p">
                    <Button variant="outline" size="lg" className="px-7 py-6 text-base">
                      <Search className="mr-2 h-5 w-5" /> Browse Templates
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <GoogleSignInButton
                    redirectPath="/dashboard"
                    size="lg"
                    className="px-7 py-6 text-base"
                  >
                    Sign in with Google
                  </GoogleSignInButton>
                  <EmailSignInButton
                    redirectPath="/dashboard"
                    variant="ghost"
                    size="sm"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    or sign in with email
                  </EmailSignInButton>
                  <Link href="/p" className="sm:ml-auto">
                    <Button variant="outline" size="lg" className="px-7 py-6 text-base">
                      <Search className="mr-2 h-5 w-5" /> Browse Templates
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
                  <Badge key={m} variant="outline" className="px-2 py-0.5 text-[10px]">
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
            <div className="order-1 md:order-2">
              <DashboardPreview />
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Organize and manage your prompt library
                </h2>
                <p className="mt-6 text-base leading-7 text-muted-foreground">
                  A secure, high-quality prompt management tool with tagging, sorting, and filtering
                  capabilities.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="mt-16 grid gap-8 sm:grid-cols-3">
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                  <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center">
                      <div className="rounded-lg border-2 border-border bg-muted p-3">
                        <Folder className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">Organize & Tag</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Create libraries, add tags, and categorize prompts for easy discovery and
                      quick access.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                  <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center">
                      <div className="rounded-lg border-2 border-border bg-muted p-3">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">Search & Filter</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Quickly find prompts by tag, keyword, category, or model. Instant access to
                      exactly what you need.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                  <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center">
                      <div className="rounded-lg border-2 border-border bg-muted p-3">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">Secure & Private</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Keep your prompts secure. Private collections with enhanced permissions coming
                      soon.
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-20 grid grid-cols-2 gap-6 border-t border-border pt-16 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-4xl font-semibold tracking-tight">100%</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    Secure Storage
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold tracking-tight">Tag & Filter</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    Easy Discovery
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold tracking-tight">Collections</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    Organize & Share
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold tracking-tight">1000s</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    Prompts Organized
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-24">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Get started in minutes. Organize your prompts with tags, search with filters, and
                  maintain version control.
                </p>
              </div>

              <div className="mx-auto mt-12 max-w-4xl">
                <div className="grid gap-8 md:grid-cols-3">
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
                      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="mb-4 text-4xl font-bold text-gray-200 dark:text-gray-800">
                        0{i + 1}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                        {s.title}
                      </h3>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link href="/pricing">
                  <Button size="lg" className="px-8">
                    See Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="relative mt-24">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 via-transparent to-gray-50 dark:from-gray-950 dark:via-transparent dark:to-gray-950" />
            <div className="mx-auto max-w-3xl px-4 text-center">
              <blockquote className="text-2xl font-medium leading-relaxed text-gray-900 dark:text-white">
                "Prompt Manage turned our scattered prompt docs into a well-organized library.
                Tagging and filtering make it easy to find exactly what we need, and version control
                keeps everything in sync."
              </blockquote>
              <div className="mt-8">
                <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
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
          <section className="mx-auto mt-32 max-w-5xl border-t pb-16 pt-12">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Explore Prompt Manage
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Link
                href="/p"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Public Prompt Directory →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse 300+ community-shared AI prompts for ChatGPT, Claude, Gemini, and more.
                  Free to use and copy.
                </p>
              </Link>
              <Link
                href="/trending"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Trending Prompts →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover the most popular and recently added AI prompt templates used by thousands
                  of creators.
                </p>
              </Link>
              <Link
                href="/categories"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Browse by Category →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find prompts organized by use case: coding, marketing, writing, design, business,
                  and more.
                </p>
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Link
                href="/p/tags"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Browse by Tag →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore prompts by specific tags and keywords to find exactly what you need.
                </p>
              </Link>
              <Link
                href="/models"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Supported AI Models →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See the complete list of 20+ AI models we support, including GPT-5, Claude 4,
                  Gemini 2.5 Pro, and more.
                </p>
              </Link>
              <Link
                href="/docs/best-practices"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Prompt Best Practices →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn expert tips for writing effective prompts, organizing your library, and
                  scaling team workflows.
                </p>
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Link
                href="/docs"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  Documentation →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete guides on how to use Prompt Manage, from creating your first prompt to
                  advanced team collaboration.
                </p>
              </Link>
              <Link
                href="/about"
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
              >
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  About Prompt Manage →
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
