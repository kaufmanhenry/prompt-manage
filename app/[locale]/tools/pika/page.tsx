import { Film, Play, Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Pika Labs specific data
const pikaData = {
  name: 'Pika Labs',
  company: 'Pika Labs',
  description:
    "Pika Labs' revolutionary AI video generation platform that creates stunning videos from text descriptions, images, and video inputs with exceptional quality.",
  icon: '🎬',
  color: 'bg-blue-100 dark:bg-blue-900',
  textColor: 'text-blue-600 dark:text-blue-400',
  capabilities: ['Video Generation', 'Image-to-Video', 'Text-to-Video', 'Video Editing'],
  features: [
    'Generate videos from text descriptions',
    'Transform images into dynamic videos',
    'Extend and modify existing videos',
    'High-quality video output',
  ],
  useCases: [
    'Social media content creation',
    'Marketing video production',
    'Educational video content',
    'Creative storytelling',
    'Product demonstrations',
    'Animation and motion graphics',
  ],
  companyUrl: 'https://pika.art',
  tag: 'pika',
  pricing: {
    free: 'Limited credits per day',
    pro: '$10/month - Enhanced features',
    premier: '$30/month - Premium features',
  },
  competitors: ['Runway', 'Google Veo', 'Stable Video Diffusion', 'Luma AI'],
  tutorials: [
    {
      title: 'Getting Started with Pika',
      url: 'https://pika.art/docs/getting-started',
      description: 'Learn the basics of video generation with Pika',
    },
    {
      title: 'Advanced Video Techniques',
      url: 'https://pika.art/docs/advanced',
      description: 'Master advanced Pika features and workflows',
    },
    {
      title: 'Image-to-Video Tips',
      url: 'https://pika.art/docs/image-to-video',
      description: 'Best practices for image-to-video generation',
    },
  ],
  community: {
    discord: 'https://discord.gg/pika',
    reddit: 'https://reddit.com/r/pika',
    twitter: 'https://twitter.com/pika_labs',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [pikaData.tag])

  const promptCount = prompts?.length || 0

  const title = `Best Pika Labs Prompts for AI Video Generation | Prompt Manage`
  const description = `Discover ${promptCount}+ ready-to-use prompts for Pika Labs AI video generation. Create stunning videos from text, images, and more with our community-tested prompt templates.`

  return {
    title,
    description,
    keywords: [
      'Pika Labs',
      'Pika prompts',
      'Pika AI',
      'AI video generation',
      'video prompts',
      'text to video',
      'image to video',
      'prompt templates',
      'AI video',
      'video AI',
    ],
    openGraph: {
      title,
      description,
      url: '/tools/pika',
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Pika Labs Prompts',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: '/tools/pika',
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
}

export default async function PikaPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts for Pika - check both tags and model_id
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .or(`tags.cs.{${pikaData.tag}},model_id.eq.pika-2`)
    .order('view_count', { ascending: false })
    .limit(100)

  // Schema.org markup
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
        name: 'AI Tools',
        item: '/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pikaData.name,
        item: '/tools/pika',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${pikaData.name} AI Prompts`,
    description: `Collection of ${prompts?.length || 0} AI prompts for ${pikaData.name}`,
    url: '/tools/pika',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: pikaData.name,
      applicationCategory: 'Video Generation',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What makes Pika Labs different from other AI video generators?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Pika Labs stands out for its ability to generate high-quality videos from both text descriptions and images. It excels at creating smooth, coherent video content with excellent temporal consistency and offers both text-to-video and image-to-video capabilities in one platform.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I choose the right Pika prompt for my video project?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Look for prompts that match your specific style, genre, and use case. Consider the type of content you're creating (social media, marketing, educational), your target audience, and the desired visual style. Our ${prompts?.length || 0} Pika prompts are organized by category to help you find the perfect match.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use these Pika prompts commercially?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! All prompts in our Pika collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your business workflows, marketing campaigns, and client projects without any restrictions.`,
        },
      },
      {
        '@type': 'Question',
        name: `How often are new Pika prompts added?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our community continuously adds new Pika prompts as the technology evolves. We update our collection regularly with the latest templates, trending prompts, and community-contributed solutions. Check back frequently or create an account to get notified of updates.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen overflow-x-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:p-6">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground">
              AI Tools
            </Link>
            <span>/</span>
            <span className="text-foreground">{pikaData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <span className="text-3xl">{pikaData.icon}</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight text-foreground">
                      {pikaData.name} Prompts
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      >
                        Video Generation
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                      >
                        AI-Powered
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
                  {pikaData.description}
                </p>

                <div className="flex flex-wrap items-center gap-8 text-sm">
                  <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-gray-900/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-foreground">
                      {prompts?.length || 0} prompts available
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-gray-900/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                      <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-semibold text-foreground">Community curated</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-gray-900/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-semibold text-foreground">Trending tool</span>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-2xl"></div>
            </div>
          </div>

          {/* Key Capabilities */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Key Capabilities</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {pikaData.capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Film className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{capability}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Pika Prompts */}
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Featured Pika Prompts</h2>
              <Link href="/p">
                <Button variant="outline" size="sm">
                  View All Prompts
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {prompts?.slice(0, 6).map((prompt) => (
                <Card
                  key={prompt.id}
                  className="group flex h-full cursor-pointer flex-col p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="flex-grow">
                    <div className="mb-4">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
                        {prompt.name}
                      </h3>
                      {prompt.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                          {prompt.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{prompt.model}</Badge>
                        {prompt.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <pre className="line-clamp-4 text-wrap rounded-lg bg-accent p-3 text-xs font-medium text-muted-foreground">
                        {prompt.prompt_text}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{prompt.view_count} views</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t px-4 pb-8 pt-8 sm:px-0 sm:pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to Pika Labs Video Generation
              </h2>

              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">What is Pika Labs?</h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Pika Labs</strong> is a revolutionary AI
                    video generation platform that creates stunning videos from text descriptions,
                    images, and video inputs with exceptional quality and temporal consistency.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for Pika Labs
                    </strong>
                    , tested and refined by the community to deliver optimal results for various
                    video creation needs.
                  </p>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Pika Labs Pricing Plans
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="mb-2 font-semibold text-foreground">Free</h4>
                    <p className="text-sm text-muted-foreground">{pikaData.pricing.free}</p>
                    <a
                      href={pikaData.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Try Free →
                    </a>
                  </div>
                  <div className="rounded-lg border border-primary bg-primary/5 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Pro</h4>
                    <p className="text-sm text-muted-foreground">{pikaData.pricing.pro}</p>
                    <a
                      href={`${pikaData.companyUrl}/pricing`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Upgrade →
                    </a>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="mb-2 font-semibold text-foreground">Premier</h4>
                    <p className="text-sm text-muted-foreground">{pikaData.pricing.premier}</p>
                    <a
                      href={`${pikaData.companyUrl}/pricing`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Upgrade →
                    </a>
                  </div>
                </div>
              </div>

              {/* Share Your Prompts CTA */}
              <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 text-center">
                <div className="mb-4">
                  <span className="text-4xl">🎬</span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Share Your Pika Creations with the Community
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Have you created amazing videos with Pika? Share your prompts and help other
                  creators discover new possibilities. Join thousands of creators building the
                  future of AI video together.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Share Your Prompts
                    </Button>
                  </Link>
                  <Link href="/p">
                    <Button variant="outline" size="lg">
                      Browse Community Prompts
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Join 60+ creators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Share & discover prompts</span>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Ready to Create Amazing Videos with Pika?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite Pika prompts, organize them by
                  project, and track your video creation results.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg">
                      <Play className="mr-2 h-4 w-4" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/p">
                    <Button variant="outline" size="lg">
                      Browse All Prompts
                    </Button>
                  </Link>
                  <a href={pikaData.companyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Learn More About Pika
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
