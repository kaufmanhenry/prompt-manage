import { TagIcon, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Tool tag mappings to their dedicated landing pages
const toolTagMappings: Record<string, string> = {
  suno: '/tools/suno',
  runway: '/tools/runway',
  veo: '/tools/google-veo',
  'google-veo': '/tools/google-veo',
  opus: '/tools/opus',
  'opus-clip': '/tools/opus',
  'ai-image': '/tools/ai-image',
  'ai-video': '/tools/ai-video',
  'ai-audio': '/tools/ai-audio',
  'dall-e': '/tools/ai-image',
  midjourney: '/tools/ai-image',
  'stable-diffusion': '/tools/ai-image',
  pika: '/tools/ai-video',
  elevenlabs: '/tools/ai-audio',
  mubert: '/tools/ai-audio',
}

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const tag = decodeURIComponent(resolvedParams.tag)

  // Check if this tag should redirect to a dedicated tool page
  const toolPage = toolTagMappings[tag.toLowerCase()]
  if (toolPage) {
    // Return metadata that will be replaced by the redirect
    return {
      title: `Redirecting to ${tag}...`,
      description: `Redirecting to the dedicated ${tag} page.`,
    }
  }

  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .contains('tags', [tag])

  const count = prompts?.length || 0

  if (count === 0) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    }
  }

  const title = `${tag} Prompts - AI Prompt Templates | Prompt Manage`
  const description = `Discover ${count} AI prompts tagged with "${tag}". Find ready-to-use prompt templates for ChatGPT, Claude, Gemini, and more. Free to browse and copy.`

  return {
    title,
    description,
    keywords: [
      tag,
      `${tag} prompts`,
      `${tag} AI prompts`,
      `${tag} ChatGPT`,
      'prompt templates',
      'AI prompts',
      'prompt engineering',
    ],
    openGraph: {
      title,
      description,
      url: `https://promptmanage.com/p/tags/${encodeURIComponent(tag)}`,
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: `${tag} Prompts`,
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
      canonical: `/p/tags/${encodeURIComponent(tag)}`,
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

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params
  const tag = decodeURIComponent(resolvedParams.tag)

  // Check if this tag should redirect to a dedicated tool page
  const toolPage = toolTagMappings[tag.toLowerCase()]
  if (toolPage) {
    redirect(toolPage)
  }

  const supabase = createServerSideClient()

  // Get prompts with this tag
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .contains('tags', [tag])
    .order('view_count', { ascending: false })
    .limit(100)

  if (!prompts || prompts.length === 0) {
    notFound()
  }

  // Get related tags (tags that appear with this tag)
  const relatedTags = new Map<string, number>()
  prompts.forEach((prompt) => {
    prompt.tags?.forEach((t: string) => {
      if (t !== tag) {
        relatedTags.set(t, (relatedTags.get(t) || 0) + 1)
      }
    })
  })

  const sortedRelatedTags = Array.from(relatedTags.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

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
        name: 'Prompts',
        item: 'https://promptmanage.com/p',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tags',
        item: 'https://promptmanage.com/p/tags',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: tag,
        item: `https://promptmanage.com/p/tags/${encodeURIComponent(tag)}`,
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag} AI Prompts`,
    description: `Collection of ${prompts.length} AI prompts tagged with ${tag}`,
    url: `https://promptmanage.com/p/tags/${encodeURIComponent(tag)}`,
    numberOfItems: prompts.length,
    about: {
      '@type': 'Thing',
      name: tag,
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What makes a good ${tag} prompt?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A good ${tag} prompt is clear, specific, and includes context about your target audience and desired outcome. It should provide enough detail for the AI to understand your ${tag.toLowerCase()} needs while remaining flexible enough to generate creative solutions.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which AI model works best for ${tag}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Different models excel at different ${tag.toLowerCase()} tasks. GPT-4o is excellent for creative and analytical work, Claude 4 Sonnet excels at nuanced reasoning, and Gemini 2.5 Pro is great for multimodal tasks. Try multiple models to see which works best for your specific ${tag.toLowerCase()} needs.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I customize these ${tag} prompts?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Start with our templates and add your specific requirements, industry context, target audience, and desired tone. You can also combine elements from multiple ${tag} prompts to create a custom solution that fits your unique needs.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are these ${tag} prompts free to use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! All prompts in our ${tag} collection are completely free to use, copy, and modify. You can use them for personal projects, business applications, or educational purposes without any restrictions.`,
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
              Prompts
            </Link>
            <span>/</span>
            <Link href="/p/tags" className="hover:text-foreground">
              Tags
            </Link>
            <span>/</span>
            <span className="text-foreground">{tag}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <TagIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{tag} Prompts</h1>
                <p className="text-muted-foreground">
                  {prompts.length} AI prompt{prompts.length !== 1 ? 's' : ''} tagged with "{tag}"
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Related Tags */}
          {sortedRelatedTags.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-sm font-medium text-foreground">Related Tags</h2>
              <div className="flex flex-wrap gap-2">
                {sortedRelatedTags.map(([relatedTag, count]) => (
                  <Link key={relatedTag} href={`/p/tags/${encodeURIComponent(relatedTag)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      {relatedTag} ({count})
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <Link key={prompt.id} href={`/p/${prompt.slug}`}>
                <Card className="group flex h-full cursor-pointer flex-col p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="flex-grow">
                    <div className="mb-4">
                      <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary">
                        {prompt.name}
                      </h3>
                      {prompt.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                          {prompt.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{prompt.model}</Badge>
                        {prompt.tags
                          ?.filter((t: string) => t !== tag)
                          .slice(0, 2)
                          .map((t: string) => (
                            <Badge key={t} variant="outline">
                              {t}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <pre className="line-clamp-3 text-wrap rounded-lg bg-accent p-2 text-xs font-medium text-muted-foreground">
                        {prompt.prompt_text}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{prompt.view_count} views</span>
                      </div>
                      <CopyButton text={prompt.prompt_text} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Comprehensive Content Section */}
          <div className="mx-auto mt-16 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Complete Guide to {tag} AI Prompts
              </h2>

              {/* What are [tag] prompts section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  What Are {tag} AI Prompts?
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">{tag} prompts</strong> are carefully crafted
                    instructions designed to help AI models like ChatGPT, Claude, and Gemini
                    generate high-quality content related to {tag.toLowerCase()}. These prompts
                    serve as templates that guide the AI to produce specific, useful outputs for{' '}
                    {tag.toLowerCase()} tasks.
                  </p>
                  <p>
                    Our collection of{' '}
                    <strong className="text-foreground">
                      {prompts.length} {tag} prompts
                    </strong>{' '}
                    has been tested and refined by the community, ensuring they deliver consistent,
                    valuable results across different AI models and use cases.
                  </p>
                </div>
              </div>

              {/* How to use section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  How to Use {tag} Prompts Effectively
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  <p>Follow these steps to get the best results from {tag} prompts:</p>
                  <ol className="ml-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Choose the right model:</strong> Different AI models excel at
                        different {tag.toLowerCase()} tasks. Check the recommended model for each
                        prompt.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Customize for your needs:</strong> Adapt the prompt by adding
                        specific details about your {tag.toLowerCase()} requirements.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Test and iterate:</strong> Run the prompt multiple times with slight
                        variations to find what works best for your use case.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Save successful prompts:</strong> Create an account to save your
                        best-performing {tag} prompts for future use.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Best practices section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Best Practices for {tag} Prompt Engineering
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  <p>To maximize the effectiveness of {tag} prompts, consider these expert tips:</p>
                  <ul className="ml-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>
                        <strong>Be specific:</strong> Include relevant context, target audience, and
                        desired output format in your {tag.toLowerCase()} prompts.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>
                        <strong>Use examples:</strong> Provide sample inputs or outputs to help the
                        AI understand your {tag.toLowerCase()} requirements better.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>
                        <strong>Set constraints:</strong> Define word limits, tone, style, or other
                        parameters to ensure the output meets your {tag.toLowerCase()} needs.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>
                        <strong>Iterate and refine:</strong> Use the AI's output as a starting point
                        and refine your {tag.toLowerCase()} prompts based on results.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Frequently Asked Questions About {tag} Prompts
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      What makes a good {tag} prompt?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      A good {tag} prompt is clear, specific, and includes context about your target
                      audience and desired outcome. It should provide enough detail for the AI to
                      understand your {tag.toLowerCase()} needs while remaining flexible enough to
                      generate creative solutions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      Which AI model works best for {tag}?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Different models excel at different {tag.toLowerCase()} tasks. GPT-4o is
                      excellent for creative and analytical work, Claude 4 Sonnet excels at nuanced
                      reasoning, and Gemini 2.5 Pro is great for multimodal tasks. Try multiple
                      models to see which works best for your specific {tag.toLowerCase()} needs.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      How can I customize these {tag} prompts?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Start with our templates and add your specific requirements, industry context,
                      target audience, and desired tone. You can also combine elements from multiple{' '}
                      {tag} prompts to create a custom solution that fits your unique needs.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      Are these {tag} prompts free to use?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our {tag} collection are completely free to use, copy, and
                      modify. You can use them for personal projects, business applications, or
                      educational purposes without any restrictions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related content */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Explore More {tag} Resources
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Link
                    href="/trending"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <h4 className="mb-2 font-semibold text-foreground">Trending AI Prompts</h4>
                    <p className="text-sm text-muted-foreground">
                      Discover the most popular prompts across all categories
                    </p>
                  </Link>
                  <Link
                    href="/categories"
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  >
                    <h4 className="mb-2 font-semibold text-foreground">Browse by Category</h4>
                    <p className="text-sm text-muted-foreground">
                      Find prompts organized by use case and industry
                    </p>
                  </Link>
                </div>
              </div>

              {/* Share Your Prompts CTA */}
              <div className="mb-8 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 text-center">
                <div className="mb-4">
                  <span className="text-4xl">💡</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Share Your {tag} Prompts with the Community
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Have you created amazing {tag.toLowerCase()} prompts? Share them with our
                  community and help other creators discover new possibilities.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Share Your Prompts
                  </Link>
                  <Link
                    href="/tools"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent dark:border-gray-600"
                  >
                    Explore AI Tools
                  </Link>
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Join 60+ creators</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TagIcon className="h-3 w-3" />
                    <span>Share & discover prompts</span>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Ready to Start Using {tag} Prompts?
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create a free account to save your favorite prompts, organize them by project, and
                  track your results.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/p/tags"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent dark:border-gray-600"
                  >
                    Browse All Tags
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
