import { Calendar, Eye, FolderOpen, Heart, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

export const revalidate = 300 // Revalidate every 5 minutes

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Prompt Collections – Discover & Organize AI Prompts | Prompt Manage'
  const description =
    'Explore curated collections of AI prompts for ChatGPT, Claude, Gemini, Suno, Runway, Pika, and more. Store, manage, and organize your prompts into collections. The best CMS for prompt management. Discover thousands of prompts organized by use case, model, and theme.'
  const url = 'https://promptmanage.com/collections'
  const keywords =
    'prompt collections, AI prompt collections, ChatGPT prompts, Claude prompts, Gemini prompts, Suno prompts, Runway prompts, prompt management, organize prompts, prompt library, AI prompts collection, prompt CMS, AI prompt organization, prompt curation'

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Prompt Manage',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          alt: 'Prompt Manage Collections - Organize and Discover AI Prompts',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CollectionsIndexPage() {
  const supabase = createServerSideClient()

  // Fetch collections in parallel
  const [
    { data: trendingCollections },
    { data: popularCollections },
    { data: newestCollections },
    { data: stats },
  ] = await Promise.all([
    // Trending: based on views + likes in last 7 days
    supabase
      .from('prompt_collections')
      .select('id, slug, title, description, cover_image_url, likes, views, created_at, creator_id')
      .eq('visibility', 'public')
      .order('views', { ascending: false })
      .order('likes', { ascending: false })
      .limit(12),
    // Popular: highest total engagement
    supabase
      .from('prompt_collections')
      .select('id, slug, title, description, cover_image_url, likes, views, created_at, creator_id')
      .eq('visibility', 'public')
      .order('likes', { ascending: false })
      .order('views', { ascending: false })
      .limit(12),
    // Newest: most recently created
    supabase
      .from('prompt_collections')
      .select('id, slug, title, description, cover_image_url, likes, views, created_at, creator_id')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(12),
    // Stats: total count
    supabase
      .from('prompt_collections')
      .select('id', { count: 'exact', head: true })
      .eq('visibility', 'public'),
  ])

  const totalCollections = stats?.length || 0

  // Helper to get creator name (reserved for future use)
  // const _getCreatorInfo = async (creatorId: string) => {
  //   const { data: profile } = await supabase
  //     .from('user_profiles')
  //     .select('username, display_name, full_name')
  //     .eq('id', creatorId)
  //     .single()
  //   return profile
  //     ? {
  //         username: profile.username,
  //         name: profile.display_name || profile.full_name || 'Anonymous',
  //       }
  //     : null
  // }

  // Fetch creator info for trending collections - batch fetch for performance
  const creatorIds = (trendingCollections || [])
    .map((c) => c.creator_id)
    .filter((id): id is string => !!id)
  const creatorIdsSet = new Set(creatorIds)

  let creatorsMap: Record<string, any> = {}
  if (creatorIdsSet.size > 0) {
    const { data: creatorProfiles } = await supabase
      .from('user_profiles')
      .select('id, username, display_name, full_name')
      .in('id', Array.from(creatorIdsSet))

    if (creatorProfiles) {
      creatorsMap = creatorProfiles.reduce(
        (acc, profile) => {
          acc[profile.id] = {
            username: profile.username,
            name: profile.display_name || profile.full_name || 'Anonymous',
          }
          return acc
        },
        {} as Record<string, any>,
      )
    }
  }

  const trendingWithCreators = (trendingCollections || []).map((c) => ({
    ...c,
    creator: c.creator_id ? creatorsMap[c.creator_id] || null : null,
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Prompt Collections
            </h1>
          </div>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground">
            Discover curated collections of AI prompts for ChatGPT, Claude, Gemini, Suno, Runway,
            and more. Organize, store, and manage your prompts in one place. The best CMS for prompt
            management.
          </p>
          <p className="mx-auto mb-6 max-w-3xl text-sm text-muted-foreground">
            Collections help you organize prompts by use case, model, or theme. Browse{' '}
            <Link href="/p" className="font-medium text-primary hover:underline">
              individual prompts
            </Link>
            , explore{' '}
            <Link href="/tools" className="font-medium text-primary hover:underline">
              AI tools
            </Link>
            , or check out{' '}
            <Link href="/models" className="font-medium text-primary hover:underline">
              supported models
            </Link>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard/collections">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Create Collection
              </Button>
            </Link>
            <Link href="/p">
              <Button size="lg" variant="outline">
                Browse Prompts
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span>{totalCollections} Collections</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Organize & Share</span>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCollections}</p>
                  <p className="text-sm text-muted-foreground">Public Collections</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(trendingCollections || [])
                      .reduce((sum, c) => sum + (c.views || 0), 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(trendingCollections || [])
                      .reduce((sum, c) => sum + (c.likes || 0), 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Collections */}
        {(trendingCollections || []).length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Trending Collections</h2>
              </div>
              <Link href="/collections?sort=trending">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trendingWithCreators.slice(0, 6).map((collection: any) => (
                <Link key={collection.id} href={`/collections/${collection.slug}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                    {collection.cover_image_url ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={collection.cover_image_url}
                          alt={collection.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="line-clamp-1 font-semibold">{collection.title}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/10" />
                    )}
                    <CardContent className="p-4">
                      {!collection.cover_image_url && (
                        <h3 className="mb-2 line-clamp-1 font-semibold group-hover:text-primary">
                          {collection.title}
                        </h3>
                      )}
                      {collection.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                          {collection.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{(collection.views || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{(collection.likes || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        {collection.creator && (
                          <Link
                            href={
                              collection.creator.username
                                ? `/u/${collection.creator.username}`
                                : '#'
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary"
                          >
                            {collection.creator.name}
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Collections */}
        {(popularCollections || []).length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Most Popular</h2>
              </div>
              <Link href="/collections?sort=popular">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(popularCollections || []).slice(0, 6).map((collection: any) => (
                <Link key={collection.id} href={`/collections/${collection.slug}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                    {collection.cover_image_url ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={collection.cover_image_url}
                          alt={collection.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="line-clamp-1 font-semibold">{collection.title}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/10" />
                    )}
                    <CardContent className="p-4">
                      {!collection.cover_image_url && (
                        <h3 className="mb-2 line-clamp-1 font-semibold group-hover:text-primary">
                          {collection.title}
                        </h3>
                      )}
                      {collection.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                          {collection.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{(collection.views || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{(collection.likes || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newest Collections */}
        {(newestCollections || []).length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Newest Collections</h2>
              </div>
              <Link href="/collections?sort=newest">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(newestCollections || []).slice(0, 6).map((collection: any) => (
                <Link key={collection.id} href={`/collections/${collection.slug}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                    {collection.cover_image_url ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={collection.cover_image_url}
                          alt={collection.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="line-clamp-1 font-semibold">{collection.title}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/10" />
                    )}
                    <CardContent className="p-4">
                      {!collection.cover_image_url && (
                        <h3 className="mb-2 line-clamp-1 font-semibold group-hover:text-primary">
                          {collection.title}
                        </h3>
                      )}
                      {collection.description && (
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                          {collection.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{(collection.views || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{(collection.likes || 0).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Educational Content */}
        <section className="mb-16 border-t pt-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Why Use Collections?</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Organize by Use Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Group prompts by purpose: marketing, coding, writing, design, or any specific
                    use case. Make it easier to find the right prompt when you need it. Collections
                    help you stay organized as your prompt library grows.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Organize by AI Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create collections for specific models like{' '}
                    <Link href="/tools/suno" className="text-primary hover:underline">
                      Suno
                    </Link>
                    ,{' '}
                    <Link href="/tools/runway" className="text-primary hover:underline">
                      Runway
                    </Link>
                    , or{' '}
                    <Link href="/models" className="text-primary hover:underline">
                      ChatGPT
                    </Link>
                    . Each AI tool requires different prompt styles, so organizing by model helps
                    ensure you&apos;re using the right prompts.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share with Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Public collections help others discover great prompts. Write a clear description
                    (2-4 sentences) explaining what your collection contains and who it&apos;s for.
                    Share your expertise and help others achieve better results with AI.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Private collections keep your team&apos;s prompts organized. Share approved
                    prompts, best practices, and brand guidelines. Collections help maintain
                    consistency across your team&apos;s AI workflows. Learn more about{' '}
                    <Link href="/pricing" className="text-primary hover:underline">
                      team features
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="mb-16 border-t pt-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Explore More</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/p">
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">Browse Prompts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Explore thousands of individual prompts for all AI models. Search by model,
                      tag, or keyword.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools">
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">AI Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Discover AI tools like Suno, Runway, Pika, and more. Learn how each tool works
                      and find tool-specific prompts.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/models">
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">Supported Models</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      See all AI models we support: ChatGPT, Claude, Gemini, and 20+ others. Find
                      the right model for your needs.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/use-cases">
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">Use Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Explore real-world use cases for AI prompts. See how professionals use prompts
                      in their workflows.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/docs/features/prompt-collections">
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn how to create, manage, and share collections. Get tips on organizing
                      your prompt library.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/collections">
                <Card className="h-full border-primary/20 bg-primary/5 transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base">Create Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Start organizing your prompts today. Create collections to keep your prompts
                      organized and discoverable.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">Create Your Own Collection</h2>
            <p className="mx-auto mb-2 max-w-2xl text-muted-foreground">
              Organize your prompts into collections. Store, manage, and share your prompts with the
              community. The best CMS for prompt management.
            </p>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground">
              <strong>Tip:</strong> When creating a public collection, write a 2-4 sentence
              description to help others discover and understand your work. Describe what prompts
              are included, the use cases, and why this collection is valuable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard/collections">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Create Collection
                </Button>
              </Link>
              <Link href="/docs/features/prompt-collections">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Prompt Collections',
              description:
                'Discover curated collections of AI prompts for ChatGPT, Claude, Gemini, and more. Organize, store, and manage your prompts in collections.',
              url: 'https://promptmanage.com/collections',
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: totalCollections,
                itemListElement: (trendingCollections || [])
                  .slice(0, 10)
                  .map((c: any, i: number) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    item: {
                      '@type': 'CreativeWork',
                      name: c.title,
                      description: c.description,
                      url: `https://promptmanage.com/collections/${c.slug}`,
                    },
                  })),
              },
            }),
          }}
        />
      </div>
    </div>
  )
}
