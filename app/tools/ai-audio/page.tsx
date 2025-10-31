import { ArrowRight, Headphones, Play, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// AI Audio specific data
const aiAudioData = {
  name: 'AI Audio',
  company: 'Various AI Platforms',
  description:
    'Comprehensive collection of AI audio generation prompts for creating music, sound effects, voice synthesis, and audio content across multiple AI platforms.',
  icon: '🎧',
  color: 'bg-orange-100 dark:bg-orange-900',
  textColor: 'text-orange-600 dark:text-orange-400',
  capabilities: ['Audio Generation', 'Music Creation', 'Sound Effects', 'Voice Synthesis'],
  features: [
    'Generate music and audio from text',
    'Create sound effects and ambient audio',
    'Produce voice synthesis and narration',
    'Support for multiple AI platforms',
  ],
  useCases: [
    'Background music for videos',
    'Podcast intros and outros',
    'Sound effects for games',
    'Voice narration for content',
    'Ambient audio for relaxation',
    'Marketing audio content',
  ],
  companyUrl: '#',
  tag: 'ai-audio',
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [aiAudioData.tag])

  const count = prompts?.length || 0

  const title = `Best AI Audio Prompts for Sound Creation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use AI audio generation prompts. Create music, sound effects, voice synthesis, and audio content with our curated collection of AI audio prompt templates for Suno, ElevenLabs, and more.`

  return {
    title,
    description,
    keywords: [
      'AI audio prompts',
      'audio generation',
      'music generation',
      'sound effects',
      'voice synthesis',
      'AI music',
      'audio creation',
      'Suno prompts',
      'ElevenLabs prompts',
      'AI sound design',
    ],
    openGraph: {
      title,
      description,
      url: 'https://promptmanage.com/tools/ai-audio',
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'AI Audio Prompts',
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
      canonical: '/tools/ai-audio',
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

export default async function AIAudioPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts tagged with 'ai-audio'
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [aiAudioData.tag])
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== aiAudioData.tag) {
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
        name: 'AI Audio',
        item: 'https://promptmanage.com/tools/ai-audio',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Audio Generation Prompts',
    description: 'Collection of AI prompts for audio generation across multiple platforms',
    url: 'https://promptmanage.com/tools/ai-audio',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'AI Audio Generation',
      applicationCategory: 'AI Audio Generation',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are AI audio generation prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI audio generation prompts are text descriptions that guide AI models to create music, sound effects, voice synthesis, and other audio content. They describe musical elements, sound characteristics, and audio properties to generate the desired audio output.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective AI audio prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective AI audio prompts should specify genre, mood, tempo, instruments, and audio characteristics. Include details about the type of audio (music, sound effect, voice), desired style, and any specific audio elements you want to achieve.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI platforms work with these prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'These prompts are designed to work with various AI audio generation platforms including Suno, ElevenLabs, Mubert, and other popular AI audio generators. Each platform may have specific formatting requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are these AI audio prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our AI audio collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
            <span className="text-foreground">{aiAudioData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${aiAudioData.color} rounded-xl p-6`}>
                <span className="text-6xl">{aiAudioData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {aiAudioData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Audio Generation
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{aiAudioData.description}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
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
                {aiAudioData.capabilities.map((capability) => (
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
                  Featured {aiAudioData.name} Prompts
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
              <Headphones className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                No {aiAudioData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for AI audio generation!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First AI Audio Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-8 sm:pt-12 px-4 sm:px-0">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to AI Audio Generation
              </h2>

              {/* What is AI Audio Generation section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  What is AI Audio Generation?
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">AI Audio Generation</strong> is the process
                    of creating audio content using artificial intelligence models trained on vast
                    datasets of audio content. These models can generate original music, sound
                    effects, voice synthesis, and other audio content from text descriptions.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for AI audio generation
                    </strong>
                    , tested and refined by the community to deliver optimal results across various
                    platforms and use cases.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  AI Audio Generation Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {aiAudioData.features.map((feature, index) => (
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
                  Best Use Cases for AI Audio Generation
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>AI audio generation excels at the following applications:</p>
                  <ul className="ml-4 space-y-2">
                    {aiAudioData.useCases.map((useCase, index) => (
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
                  How to Write Effective AI Audio Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from AI audio generation, follow these prompt
                    optimization strategies:
                  </p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Specify genre and style:</strong> Clearly define the musical genre
                        (pop, rock, jazz, classical, etc.) and style characteristics to guide the
                        AI's composition approach.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Include mood and tempo:</strong> Describe the emotional tone, energy
                        level, and desired tempo to create the right atmosphere and pacing.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Mention instruments and vocals:</strong> Specify which instruments
                        you want and the type of vocal style (male/female, style, etc.) for music
                        generation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Define audio characteristics:</strong> Include details about sound
                        quality, effects, and any specific audio properties you want to achieve.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Popular AI Platforms */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Popular AI Audio Generation Platforms
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Suno</h4>
                    <p className="text-sm text-muted-foreground">
                      AI music generation platform that creates complete songs with vocals and
                      instruments from text descriptions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">ElevenLabs</h4>
                    <p className="text-sm text-muted-foreground">
                      AI voice synthesis platform for creating realistic speech and voice cloning
                      for various applications.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Mubert</h4>
                    <p className="text-sm text-muted-foreground">
                      AI music generator that creates royalty-free music and ambient audio for
                      various use cases.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">AIVA</h4>
                    <p className="text-sm text-muted-foreground">
                      AI composer that creates original musical compositions in various styles and
                      genres.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About AI Audio Generation
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes AI audio generation different from traditional audio production?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      AI audio generation allows for rapid creation of original audio content from
                      text descriptions, enabling creators to produce music, sound effects, and
                      voice content without extensive equipment or technical skills. It can generate
                      unique audio concepts and explore creative ideas quickly.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my audio project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific genre, mood, and use case. Consider
                      the type of content you're creating (background music, sound effects, voice
                      narration), your target audience, and the desired audio characteristics. Our{' '}
                      {prompts?.length || 0} AI audio prompts are organized by category to help you
                      find the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these AI audio prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our AI audio collection are free to use for both personal
                      and commercial purposes. You can modify, adapt, and integrate them into your
                      business workflows, marketing campaigns, and client projects without any
                      restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new AI audio prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new AI audio prompts as the technology
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
                    href="/tools/suno"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <h4 className="font-semibold text-foreground">Suno Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI music generation prompts</p>
                  </Link>
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
                    href="/tools/ai-video"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      <h4 className="font-semibold text-foreground">AI Video Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI video generation prompts</p>
                  </Link>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Ready to Create Amazing Audio with AI?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite AI audio prompts, organize them by
                  project, and track your audio creation results.
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
