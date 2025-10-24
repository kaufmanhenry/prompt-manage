import { ArrowRight, Play, TrendingUp, Users, Video } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Runway specific data
const runwayData = {
  name: 'Runway',
  company: 'Runway ML',
  description:
    "Runway's cutting-edge AI video generation and editing platform that creates stunning visual content from text prompts and existing media.",
  icon: '🎥',
  color: 'bg-indigo-100 dark:bg-indigo-900',
  textColor: 'text-indigo-600 dark:text-indigo-400',
  capabilities: ['Video Generation', 'Video Editing', 'Visual Effects', 'Creative Tools'],
  features: [
    'Generate videos from text descriptions',
    'Advanced video editing capabilities',
    'Visual effects and motion graphics',
    'Creative AI-powered tools',
  ],
  useCases: [
    'Marketing and advertising videos',
    'Social media content creation',
    'Creative storytelling',
    'Product demonstrations',
    'Educational content',
    'Artistic video projects',
  ],
  companyUrl: 'https://runwayml.com',
  tag: 'runway',
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [runwayData.tag])

  const count = prompts?.length || 0

  const title = `Best Runway Prompts for AI Video Creation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use Runway prompts for AI video generation and editing. Create stunning visual content with our curated collection of Runway prompt templates for marketing, creative, and professional video projects.`

  return {
    title,
    description,
    keywords: [
      'Runway',
      'Runway prompts',
      'AI video generation',
      'video editing',
      'visual effects',
      'AI video creation',
      'video prompts',
      'creative video',
      'motion graphics',
      'video production',
    ],
    openGraph: {
      title,
      description,
      url: 'https://promptmanage.com/prompts/runway',
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Runway Prompts',
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
      canonical: '/prompts/runway',
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

export default async function RunwayPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts tagged with 'runway'
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [runwayData.tag])
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== runwayData.tag) {
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
        name: 'Runway',
        item: 'https://promptmanage.com/prompts/runway',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Runway AI Video Prompts',
    description: 'Collection of AI prompts for Runway video generation and editing',
    url: 'https://promptmanage.com/prompts/runway',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'Runway',
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
        name: 'What is Runway?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Runway is an AI-powered video generation and editing platform that creates stunning visual content from text prompts. It offers advanced video editing capabilities, visual effects, and creative tools for professional video production.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective Runway prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective Runway prompts should be detailed and specific about the visual elements, camera movements, lighting, and style you want. Include descriptions of the scene, mood, and any specific visual effects or editing techniques you desire.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of videos can I create with Runway?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Runway can create various types of videos including marketing content, social media posts, creative storytelling, product demonstrations, educational content, and artistic video projects. It's particularly good at visual effects and motion graphics.",
        },
      },
      {
        '@type': 'Question',
        name: 'Are these Runway prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our Runway collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
            <Link href="/p" className="hover:text-foreground">
              AI Tools
            </Link>
            <span>/</span>
            <span className="text-foreground">{runwayData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${runwayData.color} rounded-xl p-6`}>
                <span className="text-6xl">{runwayData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {runwayData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Video Generation
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{runwayData.description}</p>
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
                    <span>Trending tool</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Capabilities */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">Key Capabilities</h2>
              <div className="flex flex-wrap gap-2">
                {runwayData.capabilities.map((capability) => (
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
                  Featured {runwayData.name} Prompts
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
                No {runwayData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for Runway video generation!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First Runway Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to Runway Video Generation
              </h2>

              {/* What is Runway section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">What is Runway?</h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Runway</strong> is a cutting-edge AI video
                    generation and editing platform that creates stunning visual content from text
                    prompts. It offers advanced video editing capabilities, visual effects, and
                    creative tools for professional video production.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for Runway
                    </strong>
                    , tested and refined by the community to deliver optimal results for various
                    video creation needs.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Runway Key Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {runwayData.features.map((feature, index) => (
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
                  Best Use Cases for Runway
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>Runway excels at the following video creation applications:</p>
                  <ul className="ml-4 space-y-2">
                    {runwayData.useCases.map((useCase, index) => (
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
                  How to Write Effective Runway Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from Runway, follow these prompt optimization
                    strategies:
                  </p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Be specific about visual elements:</strong> Describe the scene,
                        objects, characters, and setting in detail. Include specific colors,
                        textures, and visual characteristics.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Include camera movements and angles:</strong> Specify camera
                        movements, angles, and transitions to create dynamic and engaging videos.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Describe lighting and mood:</strong> Include details about lighting
                        conditions, atmosphere, and emotional tone to set the right mood.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Mention visual effects and style:</strong> Specify any visual
                        effects, artistic style, or editing techniques you want to achieve.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About Runway
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes Runway different from other AI video generators?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Runway stands out for its advanced video editing capabilities and visual
                      effects. It excels at creating professional-quality videos with sophisticated
                      editing features, making it particularly effective for marketing, creative,
                      and professional video projects.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my video project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific style, genre, and use case. Consider
                      the type of content you're creating (marketing, creative, educational), your
                      target audience, and the desired visual style. Our {prompts?.length || 0}{' '}
                      Runway prompts are organized by category to help you find the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these Runway prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our Runway collection are free to use for both personal
                      and commercial purposes. You can modify, adapt, and integrate them into your
                      business workflows, marketing campaigns, and client projects without any
                      restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new Runway prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new Runway prompts as the technology evolves.
                      We update our collection regularly with the latest templates, trending
                      prompts, and community-contributed solutions. Check back frequently or create
                      an account to get notified of updates.
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
                    href="/prompts/google-veo"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎬</span>
                      <h4 className="font-semibold text-foreground">Google Veo Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI video generation prompts</p>
                  </Link>
                  <Link
                    href="/prompts/ai-video"
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
                  <Link
                    href="/prompts/suno"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <h4 className="font-semibold text-foreground">Suno Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI music generation prompts</p>
                  </Link>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Ready to Create Amazing Videos with Runway?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite Runway prompts, organize them by
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
                  <a href={runwayData.companyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Learn More About Runway
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
