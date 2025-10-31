'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Eye,
  Facebook,
  FolderOpen,
  Heart,
  Linkedin,
  Share2,
  Twitter,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/client'

interface CollectionPageClientProps {
  slug: string
}

type Collection = {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  creator_id: string
  views: number
  likes: number
  created_at: string
  visibility: 'private' | 'public'
}

type CollectionPrompt = {
  id: string
  name: string
  slug: string
  description: string | null
  model: string | null
  tags: string[] | null
  view_count: number
}

type CreatorProfile = {
  username: string | null
  display_name: string | null
  full_name: string | null
}

export function CollectionPageClient({ slug }: CollectionPageClientProps) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [prompts, setPrompts] = useState<CollectionPrompt[]>([])
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const supabase = createClient()

        // Fetch collection
        const { data: collectionData, error: collectionError } = await supabase
          .from('prompt_collections')
          .select('*')
          .eq('slug', slug)
          .eq('visibility', 'public')
          .single()

        if (collectionError || !collectionData) {
          setLoading(false)
          return
        }

        setCollection(collectionData as Collection)

        // Fetch prompts in collection
        const { data: promptsData, error: promptsError } = await supabase
          .from('collection_prompts')
          .select(
            `
            prompts (
              id, name, slug, description, model, tags, view_count, is_public
            ),
            sort_order
          `,
          )
          .eq('collection_id', collectionData.id)
          .order('sort_order', { ascending: true })

        if (!promptsError && promptsData) {
          const validPrompts = promptsData
            .filter((item: any) => item.prompts && item.prompts.is_public)
            .map((item: any) => ({
              ...item.prompts,
              sort_order: item.sort_order,
            }))
          setPrompts(validPrompts as CollectionPrompt[])
        }

        // Fetch creator profile
        if (collectionData.creator_id) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('username, display_name, full_name')
            .eq('id', collectionData.creator_id)
            .single()

          if (profileData) {
            setCreator(profileData as CreatorProfile)
          }
        }

        // Increment view count
        await supabase
          .from('prompt_collections')
          .update({ views: (collectionData.views || 0) + 1 })
          .eq('id', collectionData.id)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching collection:', error)
        setLoading(false)
      }
    }

    void fetchCollection()
  }, [slug])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowShareDialog(false)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShareToX = () => {
    if (!collection) return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`${collection.title} - Prompt Collection`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handleShareToLinkedIn = () => {
    if (!collection) return
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(collection.title)
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank')
  }

  const handleShareToFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const handleShareToReddit = () => {
    if (!collection) return
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(`${collection.title} - Prompt Collection`)
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading collection...</div>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Collection Not Found
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            This collection may have been deleted or is not publicly available.
          </p>
          <Link href="/collections">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Collections
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const collectionUrl = `https://promptmanage.com/collections/${slug}`
  const creatorName = creator?.display_name || creator?.full_name || 'Anonymous'
  const creatorLink = creator?.username ? `/u/${creator.username}` : null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-foreground">
            Collections
          </Link>
          <span>/</span>
          <span className="text-foreground">{collection.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          {collection.cover_image_url && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={collection.cover_image_url}
                alt={collection.title}
                className="h-64 w-full object-cover"
              />
            </div>
          )}

          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
                {collection.title}
              </h1>
              {collection.description ? (
                <div className="mb-4">
                  <p className="mb-2 text-lg leading-relaxed text-foreground">{collection.description}</p>
                </div>
              ) : (
                <div className="mb-4 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Add a 2-4 sentence description to help others discover this
                    collection. Describe what prompts are included, the use cases, and why this
                    collection is valuable.
                  </p>
                </div>
              )}

              {/* Creator & Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {creatorLink ? (
                  <Link href={creatorLink} className="flex items-center gap-1 hover:text-foreground">
                    <User className="h-4 w-4" />
                    <span>{creatorName}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{creatorName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{collection.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{collection.likes || 0} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{prompts.length} prompt{prompts.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-2">
              <Button onClick={() => setShowShareDialog(true)} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Collection Info & Context */}
        {prompts.length > 0 && (
          <section className="mb-8 rounded-lg border bg-muted/30 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h2 className="mb-2 text-lg font-semibold">About This Collection</h2>
                {collection.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {collection.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This collection contains {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}{' '}
                    for various AI models. Explore the prompts below to find exactly what you need.
                  </p>
                )}
                {prompts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(new Set(prompts.map((p) => p.model).filter(Boolean))).slice(0, 5).map((model) => (
                      <Link key={model} href={`/p?model=${encodeURIComponent(model!)}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {model}
                        </Badge>
                      </Link>
                    ))}
                    {Array.from(new Set(prompts.flatMap((p) => p.tags || []))).slice(0, 5).map((tag) => (
                      <Link key={tag} href={`/p/tags/${encodeURIComponent(tag)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Related Collections Prompt */}
        {prompts.length > 0 && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Looking for similar collections? Explore{' '}
              <Link href="/collections" className="font-medium text-primary hover:underline">
                all collections
              </Link>
              {' '}or browse{' '}
              <Link href="/p" className="font-medium text-primary hover:underline">
                individual prompts
              </Link>
              {' '}by model, tag, or keyword.
            </p>
          </div>
        )}

        {/* Prompts Grid */}
        {prompts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">No prompts in this collection yet.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/p">
                <Button variant="outline" size="sm">
                  Browse Prompts
                </Button>
              </Link>
              <Link href="/dashboard/collections">
                <Button variant="outline" size="sm">
                  Create Collection
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Prompts in This Collection ({prompts.length})
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Link href={prompt.slug ? `/p/${prompt.slug}` : '#'}>
                    <CardTitle className="line-clamp-2 hover:text-primary">
                      {prompt.name}
                    </CardTitle>
                  </Link>
                  {prompt.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {prompt.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {prompt.model && (
                      <Badge variant="secondary" className="text-xs">
                        {prompt.model}
                      </Badge>
                    )}
                    {prompt.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{prompt.view_count || 0} views</span>
                    {prompt.slug && (
                      <Link href={`/p/${prompt.slug}`}>
                        <Button variant="ghost" size="sm">
                          View →
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </>
        )}

        {/* Related Content Section */}
        {prompts.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold tracking-tight">Explore More</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/collections">
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">All Collections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Browse trending, popular, and newest collections. Discover curated prompt
                        collections from our community.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/p">
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">Browse Prompts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Explore thousands of individual prompts. Search by model, tag, or keyword
                        to find exactly what you need.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                {creatorLink && (
                  <Link href={creatorLink}>
                    <Card className="h-full transition-all hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-base">Creator Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          View more collections by {creatorName}. Explore their profile to discover
                          additional prompts and collections.
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                <Link href="/tools">
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">AI Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Discover AI tools like Suno, Runway, Pika, and more. Learn how each tool
                        works and find tool-specific prompts.
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
                        See all AI models we support: ChatGPT, Claude, Gemini, and 20+ others.
                        Find the right model for your needs.
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
                        Explore real-world use cases for AI prompts. See how professionals use
                        prompts in their workflows.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SEO Footer Content */}
        {prompts.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <div className="mx-auto max-w-4xl text-sm text-muted-foreground">
              <p className="leading-relaxed">
                This collection on{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                  Prompt Manage
                </Link>
                {' '}contains {prompts.length} curated prompt{prompts.length !== 1 ? 's' : ''} for
                AI models including{' '}
                {Array.from(new Set(prompts.map((p) => p.model).filter(Boolean)))
                  .slice(0, 5)
                  .map((model, i, arr) => (
                    <span key={model}>
                      <Link
                        href={`/p?model=${encodeURIComponent(model!)}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {model}
                      </Link>
                      {i < arr.length - 1 && ', '}
                    </span>
                  ))}
                . Collections help organize prompts by use case, model, or theme, making it easier
                to find the right prompts for your needs. Browse more{' '}
                <Link href="/collections" className="font-medium text-primary hover:underline">
                  prompt collections
                </Link>
                {' '}or explore{' '}
                <Link href="/p" className="font-medium text-primary hover:underline">
                  individual prompts
                </Link>
                {' '}in our{' '}
                <Link href="/p" className="font-medium text-primary hover:underline">
                  public directory
                </Link>
                .
                {creatorLink && (
                  <>
                    {' '}
                    View more collections by{' '}
                    <Link href={creatorLink} className="font-medium text-primary hover:underline">
                      {creatorName}
                    </Link>
                    {' '}or explore their{' '}
                    <Link href={creatorLink} className="font-medium text-primary hover:underline">
                      profile
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </section>
        )}

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Button onClick={handleCopyLink} className="flex w-full items-center gap-2">
                <Share2 className="h-4 w-4" /> Copy Link
              </Button>
              <Button
                onClick={handleShareToX}
                className="flex w-full items-center gap-2"
                variant="outline"
              >
                <Twitter className="h-4 w-4 text-blue-500" /> Share to X (Twitter)
              </Button>
              <Button
                onClick={handleShareToLinkedIn}
                className="flex w-full items-center gap-2"
                variant="outline"
              >
                <Linkedin className="h-4 w-4 text-blue-700" /> Share to LinkedIn
              </Button>
              <Button
                onClick={handleShareToFacebook}
                className="flex w-full items-center gap-2"
                variant="outline"
              >
                <Facebook className="h-4 w-4 text-blue-600" /> Share to Facebook
              </Button>
              <Button
                onClick={handleShareToReddit}
                className="flex w-full items-center gap-2"
                variant="outline"
              >
                <Share2 className="h-4 w-4 text-orange-500" /> Share to Reddit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: collection.title,
              description: collection.description || `${collection.title} - Prompt Collection`,
              url: collectionUrl,
              datePublished: collection.created_at,
              creator: {
                '@type': 'Person',
                name: creatorName,
                ...(creatorLink && { url: `https://promptmanage.com${creatorLink}` }),
              },
              numberOfItems: prompts.length,
            }),
          }}
        />
      </div>
    </div>
  )
}

