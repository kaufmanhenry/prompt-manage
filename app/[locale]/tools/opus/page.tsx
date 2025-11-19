import { ArrowRight, Play, Scissors, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Opus specific data
const opusData = {
  name: 'Opus',
  company: 'Opus Clip',
  description:
    "Opus Clip's AI-powered video clipping platform that automatically creates engaging short-form content from long-form videos using intelligent editing and optimization.",
  icon: '✂️',
  color: 'bg-violet-100 dark:bg-violet-900',
  textColor: 'text-violet-600 dark:text-violet-400',
  capabilities: ['Video Clipping', 'Content Optimization', 'Auto-Editing', 'Short-Form Creation'],
  features: [
    'Automatically clip long videos into short-form content',
    'AI-powered content optimization and editing',
    'Engagement-focused video creation',
    'Social media ready output',
  ],
  useCases: [
    'YouTube Shorts creation',
    'TikTok content generation',
    'Instagram Reels production',
    'LinkedIn video clips',
    'Twitter video content',
    'Educational micro-content',
  ],
  companyUrl: 'https://opus.pro',
  tag: 'opus',
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [opusData.tag])

  const count = prompts?.length || 0

  const title = `Best Opus Prompts for AI Video Clipping | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use Opus prompts for AI video clipping and optimization. Create engaging short-form content with our curated collection of Opus prompt templates for YouTube Shorts, TikTok, and social media.`

  return {
    title,
    description,
    keywords: [
      'Opus',
      'Opus prompts',
      'AI video clipping',
      'video optimization',
      'short-form content',
      'Opus Clip',
      'video editing prompts',
      'social media clips',
      'YouTube Shorts',
      'TikTok content',
    ],
    openGraph: {
      title,
      description,
      url: '/tools/opus',
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Opus Prompts',
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
      canonical: '/tools/opus',
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

export default async function OpusPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts tagged with 'opus'
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [opusData.tag])
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== opusData.tag) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      }
    })
  })

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

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
        item: '/prompts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Opus',
        item: '/tools/opus',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Opus AI Video Clipping Prompts',
    description: 'Collection of AI prompts for Opus video clipping and optimization',
    url: '/tools/opus',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'Opus Clip',
      applicationCategory: 'AI Video Editing',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Opus Clip?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Opus Clip is an AI-powered video clipping platform that automatically creates engaging short-form content from long-form videos. It uses intelligent editing and optimization to transform lengthy content into viral-ready clips for social media platforms.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective Opus prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective Opus prompts should specify the type of content you want to create, target platform, desired length, and key messaging. Include details about the source video, target audience, and any specific editing requirements or optimization goals.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of content can I create with Opus?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Opus can create various types of short-form content including YouTube Shorts, TikTok videos, Instagram Reels, LinkedIn clips, Twitter videos, and educational micro-content. It's particularly effective for transforming long-form content into engaging social media clips.",
        },
      },
      {
        '@type': 'Question',
        name: 'Are these Opus prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our Opus collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
            <Link href="/p" className="hover:text-foreground">
              AI Tools
            </Link>
            <span>/</span>
            <span className="text-foreground">{opusData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${opusData.color} rounded-xl p-6`}>
                <span className="text-6xl">{opusData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {opusData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Video Clipping
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{opusData.description}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                      {prompts?.length || 0} prompts
                    </span>
                    <span>available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Community curated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending tool</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Capabilities */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">Key Capabilities</h2>
              <div className="flex flex-wrap gap-2">
                {opusData.capabilities.map((capability) => (
                  <Badge key={capability} variant="outline" className="text-sm">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-lg font-semibold text-foreground">Popular Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(([tag, count]) => (
                    <Link key={tag} href={`/p/tags/${encodeURIComponent(tag)}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                        {tag} ({count})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prompts Grid */}
          {prompts && prompts.length > 0 ? (
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Featured {opusData.name} Prompts
                </h2>
                <Link href="/p">
                  <Button variant="outline" size="sm">
                    View All Prompts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {prompts.slice(0, 12).map((prompt) => (
                  <Link key={prompt.id} href={`/p/${prompt.slug}`}>
                    <Card className="group flex h-full cursor-pointer flex-col p-6 transition-all hover:border-primary hover:shadow-lg">
                      <div className="flex-grow">
                        <div className="mb-4">
                          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
                            {prompt.name}
                          </h3>
                          {prompt.description && (
                            <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                              {prompt.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {prompt.tags?.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {prompt.tags && prompt.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{prompt.tags.length - 3}
                              </Badge>
                            )}
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
                            <span>{prompt.view_count || 0} views</span>
                          </div>
                          <CopyButton text={prompt.prompt_text} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-12 py-12 text-center">
              <Scissors className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                No {opusData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for Opus video clipping!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First Opus Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t px-4 pb-8 pt-8 sm:px-0 sm:pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to Opus Video Clipping
              </h2>

              {/* What is Opus section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">What is Opus Clip?</h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Opus Clip</strong> is an AI-powered video
                    clipping platform that automatically creates engaging short-form content from
                    long-form videos. It uses intelligent editing and optimization to transform
                    lengthy content into viral-ready clips for social media platforms.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for Opus
                    </strong>
                    , tested and refined by the community to deliver optimal results for various
                    video clipping and optimization needs.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Opus Key Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {opusData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg bg-accent/50 p-4">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use cases section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Best Use Cases for Opus
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>Opus excels at the following video clipping applications:</p>
                  <ul className="ml-4 space-y-2">
                    {opusData.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* How to optimize prompts section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  How to Write Effective Opus Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from Opus, follow these prompt optimization strategies:
                  </p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Specify content type and platform:</strong> Clearly define the type
                        of short-form content you want to create and the target platform (YouTube
                        Shorts, TikTok, Instagram Reels, etc.).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Define target audience and messaging:</strong> Include details about
                        your target audience and the key message or value proposition you want to
                        convey.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Set length and pacing requirements:</strong> Specify the desired
                        clip length, pacing, and any specific timing requirements for optimal
                        engagement.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Include optimization goals:</strong> Mention specific optimization
                        goals such as maximizing engagement, highlighting key points, or creating
                        viral-worthy content.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About Opus
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes Opus different from other video editing tools?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Opus specializes in AI-powered video clipping and optimization specifically
                      for short-form content. It excels at automatically identifying the most
                      engaging moments in long-form videos and transforming them into viral-ready
                      clips optimized for social media platforms.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my video clipping project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific platform, content type, and
                      optimization goals. Consider the type of content you're creating (educational,
                      entertainment, marketing), your target audience, and the desired engagement
                      level. Our {prompts?.length || 0} Opus prompts are organized by category to
                      help you find the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these Opus prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our Opus collection are free to use for both personal and
                      commercial purposes. You can modify, adapt, and integrate them into your
                      business workflows, marketing campaigns, and client projects without any
                      restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new Opus prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new Opus prompts as the technology evolves. We
                      update our collection regularly with the latest templates, trending prompts,
                      and community-contributed solutions. Check back frequently or create an
                      account to get notified of updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related tools section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Explore Other AI Video Tools
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href="/tools/google-veo"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎬</span>
                      <h4 className="font-semibold text-foreground">Google Veo Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI video generation prompts</p>
                  </Link>
                  <Link
                    href="/tools/runway"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      <h4 className="font-semibold text-foreground">Runway Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Creative video generation prompts
                    </p>
                  </Link>
                  <Link
                    href="/tools/ai-video"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      <h4 className="font-semibold text-foreground">AI Video Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      General AI video creation prompts
                    </p>
                  </Link>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Ready to Create Amazing Short-Form Content with Opus?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite Opus prompts, organize them by
                  project, and track your video clipping results.
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
                  <a href={opusData.companyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Learn More About Opus
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
