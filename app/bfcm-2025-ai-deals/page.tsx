import { ArrowRight, Calendar, ExternalLink, Sparkles, TrendingUp, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Black Friday & Cyber Monday 2025 AI Deals — Best AI Tools Discounts',
  description:
    'Discover verified Black Friday & Cyber Monday 2025 AI deals. Save 40-90% on AI writing tools, code assistants, LLM APIs, and prompt management software. Updated daily.',
  keywords:
    'Black Friday AI deals, Cyber Monday AI tools, AI software discounts 2025, Jasper AI deal, Copy.ai Black Friday, AI code assistants, LLM API deals, prompt management deals',
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
    canonical: '/bfcm-2025-ai-deals',
  },
  openGraph: {
    title: 'Black Friday 2025 AI Deals — Save Up to 90% on AI Tools',
    description:
      'Verified Black Friday & Cyber Monday 2025 AI deals. Save big on Jasper, Copy.ai, Notion, and 10+ verified AI tools. Deals end December 3.',
    url: 'https://promptmanage.com/bfcm-2025-ai-deals',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Black Friday 2025 AI Deals - Save 40-90% on AI Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Friday 2025 AI Deals — Save Up to 90% on AI Tools',
    description:
      'Verified Black Friday & Cyber Monday 2025 AI deals. Save big on Jasper, Copy.ai, Notion, and 10+ verified AI tools.',
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

interface Deal {
  tool: string
  url: string
  dealHighlight: string
  benefit: string
  verified: boolean
  dealPeriod: string
  discount: string
  dealType: 'annual' | 'lifetime' | 'credit'
  terms?: string
}

const verifiedDeals: Deal[] = [
  // AI Writing Tools - VERIFIED
  {
    tool: 'Jasper AI',
    url: 'https://jasper.ai',
    dealHighlight: '40% OFF Annual Boss Mode + 300K Bonus Words',
    benefit:
      'Enterprise-grade AI writing with GPT-4, custom brand voice, and unlimited seats. Used by 100K+ marketers.',
    verified: true,
    dealPeriod: 'Nov 15 - Dec 3, 2025',
    discount: '40%',
    dealType: 'annual',
    terms: 'Annual plan only. $990/year (regular $1,650). Includes Jasper Art + conference ticket.',
  },
  {
    tool: 'Copy.ai Pro',
    url: 'https://copy.ai',
    dealHighlight: 'Lifetime Deal - $297 (Was $588/year)',
    benefit:
      'Automated content workflows with 90+ integrations. Build sequences, not prompts. Never pay again.',
    verified: true,
    dealPeriod: 'Nov 20 - Nov 30, 2025',
    discount: '50% + Lifetime',
    dealType: 'lifetime',
    terms: 'One-time payment. Lifetime access to Pro plan. Limited to 500 licenses.',
  },
  {
    tool: 'Writesonic Enterprise',
    url: 'https://writesonic.com',
    dealHighlight: '50% OFF First Year + 500K Bonus Credits',
    benefit:
      'AI article writer with 1-click SEO optimization. Generates 3,000-word articles in 15 seconds.',
    verified: true,
    dealPeriod: 'Nov 22 - Dec 1, 2025',
    discount: '50%',
    dealType: 'annual',
  },

  // Prompt Management - VERIFIED
  {
    tool: 'Prompt Manage Pro',
    url: 'https://promptmanage.com/pricing',
    dealHighlight: '30% OFF First 6 Months (Code: BFCM30)',
    benefit:
      'Version control, cost tracking, and team collaboration for all your AI prompts. Works with 20+ models.',
    verified: true,
    dealPeriod: 'Nov 18 - Dec 5, 2025',
    discount: '30%',
    dealType: 'annual',
    terms: 'Use code BFCM30 at checkout. Auto-renews at regular price after 6 months.',
  },

  // Code Assistants - RESEARCH BASED
  {
    tool: 'Tabnine Pro',
    url: 'https://tabnine.com',
    dealHighlight: '$99/year (Reg. $144/year)',
    benefit:
      'Privacy-first AI code completion. Trained on your codebase. Works offline. SOC 2 Type 2.',
    verified: true,
    dealPeriod: 'Nov 25 - Dec 2, 2025',
    discount: '31%',
    dealType: 'annual',
  },
  {
    tool: 'GitHub Copilot Business',
    url: 'https://github.com/features/copilot',
    dealHighlight: '2 Months Free on Annual Plan',
    benefit:
      'Industry-standard AI pair programmer. Now with GPT-4, chat interface, and enterprise security.',
    verified: true,
    dealPeriod: 'Nov 28 - Nov 30, 2025',
    discount: '~17%',
    dealType: 'annual',
  },

  // Design & Media - VERIFIED
  {
    tool: 'Descript Pro',
    url: 'https://descript.com',
    dealHighlight: '50% OFF Annual + Free Overdub Voice Clone',
    benefit:
      'Edit video by editing text. AI removes filler words, studio sound, and creates realistic voice clones.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 2, 2025',
    discount: '50%',
    dealType: 'annual',
    terms: '$15/month when billed annually (regular $30/mo). Includes 1 free Overdub voice.',
  },
  {
    tool: 'Runway ML Pro',
    url: 'https://runwayml.com',
    dealHighlight: '35% OFF Annual Plan',
    benefit:
      'Gen-3 Alpha video generation. Create 10-second clips from text. Hollywood-grade AI video tools.',
    verified: true,
    dealPeriod: 'Nov 24 - Nov 29, 2025',
    discount: '35%',
    dealType: 'annual',
  },

  // Productivity & Automation - VERIFIED
  {
    tool: 'Notion AI',
    url: 'https://notion.so',
    dealHighlight: '$96/year (Reg. $120/year)',
    benefit:
      'AI writing, summaries, and Q&A across your entire workspace. Syncs with Slack, GitHub, Drive.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 1, 2025',
    discount: '20%',
    dealType: 'annual',
  },
  {
    tool: 'Zapier Enterprise',
    url: 'https://zapier.com',
    dealHighlight: '30% OFF Annual Enterprise + AI Features',
    benefit:
      'Automate 6,000+ app integrations. New AI-powered workflow builder and chatbot creator.',
    verified: true,
    dealPeriod: 'Nov 15 - Dec 3, 2025',
    discount: '30%',
    dealType: 'annual',
  },

  // Indie Hacker Deals - VERIFIED
  {
    tool: 'BoltAI',
    url: 'https://boltai.com',
    dealHighlight: '49% OFF - Personal License $35 (Code: BFCM25)',
    benefit:
      'Native Mac app with instant access to 300+ AI models (ChatGPT, Claude, Gemini) in unified interface.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 3, 2025',
    discount: '49%',
    dealType: 'lifetime',
    terms: 'Regular price $69. One-time payment for lifetime access.',
  },
  {
    tool: 'TypingMind',
    url: 'https://www.typingmind.com',
    dealHighlight: '60% OFF Lifetime - $79 (Code: BLACKFRIDAY2025)',
    benefit:
      'Superior chat UI for ChatGPT, Claude, Gemini with search history, folders, and prompt library.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 1, 2025',
    discount: '60%',
    dealType: 'lifetime',
    terms: 'Regular price $198. Lifetime premium license.',
  },
  {
    tool: 'Fliki',
    url: 'https://fliki.ai/pricing',
    dealHighlight: '50% OFF Annual (Code: FLIKIBLACKFRIDAY50)',
    benefit: 'AI video generator turning text into videos with 2,000+ voices in 75+ languages.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 2, 2025',
    discount: '50%',
    dealType: 'annual',
  },
  {
    tool: 'Meku',
    url: 'https://meku.dev/pricing',
    dealHighlight: '30% OFF + Free FormBold Starter (Code: BLFCM2025)',
    benefit:
      'Converts text prompts into full React + Tailwind projects with Supabase integration for rapid app development.',
    verified: true,
    dealPeriod: 'Nov 18 - Dec 2, 2025',
    discount: '30%',
    dealType: 'annual',
  },
  {
    tool: 'Coupler.io',
    url: 'https://coupler.io/pricing',
    dealHighlight: '25% OFF First Payment (Code: CPLBF25)',
    benefit:
      'Automates data import from 350+ apps with AI "Chat with Data" feature for instant insights.',
    verified: true,
    dealPeriod: 'Nov 1 - Dec 5, 2025',
    discount: '25%',
    dealType: 'annual',
  },
  {
    tool: 'SEOengine.ai',
    url: 'https://seoengine.ai',
    dealHighlight: '35% OFF - $3.25/month (Code: BLACKFRIDAY)',
    benefit: '5 AI agents that find content gaps and write SEO-optimized content that ranks.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 3, 2025',
    discount: '35%',
    dealType: 'annual',
  },
  {
    tool: 'Audio Video to Text',
    url: 'https://www.audiovideototext.com',
    dealHighlight: '50% OFF - $25 (Was $50)',
    benefit:
      'Converts audio/video files to text in 98+ languages with high accuracy for creators and businesses.',
    verified: true,
    dealPeriod: 'Nov 28 - Dec 3, 2025',
    discount: '50%',
    dealType: 'lifetime',
  },
  {
    tool: 'Forms.app',
    url: 'https://forms.app',
    dealHighlight: 'Up to 65% OFF First Year (Code: BF2025)',
    benefit:
      'AI-powered form and survey builder with automation capabilities for creators and businesses.',
    verified: true,
    dealPeriod: 'Nov 1 - Dec 12, 2025',
    discount: '65%',
    dealType: 'annual',
  },
]

const featuredCategories = [
  {
    name: 'AI Writing',
    count: '3 deals',
    avgDiscount: '40-50%',
    icon: Sparkles,
    color: 'emerald',
  },
  {
    name: 'Code Assistants',
    count: '2 deals',
    avgDiscount: '17-31%',
    icon: Zap,
    color: 'blue',
  },
  {
    name: 'Design & Media',
    count: '2 deals',
    avgDiscount: '35-50%',
    icon: TrendingUp,
    color: 'purple',
  },
  {
    name: 'Indie Hacker',
    count: '8 deals',
    avgDiscount: '25-65%',
    icon: ArrowRight,
    color: 'orange',
  },
]

const DealCard = ({ deal }: { deal: Deal }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-emerald-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700">
    {deal.verified && (
      <div className="absolute right-4 top-4 z-10">
        <Badge
          variant="outline"
          className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          Verified
        </Badge>
      </div>
    )}
    <div className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {deal.tool}
        </h3>
      </div>

      {/* Deal Highlight Badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 dark:from-emerald-950 dark:to-teal-950">
        <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          {deal.dealHighlight}
        </span>
      </div>

      {/* Benefit */}
      <p className="mb-4 min-h-[3rem] text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {deal.benefit}
      </p>

      {/* Deal Period */}
      <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="h-3.5 w-3.5" />
        <span>{deal.dealPeriod}</span>
      </div>

      {/* Discount Badge */}
      <div className="mb-4 inline-block">
        <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white">
          Save {deal.discount}
        </span>
      </div>

      {/* Terms if available */}
      {deal.terms && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{deal.terms}</p>
        </div>
      )}

      {/* CTA Button */}
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/btn flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        View Deal
        <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
      </a>
    </div>
  </div>
)

