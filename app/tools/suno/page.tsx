import { ArrowRight, Music, Play, Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Suno specific data
const sunoData = {
  name: 'Suno',
  company: 'Suno AI',
  description:
    "Suno's revolutionary AI music generation platform that creates original songs, melodies, and audio content from text descriptions.",
  icon: '🎵',
  color: 'bg-purple-100 dark:bg-purple-900',
  textColor: 'text-purple-600 dark:text-purple-400',
  capabilities: ['Music Generation', 'Song Creation', 'Melody Composition', 'Audio Production'],
  features: [
    'Generate complete songs from text',
    'Create original melodies and harmonies',
    'Produce vocals and instrumental tracks',
    'Support for multiple music genres',
  ],
  useCases: [
    'Background music for videos',
    'Podcast intros and outros',
    'Marketing jingles',
    'Creative songwriting',
    'Educational content audio',
    'Social media content',
  ],
  companyUrl: 'https://suno.ai',
  tag: 'suno',
  pricing: {
    free: '10 credits per day',
    pro: '$8/month - 500 credits per month',
    premier: '$24/month - 2000 credits per month',
  },
  competitors: ['Udio', 'Mubert', 'AIVA', 'Soundraw'],
  tutorials: [
    {
      title: 'Getting Started with Suno',
      url: 'https://suno.ai/docs/getting-started',
      description: 'Learn the basics of creating music with Suno',
    },
    {
      title: 'Advanced Prompt Techniques',
      url: 'https://suno.ai/docs/advanced-prompts',
      description: 'Master the art of writing effective music prompts',
    },
    {
      title: 'Genre-Specific Tips',
      url: 'https://suno.ai/docs/genres',
      description: 'Tips for creating different music styles',
    },
  ],
  community: {
    discord: 'https://discord.gg/suno',
    reddit: 'https://reddit.com/r/suno',
    twitter: 'https://twitter.com/suno_ai_',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [sunoData.tag])

  const count = prompts?.length || 0

  const title = `Best Suno Prompts for AI Music Creation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use Suno prompts for AI music generation. Create original songs, melodies, and audio content with our curated collection of Suno prompt templates for all genres and use cases.`

  return {
    title,
    description,
    keywords: [
      'Suno',
      'Suno prompts',
      'AI music generation',
      'music creation',
      'song generation',
      'AI audio',
      'music prompts',
      'melody generation',
      'vocal generation',
      'music composition',
    ],
    openGraph: {
      title,
      description,
      url: 'https://promptmanage.com/tools/suno',
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Suno Prompts',
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
      canonical: '/tools/suno',
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

export default async function SunoPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts for Suno - check both tags and model_id
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .or(`tags.cs.{${sunoData.tag}},model_id.eq.suno-v4`)
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags for this category
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== sunoData.tag) {
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
        name: 'Suno',
        item: 'https://promptmanage.com/tools/suno',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Suno AI Music Prompts',
    description: 'Collection of AI prompts for Suno music generation',
    url: 'https://promptmanage.com/tools/suno',
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: 'Suno',
      applicationCategory: 'AI Music Generation',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Suno?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Suno is an AI music generation platform that creates original songs, melodies, and audio content from text descriptions. It can generate complete musical compositions including vocals, instruments, and arrangements across various genres.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective Suno prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Effective Suno prompts should specify the genre, mood, tempo, and style of music you want. Include details about instruments, vocal style, and any specific musical elements. Mention the intended use case and emotional tone for better results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of music can I create with Suno?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Suno can create various types of music including pop, rock, jazz, classical, electronic, folk, and more. It's particularly good at creating background music for videos, podcast intros, marketing jingles, and original song compositions.",
        },
      },
      {
        '@type': 'Question',
        name: 'Are these Suno prompts free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All prompts in our Suno collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your projects without any restrictions.',
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
            <span className="text-foreground">{sunoData.name}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8 flex items-start gap-6">
              <div className={`${sunoData.color} rounded-xl p-6`}>
                <span className="text-6xl">{sunoData.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {sunoData.name} Prompts
                  </h1>
                  <Badge variant="default" className="text-sm">
                    Music Generation
                  </Badge>
                </div>
                <p className="mb-4 text-xl text-muted-foreground">{sunoData.description}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
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
                {sunoData.capabilities.map((capability) => (
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
                  Featured {sunoData.name} Prompts
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
              <Music className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                No {sunoData.name} Prompts Yet
              </h3>
              <p className="mb-6 text-muted-foreground">
                Be the first to create a prompt for Suno music generation!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Create Your First Suno Prompt
                </Button>
              </Link>
            </div>
          )}

          {/* Educational Content */}
          <div className="mx-auto mb-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                Complete Guide to Suno Music Generation
              </h2>

              {/* What is Suno section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">What is Suno?</h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Suno</strong> is a revolutionary AI music
                    generation platform that creates original songs, melodies, and audio content
                    from text descriptions. It represents a breakthrough in AI music creation
                    technology.
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for Suno
                    </strong>
                    , tested and refined by the community to deliver optimal results for various
                    music creation needs.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Suno Key Capabilities
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {sunoData.features.map((feature, index) => (
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
                  Best Use Cases for Suno
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>Suno excels at the following music creation applications:</p>
                  <ul className="ml-4 space-y-2">
                    {sunoData.useCases.map((useCase, index) => (
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
                  How to Write Effective Suno Prompts
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from Suno, follow these prompt optimization strategies:
                  </p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Specify genre and style:</strong> Clearly define the musical genre
                        (pop, rock, jazz, etc.) and style characteristics to guide Suno's
                        composition approach.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Include mood and tempo:</strong> Describe the emotional tone, energy
                        level, and desired tempo to create the right atmosphere.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Mention instruments and vocals:</strong> Specify which instruments
                        you want and the type of vocal style (male/female, style, etc.).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Define the use case:</strong> Explain how the music will be used
                        (background, intro, jingle, etc.) to help Suno tailor the composition.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Frequently Asked Questions About Suno
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      What makes Suno different from other AI music generators?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Suno stands out for its ability to generate complete songs with vocals,
                      melodies, and arrangements. It excels at creating original compositions across
                      multiple genres and can produce music that sounds natural and professionally
                      produced.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How do I choose the right prompt for my music project?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that match your specific genre, mood, and use case. Consider
                      the type of content you're creating (background music, podcast intro,
                      marketing jingle), your target audience, and the desired emotional impact. Our{' '}
                      {prompts?.length || 0} Suno prompts are organized by category to help you find
                      the perfect match.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      Can I use these Suno prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our Suno collection are free to use for both personal and
                      commercial purposes. You can modify, adapt, and integrate them into your
                      business workflows, marketing campaigns, and client projects without any
                      restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-6">
                    <h4 className="mb-3 text-lg font-semibold text-foreground">
                      How often are new Suno prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new Suno prompts as the technology evolves. We
                      update our collection regularly with the latest templates, trending prompts,
                      and community-contributed solutions. Check back frequently or create an
                      account to get notified of updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">Suno Pricing Plans</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="mb-2 font-semibold text-foreground">Free</h4>
                    <p className="text-sm text-muted-foreground">{sunoData.pricing.free}</p>
                    <a
                      href={sunoData.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Try Free →
                    </a>
                  </div>
                  <div className="rounded-lg border border-primary bg-primary/5 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Pro</h4>
                    <p className="text-sm text-muted-foreground">{sunoData.pricing.pro}</p>
                    <a
                      href={`${sunoData.companyUrl}/pricing`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Upgrade →
                    </a>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                    <h4 className="mb-2 font-semibold text-foreground">Premier</h4>
                    <p className="text-sm text-muted-foreground">{sunoData.pricing.premier}</p>
                    <a
                      href={`${sunoData.companyUrl}/pricing`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Upgrade →
                    </a>
                  </div>
                </div>
              </div>

              {/* Getting Started Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Getting Started with Suno
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Step 1: Sign Up</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Create a free account at Suno to start generating music. You'll get 10 credits
                      per day to experiment with.
                    </p>
                    <a
                      href={sunoData.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Sign Up Free →
                    </a>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Step 2: Learn the Basics</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Start with simple prompts and gradually add more detail. Our curated prompts
                      below are perfect for beginners.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sunoData.tutorials.map((tutorial, index) => (
                        <a
                          key={index}
                          href={tutorial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {tutorial.title} →
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">Step 3: Use Our Prompts</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Copy and customize our community-tested prompts to create amazing music
                      quickly.
                    </p>
                    <Link
                      href="#featured-prompts"
                      className="inline-block rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Browse Prompts ↓
                    </Link>
                  </div>
                </div>
              </div>

              {/* Competitors Comparison */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  How Suno Compares to Other AI Music Tools
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-accent/50">
                        <th className="border border-gray-300 p-3 text-left dark:border-gray-700">
                          Feature
                        </th>
                        <th className="border border-gray-300 p-3 text-left dark:border-gray-700">
                          Suno
                        </th>
                        <th className="border border-gray-300 p-3 text-left dark:border-gray-700">
                          Udio
                        </th>
                        <th className="border border-gray-300 p-3 text-left dark:border-gray-700">
                          Mubert
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          Vocal Generation
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ Excellent
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">✅ Good</td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ❌ No vocals
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          Genre Variety
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ 50+ genres
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ 30+ genres
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ Ambient focus
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          Free Tier
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ 10 credits/day
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ 10 credits/day
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ Limited
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          Commercial Use
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ Yes (paid plans)
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">
                          ✅ Yes (paid plans)
                        </td>
                        <td className="border border-gray-300 p-3 dark:border-gray-700">✅ Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Community Section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Join the Suno Community
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <a
                    href={sunoData.community.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <h4 className="font-semibold text-foreground">Discord</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Join creators sharing tips and music
                    </p>
                  </a>
                  <a
                    href={sunoData.community.reddit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🔗</span>
                      <h4 className="font-semibold text-foreground">Reddit</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      r/suno - Community discussions and showcases
                    </p>
                  </a>
                  <a
                    href={sunoData.community.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🐦</span>
                      <h4 className="font-semibold text-foreground">Twitter</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Latest updates and featured creations
                    </p>
                  </a>
                </div>
              </div>

              {/* Related tools section */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  Explore Other AI Audio Tools
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href="/tools/ai-audio"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎧</span>
                      <h4 className="font-semibold text-foreground">AI Audio Prompts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      General AI audio generation prompts
                    </p>
                  </Link>
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
                </div>
              </div>

              {/* Share Your Prompts CTA */}
              <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 text-center">
                <div className="mb-4">
                  <span className="text-4xl">🎵</span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  Share Your Suno Creations with the Community
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Have you created amazing music with Suno? Share your prompts and help other
                  creators discover new possibilities. Join thousands of creators building the
                  future of AI music together.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
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
                  Ready to Create Amazing Music with Suno?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Create a free account to save your favorite Suno prompts, organize them by
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
                  <a href={sunoData.companyUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg">
                      Learn More About Suno
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
