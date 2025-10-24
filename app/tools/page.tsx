import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// AI Tools data
const aiTools = [
  {
    name: 'Google Veo',
    company: 'Google DeepMind',
    description:
      'AI video generation model that creates high-quality, realistic videos from text prompts.',
    icon: '🎬',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    tag: 'veo',
    url: '/tools/google-veo',
    capabilities: ['Video Generation', 'Text-to-Video', 'High Quality Output'],
  },
  {
    name: 'Suno',
    company: 'Suno AI',
    description:
      'AI music generation platform that creates original songs, melodies, and audio content.',
    icon: '🎵',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    tag: 'suno',
    url: '/tools/suno',
    capabilities: ['Music Generation', 'Song Creation', 'Melody Composition'],
  },
  {
    name: 'Runway',
    company: 'Runway ML',
    description:
      'AI video generation and editing platform with advanced visual effects and creative tools.',
    icon: '🎥',
    color: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    tag: 'runway',
    url: '/tools/runway',
    capabilities: ['Video Generation', 'Video Editing', 'Visual Effects'],
  },
  {
    name: 'Opus',
    company: 'Opus Clip',
    description:
      'AI-powered video clipping platform that creates engaging short-form content from long videos.',
    icon: '✂️',
    color: 'bg-violet-100 dark:bg-violet-900',
    textColor: 'text-violet-600 dark:text-violet-400',
    tag: 'opus',
    url: '/tools/opus',
    capabilities: ['Video Clipping', 'Content Optimization', 'Auto-Editing'],
  },
  {
    name: 'AI Image',
    company: 'Various Platforms',
    description:
      'AI image generation across multiple platforms including DALL-E, Midjourney, and Stable Diffusion.',
    icon: '🖼️',
    color: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    tag: 'ai-image',
    url: '/tools/ai-image',
    capabilities: ['Image Generation', 'Art Creation', 'Visual Design'],
  },
  {
    name: 'AI Video',
    company: 'Various Platforms',
    description:
      'AI video generation across multiple platforms for creating dynamic videos and animations.',
    icon: '🎥',
    color: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-600 dark:text-red-400',
    tag: 'ai-video',
    url: '/tools/ai-video',
    capabilities: ['Video Generation', 'Animation Creation', 'Motion Graphics'],
  },
  {
    name: 'AI Audio',
    company: 'Various Platforms',
    description:
      'AI audio generation for creating music, sound effects, and voice synthesis across platforms.',
    icon: '🎧',
    color: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400',
    tag: 'ai-audio',
    url: '/tools/ai-audio',
    capabilities: ['Audio Generation', 'Music Creation', 'Sound Effects'],
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const title = `AI Tools & Prompt Collections | Prompt Manage`
  const description = `Discover AI tools and prompt collections for Google Veo, Suno, Runway, Opus, and more. Find curated prompts for video generation, music creation, image generation, and audio production.`

  return {
    title,
    description,
    keywords: [
      'AI tools',
      'AI prompts',
      'Google Veo',
      'Suno',
      'Runway',
      'Opus',
      'AI video generation',
      'AI music generation',
      'AI image generation',
      'prompt collections',
    ],
    openGraph: {
      title,
      description,
      url: 'https://promptmanage.com/tools',
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'AI Tools & Prompt Collections',
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
      canonical: '/tools',
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

export default async function ToolsPage() {
  const supabase = createServerSideClient()

  // Get prompt counts for each tool
  const toolStats = await Promise.all(
    aiTools.map(async (tool) => {
      const { data: prompts } = await supabase
        .from('prompts')
        .select('id')
        .eq('is_public', true)
        .contains('tags', [tool.tag])

      return {
        ...tool,
        promptCount: prompts?.length || 0,
      }
    }),
  )

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
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tools & Prompt Collections',
    description: 'Collection of AI tools and curated prompt collections',
    url: 'https://promptmanage.com/tools',
    numberOfItems: toolStats.length,
    about: {
      '@type': 'SoftwareApplication',
      name: 'AI Tools',
      applicationCategory: 'AI Tools',
      operatingSystem: 'Web',
    },
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
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">AI Tools</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                AI Tools & Prompt Collections
              </h1>
              <p className="mb-6 text-xl text-muted-foreground">
                Discover curated prompt collections for the most popular AI tools. Find ready-to-use
                prompts for video generation, music creation, image generation, and more.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium text-foreground">{toolStats.length} AI tools</span>
                  <span>covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Community curated</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Always updated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Featured AI Tools</h2>
              <Link href="/p">
                <Button variant="outline" size="sm">
                  Browse All Prompts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {toolStats.map((tool) => (
                <Link key={tool.name} href={tool.url}>
                  <Card className="group flex h-full cursor-pointer flex-col p-6 transition-all hover:border-primary hover:shadow-lg">
                    <div className="flex-grow">
                      <div className="mb-4 flex items-start gap-4">
                        <div className={`${tool.color} rounded-lg p-3`}>
                          <span className="text-3xl">{tool.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                              {tool.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {tool.promptCount} prompts
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tool.company}</p>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                        {tool.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {tool.capabilities.slice(0, 3).map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                        {tool.capabilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.capabilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Browse by Category</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/tools/google-veo">
                <Card className="p-4 text-center transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-2 text-2xl">🎬</div>
                  <h3 className="font-semibold text-foreground">Video Generation</h3>
                  <p className="text-sm text-muted-foreground">AI video creation tools</p>
                </Card>
              </Link>
              <Link href="/tools/suno">
                <Card className="p-4 text-center transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-2 text-2xl">🎵</div>
                  <h3 className="font-semibold text-foreground">Music Generation</h3>
                  <p className="text-sm text-muted-foreground">AI music creation tools</p>
                </Card>
              </Link>
              <Link href="/tools/ai-image">
                <Card className="p-4 text-center transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-2 text-2xl">🖼️</div>
                  <h3 className="font-semibold text-foreground">Image Generation</h3>
                  <p className="text-sm text-muted-foreground">AI image creation tools</p>
                </Card>
              </Link>
              <Link href="/tools/opus">
                <Card className="p-4 text-center transition-all hover:border-primary hover:shadow-md">
                  <div className="mb-2 text-2xl">✂️</div>
                  <h3 className="font-semibold text-foreground">Video Editing</h3>
                  <p className="text-sm text-muted-foreground">AI video editing tools</p>
                </Card>
              </Link>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Why Use AI Tool-Specific Prompts?
              </h2>

              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Optimized for Each Platform
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Each AI tool has unique capabilities, strengths, and prompt formatting
                    requirements. Our tool-specific prompt collections are optimized to leverage the
                    full potential of each platform.
                  </p>
                  <p>
                    Whether you're creating videos with Google Veo, generating music with Suno, or
                    editing clips with Opus, our prompts are tailored to deliver the best results
                    for each specific tool.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Community-Tested & Refined
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    All prompts in our collections have been tested and refined by our community of
                    AI creators. We continuously update our collections with the latest templates
                    and trending prompts.
                  </p>
                  <p>
                    Each prompt includes detailed descriptions, use cases, and optimization tips to
                    help you get the most out of your chosen AI tool.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Ready for Production
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Our prompts are designed for real-world use cases, from marketing content to
                    educational materials. They're ready to use in your projects and can be easily
                    customized for your specific needs.
                  </p>
                  <p>
                    Whether you're a beginner exploring AI tools or an experienced creator looking
                    for inspiration, our collections provide the perfect starting point for your
                    creative projects.
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Ready to Explore AI Tools?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite prompts, organize them by project, and
                  track your AI creation results.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg">
                      <Sparkles className="mr-2 h-4 w-4" />
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
