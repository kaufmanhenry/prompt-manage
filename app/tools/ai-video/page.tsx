import { ArrowRight, Play, TrendingUp, Users, Video } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// AI Video specific data
const aiVideoData = {
  name: 'AI Video',
  company: 'Various AI Platforms',
  description:
    'Comprehensive collection of AI video generation prompts for creating dynamic videos, animations, and visual content across multiple AI platforms.',
  icon: '🎥',
  color: 'bg-red-100 dark:bg-red-900',
  textColor: 'text-red-600 dark:text-red-400',
  capabilities: [
    'Video Generation',
    'Animation Creation',
    'Motion Graphics',
    'Visual Storytelling',
  ],
  features: [
    'Generate videos from text descriptions',
    'Create animations and motion graphics',
    'Produce dynamic visual content',
    'Support for multiple AI platforms',
  ],
  useCases: [
    'Marketing and advertising videos',
    'Social media content',
    'Educational animations',
    'Product demonstrations',
    'Creative storytelling',
    'Training materials',
  ],
  companyUrl: '#',
  tag: 'ai-video',
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [aiVideoData.tag])

  const count = prompts?.length || 0

  const title = `Best AI Video Prompts for Dynamic Content Creation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use AI video generation prompts. Create dynamic videos, animations, and visual content with our curated collection of AI video prompt templates for Runway, Pika, and other platforms.`

  return {
    title,
    description,
    keywords: [
      'AI video prompts',
      'video generation',
      'Runway prompts',
      'Pika prompts',
      'AI animation',
      'video creation',
      'motion graphics',
      'visual storytelling',
      'AI video creation',
      'dynamic content',
    ],
    openGraph: {
      title,
      description,
      url: 'https://promptmanage.com/tools/ai-video',
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'AI Video Prompts',
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
      canonical: '/tools/ai-video',
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

export default async function AIVideoPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts tagged with 'ai-video'
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [aiVideoData.tag])
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== aiVideoData.tag) {
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
        item: 'https://promptmanage.com/prompts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'AI Video',
        item: 'https://promptmanage.com/tools/ai-video',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Video Generation Prompts',
    description: 'Collection of AI prompts for video generation across multiple platforms',
    url: 'https://promptmanage.com/tools/ai-video',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'AI Video Generation',
      applicationCategory: 'AI Video Generation',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are AI video generation prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI video generation prompts are text descriptions that guide AI models to create dynamic videos, animations, and visual content. They describe scenes, camera movements, lighting, and other visual elements to generate the desired video output.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective AI video prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective AI video prompts should be detailed about visual elements, camera movements, lighting, and timing. Include descriptions of the scene, actions, transitions, and any specific visual effects or styles you want to achieve.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI platforms work with these prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'These prompts are designed to work with various AI video generation platforms including Runway, Pika, Google Veo, and other popular AI video generators. Each platform may have specific formatting requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are these AI video prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our AI video collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
      <div className="min-h-screen bg-background overflow-x-hidden">
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
            <span className="text-foreground">{aiVideoData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${aiVideoData.color} rounded-xl p-6`}>
                <span className="text-6xl">{aiVideoData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {aiVideoData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Video Generation
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{aiVideoData.description}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
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
                    <span>Popular category</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Capabilities */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">Key Capabilities</h2>
              <div className="flex flex-wrap gap-2">
                {aiVideoData.capabilities.map((capability) => (
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
                  Featured {aiVideoData.name} Prompts
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
              <Video className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                No {aiVideoData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for AI video generation!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First AI Video Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-8 sm:pt-12 px-4 sm:px-0">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to AI Video Generation
              </h2>

              {/* What is AI Video Generation section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  What is AI Video Generation?
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">AI Video Generation</strong> is the process
                    of creating dynamic video content using artificial intelligence models trained
                    on vast datasets of video content. These models can generate original videos,
                    animations, and visual content from text descriptions.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for AI video generation
                    </strong>
                    , tested and refined by the community to deliver optimal results across various
                    platforms and use cases.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  AI Video Generation Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {aiVideoData.features.map((feature, index) => (
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
                  Best Use Cases for AI Video Generation
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>AI video generation excels at the following applications:</p>
                  <ul className="ml-4 space-y-2">
                    {aiVideoData.useCases.map((useCase, index) => (
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
                  How to Write Effective AI Video Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from AI video generation, follow these prompt
                    optimization strategies:
                  </p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Describe the scene and action:</strong> Clearly define what's
                        happening in the video, including characters, objects, and actions. Include
                        specific details about movement and interactions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Specify camera movements:</strong> Include details about camera
                        angles, movements, and transitions (close-up, panning, zoom, etc.) to create
                        dynamic visuals.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Include lighting and mood:</strong> Describe the lighting
                        conditions, atmosphere, and emotional tone to set the right mood and visual
                        impact.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Mention timing and pacing:</strong> Specify the duration, rhythm,
                        and pacing of the video to help the AI understand the desired flow and
                        timing.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Popular AI Platforms */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Popular AI Video Generation Platforms
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Runway</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced video generation and editing platform with professional-grade
                      features and visual effects.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Pika</h4>
                    <p className="text-sm text-muted-foreground">
                      AI video generator known for creative and artistic video generation with
                      strong community features.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Google Veo</h4>
                    <p className="text-sm text-muted-foreground">
                      Google's advanced AI video generation model with high-quality, realistic video
                      output.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Stable Video Diffusion</h4>
                    <p className="text-sm text-muted-foreground">
                      Open-source video generation model with extensive customization options and
                      local deployment.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About AI Video Generation
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes AI video generation different from traditional video production?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      AI video generation allows for rapid creation of original video content from
                      text descriptions, enabling creators to produce videos without extensive
                      equipment or technical skills. It can generate unique visual concepts, explore
                      creative ideas quickly, and create content that might be difficult or
                      expensive to produce traditionally.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my video project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific style, genre, and use case. Consider
                      the type of content you're creating (marketing, educational, creative), your
                      target audience, and the desired visual style. Our {prompts?.length || 0} AI
                      video prompts are organized by category to help you find the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these AI video prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our AI video collection are free to use for both personal
                      and commercial purposes. You can modify, adapt, and integrate them into your
                      business workflows, marketing campaigns, and client projects without any
                      restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new AI video prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new AI video prompts as the technology
                      evolves. We update our collection regularly with the latest templates,
                      trending prompts, and community-contributed solutions. Check back frequently
                      or create an account to get notified of updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related tools section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Explore Other AI Creative Tools
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href="/tools/ai-image"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🖼️</span>
                      <h4 className="font-semibold text-foreground">AI Image Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI image generation prompts</p>
                  </Link>
                  <Link
                    href="/tools/ai-audio"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎧</span>
                      <h4 className="font-semibold text-foreground">AI Audio Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI audio generation prompts</p>
                  </Link>
                  <Link
                    href="/tools/google-veo"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎬</span>
                      <h4 className="font-semibold text-foreground">Google Veo Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Google Veo video generation prompts
                    </p>
                  </Link>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Ready to Create Amazing Videos with AI?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite AI video prompts, organize them by
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
                  <Link href="/models">
                    <Button variant="outline" size="lg">
                      Explore AI Models
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
