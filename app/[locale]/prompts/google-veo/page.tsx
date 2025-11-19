import { ArrowRight, Play, TrendingUp, Users, Video } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Google Veo specific data
const veoData = {
  name: 'Google Veo',
  company: 'Google DeepMind',
  description:
    "Google's advanced AI video generation model that creates high-quality, realistic videos from text prompts.",
  icon: '🎬',
  color: 'bg-blue-100 dark:bg-blue-900',
  textColor: 'text-blue-600 dark:text-blue-400',
  capabilities: ['Video Generation', 'Text-to-Video', 'High Quality Output', 'Realistic Motion'],
  features: [
    'Generate videos from text descriptions',
    'High-resolution video output',
    'Realistic motion and physics',
    'Creative storytelling capabilities',
  ],
  useCases: [
    'Marketing video creation',
    'Educational content',
    'Social media content',
    'Product demonstrations',
    'Creative storytelling',
    'Training materials',
  ],
  companyUrl: 'https://deepmind.google/technologies/veo/',
  tag: 'veo',
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [veoData.tag])

  const count = prompts?.length || 0

  const title = `Best Google Veo Prompts for AI Video Creation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use Google Veo prompts for AI video generation. Create stunning videos with our curated collection of Veo prompt templates for marketing, education, and creative content.`

  return {
    title,
    description,
    keywords: [
      'Google Veo',
      'Veo prompts',
      'AI video generation',
      'text to video',
      'video prompts',
      'Google DeepMind',
      'AI video creation',
      'video generation prompts',
      'creative video prompts',
      'marketing video prompts',
    ],
    openGraph: {
      title,
      description,
      url: '/prompts/google-veo',
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Google Veo Prompts',
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
      canonical: '/prompts/google-veo',
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

export default async function GoogleVeoPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts tagged with 'veo'
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [veoData.tag])
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== veoData.tag) {
        // Exclude the main tag
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
        name: 'Google Veo',
        item: '/prompts/google-veo',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Google Veo AI Video Prompts',
    description: 'Collection of AI prompts for Google Veo video generation',
    url: '/prompts/google-veo',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'Google Veo',
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
        name: 'What is Google Veo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Google Veo is an advanced AI video generation model developed by Google DeepMind that creates high-quality, realistic videos from text prompts. It excels at understanding complex descriptions and generating videos with realistic motion and physics.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective Google Veo prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective Veo prompts should be detailed and specific. Include descriptions of the scene, camera movements, lighting, and mood. Mention specific actions, objects, and visual elements. The more descriptive your prompt, the better the video output.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of videos can I create with Google Veo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Google Veo can create various types of videos including marketing content, educational materials, social media posts, product demonstrations, creative storytelling, and training materials. It's particularly good at realistic motion and cinematic quality.",
        },
      },
      {
        '@type': 'Question',
        name: 'Are these Google Veo prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our Google Veo collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
            <span className="text-foreground">{veoData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${veoData.color} rounded-xl p-6`}>
                <span className="text-6xl">{veoData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {veoData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Video Generation
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{veoData.description}</p>
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
                {veoData.capabilities.map((capability) => (
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
                  Featured {veoData.name} Prompts
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
                No {veoData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for Google Veo video generation!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First Veo Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to Google Veo Video Generation
              </h2>

              {/* What is Google Veo section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">What is Google Veo?</h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Google Veo</strong> is Google DeepMind's
                    advanced AI video generation model that creates high-quality, realistic videos
                    from text descriptions. It represents a significant leap forward in AI video
                    creation technology.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for Google Veo
                    </strong>
                    , tested and refined by the community to deliver optimal results for various
                    video creation needs.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Google Veo Key Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {veoData.features.map((feature, index) => (
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
                  Best Use Cases for Google Veo
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>Google Veo excels at the following video creation applications:</p>
                  <ul className="ml-4 space-y-2">
                    {veoData.useCases.map((useCase, index) => (
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
                  How to Write Effective Google Veo Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from Google Veo, follow these prompt optimization
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
                        <strong>Include camera movements:</strong> Specify camera angles, movements,
                        and transitions (e.g., "close-up", "panning shot", "fade in").
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
                        <strong>Specify duration and pacing:</strong> Mention the desired length and
                        rhythm of the video to help Veo understand the pacing.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About Google Veo
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes Google Veo different from other AI video generators?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Google Veo stands out for its ability to generate high-quality videos with
                      realistic motion and physics. It excels at understanding complex descriptions
                      and creating videos that feel natural and cinematic, making it particularly
                      effective for professional content creation.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my video project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific use case and style preferences.
                      Consider the type of content you're creating (marketing, educational,
                      creative), your target audience, and the desired mood or tone. Our{' '}
                      {prompts?.length || 0} Google Veo prompts are organized by category to help
                      you find the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these Google Veo prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our Google Veo collection are free to use for both
                      personal and commercial purposes. You can modify, adapt, and integrate them
                      into your business workflows, marketing campaigns, and client projects without
                      any restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new Google Veo prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new Google Veo prompts as the technology
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
                  Explore Other AI Video Tools
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href="/prompts/runway"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      <h4 className="font-semibold text-foreground">Runway Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Creative video generation and editing prompts
                    </p>
                  </Link>
                  <Link
                    href="/prompts/ai-video"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎬</span>
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
                  Ready to Create Amazing Videos with Google Veo?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite Google Veo prompts, organize them by
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
                  <a href={veoData.companyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Learn More About Veo
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
