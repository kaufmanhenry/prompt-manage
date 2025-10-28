import { Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createServerSideClient } from '@/utils/supabase/server'

type AITool = {
  name: string
  company: string
  description: string
  icon: string
  color: string
  textColor: string
  tag: string
  modelId: string | null
  url: string
  capabilities: string[]
  category: string
}

// AI Tools data
const aiTools: AITool[] = [
  {
    name: 'Suno',
    company: 'Suno AI',
    description:
      'AI music generation platform that creates original songs, melodies, and audio content.',
    icon: '🎵',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    tag: 'suno',
    modelId: 'suno-v4',
    url: '/tools/suno',
    capabilities: ['Music Generation', 'Song Creation', 'Melody Composition'],
    category: 'Music',
  },
  {
    name: 'Udio',
    company: 'Udio AI',
    description:
      'Advanced AI music creation platform for generating high-quality music compositions.',
    icon: '🎶',
    color: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    tag: 'udio',
    modelId: 'udio',
    url: '/tools/udio',
    capabilities: ['Music Generation', 'Composition', 'Studio Quality'],
    category: 'Music',
  },
  {
    name: 'Pika',
    company: 'Pika AI',
    description:
      'AI video generation platform for creating high-quality video content from text prompts.',
    icon: '🎬',
    color: 'bg-rose-100 dark:bg-rose-900',
    textColor: 'text-rose-600 dark:text-rose-400',
    tag: 'pika',
    modelId: 'pika-2',
    url: '/tools/pika',
    capabilities: ['Video Generation', 'Text-to-Video', 'Video Editing'],
    category: 'Video',
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
    modelId: 'runway-gen-3',
    url: '/tools/runway',
    capabilities: ['Video Generation', 'Video Editing', 'Visual Effects'],
    category: 'Video',
  },
  {
    name: 'Google Veo',
    company: 'Google DeepMind',
    description:
      'AI video generation model that creates high-quality, realistic videos from text prompts.',
    icon: '🎬',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    tag: 'veo',
    modelId: 'google-veo',
    url: '/tools/google-veo',
    capabilities: ['Video Generation', 'Text-to-Video', 'High Quality Output'],
    category: 'Video',
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
    modelId: null,
    url: '/tools/ai-image',
    capabilities: ['Image Generation', 'Art Creation', 'Visual Design'],
    category: 'Image',
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
    modelId: null,
    url: '/tools/ai-video',
    capabilities: ['Video Generation', 'Animation Creation', 'Motion Graphics'],
    category: 'Video',
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
    modelId: null,
    url: '/tools/ai-audio',
    capabilities: ['Audio Generation', 'Music Creation', 'Sound Effects'],
    category: 'Audio',
  },
  {
    name: 'Midjourney',
    company: 'Midjourney',
    description:
      'AI image generation with stunning artistic quality and creative control over style and composition.',
    icon: '🎨',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    tag: 'midjourney',
    modelId: 'midjourney',
    url: '/tools/midjourney',
    capabilities: ['Image Generation', 'Art Creation', 'Style Control'],
    category: 'Image',
  },
  {
    name: 'DALL-E 3',
    company: 'OpenAI',
    description:
      'Advanced AI image generation with precise prompt interpretation and high-quality output.',
    icon: '🖼️',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    tag: 'dall-e',
    modelId: 'dall-e-3',
    url: '/tools/dall-e',
    capabilities: ['Image Generation', 'Natural Language Understanding', 'High Quality'],
    category: 'Image',
  },
  {
    name: 'Stable Diffusion',
    company: 'Stability AI',
    description:
      'Open-source AI image generation with extensive customization and community-driven models.',
    icon: '🌈',
    color: 'bg-cyan-100 dark:bg-cyan-900',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    tag: 'stable-diffusion',
    modelId: 'stable-diffusion',
    url: '/tools/stable-diffusion',
    capabilities: ['Image Generation', 'Custom Models', 'ControlNet'],
    category: 'Image',
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
      // Build query - check both tags (backward compatibility) and model_id (new system)
      let query = supabase
        .from('prompts')
        .select('id')
        .eq('is_public', true)

      // If tool has a modelId, query by that OR by tags
      if (tool.modelId) {
        query = query.or(`tags.cs.{${tool.tag}},model_id.eq.${tool.modelId}`)
      } else {
        // For legacy tools without modelId, use tags only
        query = query.contains('tags', [tool.tag])
      }

      const { data: prompts } = await query

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
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">AI Tools</span>
          </nav>

          {/* Hero Section */}
          <section className="mb-20 border-b border-gray-200 pb-16 dark:border-gray-800 md:pb-20">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
                AI Tools & Prompt Collections
              </h1>
              <p className="mb-8 text-lg leading-7 text-gray-600 dark:text-gray-400 md:text-xl">
                Discover curated prompt collections for the most popular AI tools. Find ready-to-use
                prompts for video generation, music creation, image generation, and more.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">{toolStats.length} tools</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Community curated</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Updated daily</span>
                </span>
              </div>
            </div>
          </section>

          {/* Tools by Category */}
          {['Music', 'Video', 'Image', 'Audio']
            .filter(cat => toolStats.some(tool => tool.category === cat))
            .map((category) => {
              const categoryTools = toolStats.filter((tool) => tool.category === category)
              if (!categoryTools || categoryTools.length === 0) return null

              return (
                <section key={category} className="mb-20">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    {category} Generation
                  </h2>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <Link key={tool.name} href={tool.url}>
                      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-950/50" />
                        <div className="relative">
                          <div className="mb-6 inline-flex items-center justify-center">
                            <div className={`${tool.color} rounded-lg p-3`}>
                              <span className="text-2xl">{tool.icon}</span>
                            </div>
                          </div>
                          <div className="mb-3 flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {tool.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs font-medium">
                              {tool.promptCount}
                            </Badge>
                          </div>
                          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{tool.company}</p>
                          <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {tool.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {tool.capabilities.slice(0, 3).map((capability) => (
                              <Badge key={capability} variant="outline" className="text-xs font-normal">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}

          {/* Understanding AI Model Types - Educational Section */}
          <section className="mx-auto mb-20 max-w-6xl border-t border-gray-200 pt-16 dark:border-gray-800">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                Understanding Different AI Models & Tools
              </h2>
              <p className="text-lg text-muted-foreground">
                Learn the difference between LLMs, image generators, video creators, and other AI tools
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {/* LLMs Card */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/50" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center">
                    <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Large Language Models (LLMs)
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">GPT, Claude, Gemini</p>
                  <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Text-based AI models that understand and generate human language. Designed for
                    conversation, writing, analysis, and text-based tasks.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 text-xs font-normal">Text generation</Badge>
                    <Badge variant="secondary" className="mr-2 text-xs font-normal">Conversation</Badge>
                    <Badge variant="secondary" className="mr-2 text-xs font-normal">Code assistance</Badge>
                  </div>
                </div>
              </div>

              {/* Image Models Card */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/50" />
                <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Image Generation Models</h3>
                    <p className="text-sm text-muted-foreground">Midjourney, DALL-E, Stable Diffusion</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Image generators create visual art from text descriptions. These models specialize in
                  transforming your ideas into stunning artwork, photos, illustrations, and designs.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">Digital art</Badge>
                  <Badge variant="secondary" className="mr-2">Illustrations</Badge>
                  <Badge variant="secondary" className="mr-2">Photorealistic</Badge>
                  <Badge variant="secondary" className="mr-2">Design assets</Badge>
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  Best for: Art creation, marketing visuals, concept art, social media graphics
                </p>
                </div>
              </div>

              {/* Video Models Card */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/50" />
                <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Video Generation Tools</h3>
                    <p className="text-sm text-muted-foreground">Runway, Pika, Google Veo</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Video generators create dynamic video content from text prompts. They can produce
                  short video clips, animations, and even realistic scenes for marketing, entertainment,
                  and creative projects.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">Animated clips</Badge>
                  <Badge variant="secondary" className="mr-2">Marketing videos</Badge>
                  <Badge variant="secondary" className="mr-2">Visual effects</Badge>
                  <Badge variant="secondary" className="mr-2">Storytelling</Badge>
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  Best for: Marketing content, social media, creative projects, visual storytelling
                </p>
                </div>
              </div>

              {/* Music Models Card */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/50" />
                <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Music Generation Models</h3>
                    <p className="text-sm text-muted-foreground">Suno, Udio</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Music generators create original compositions, melodies, and songs from text
                  descriptions. They can produce complete tracks with vocals, instrumentals, and
                  various music styles.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">Song creation</Badge>
                  <Badge variant="secondary" className="mr-2">Background music</Badge>
                  <Badge variant="secondary" className="mr-2">Podcast audio</Badge>
                  <Badge variant="secondary" className="mr-2">All genres</Badge>
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  Best for: Background music, podcast content, jingles, creative compositions
                </p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-6 text-xl font-semibold text-foreground">Quick Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-left font-semibold text-foreground">Model Type</th>
                      <th className="pb-3 text-left font-semibold text-foreground">Input</th>
                      <th className="pb-3 text-left font-semibold text-foreground">Output</th>
                      <th className="pb-3 text-left font-semibold text-foreground">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-3 font-medium">LLMs</td>
                      <td className="py-3 text-muted-foreground">Text prompts</td>
                      <td className="py-3 text-muted-foreground">Text responses</td>
                      <td className="py-3 text-muted-foreground">GPT-5, Claude, Gemini</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Image Models</td>
                      <td className="py-3 text-muted-foreground">Text descriptions</td>
                      <td className="py-3 text-muted-foreground">Images/Art</td>
                      <td className="py-3 text-muted-foreground">Midjourney, DALL-E 3</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">Video Models</td>
                      <td className="py-3 text-muted-foreground">Text or images</td>
                      <td className="py-3 text-muted-foreground">Video clips</td>
                      <td className="py-3 text-muted-foreground">Runway, Pika, Veo</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Music Models</td>
                      <td className="py-3 text-muted-foreground">Text descriptions</td>
                      <td className="py-3 text-muted-foreground">Audio/Songs</td>
                      <td className="py-3 text-muted-foreground">Suno, Udio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why Use Tool-Specific Prompts */}
            <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-xl font-semibold text-foreground">Why Each Tool Needs Different Prompts</h3>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="font-semibold text-foreground">Different architectures:</strong> Each
                  model type uses a different underlying technology. LLMs process language patterns,
                  while image models understand visual concepts and artistic styles.
                </p>
                <p>
                  <strong className="font-semibold text-foreground">Optimized parameters:</strong> What
                  works for generating text won't work for creating music. Each tool has specific
                  parameters, keywords, and formatting requirements for best results.
                </p>
                <p>
                  <strong className="font-semibold text-foreground">Result quality:</strong> Using
                  tool-specific prompts ensures you get professional, high-quality outputs. Generic
                  prompts often produce mediocre results across different tools.
                </p>
              </div>
            </div>
          </section>

          {/* Educational Content - Updated */}
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
