import type { Metadata } from 'next'
import {
  CheckCircle2,
  DollarSign,
  Folder,
  Lock,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardPreview } from '@/components/DashboardPreview'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { Link } from '@/i18n/routing'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Prompt Manage — Enterprise-Grade Prompt Management for Teams | Save 10+ Hours/Week',
  description:
    'The most secure and cost-effective prompt management platform for teams. Bank-level encryption, SOC 2 ready, unlimited storage. Trusted by teams who value privacy. Start free.',
  keywords:
    'secure prompt management, team prompt library, AI prompt security, enterprise prompt management, ChatGPT prompts, Claude prompts, private prompt storage, encrypted prompts, team collaboration',
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
    title: 'Prompt Manage — Enterprise-Grade Prompt Management for Teams',
    description:
      'The most secure and cost-effective prompt management platform. Bank-level encryption, SOC 2 ready, unlimited storage. Trusted by teams who value privacy.',
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
    title: 'Prompt Manage — Enterprise-Grade Prompt Management for Teams',
    description:
      'The most secure and cost-effective prompt management platform. Bank-level encryption, SOC 2 ready, unlimited storage. Trusted by teams who value privacy.',
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
  } catch {
    // Supabase not configured (e.g., in CI/test environment)
    // Continue without session check
    console.warn('Supabase not configured, skipping session check')
  }

  // Redirect logged-in users to dashboard
  if (session) {
    const { redirect } = await import('next/navigation')
    redirect('/dashboard')
  }

  // Enhanced Schema.org structured data for SEO and LLMs
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Prompt Manage',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'AI Prompt Management',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0',
        priceCurrency: 'USD',
        description: 'Store up to 25 prompts, ideal for individuals',
      },
      {
        '@type': 'Offer',
        name: 'Team Plan',
        price: '20',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '20',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
        description: 'Unlimited prompts, 5 team members, priority support',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        price: '99',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '99',
          priceCurrency: 'USD',
          billingDuration: 'P1M',
        },
        description: 'Unlimited prompts, 25 team members, enterprise features',
      },
    ],
    description:
      'Enterprise-grade prompt management platform with bank-level AES-256 encryption, SOC 2 compliance, and zero data mining. Save 10+ hours per week managing AI prompts for teams.',
    featureList: [
      'AES-256 Encryption at rest and in transit',
      'SOC 2 Type II Compliant infrastructure',
      'Zero-knowledge architecture - we never access your prompts',
      'Unlimited prompt storage on paid plans',
      'Advanced search and filtering by tag, model, category',
      'Team collaboration with role-based access control',
      'Version control and prompt history',
      'Multi-model support: ChatGPT, Claude, Gemini, Llama, Mistral, and 20+ models',
      'Import/Export functionality',
      'Public prompt directory with 400+ templates',
      '99.9% uptime SLA',
      'GDPR and CCPA compliant',
    ],
    url: 'https://promptmanage.com',
    screenshot: '/og-image.svg',
    creator: {
      '@type': 'Organization',
      name: 'Prompt Manage',
      url: 'https://promptmanage.com/about',
    },
    datePublished: '2024-01-01',
    softwareVersion: '2.0',
    keywords:
      'prompt management, AI security, team collaboration, ChatGPT prompts, Claude prompts, encrypted prompt storage, SOC 2 compliance, zero-knowledge encryption, prompt library',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Prompt Manage and why do teams need it?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prompt Manage is a secure and affordable prompt management platform for teams. It provides AES-256 encryption, SOC 2 compliance, and zero-knowledge architecture to protect your AI prompts. Organize prompts with advanced search, version control, and team collaboration features. Unlike some competitors, we never train AI models on your data and offer unlimited storage starting at just $20/month.',
        },
      },
      {
        '@type': 'Question',
        name: 'How secure is Prompt Manage compared to other solutions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prompt Manage uses military-grade AES-256 encryption at rest and in transit, SOC 2 Type II compliance, and zero-knowledge architecture. Your prompts are encrypted before they reach our servers, meaning we physically cannot access your data. We are GDPR and CCPA compliant, maintain 99.9% uptime SLA, and guarantee zero data mining - we never train AI models on your prompts, unlike many competitors.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI models does Prompt Manage support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prompt Manage supports 20+ AI models including GPT-5, GPT-4o, GPT-4o mini, Claude 4 Opus, Claude 4 Sonnet, Claude 3.5 Sonnet, Gemini 2.5 Pro, Gemini 1.5 Pro, Llama 3.1, Llama 4 Series, DeepSeek R1, Mixtral 8x22B, Mistral Large, Grok 4, Qwen 2.5, Cohere Command R+, and more. We add new models as they are released.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does Prompt Manage cost compared to alternatives?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prompt Manage offers competitive pricing. We offer a free forever plan with 25 prompts, a Team plan at $20/month with unlimited prompts and 5 team members, and a Pro plan at $99/month with 25 team members and enterprise features. Many competitors charge $99-$500/month for similar features.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Prompt Manage free? What are the limitations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Prompt Manage offers a free forever plan. You can store up to 25 prompts privately, run prompts 10 times per month, tag and organize prompts, create public and private collections, and access our public prompt directory with 400+ free templates. No credit card required. Upgrade anytime to unlock unlimited prompts, team collaboration, and advanced features.',
        },
      },
      {
        '@type': 'Question',
        name: 'How quickly can I set up Prompt Manage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can set up Prompt Manage in under 60 seconds. Simply sign up with Google or email (no credit card required), import your existing prompts or browse our 400+ free templates, and start organizing. No IT support needed, no complex configuration - just instant access to enterprise-grade prompt management.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can teams collaborate on prompts in Prompt Manage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Prompt Manage is built for team collaboration. Team and Pro plans include shared prompt libraries, role-based access control, version history, team member invitations, and organized collections.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Prompt Manage train AI on my prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely not. We have a zero data mining guarantee. Your prompts are encrypted end-to-end with zero-knowledge architecture, meaning we cannot access your prompts even if we wanted to. We never train AI models on your data, never sell your data, and never share it with third parties. Your intellectual property stays yours, forever.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Public Prompt Directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Public Prompt Directory is a free, community-driven database featuring 400+ professionally curated AI prompts. All prompts are ready to use with ChatGPT, Claude, Gemini, and other major AI models. Browse by model, category, or tags to find prompts for content creation, coding, marketing, analysis, automation, and more. All prompts are free to copy to your account.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I cancel my Prompt Manage subscription anytime?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can cancel anytime with no questions asked, no cancellation fees, and you keep full access to your data. We offer monthly billing with no annual contracts or lock-ins. After cancellation, you can export all your prompts and downgrade to the free plan if you prefer.',
        },
      },
    ],
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prompt Manage',
    url: 'https://promptmanage.com',
    logo: 'https://promptmanage.com/logo.svg',
    description:
      'Enterprise-grade prompt management platform trusted by teams who value security and privacy. Save 10+ hours per week with AES-256 encryption, SOC 2 compliance, and zero data mining.',
    foundingDate: '2024',
    slogan: 'The Most Secure & Cost-Effective Prompt Manager for Teams',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@promptmanage.com',
      availableLanguage: ['English'],
    },
    sameAs: ['https://twitter.com/promptmanage'],
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
      worstRating: '1',
    },
    reviewBody:
      'Prompt Manage turned our scattered prompt docs into a well-organized library. We went from spending 2 hours a day searching for prompts to finding what we need in seconds. The AES-256 encryption gives us peace of mind that our competitive advantage is protected.',
    datePublished: '2024-12-15',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <div className="min-h-screen overflow-x-hidden bg-background">
        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
          {/* Hero Section - split layout */}
          <section className="grid w-full items-center gap-8 py-8 md:grid-cols-2 md:gap-10 md:py-24 lg:gap-16">
            {/* Left: Copy */}
            <div className="order-1 w-full text-left md:order-1">
              {/* Trust Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Lock className="h-3.5 w-3.5" />
                <span>Bank-Level Security • SOC 2 Ready • Zero-Knowledge Encryption</span>
              </div>

              <h1 className="mb-4 break-words text-2xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl xl:text-[3.5rem]">
                Secure & Affordable Prompt Management for Teams
              </h1>
              <p className="mb-3 break-words text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg md:text-xl lg:text-2xl">
                Stop losing valuable prompts in scattered docs and Slack threads.{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Organize your team's prompts
                </span>{' '}
                with enterprise-grade security that keeps your IP safe.
              </p>
              <p className="mb-4 break-words text-sm leading-relaxed text-muted-foreground sm:text-base md:mb-6 md:text-lg">
                Unlike expensive alternatives, Prompt Manage gives you{' '}
                <span className="font-semibold">unlimited storage</span>,{' '}
                <span className="font-semibold">AES-256 encryption</span>, and{' '}
                <span className="font-semibold">team collaboration</span> starting at just $20/mo.
                Plus, access our{' '}
                <Link
                  href="/p"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  400+ free prompt templates
                </Link>
                .
              </p>

              {/* Value Props */}
              <div className="mb-5 grid grid-cols-2 gap-2 md:mb-7 md:gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Competitive pricing from $20/mo</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Quick setup with Google/Email</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Enterprise-grade encryption</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">Cancel anytime, no questions</span>
                </div>
              </div>
              {/* CTAs */}
              {session ? (
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full px-5 py-4 text-sm sm:px-7 sm:py-5 sm:text-base"
                    >
                      Open your Library
                    </Button>
                  </Link>
                  <Link href="/p" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full px-5 py-4 text-sm sm:px-7 sm:py-5 sm:text-base"
                    >
                      <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Browse Templates
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                    <GoogleSignInButton
                      redirectPath="/dashboard"
                      size="lg"
                      className="w-full px-6 py-5 text-base font-semibold shadow-lg sm:h-12 sm:w-auto sm:px-8"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Start Free - No Credit Card
                    </GoogleSignInButton>
                    <Link href="/pricing" className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-2 px-6 py-5 text-base font-semibold sm:h-12 sm:w-auto sm:px-8"
                      >
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />
                    Free forever plan available • Upgrade anytime
                  </p>
                </div>
              )}
              <div className="mt-4 flex w-full flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="shrink-0 text-xs text-muted-foreground">Popular models:</span>
                {[
                  'gpt-4',
                  'gpt-4o',
                  'Claude 4 Opus',
                  'Gemini 2.5 Pro',
                  'Llama 4 Series',
                  'Mistral Large',
                ].map((m) => (
                  <Badge
                    key={m}
                    variant="outline"
                    className="shrink-0 whitespace-nowrap px-2 py-0.5 text-[10px] sm:py-1 sm:text-xs"
                  >
                    {m}
                  </Badge>
                ))}
                <Link
                  href="/models"
                  className="ml-0.5 shrink-0 whitespace-nowrap text-xs text-emerald-700 hover:underline dark:text-emerald-300 sm:ml-1"
                >
                  Models →
                </Link>
              </div>
            </div>

            {/* Right: Interactive Dashboard Preview */}
            <div className="order-2 w-full md:order-2">
              <DashboardPreview />
            </div>
          </section>

          {/* Trust Signals & Security */}
          <section className="border-y border-border/50 bg-gradient-to-r from-muted/30 via-muted/10 to-muted/30 py-8 md:py-12">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground md:mb-8">
                Why Teams Trust Prompt Manage
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-background p-4 text-center">
                  <div className="mb-2 rounded-full bg-emerald-500/10 p-3">
                    <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold">AES-256 Encryption</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Bank-level encryption at rest and in transit. Your prompts are never exposed.
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-background p-4 text-center">
                  <div className="mb-2 rounded-full bg-emerald-500/10 p-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold">SOC 2 Compliant</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Enterprise-ready security controls. GDPR and CCPA compliant infrastructure.
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-background p-4 text-center">
                  <div className="mb-2 rounded-full bg-emerald-500/10 p-3">
                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold">Affordable Pricing</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Premium features at competitive prices. No hidden fees or surprise charges.
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-background p-4 text-center">
                  <div className="mb-2 rounded-full bg-emerald-500/10 p-3">
                    <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold">Zero Data Mining</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    We never train AI on your prompts. Your intellectual property stays yours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section with ROI */}
          <section className="mt-16 md:mt-32">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  Everything You Need to Scale Your AI Operations
                </h2>
                <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg md:mt-6 md:text-xl">
                  Stop wasting hours searching for prompts. Prompt Manage helps you find and organize your team's best prompts while keeping your competitive advantage secure.
                </p>
              </div>

              {/* Feature Cards with Benefits */}
              <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 md:mt-16 lg:grid-cols-3">
                <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-emerald-500/50 hover:shadow-xl sm:p-8">
                  <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-br from-emerald-500/10 to-transparent blur-2xl" />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3">
                      <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold md:text-xl">
                      Find Prompts in Seconds
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      Powerful search and filtering cut search time from 10 minutes to 10 seconds.
                      Tag by model, use case, or team.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Save time with instant search
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-emerald-500/50 hover:shadow-xl sm:p-8">
                  <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-br from-emerald-500/10 to-transparent blur-2xl" />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3">
                      <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold md:text-xl">
                      Military-Grade Security
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      AES-256 encryption, SOC 2 compliance, and zero-knowledge architecture. Your
                      prompts never leave your control.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Protect your intellectual property
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-emerald-500/50 hover:shadow-xl sm:p-8">
                  <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-br from-emerald-500/10 to-transparent blur-2xl" />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3">
                      <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold md:text-xl">Team Collaboration</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      Share prompts instantly, maintain version history, and onboard new team
                      members in minutes instead of weeks.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Onboard teams faster
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Comparison/Differentiation Section */}
          <section className="mt-16 md:mt-32">
            <div className="mx-auto max-w-5xl rounded-2xl border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-8 md:p-12">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Why Choose Prompt Manage Over Alternatives?
                </h2>
                <p className="mb-8 text-base text-muted-foreground md:text-lg">
                  We built Prompt Manage because existing solutions are either too expensive, too
                  complicated, or don&apos;t take security seriously.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-full bg-red-500/10 p-1">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                    </div>
                    <h3 className="font-bold text-muted-foreground">Other Solutions</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-red-500">✗</span>
                      <span>$99-$500/month for basic features</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Train AI models on your prompts</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Limited storage quotas</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Complex setup requiring IT support</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Lock you into annual contracts</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border-2 border-emerald-500/50 bg-emerald-500/5 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-full bg-emerald-500/10 p-1">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <h3 className="font-bold">Prompt Manage</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="font-medium">$0-$99/month with unlimited storage</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="font-medium">Zero data mining guarantee</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="font-medium">Truly unlimited prompts on paid plans</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="font-medium">Start in 60 seconds, no setup needed</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span className="font-medium">Cancel anytime, keep your data</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link href="/pricing">
                  <Button size="lg" className="px-8 py-6 text-base font-semibold shadow-lg">
                    See Full Pricing Comparison →
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-12 md:mt-24">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                  Get Started in 3 Simple Steps
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base md:mt-4 md:text-lg">
                  No complex setup. No IT required. Start securing your prompts in under 60 seconds.
                </p>
              </div>

              <div className="mx-auto mt-6 max-w-4xl sm:mt-8 md:mt-12">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
                  {[
                    {
                      title: 'Sign Up Free',
                      desc: 'Create your account with Google or email. No credit card required.',
                      icon: Zap,
                      color: 'emerald',
                    },
                    {
                      title: 'Import or Create',
                      desc: 'Add your existing prompts or browse 400+ templates to get started.',
                      icon: Folder,
                      color: 'sky',
                    },
                    {
                      title: 'Collaborate & Scale',
                      desc: 'Invite your team, set permissions, and scale with confidence.',
                      icon: Users,
                      color: 'purple',
                    },
                  ].map((s, i) => (
                    <div
                      key={s.title}
                      className="relative overflow-hidden rounded-xl border-2 border-border bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {i + 1}
                          </span>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-2">
                          <s.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                        {s.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center sm:mt-10 md:mt-16">
                <div className="inline-flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <GoogleSignInButton
                    redirectPath="/dashboard"
                    size="lg"
                    className="px-8 py-6 text-base font-semibold shadow-lg"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Free - No Credit Card
                  </GoogleSignInButton>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-2 px-8 py-6 text-base font-semibold sm:w-auto"
                    >
                      Compare Plans
                    </Button>
                  </Link>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />
                  Free plan forever • Cancel anytime
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA Banner */}
          <section className="mt-16 md:mt-32">
            <div className="mx-auto max-w-5xl rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Stop Compromising on Security or Price
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Join the teams who switched to Prompt Manage and saved thousands while getting
                enterprise-grade security. Start your free account today.
              </p>
              <div className="flex flex-col items-center gap-4">
                <GoogleSignInButton
                  redirectPath="/dashboard"
                  size="lg"
                  className="px-10 py-7 text-lg font-bold shadow-xl"
                >
                  <Lock className="mr-2 h-6 w-6" />
                  Get Started Free — Secure Your Prompts Now
                </GoogleSignInButton>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Free forever plan
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    AES-256 encryption
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Success Stories */}
          <section className="relative mt-12 md:mt-24">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 via-transparent to-gray-50 dark:from-gray-950 dark:via-transparent dark:to-gray-950" />
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl md:mb-12 md:text-4xl">
                Trusted by Teams Who Take Security Seriously
              </h2>
              <div className="mx-auto max-w-2xl">
                {/* Real Testimonial */}
                <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    &quot;Prompt Manage turned our scattered prompt docs into a well-organized
                    library. We went from spending 2 hours a day searching for prompts to finding
                    what we need in seconds.&quot;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10" />
                    <div>
                      <div className="text-xs font-semibold">Michael Moloney</div>
                      <div className="text-xs text-muted-foreground">
                        Co-Founder,{' '}
                        <a
                          href="https://moloneycreativeagency.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          MCA
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* FAQ Section - Human & LLM Optimized */}
          <section className="mx-auto mt-12 max-w-4xl md:mt-24">
            <div className="text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:mb-4 md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mb-8 text-base text-muted-foreground md:mb-12 md:text-lg">
                Everything you need to know about the most secure prompt management platform
              </p>
            </div>
            <div className="space-y-4">
              <details className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-emerald-500/50">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Why is Prompt Manage more secure than alternatives?</span>
                  <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Prompt Manage uses military-grade AES-256 encryption at rest and in transit, SOC 2
                  Type II compliance, and zero-knowledge architecture. Unlike competitors, your
                  prompts are encrypted before they reach our servers, so we physically cannot
                  access your data. We&apos;re GDPR and CCPA compliant, maintain 99.9% uptime SLA,
                  and guarantee zero data mining—we never train AI on your prompts.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-emerald-500/50">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>How much money will I save switching to Prompt Manage?</span>
                  <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  While some competitors charge $99-$500/month for basic features, Prompt Manage offers unlimited prompts starting at just $20/month. Our free plan gives you 25 prompts forever—no credit card required.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-emerald-500/50">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Can I try Prompt Manage before committing?</span>
                  <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Absolutely! Our free forever plan lets you store 25 prompts, use our advanced
                  search and tagging, and access 400+ free templates from our public directory. No
                  credit card required, no time limit. When you&apos;re ready to scale, upgrade to
                  Team ($20/mo) or Pro ($99/mo) and cancel anytime with no fees or lock-ins.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-emerald-500/50">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>What AI models work with Prompt Manage?</span>
                  <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  All of them! Prompt Manage supports 20+ AI models including GPT-5, GPT-4o, Claude
                  4 Opus, Claude 4 Sonnet, Claude 3.5 Sonnet, Gemini 2.5 Pro, Llama 4, DeepSeek R1,
                  Mistral Large, Grok 4, and more. We add new models as they launch, so your prompt
                  library works with any AI tool you use now or in the future.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-emerald-500/50">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>How do teams use Prompt Manage to collaborate?</span>
                  <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Teams create shared prompt libraries with role-based access control. You can
                  invite members, organize prompts by project or use case, track version history,
                  and maintain a single source of truth for your best prompts. New team members can
                  be onboarded in minutes instead of weeks, and everyone always has access to your
                  latest, most effective prompts.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-emerald-500/50">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Will you train AI on my prompts like other companies do?</span>
                  <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Never. This is our zero data mining guarantee. Your prompts are your intellectual
                  property and competitive advantage. We use zero-knowledge encryption, meaning we
                  physically cannot access your prompts. We never train AI on your data, never sell
                  it, never share it with third parties, and never use it for any purpose other than
                  securely storing it for you.
                </p>
              </details>
            </div>
          </section>

          {/* Learn More / Internal Links Section */}
          <section className="mx-auto mt-12 max-w-5xl border-t pb-10 pt-8 sm:mt-16 sm:pb-12 sm:pt-10 md:mt-32 md:pb-16 md:pt-12">
            <h2 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-xl md:mb-8 md:text-2xl">
              Explore Prompt Manage
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
              <Link
                href="/p"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Public Prompt Directory →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Browse 300+ community-shared AI prompts for ChatGPT, Claude, Gemini, and more.
                  Free to use and copy.
                </p>
              </Link>
              <Link
                href="/trending"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Trending Prompts →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Discover the most popular and recently added AI prompt templates used by thousands
                  of creators.
                </p>
              </Link>
              <Link
                href="/categories"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Browse by Category →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Find prompts organized by use case: coding, marketing, writing, design, business,
                  and more.
                </p>
              </Link>
            </div>
            <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4 md:mt-6 md:gap-6 lg:grid-cols-3">
              <Link
                href="/p/tags"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Browse by Tag →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Explore prompts by specific tags and keywords to find exactly what you need.
                </p>
              </Link>
              <Link
                href="/models"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Supported AI Models →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  See the complete list of 20+ AI models we support, including GPT-5, Claude 4,
                  Gemini 2.5 Pro, and more.
                </p>
              </Link>
              <Link
                href="/docs/best-practices"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Prompt Best Practices →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Learn expert tips for writing effective prompts, organizing your library, and
                  scaling team workflows.
                </p>
              </Link>
            </div>
            <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:mt-6 md:gap-6 lg:grid-cols-2">
              <Link
                href="/docs"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
                  Documentation →
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm">
                  Complete guides on how to use Prompt Manage, from creating your first prompt to
                  advanced team collaboration.
                </p>
              </Link>
              <Link
                href="/about"
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700 sm:p-5 md:rounded-xl md:p-6"
              >
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:mb-1.5 sm:text-base md:mb-2">
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
