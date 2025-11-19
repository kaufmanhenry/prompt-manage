import { ArrowRight, Image, Play, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// AI Image specific data
const aiImageData = {
  name: 'AI Image',
  company: 'Various AI Platforms',
  description:
    'Comprehensive collection of AI image generation prompts for creating stunning visuals, artwork, and graphics across multiple AI platforms.',
  icon: '🖼️',
  color: 'bg-emerald-100 dark:bg-emerald-900',
  textColor: 'text-emerald-600 dark:text-emerald-400',
  capabilities: ['Image Generation', 'Art Creation', 'Visual Design', 'Graphic Design'],
  features: [
    'Generate images from text descriptions',
    'Create artwork in various styles',
    'Design graphics and illustrations',
    'Support for multiple AI platforms',
  ],
  useCases: [
    'Marketing and advertising visuals',
    'Social media content',
    'Website graphics and illustrations',
    'Artistic creations',
    'Product mockups',
    'Educational materials',
  ],
  companyUrl: '#',
  tag: 'ai-image',
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [aiImageData.tag])

  const count = prompts?.length || 0

  const title = `Best AI Image Prompts for Visual Creation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use AI image generation prompts. Create stunning visuals, artwork, and graphics with our curated collection of AI image prompt templates for DALL-E, Midjourney, Stable Diffusion, and more.`

  return {
    title,
    description,
    keywords: [
      'AI image prompts',
      'image generation',
      'DALL-E prompts',
      'Midjourney prompts',
      'Stable Diffusion prompts',
      'AI art prompts',
      'visual creation',
      'graphic design prompts',
      'AI artwork',
      'image creation',
    ],
    openGraph: {
      title,
      description,
      url: '/prompts/ai-image',
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'AI Image Prompts',
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
      canonical: '/prompts/ai-image',
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

export default async function AIImagePromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts tagged with 'ai-image'
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [aiImageData.tag])
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== aiImageData.tag) {
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
        name: 'AI Image',
        item: '/prompts/ai-image',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Image Generation Prompts',
    description: 'Collection of AI prompts for image generation across multiple platforms',
    url: '/prompts/ai-image',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'AI Image Generation',
      applicationCategory: 'AI Image Generation',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are AI image generation prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI image generation prompts are text descriptions that guide AI models like DALL-E, Midjourney, and Stable Diffusion to create specific images. They describe visual elements, style, composition, and other characteristics to generate the desired artwork.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective AI image prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective AI image prompts should be detailed and specific about visual elements, style, lighting, composition, and mood. Include specific colors, textures, artistic styles, and technical details to guide the AI in creating your desired image.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI platforms work with these prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'These prompts are designed to work with various AI image generation platforms including DALL-E, Midjourney, Stable Diffusion, Adobe Firefly, and other popular AI art generators. Each platform may have specific formatting requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are these AI image prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our AI image collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
            <span className="text-foreground">{aiImageData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${aiImageData.color} rounded-xl p-6`}>
                <span className="text-6xl">{aiImageData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {aiImageData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Image Generation
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{aiImageData.description}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
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
                {aiImageData.capabilities.map((capability) => (
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
                  Featured {aiImageData.name} Prompts
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
              <Image className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                No {aiImageData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for AI image generation!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First AI Image Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to AI Image Generation
              </h2>

              {/* What is AI Image Generation section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  What is AI Image Generation?
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">AI Image Generation</strong> is the process
                    of creating visual content using artificial intelligence models trained on vast
                    datasets of images. These models can generate original artwork, graphics, and
                    illustrations from text descriptions.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for AI image generation
                    </strong>
                    , tested and refined by the community to deliver optimal results across various
                    platforms and use cases.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  AI Image Generation Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {aiImageData.features.map((feature, index) => (
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
                  Best Use Cases for AI Image Generation
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>AI image generation excels at the following applications:</p>
                  <ul className="ml-4 space-y-2">
                    {aiImageData.useCases.map((useCase, index) => (
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
                  How to Write Effective AI Image Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from AI image generation, follow these prompt
                    optimization strategies:
                  </p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Be specific about visual elements:</strong> Describe the subject,
                        objects, colors, textures, and composition in detail. Include specific
                        visual characteristics and details.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Specify artistic style:</strong> Mention the artistic style
                        (photorealistic, cartoon, oil painting, digital art, etc.) and any specific
                        artists or art movements you want to emulate.
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
                        <strong>Add technical specifications:</strong> Include details about
                        resolution, aspect ratio, camera settings, and any specific technical
                        requirements.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Popular AI Platforms */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Popular AI Image Generation Platforms
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">DALL-E</h4>
                    <p className="text-sm text-muted-foreground">
                      OpenAI's image generation model known for creative and accurate
                      interpretations of text prompts.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Midjourney</h4>
                    <p className="text-sm text-muted-foreground">
                      Popular for artistic and stylized image generation with strong community
                      features.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Stable Diffusion</h4>
                    <p className="text-sm text-muted-foreground">
                      Open-source model with extensive customization options and local deployment
                      capabilities.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Adobe Firefly</h4>
                    <p className="text-sm text-muted-foreground">
                      Adobe's AI image generator integrated with Creative Cloud for professional
                      workflows.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About AI Image Generation
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes AI image generation different from traditional design?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      AI image generation allows for rapid creation of original visuals from text
                      descriptions, enabling non-designers to create professional-quality images. It
                      can generate unique artwork, explore creative concepts quickly, and produce
                      visuals that might be difficult or time-consuming to create manually.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my image project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific style, subject matter, and use case.
                      Consider the type of content you're creating (marketing, artistic,
                      educational), your target audience, and the desired visual style. Our{' '}
                      {prompts?.length || 0} AI image prompts are organized by category to help you
                      find the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these AI image prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our AI image collection are free to use for both personal
                      and commercial purposes. You can modify, adapt, and integrate them into your
                      business workflows, marketing campaigns, and client projects without any
                      restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new AI image prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new AI image prompts as the technology
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
                    href="/prompts/ai-video"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      <h4 className="font-semibold text-foreground">AI Video Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI video generation prompts</p>
                  </Link>
                  <Link
                    href="/prompts/ai-audio"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎧</span>
                      <h4 className="font-semibold text-foreground">AI Audio Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">AI audio generation prompts</p>
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
                  Ready to Create Amazing Images with AI?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite AI image prompts, organize them by
                  project, and track your visual creation results.
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
