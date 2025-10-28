import { Music, Play, Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Udio specific data
const udioData = {
  name: 'Udio',
  company: 'Udio AI',
  description:
    "Udio's advanced AI music generation platform that creates high-quality songs, instrumentals, and audio content with exceptional vocal synthesis.",
  icon: '🎼',
  color: 'bg-orange-100 dark:bg-orange-900',
  textColor: 'text-orange-600 dark:text-orange-400',
  capabilities: [
    'Music Generation',
    'Vocal Synthesis',
    'Instrumental Creation',
    'Song Composition',
  ],
  features: [
    'Generate complete songs with vocals',
    'Create instrumental tracks and beats',
    'Advanced vocal synthesis technology',
    'Support for multiple music styles',
  ],
  useCases: [
    'Original song creation',
    'Background music for content',
    'Podcast theme music',
    'Marketing audio content',
    'Creative music projects',
    'Educational audio materials',
  ],
  companyUrl: 'https://udio.ai',
  tag: 'udio',
  pricing: {
    free: '10 credits per day',
    pro: '$10/month - 1200 credits per month',
    premier: '$30/month - 4800 credits per month',
  },
  competitors: ['Suno', 'Mubert', 'AIVA', 'Soundraw'],
  tutorials: [
    {
      title: 'Getting Started with Udio',
      url: 'https://udio.ai/docs/getting-started',
      description: 'Learn the basics of creating music with Udio',
    },
    {
      title: 'Advanced Music Creation',
      url: 'https://udio.ai/docs/advanced',
      description: 'Master advanced Udio features and techniques',
    },
    {
      title: 'Vocal Synthesis Tips',
      url: 'https://udio.ai/docs/vocals',
      description: 'Tips for creating realistic vocals',
    },
  ],
  community: {
    discord: 'https://discord.gg/udio',
    reddit: 'https://reddit.com/r/udio',
    twitter: 'https://twitter.com/udio_ai',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [udioData.tag])

  const promptCount = prompts?.length || 0

  const title = `Best Udio Prompts for AI Music Creation | Prompt Manage`
  const description = `Discover ${promptCount}+ ready-to-use prompts for Udio AI music generation. Create amazing songs, vocals, and instrumentals with our community-tested prompt templates.`

  return {
    title,
    description,
    keywords: [
      'Udio',
      'Udio prompts',
      'Udio AI',
      'AI music generation',
      'music prompts',
      'vocal synthesis',
      'song creation',
      'prompt templates',
      'AI music',
      'music AI',
    ],
    openGraph: {
      title,
      description,
      url: 'https://promptmanage.com/tools/udio',
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Udio Prompts',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://promptmanage.com/og-image.svg'],
    },
    alternates: {
      canonical: '/tools/udio',
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

export default async function UdioPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts for Udio - check both tags and model_id
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .or(`tags.cs.{${udioData.tag}},model_id.eq.udio`)
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
        item: 'https://promptmanage.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: udioData.name,
        item: 'https://promptmanage.com/tools/udio',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${udioData.name} AI Prompts`,
    description: `Collection of ${prompts?.length || 0} AI prompts for ${udioData.name}`,
    url: 'https://promptmanage.com/tools/udio',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: udioData.name,
      applicationCategory: 'Music Generation',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What makes Udio different from other AI music generators?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Udio stands out for its advanced vocal synthesis technology and ability to create complete songs with realistic vocals. It excels at generating both instrumental tracks and songs with lyrics, making it ideal for creators who need high-quality vocal content.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I choose the right Udio prompt for my project?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Look for prompts that match your specific genre, mood, and use case. Consider whether you need vocals or instrumentals, the style of music you want, and the intended use (background music, standalone song, etc.). Our ${prompts?.length || 0} Udio prompts are organized by category to help you find the perfect match.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use these Udio prompts commercially?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! All prompts in our Udio collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your business workflows, marketing campaigns, and client projects without any restrictions.`,
        },
      },
      {
        '@type': 'Question',
        name: `How often are new Udio prompts added?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our community continuously adds new Udio prompts as the technology evolves. We update our collection regularly with the latest templates, trending prompts, and community-contributed solutions. Check back frequently or create an account to get notified of updates.`,
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
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
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
            <span className="text-foreground">{udioData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-8 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                    <span className="text-3xl">{udioData.icon}</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight text-foreground">
                      {udioData.name} Prompts
                    </h1>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      >
                        Music Generation
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
                  {udioData.description}
                </p>

                <div className="flex flex-wrap items-center gap-8 text-sm">
                  <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-gray-900/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="font-semibold text-foreground">
                      {prompts?.length || 0} prompts available
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-gray-900/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-gradient-to-br from-red-400/20 to-pink-400/20 blur-2xl"></div>
            </div>
          </div>

          {/* Key Capabilities */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Key Capabilities</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {udioData.capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <Music className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{capability}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Udio Prompts */}
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Featured Udio Prompts</h2>
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
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to Udio Music Generation
              </h2>

              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">What is Udio?</h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Udio</strong> is an advanced AI music
                    generation platform that creates high-quality songs, instrumentals, and audio
                    content with exceptional vocal synthesis capabilities.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for Udio
                    </strong>
                    , tested and refined by the community to deliver optimal results for various
                    music creation needs.
                  </p>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">Udio Pricing Plans</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="mb-2 font-semibold text-foreground">Free</h4>
                    <p className="text-sm text-muted-foreground">{udioData.pricing.free}</p>
                    <a
                      href={udioData.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Try Free →
                    </a>
                  </div>
                  <div className="rounded-lg border border-primary bg-primary/5 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Pro</h4>
                    <p className="text-sm text-muted-foreground">{udioData.pricing.pro}</p>
                    <a
                      href={`${udioData.companyUrl}/pricing`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Upgrade →
                    </a>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="mb-2 font-semibold text-foreground">Premier</h4>
                    <p className="text-sm text-muted-foreground">{udioData.pricing.premier}</p>
                    <a
                      href={`${udioData.companyUrl}/pricing`}
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
              <div className="mb-8 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 text-center">
                <div className="mb-4">
                  <span className="text-4xl">🎼</span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Share Your Udio Creations with the Community
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Have you created amazing music with Udio? Share your prompts and help other
                  creators discover new possibilities. Join thousands of creators building the
                  future of AI music together.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
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
                  Ready to Create Amazing Music with Udio?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite Udio prompts, organize them by
                  project, and track your music creation results.
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
                  <a href={udioData.companyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Learn More About Udio
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