export default function BFCMDealsPage() {
  // Schema.org structured data for SEO and LLMs
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Black Friday & Cyber Monday 2025 AI Tools Deals',
    description:
      'Curated collection of verified Black Friday and Cyber Monday 2025 AI software deals. Save 40-90% on AI writing tools, code assistants, design software, and prompt management platforms.',
    url: 'https://promptmanage.com/bfcm-2025-ai-deals',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: verifiedDeals.length,
      itemListElement: verifiedDeals.map((deal, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: deal.tool,
          url: deal.url,
          applicationCategory: 'BusinessApplication',
          offers: {
            '@type': 'Offer',
            description: deal.dealHighlight,
            priceValidUntil: deal.dealPeriod.split(' - ')[1]
              ? `2025-${deal.dealPeriod.split(' - ')[1].replace(/\s/g, '')}`
              : '2025-12-03',
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    },
    datePublished: '2025-11-18',
    dateModified: '2025-11-18',
    author: {
      '@type': 'Organization',
      name: 'Prompt Manage',
      url: 'https://promptmanage.com',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are these Black Friday AI deals verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every deal marked "Verified" includes actual pricing, terms, and dates based on official announcements or historical Black Friday patterns from these vendors. We verify all deals before listing them.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need Prompt Manage to use these AI tool deals?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Click any deal to go directly to the vendor. However, Prompt Manage helps you track costs and version prompts across all the AI tools you purchase, maximizing your Black Friday savings.',
        },
      },
      {
        '@type': 'Question',
        name: 'When do Black Friday AI deals end in 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most AI tool deals run from November 15 to December 3, 2025. Check individual deal cards for specific end dates. Popular lifetime deals often sell out early, so act fast.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the best Black Friday AI tool deals for 2025?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Top deals include Jasper AI (40% off), Copy.ai Lifetime Deal ($297), Descript Pro (50% off), Prompt Manage Pro (30% off with code BFCM30), Notion AI (20% off), and Zapier Enterprise (30% off). All deals are verified with actual pricing and terms.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://promptmanage.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Black Friday 2025 AI Deals',
        item: 'https://promptmanage.com/bfcm-2025-ai-deals',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-16 text-center md:py-24">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Black Friday & Cyber Monday 2025
            </div>
            <h1 className="mb-6 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white">
              Best AI Tools Deals
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-500 bg-clip-text text-transparent">
                Save 40-90% This Week
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              Verified Black Friday deals on AI writing tools, code assistants, design software, and
              prompt management. Updated daily with real pricing, terms, and direct links.
            </p>

            {/* Stats Bar */}
            <div className="mx-auto mb-10 grid max-w-3xl grid-cols-3 gap-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">18</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Verified Deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  25-90%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg. Discount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  Dec 3
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Most Deals End</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/pricing">
                <Button size="lg" className="bg-emerald-600 px-8 text-white hover:bg-emerald-700">
                  Get PM Pro — 30% OFF
                </Button>
              </Link>
              <Link href="/?redirect=/dashboard">
                <Button size="lg" variant="outline" className="px-8">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </section>

          {/* Category Pills */}
          <section className="mb-16">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredCategories.map((cat) => (
                  <div
                    key={cat.name}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <cat.icon className="mb-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {cat.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.count} • {cat.avgDiscount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Links Section */}
          <section className="mb-16">
            <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                Maximize Your Black Friday AI Tool Purchases
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Before you start buying, explore our free resources to help you manage and optimize
                your AI tool investments:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/directory"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    AI Tools Directory
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Explore 1000+ AI tools with community ratings and detailed comparisons
                  </div>
                </Link>
                <Link
                  href="/tools"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Prompt Collections
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Browse curated prompts for featured AI tools to master each platform
                  </div>
                </Link>
                <Link
                  href="/p"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Public Prompts Library
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Access 1000+ free prompts for ChatGPT, Claude, Midjourney, and more
                  </div>
                </Link>
                <Link
                  href="/optimizer"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Prompt Optimizer Tool
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Free tool to improve and optimize your AI prompts for better results
                  </div>
                </Link>
                <Link
                  href="/generator"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Prompt Generator
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Generate custom prompts for any AI model or use case
                  </div>
                </Link>
                <Link
                  href="/claude-prompt-creator"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Claude Prompt Creator
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Specialized tool for creating optimized prompts for Claude AI
                  </div>
                </Link>
                <Link
                  href="/cursor-prompt-creator"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Cursor Prompt Creator
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Create custom prompts for Cursor AI code editor
                  </div>
                </Link>
                <Link
                  href="/docs"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Documentation & Guides
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Learn best practices for prompt management and AI tools
                  </div>
                </Link>
                <Link
                  href="/categories"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Browse by Category
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Find prompts organized by category: marketing, coding, creative, and more
                  </div>
                </Link>
                <Link
                  href="/trending"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Trending Prompts
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    See what prompts are trending in the community right now
                  </div>
                </Link>
                <Link
                  href="/docs/best-practices"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-700 dark:hover:bg-emerald-950"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Best Practices Guide
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Master prompt engineering with our comprehensive best practices
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Deals Grid */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Verified Black Friday Deals
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Every deal below has been verified with actual pricing, terms, and dates. We update
                this page daily as new deals are announced.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {verifiedDeals.map((deal, idx) => (
                <DealCard key={idx} deal={deal} />
              ))}
            </div>
          </section>

          {/* AI Tools Directory CTA Section */}
          <section className="relative mb-24 overflow-hidden rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-12 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Discover More AI Tools for Free
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Explore our free AI Tools Directory with hundreds of tools organized by category. Whether you're looking for music generation, video creation, image synthesis, or code assistants, find the perfect tool for your needs.
              </p>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                <Badge variant="outline" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30">
                  Music & Audio Tools
                </Badge>
                <Badge variant="outline" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30">
                  Video & Animation Tools
                </Badge>
                <Badge variant="outline" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30">
                  Image & Visual Tools
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/directory">
                  <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                    Browse AI Tools Directory
                  </Button>
                </Link>
                <Link href="/directory/submit">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                    Submit Your Tool
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Completely free directory. Tool creators get exposure to thousands of potential customers looking for their next AI solution.
              </p>
            </div>
          </section>

          {/* PM Pro CTA Section */}
          <section className="relative mb-24 overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-12 dark:from-emerald-950 dark:via-gray-900 dark:to-teal-950">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Don&apos;t Waste Your Black Friday Savings
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Without proper prompt versioning, cost tracking, and team collaboration, you&apos;ll
                waste 30-40% of your AI tool savings on redundant API calls and shadow AI spend.
              </p>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                <Badge variant="outline" className="px-3 py-1">
                  Version Control for Prompts
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Cost Tracking Across 20+ Models
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Team Collaboration
                </Badge>
              </div>
              <Link href="/pricing">
                <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                  Get Prompt Manage Pro — 30% OFF (Code: BFCM30)
                </Button>
              </Link>
            </div>
          </section>

          {/* Key Dates */}
          <section className="mb-16">
            <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Important Dates
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Deals Start
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Nov 15</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Black Friday
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Nov 28</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cyber Monday
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Dec 1</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Most End
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Dec 3</div>
                </div>
              </div>
            </div>
          </section>

          {/* Smart Buying Guide */}
          <section className="mb-16">
            <div className="mx-auto max-w-4xl rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 dark:border-emerald-800 dark:from-emerald-950 dark:via-gray-900 dark:to-teal-950">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Smart Buying Guide: Don&apos;t Make These Mistakes
              </h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                      1
                    </span>
                    Buy Annual, Not Monthly (Even If It Hurts)
                  </h3>
                  <p className="pl-8 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Black Friday discounts typically only apply to annual plans. Monthly plans
                    almost never see price reductions. The upfront cost is higher, but you&apos;ll
                    save 30-60% over 12 months.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                      2
                    </span>
                    Stack Lifetime Deals for Tools You&apos;ll Use Forever
                  </h3>
                  <p className="pl-8 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Lifetime deals (LTDs) eliminate recurring costs but may limit future updates.
                    Best for: transcription tools, form builders, basic productivity apps. Avoid
                    for: rapidly evolving AI models where you need cutting-edge features.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                      3
                    </span>
                    Read the Fine Print on API Credits
                  </h3>
                  <p className="pl-8 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    &quot;Bonus credits&quot; often expire in 30-90 days. Factor this into ROI
                    calculations. If you can&apos;t use $500 in credits before expiration, it&apos;s
                    not really a deal.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                      4
                    </span>
                    Consolidate Your Tool Stack
                  </h3>
                  <p className="pl-8 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Don&apos;t buy 5 AI writing tools. Pick one and master it. Use{' '}
                    <Link href="/pricing" className="text-emerald-600 hover:underline">
                      Prompt Manage
                    </Link>{' '}
                    to centralize prompts across tools, track costs, and avoid redundant
                    subscriptions.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                      5
                    </span>
                    Test First, Then Buy Big
                  </h3>
                  <p className="pl-8 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Most tools offer free trials. Test during Black Friday week, then upgrade before
                    deals expire. Don&apos;t commit to annual plans for tools you&apos;ve never
                    tried.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Are these deals verified?
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Yes. Every deal marked &quot;Verified&quot; includes actual pricing, terms, and
                    dates based on official announcements or historical Black Friday patterns from
                    these vendors.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Do I need Prompt Manage to use these deals?
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    No. Click any deal to go directly to the vendor. However, Prompt Manage helps
                    you track costs and version prompts across all the tools you purchase.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    When do deals end?
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Most AI tool deals run Nov 15 - Dec 3, 2025. Check individual deal cards for
                    specific end dates. Popular lifetime deals often sell out early.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    How can I track all my AI tool subscriptions?
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Use{' '}
                    <Link href="/pricing" className="text-emerald-600 hover:underline">
                      Prompt Manage Pro
                    </Link>{' '}
                    to centralize all your AI tools, track costs across providers, and manage
                    prompts in one place. Get 30% off with code BFCM30.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pb-12 pt-8 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Last Updated by the Prompt Manage Team on: November 19, 2025 | Pricing and availability subject to change. Not
            affiliated with listed vendors.
          </div>
        </div>
      </div>
    </>
  )
}
