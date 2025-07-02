'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PublicPrompt } from '@/lib/schemas/prompt'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyButton from '@/components/CopyButton'
import { CopyPromptButton } from '@/components/CopyPromptButton'
import { RelatedPrompts } from '@/components/RelatedPrompts'
import { DerivativePrompts } from '@/components/DerivativePrompts'
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  TrendingUp,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FullPageLoading } from '@/components/ui/loading'

interface PublicPromptPageClientProps {
  params: {
    slug: string
  }
}

export function PublicPromptPageClient({
  params,
}: PublicPromptPageClientProps) {
  const [prompt, setPrompt] = useState<PublicPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [showShareDialog, setShowShareDialog] = useState(false)

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

      // Increment view count (only if the function exists)
      try {
        await createClient().rpc('increment_prompt_views', {
          prompt_id: data.id,
        })
      } catch (viewError) {
        console.error('View count increment error:', viewError)
      }
    } catch (error) {
      console.error('Prompt fetch error:', error)
      setError('Failed to load prompt')
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  useEffect(() => {
    fetchPrompt()
  }, [params.slug, fetchPrompt])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
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

  const handleShareToX = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(prompt?.name || 'Check out this prompt!')
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank'
    )
  }

  const handleShareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(prompt?.name || 'Prompt on Prompt Manage')
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      '_blank'
    )
  }

  const handleShareToFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const handleShareToReddit = () => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(prompt?.name || 'Prompt on Prompt Manage')
    window.open(
      `https://www.reddit.com/submit?url=${url}&title=${title}`,
      '_blank'
    )
  }

  if (loading) {
    return <FullPageLoading text="Loading prompt..." />
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/p">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {prompt.name}
              </h1>
              {prompt.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {prompt.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1 bg-input/70 px-2 py-1 rounded-lg">
                  <User className="h-4 w-4" />
                  <span>Shared by Community</span>
                </div>
                {prompt.updated_at && (
                  <div className="flex items-center gap-1 bg-input/70 px-2 py-1 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated {new Date(prompt.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-input/70 px-2 py-1 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                  <span>{prompt.view_count} views</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {prompt.id && (
                <CopyPromptButton
                  promptId={prompt.id}
                  promptName={prompt.name}
                />
              )}
              <Button
                onClick={() => setShowShareDialog(true)}
                variant="outline"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3 min-w-0">
            <Card className="space-y-0 gap-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Prompt</span>
                  <CopyButton text={prompt.prompt_text} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent p-4 rounded-lg">
                  <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-words">
                    {prompt.prompt_text}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Info */}
          <Card className="space-y-0 gap-2">
            <CardHeader>
              <CardTitle>Model</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                {prompt.model}
              </Badge>
            </CardContent>
          </Card>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <Card className="space-y-0 gap-2">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card className="space-y-0 gap-2">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Views</span>
                <span className="font-medium">{prompt.view_count}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Created
                </span>
                <span className="font-medium">
                  {prompt.inserted_at
                    ? new Date(prompt.inserted_at).toLocaleDateString()
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="font-medium">
                  {prompt.updated_at
                    ? new Date(prompt.updated_at).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Derivative Prompts */}
          {prompt.id && <DerivativePrompts promptId={prompt.id} />}
        </div>

        {/* Related Prompts */}
        <div className="mt-12">
          <RelatedPrompts currentPrompt={prompt} />
        </div>

        {/* Share Modal */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share this Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" /> Copy Link
              </Button>
              <Button
                onClick={handleShareToX}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Twitter className="h-4 w-4 text-blue-500" /> Share to X
              </Button>
              <Button
                onClick={handleShareToLinkedIn}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Linkedin className="h-4 w-4 text-blue-700" /> Share to LinkedIn
              </Button>
              <Button
                onClick={handleShareToFacebook}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Facebook className="h-4 w-4 text-blue-600" /> Share to Facebook
              </Button>
              <Button
                onClick={handleShareToReddit}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Share2 className="h-4 w-4 text-orange-500" /> Share to Reddit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
