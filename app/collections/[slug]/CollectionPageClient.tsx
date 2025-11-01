'use client'

// import { useQuery } from '@tanstack/react-query' // Commented out - session not currently used
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Facebook,
  FolderOpen,
  Heart,
  Linkedin,
  Share2,
  Twitter,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
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
  is_public?: boolean
  sort_order?: number
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

  // Session is not currently used but kept for future auth checks
  // const { data: session } = useQuery({
  //   queryKey: ['session'],
  //   queryFn: async () => {
  //     const {
  //       data: { session },
  //     } = await createClient().auth.getSession()
  //     return session
  //   },
  // })

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
          interface CollectionPromptItem {
            prompts: CollectionPrompt & { is_public?: boolean }
            sort_order: number
          }
          const validPrompts = (promptsData as unknown as CollectionPromptItem[])
            .filter((item) => item.prompts?.is_public !== false)
            .map((item) => ({
              ...item.prompts,
              sort_order: item.sort_order,
            }))
          setPrompts(validPrompts)
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
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      '_blank',
    )
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Collection Not Found</h1>
          <p className="mb-4 text-muted-foreground">
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

        {/* Compact Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-3 text-4xl font-bold tracking-tight">{collection.title}</h1>
              {collection.description && (
                <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                  {collection.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {creatorLink ? (
                  <Link
                    href={creatorLink}
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    {creatorName}
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {creatorName}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {collection.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  {collection.likes || 0} likes
                </div>
                <div className="flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <Button onClick={() => setShowShareDialog(true)} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Cover Image */}
          {collection.cover_image_url && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <Image
                src={collection.cover_image_url}
                alt={collection.title}
                width={1200}
                height={400}
                className="h-64 w-full object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Prompts Section - PRIORITY AT TOP */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Prompts in This Collection</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} organized in this
                collection
              </p>
            </div>
          </div>

          {prompts.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 font-medium">No prompts in this collection yet.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/p">
                  <Button variant="outline">Browse Prompts</Button>
                </Link>
                <Link href="/collections">
                  <Button variant="outline">Explore Collections</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="group transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <Link href={prompt.slug ? `/p/${prompt.slug}` : '#'}>
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary">
                        {prompt.name}
                      </h3>
                    </Link>
                    {prompt.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {prompt.description}
                      </p>
                    )}
                    <div className="mb-4 flex flex-wrap gap-2">
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {prompt.view_count || 0} views
                      </span>
                      {prompt.slug && (
                        <Link href={`/p/${prompt.slug}`}>
                          <Button variant="ghost" size="sm" className="gap-1.5">
                            View
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Collection Details - Compact */}
        {prompts.length > 0 && (
          <section className="mb-12 rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-3 text-lg font-semibold">About This Collection</h3>
            <div className="space-y-4">
              {collection.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {collection.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This collection contains {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}{' '}
                  for various AI models.
                </p>
              )}
              {prompts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(prompts.map((p) => p.model).filter(Boolean)))
                    .slice(0, 6)
                    .map((model) => (
                      <Link key={model} href={`/p?model=${encodeURIComponent(model!)}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {model}
                        </Badge>
                      </Link>
                    ))}
                  {Array.from(new Set(prompts.flatMap((p) => p.tags || [])))
                    .slice(0, 6)
                    .map((tag) => (
                      <Link key={tag} href={`/p/tags/${encodeURIComponent(tag)}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Explore More - Compact */}
        <section className="border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold">Explore More</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/collections">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <h4 className="mb-2 font-semibold">All Collections</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse trending and popular collections
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/p">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <h4 className="mb-2 font-semibold">Browse Prompts</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore thousands of individual prompts
                  </p>
                </CardContent>
              </Card>
            </Link>
            {creatorLink && (
              <Link href={creatorLink}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <h4 className="mb-2 font-semibold">Creator Profile</h4>
                    <p className="text-sm text-muted-foreground">View more by {creatorName}</p>
                  </CardContent>
                </Card>
              </Link>
            )}
            <Link href="/models">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <h4 className="mb-2 font-semibold">AI Models</h4>
                  <p className="text-sm text-muted-foreground">See all supported models</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Collection</DialogTitle>
              <DialogDescription>Share this collection with others</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Button onClick={handleCopyLink} className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
              <Button onClick={handleShareToX} className="w-full gap-2" variant="outline">
                <Twitter className="h-4 w-4" />
                Share to X (Twitter)
              </Button>
              <Button onClick={handleShareToLinkedIn} className="w-full gap-2" variant="outline">
                <Linkedin className="h-4 w-4" />
                Share to LinkedIn
              </Button>
              <Button onClick={handleShareToFacebook} className="w-full gap-2" variant="outline">
                <Facebook className="h-4 w-4" />
                Share to Facebook
              </Button>
              <Button onClick={handleShareToReddit} className="w-full gap-2" variant="outline">
                <Share2 className="h-4 w-4 text-orange-500" />
                Share to Reddit
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
