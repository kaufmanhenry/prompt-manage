import { TagIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Browse Prompts by Tag - AI Prompt Directory | Prompt Manage',
  description:
    'Explore AI prompts organized by tags. Find prompts for specific use cases, industries, and applications across ChatGPT, Claude, Gemini, and more.',
  keywords:
    'AI prompt tags, prompt categories, ChatGPT prompts by tag, Claude prompts, prompt organization, prompt discovery',
  openGraph: {
    title: 'Browse Prompts by Tag - AI Prompt Directory',
    description:
      'Explore AI prompts organized by tags. Find prompts for specific use cases and applications.',
    url: 'https://promptmanage.com/p/tags',
    type: 'website',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Tag Directory',
      },
    ],
  },
  alternates: {
    canonical: '/p/tags',
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

interface TagWithCount {
  tag: string
  count: number
}

export default async function TagsDirectoryPage() {
  const supabase = createServerSideClient()

  // Get all public prompts with tags
  const { data: prompts } = await supabase
    .from('prompts')
    .select('tags')
    .eq('is_public', true)
    .not('tags', 'is', null)

  // Count tag occurrences
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  // Convert to array and sort by count
  const sortedTags: TagWithCount[] = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)

  // Schema.org CollectionPage markup
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Prompt Tags Directory',
    description: 'Browse AI prompts organized by tags and categories',
    url: 'https://promptmanage.com/p/tags',
    breadcrumb: {
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
      ],
    },
    numberOfItems: sortedTags.length,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          {/* Header */}
          <div className="mb-8">
            <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/p" className="hover:text-foreground">
                Prompts
              </Link>
              <span>/</span>
              <span className="text-foreground">Tags</span>
            </nav>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Browse Prompts by Tag
            </h1>
            <p className="text-muted-foreground">
              Discover AI prompts organized by tags. Find exactly what you need for your specific
              use case or industry.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground">
              {sortedTags.length} unique tags • {prompts?.length || 0} tagged prompts
            </p>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedTags.map(({ tag, count }) => (
              <Link key={tag} href={`/p/tags/${encodeURIComponent(tag)}`}>
                <Card className="group cursor-pointer p-4 transition-all hover:border-primary hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <TagIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                          {tag}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {count} prompt{count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {sortedTags.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No tags found. Start creating tagged prompts!</p>
            </div>
          )}

          {/* SEO Footer Content */}
          <div className="mx-auto mt-16 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Find AI Prompts by Tag and Category
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Our <strong className="text-foreground">AI prompt tag directory</strong> helps you
                  quickly discover prompts tailored to your specific needs. Whether you're looking
                  for marketing prompts, coding assistants, content creation tools, or business
                  automation workflows, our tag-based organization makes it easy to find exactly
                  what you need.
                </p>
                <p>
                  Each tag represents a specific use case, industry, or application type. Browse{' '}
                  <strong>popular tags</strong> to see what the community is creating, or search for
                  niche tags to find specialized prompts for your unique requirements. All prompts
                  work across multiple AI models including ChatGPT, Claude, Gemini, and more.
                </p>
                <p>
                  Want to organize your own prompts with tags?{' '}
                  <Link
                    href="/dashboard"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign up for free
                  </Link>{' '}
                  and start building your personal prompt library with custom tagging and
                  categorization.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/p"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse All Prompts →
                  </Link>
                  <Link
                    href="/models"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Supported Models →
                  </Link>
                  <Link
                    href="/docs"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Learn Best Practices →
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
