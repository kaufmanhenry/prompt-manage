'use client'

import {
  ArrowLeft,
  Bot,
  Calendar,
  Facebook,
  Heart,
  Linkedin,
  Share2,
  TrendingUp,
  Twitter,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import CopyButton from '@/components/CopyButton'
import { CopyPromptButton } from '@/components/CopyPromptButton'
import { DerivativePrompts } from '@/components/DerivativePrompts'
import { RelatedPrompts } from '@/components/RelatedPrompts'
import { UpvoteButton } from '@/components/social/UpvoteButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FullPageLoading } from '@/components/ui/loading'
import { useToast } from '@/components/ui/use-toast'
import { generateAudienceDescription, generateCTA } from '@/lib/promptAudienceGenerator'
import type { PublicPrompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

interface PublicPromptPageClientProps {
  params: {
    slug: string
  }
}

export function PublicPromptPageClient({ params }: PublicPromptPageClientProps) {
  const [prompt, setPrompt] = useState<PublicPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [creatorUsername, setCreatorUsername] = useState<string | null>(null)
  const [publicCount, setPublicCount] = useState<number | null>(null)
  const [isAgentGenerated, setIsAgentGenerated] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const supabase = createClient()

  // Schema.org structured data for this prompt
  const promptSchema = useMemo(() => {
    if (!prompt) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: prompt.name,
      description: prompt.description || `AI prompt for ${prompt.model}`,
      text: prompt.prompt_text,
      datePublished: prompt.inserted_at,
      dateModified: prompt.updated_at,
      keywords: prompt.tags?.join(', '),
      url: `/p/${prompt.slug}`,
      creator: {
        '@type': 'Person',
        name: creatorId || 'Anonymous',
      },
      about: {
        '@type': 'SoftwareApplication',
        name: prompt.model,
      },
      isAccessibleForFree: true,
    }
  }, [prompt, creatorId])

  const breadcrumbSchema = useMemo(() => {
    if (!prompt) return null
    return {
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
          name: 'Public Prompt Directory',
          item: '/p',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: prompt.model || 'All Prompts',
          item: `/p${prompt.model ? `?model=${encodeURIComponent(prompt.model)}` : ''}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: prompt.name,
          item: `/p/${prompt.slug}`,
        },
      ],
    }
  }, [prompt])

  // AI-generated audience description (unique, SEO-optimized, human-sounding)
  const audienceInfo = useMemo(() => {
    if (!prompt) return null

    return generateAudienceDescription({
      name: prompt.name,
      description: prompt.description,
      tags: prompt.tags || [],
      model: prompt.model,
      promptText: prompt.prompt_text,
    })
  }, [prompt])

  // Generate compelling CTA
  const ctaInfo = useMemo(() => {
    if (!prompt) return null

    return generateCTA({
      name: prompt.name,
      description: prompt.description,
      tags: prompt.tags || [],
      model: prompt.model,
      promptText: prompt.prompt_text,
    })
  }, [prompt])

  const fetchPrompt = useCallback(async () => {
    try {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_public', true)
        .single()

      if (error) {
        setError('Prompt not found')
        return
      }

      // Transform data to match the new schema with fallbacks
      const transformedPrompt = {
        ...data,
        description: data.description || null,
        is_public: data.is_public || false,
        slug: data.slug || null,
        view_count: data.view_count || 0,
        inserted_at: data.inserted_at || data.created_at || null,
      }

      setPrompt(transformedPrompt as PublicPrompt)
      const userId = (data as { user_id?: string }).user_id ?? null
      const agentId = (data as { agent_id?: string }).agent_id ?? null
      setCreatorId(userId)
      setIsAgentGenerated(!!agentId)

      // Fetch creator username from user_profiles
      if (userId) {
        const { data: profile } = await createClient()
          .from('user_profiles')
          .select('username')
          .eq('id', userId)
          .single()
        setCreatorUsername(profile?.username ?? null)
      }

      // Increment view count (with deduplication)
      const viewedKey = `prompt_viewed_${data.id}`
      const hasViewed = sessionStorage.getItem(viewedKey)

      if (!hasViewed) {
        try {
          await createClient().rpc('increment_prompt_views', {
            prompt_id: data.id,
          })
          sessionStorage.setItem(viewedKey, 'true')
        } catch (viewError) {
          console.error('View count increment error:', viewError)
        }
      }
    } catch (error) {
      console.error('Prompt fetch error:', error)
      setError('Failed to load prompt')
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  useEffect(() => {
    void fetchPrompt()
  }, [params.slug, fetchPrompt])

  // Fetch like status and count
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!prompt?.id) return

      try {
        // Get like count
        const { count } = await supabase
          .from('prompt_likes')
          .select('*', { count: 'exact', head: true })
          .eq('prompt_id', prompt.id)
        setLikeCount(count || 0)

        // Check if current user has liked
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('prompt_likes')
            .select('id')
            .eq('prompt_id', prompt.id)
            .eq('user_id', user.id)
            .single()
          setIsLiked(!!data)
        }
      } catch (err) {
        console.error('Error fetching like status:', err)
      }
    }

    void fetchLikeStatus()
  }, [prompt?.id, supabase])

  // Fetch total public prompts count (for footer blurb)
  useEffect(() => {
    void (async () => {
      try {
        const { count } = await createClient()
          .from('prompts')
          .select('id', { count: 'exact', head: true })
          .eq('is_public', true)
        setPublicCount(count ?? null)
      } catch {
        // ignore count failure
      }
    })()
  }, [])

  const primaryCategory = useMemo(() => {
    if (!prompt) return null
    const tags = prompt.tags || []
    if (tags.length > 0) return tags[0]
    const name = (prompt.name || '').toLowerCase()
    if (name.includes('blog') || name.includes('content')) return 'content'
    if (name.includes('marketing')) return 'marketing'
    if (name.includes('code') || name.includes('developer')) return 'coding'
    if (name.includes('sales')) return 'sales'
    if (name.includes('idea') || name.includes('business')) return 'business'
    return null
  }, [prompt])

  const relatedTasks = useMemo(() => {
    if (!prompt) return [] as string[]
    const tags = (prompt.tags || []).filter((t) => t !== primaryCategory)
    return tags.slice(0, 3)
  }, [prompt, primaryCategory])

  const trackShare = async (platform: string) => {
    if (!prompt?.id) return
    try {
      await fetch('/api/analytics/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: prompt.id, platform }),
      })
    } catch (err) {
      console.error('Failed to track share:', err)
    }
  }

  const handleLike = async () => {
    if (!prompt?.id) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like prompts',
        variant: 'destructive',
      })
      return
    }

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('prompt_likes')
          .delete()
          .eq('prompt_id', prompt.id)
          .eq('user_id', user.id)
        setIsLiked(false)
        setLikeCount((prev) => Math.max(0, prev - 1))
        toast({
          title: 'Removed like',
          description: 'You unliked this prompt',
        })
      } else {
        // Like
        await supabase.from('prompt_likes').insert({
          prompt_id: prompt.id,
          user_id: user.id,
        })
        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
        toast({
          title: 'Liked!',
          description: 'Added to your liked prompts',
        })
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      await trackShare('copy_link')
      toast({
        title: 'Link Copied!',
        description: 'Public link copied to clipboard.',
      })
    } catch (error) {
      console.error('Copy link error:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleShareToX = async () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(prompt?.name || 'Check out this prompt!')
    await trackShare('twitter')
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handleShareToLinkedIn = async () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(prompt?.name || 'Prompt on Prompt Manage')
    await trackShare('linkedin')
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      '_blank',
    )
  }

  const handleShareToFacebook = async () => {
    const url = encodeURIComponent(window.location.href)
    await trackShare('facebook')
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const handleShareToReddit = async () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(prompt?.name || 'Prompt on Prompt Manage')
    await trackShare('reddit')
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank')
  }

  if (loading) {
    return <FullPageLoading text="Loading prompt..." />
  }

  if (error || !prompt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Prompt Not Found
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            This prompt may have been deleted or is not publicly available.
          </p>
          <Link href="/p">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Public Prompts
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {promptSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(promptSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl p-6">
          {/* Header */}
          <div className="mb-10 space-y-6">
            <Link
              href="/p"
              className="flex items-center text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>

            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {prompt.name}
                </h1>
                {prompt.description && (
                  <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                    {prompt.description}
                  </p>
                )}
                {!prompt.description && audienceInfo && (
                  <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                    {audienceInfo.primary}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {isAgentGenerated ? (
                      <>
                        <Bot className="h-4 w-4" />
                        <span>AI Generated</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        <span>Community</span>
                      </>
                    )}
                  </div>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  {prompt.updated_at && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(prompt.updated_at).toLocaleDateString()}</span>
                      </div>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                    </>
                  )}
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>{prompt.view_count.toLocaleString()} views</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-start gap-2">
                {prompt.id && <CopyPromptButton promptId={prompt.id} promptName={prompt.name} />}
                <div onClick={(e) => e.preventDefault()}>
                  {prompt.id && (
                    <UpvoteButton
                      itemId={prompt.id}
                      itemType="prompt"
                      initialUpvoteCount={prompt.upvote_count || 0}
                    />
                  )}
                </div>
                <Button
                  onClick={handleLike}
                  variant="outline"
                  className={isLiked ? 'bg-red-50 text-red-600 dark:bg-red-950/30' : ''}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount > 0 && <span className="mr-1">{likeCount}</span>}
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button onClick={() => setShowShareDialog(true)} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Instructional Header */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              📋 <strong>How to use:</strong> Copy the prompt below, paste it into your AI tool
              (ChatGPT, Claude, etc.), and customize any variables in square brackets.
            </p>
          </div>

          {/* Prompt Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-3">
              <Card className="overflow-hidden border-slate-300 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
                <CardHeader className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Prompt Template
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Click to copy →
                      </span>
                      <CopyButton text={prompt.prompt_text} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap break-words bg-white p-6 font-mono text-sm leading-relaxed text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                      {prompt.prompt_text}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Who is this prompt for? */}
            <div className="min-w-0 lg:col-span-3">
              <Card className="border-muted bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Who is this prompt for?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {audienceInfo?.primary ||
                      `Perfect for anyone looking to ${prompt.name.toLowerCase()} efficiently.`}
                  </p>

                  {audienceInfo?.secondary && (
                    <p className="text-sm italic text-muted-foreground/80">
                      {audienceInfo.secondary}
                    </p>
                  )}

                  {audienceInfo && audienceInfo.personas.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {audienceInfo.personas.map((persona) => (
                        <Badge
                          key={persona}
                          variant="outline"
                          className="border-muted-foreground/20 font-normal"
                        >
                          {persona}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Model Info */}
            {prompt.model && (
              <Card className="gap-2 space-y-0">
                <CardHeader>
                  <CardTitle>Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/prompts/${encodeURIComponent(prompt.model)}`}
                    className="transition-opacity hover:opacity-80"
                  >
                    <Badge variant="secondary" className="cursor-pointer">
                      {prompt.model}
                    </Badge>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <Card className="gap-2 space-y-0">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/p/tags/${encodeURIComponent(tag)}`}
                        className="transition-opacity hover:opacity-80"
                      >
                        <Badge variant="outline" className="cursor-pointer">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card className="gap-2 space-y-0">
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Views</span>
                  <span className="font-medium">{prompt.view_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Upvotes</span>
                  <span className="font-medium">{prompt.upvote_count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-medium">
                    {prompt.inserted_at ? new Date(prompt.inserted_at).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium">
                    {prompt.updated_at ? new Date(prompt.updated_at).toLocaleDateString() : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Derivative Prompts */}
            {prompt.id && <DerivativePrompts promptId={prompt.id} />}
          </div>

          {/* Call-to-Action Section (AI-generated, unique) */}
          {ctaInfo && (
            <div className="mt-12">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:border-purple-900 dark:from-purple-950 dark:to-blue-950">
                <CardContent className="p-8 text-center">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {ctaInfo.text}
                  </h3>
                  {ctaInfo.emphasis && (
                    <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
                      {ctaInfo.emphasis}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    {prompt.id && (
                      <CopyPromptButton promptId={prompt.id} promptName={prompt.name} size="lg" />
                    )}
                    <Link href="/p">
                      <Button size="lg" variant="ghost">
                        Explore More Prompts
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Related Prompts */}
          <div className="mt-12">
            <RelatedPrompts currentPrompt={prompt} />
          </div>

          {/* Share Your Prompts CTA */}
          <div className="mt-12 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 text-center">
            <div className="mb-4">
              <span className="text-4xl">💡</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">
              Inspired by This Prompt? Share Your Own!
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Have you created similar or improved prompts? Share them with our community and help
              other creators discover new possibilities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Share Your Prompts
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="sm" variant="outline">
                  Explore AI Tools
                </Button>
              </Link>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Join 60+ creators</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>Share & discover prompts</span>
              </div>
            </div>
          </div>

          {/* Directory Footer Blurb */}
          <div className="mt-8 text-sm text-muted-foreground">
            <h3 className="mb-2 text-center text-base font-semibold text-foreground">
              About the Prompt Manage Directory
            </h3>
            <p>
              The{' '}
              <Link href="/p" className="underline">
                Public Prompt Directory
              </Link>{' '}
              from{' '}
              <Link href="/" className="underline">
                Prompt Manage
              </Link>{' '}
              features over <span className="font-semibold">{publicCount ?? 325}</span>{' '}
              <span className="font-semibold">prompts</span> for{' '}
              <Link href="/models" className="underline">
                AI chatbots
              </Link>
              , including ChatGPT, Google Gemini, Claude, Grok, and more. This page highlights{' '}
              <span className="font-medium">“{prompt.name}”</span>
              {primaryCategory && <>, a {primaryCategory} prompt</>}
              {relatedTasks.length > 0 && <> that helps with {relatedTasks.join(', ')} tasks</>}.
              {primaryCategory && (
                <>
                  {' '}
                  Explore more{' '}
                  <Link
                    href={`/p/tags/${encodeURIComponent(primaryCategory)}`}
                    className="underline"
                  >
                    {primaryCategory}
                  </Link>{' '}
                  prompts
                </>
              )}{' '}
              or browse the full directory to discover new ways to write, code, brainstorm, and
              create with AI.
              {creatorUsername && (
                <>
                  {' '}
                  View the creator's profile at{' '}
                  <Link href={`/u/${creatorUsername}`} className="underline">
                    /u/{creatorUsername}
                  </Link>
                </>
              )}
              .{' '}
              <Link href="/p" className="underline">
                View all prompts
              </Link>
              .
            </p>
          </div>

          {/* Share Modal */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share this Prompt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button onClick={handleCopyLink} className="flex w-full items-center gap-2">
                  <Share2 className="h-4 w-4" /> Copy Link
                </Button>
                <Button
                  onClick={handleShareToX}
                  className="flex w-full items-center gap-2"
                  variant="outline"
                >
                  <Twitter className="h-4 w-4 text-blue-500" /> Share to X
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
        </div>
      </div>
    </>
  )
}
