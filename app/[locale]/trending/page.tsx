import { Clock, Flame, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { BlackFridayBanner } from '@/components/BlackFridayBanner'
import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PublicPrompt } from '@/lib/schemas/prompt'
import { createServerSideClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Trending AI Prompts - Most Popular & Recent Templates | Prompt Manage',
  description:
    'Discover trending AI prompts used by thousands. Browse the most popular and recently added prompt templates for ChatGPT, Claude, Gemini, and more.',
  keywords: [
    'trending AI prompts',
    'popular prompts',
    'most viewed prompts',
    'recent prompts',
    'ChatGPT trending',
    'AI prompt templates',
    'prompt discovery',
  ],
  openGraph: {
    title: 'Trending AI Prompts - Most Popular Templates',
    description:
      'Discover the most popular and recently added AI prompts. Browse trending templates used by thousands.',
    url: '/trending',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Trending AI Prompts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trending AI Prompts - Most Popular Templates',
    description: 'Discover the most popular and recently added AI prompts.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: '/trending',
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

export default async function TrendingPage() {
  const supabase = createServerSideClient()

  // Get most popular prompts (by view count)
  const { data: popularPrompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .order('view_count', { ascending: false })
    .limit(24)

  // Get recently added prompts
  const { data: recentPrompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .order('inserted_at', { ascending: false })
    .limit(24)

  // Get recently updated prompts
  const { data: recentlyUpdated } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(24)

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
        name: 'Trending',
        item: '/trending',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Trending AI Prompts',
    description: 'Most popular and recently added AI prompts',
    url: '/trending',
  }

  const PromptGrid = ({ prompts }: { prompts: PublicPrompt[] }) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts?.map((prompt, index) => (
        <Link key={prompt.id} href={`/p/${prompt.slug}`}>
          <Card className="group relative flex h-full cursor-pointer flex-col p-4 transition-all hover:border-primary hover:shadow-md">
            {/* Rank badge for top 3 */}
            {index < 3 && (
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-sm font-bold text-white shadow-lg">
                {index + 1}
              </div>
            )}

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
                  {prompt.tags?.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags && prompt.tags.length > 2 && (
                    <Badge variant="outline">+{prompt.tags.length - 2}</Badge>
                  )}
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
  )

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
            <span className="text-foreground">Trending</span>
          </nav>

          {/* Black Friday Banner */}
          <BlackFridayBanner />

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-500 p-3">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Trending AI Prompts
                </h1>
                <p className="text-muted-foreground">
                  Discover the most popular and recently added prompts
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="popular" className="gap-2">
                <Flame className="h-4 w-4" />
                Most Popular
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="h-4 w-4" />
                Recently Added
              </TabsTrigger>
              <TabsTrigger value="updated" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Recently Updated
              </TabsTrigger>
            </TabsList>

            <TabsContent value="popular">
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {popularPrompts?.length || 0} most viewed prompts
                </p>
              </div>
              {popularPrompts && popularPrompts.length > 0 ? (
                <PromptGrid prompts={popularPrompts} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No popular prompts found.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {recentPrompts?.length || 0} recently added prompts
                </p>
              </div>
              {recentPrompts && recentPrompts.length > 0 ? (
                <PromptGrid prompts={recentPrompts} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No recent prompts found.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="updated">
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {recentlyUpdated?.length || 0} recently updated prompts
                </p>
              </div>
              {recentlyUpdated && recentlyUpdated.length > 0 ? (
                <PromptGrid prompts={recentlyUpdated} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No recently updated prompts found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* SEO Footer Content */}
          <div className="mx-auto mt-16 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Discover What's Trending in AI Prompts
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Stay up-to-date with the{' '}
                  <strong className="text-foreground">most popular AI prompts</strong> used by our
                  community. Our trending page showcases prompts with the highest view counts, most
                  recent additions, and frequently updated templates across all supported AI models
                  including ChatGPT, Claude, Gemini, and more.
                </p>
                <p>
                  <strong className="text-foreground">Most Popular</strong> prompts are ranked by
                  view count, showing you what's working best for other users.{' '}
                  <strong className="text-foreground">Recently Added</strong> prompts feature the
                  newest templates shared by the community.{' '}
                  <strong className="text-foreground">Recently Updated</strong> prompts highlight
                  active improvements and refinements.
                </p>
                <p>
                  Whether you're looking for inspiration or proven templates, the trending page is
                  your go-to resource for discovering high-quality AI prompts. Copy any prompt
                  directly to your clipboard, or{' '}
                  <Link
                    href="/dashboard"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    sign up for free
                  </Link>{' '}
                  to save prompts to your personal library and track your favorites.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/p"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse All Prompts →
                  </Link>
                  <Link
                    href="/p/tags"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse by Tag →
                  </Link>
                  <Link
                    href="/models"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse by Model →
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
