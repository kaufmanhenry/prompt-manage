'use client'

import { ArrowRight, Clock, Sparkles, Tag, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PublicPrompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

interface RelatedPromptsProps {
  currentPrompt: PublicPrompt
  maxResults?: number
}

interface RelatedPromptsData {
  tagMatches: PublicPrompt[]
  modelMatches: PublicPrompt[]
  popularPrompts: PublicPrompt[]
}

interface DatabasePrompt {
  id: string
  name: string
  description?: string | null
  prompt_text: string
  model: string
  tags: string[]
  is_public: boolean
  slug?: string | null
  view_count: number
  inserted_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export function RelatedPrompts({ currentPrompt, maxResults = 8 }: RelatedPromptsProps) {
  const [relatedData, setRelatedData] = useState<RelatedPromptsData>({
    tagMatches: [],
    modelMatches: [],
    popularPrompts: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllRelatedPrompts = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Fetch all types of related prompts in parallel
        const [tagMatches, modelMatches, popularPrompts] = await Promise.all([
          // Tag matches
          currentPrompt.tags && currentPrompt.tags.length > 0
            ? supabase
                .from('prompts')
                .select('*')
                .eq('is_public', true)
                .neq('id', currentPrompt.id)
                .overlaps('tags', currentPrompt.tags)
                .order('view_count', { ascending: false })
                .limit(maxResults)
            : Promise.resolve({ data: [] }),

          // Model matches
          supabase
            .from('prompts')
            .select('*')
            .eq('is_public', true)
            .eq('model', currentPrompt.model)
            .neq('id', currentPrompt.id)
            .order('view_count', { ascending: false })
            .limit(maxResults),

          // Popular prompts
          supabase
            .from('prompts')
            .select('*')
            .eq('is_public', true)
            .neq('id', currentPrompt.id)
            .order('view_count', { ascending: false })
            .limit(maxResults),
        ])

        const transformPrompts = (data: DatabasePrompt[] | null): PublicPrompt[] => {
          return (data || []).map((prompt) => ({
            ...prompt,
            description: prompt.description || null,
            is_public: prompt.is_public || false,
            slug: prompt.slug || null,
            view_count: prompt.view_count || 0,
            inserted_at: prompt.inserted_at || prompt.created_at || null,
          })) as PublicPrompt[]
        }

        setRelatedData({
          tagMatches: transformPrompts(tagMatches.data || []),
          modelMatches: transformPrompts(modelMatches.data || []),
          popularPrompts: transformPrompts(popularPrompts.data || []),
        })
      } catch (err) {
        console.error('Error fetching related prompts:', err)
        setError('Failed to load related prompts')
      } finally {
        setLoading(false)
      }
    }

    void fetchAllRelatedPrompts()
  }, [currentPrompt, maxResults])

  const PromptCard = ({ prompt }: { prompt: PublicPrompt }) => (
    <div className="rounded-lg border bg-background p-4 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <Link href={`/p/${prompt.slug}`}>
            <h4 className="truncate text-lg font-medium text-foreground transition-colors hover:text-primary">
              {prompt.name}
            </h4>
          </Link>
          {prompt.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{prompt.description}</p>
          )}
        </div>
        <div className="ml-4 flex items-center gap-2">
          <CopyButton text={prompt.prompt_text} />
          <Link href={`/p/${prompt.slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {prompt.model}
        </Badge>
        {prompt.tags?.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {prompt.tags && prompt.tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{prompt.tags.length - 3} more
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
          <TrendingUp className="h-3 w-3" />
          <span>{prompt.view_count} views</span>
        </div>
        {prompt.updated_at && (
          <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(prompt.updated_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  )

  const EmptyState = ({ message }: { message: string }) => (
    <div className="py-8 text-center">
      <Sparkles className="mx-auto mb-2 h-8 w-8 text-gray-400" />
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return null
  }

  const hasAnyRelatedPrompts =
    relatedData.tagMatches.length > 0 ||
    relatedData.modelMatches.length > 0 ||
    relatedData.popularPrompts.length > 0

  if (!hasAnyRelatedPrompts) {
    return null
  }

  return (
    <div>
      <Tabs defaultValue="tags">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-gray-800 dark:text-white" />
          <h3 className="text-lg font-medium">Related Prompts</h3>
          <div className="flex flex-1 justify-end">
            <TabsList className="">
              <TabsTrigger value="tags">
                <Tag className="mr-2 h-4 w-4" />
                Tags
              </TabsTrigger>
              <TabsTrigger value="model">
                <Sparkles className="mr-2 h-4 w-4" />
                Model
              </TabsTrigger>
              <TabsTrigger value="popular">
                <TrendingUp className="mr-2 h-4 w-4" />
                Popular
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="tags" className="mt-4">
          {relatedData.tagMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedData.tagMatches.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <EmptyState message="No prompts with similar tags found." />
          )}
        </TabsContent>
        <TabsContent value="model" className="mt-4">
          {relatedData.modelMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedData.modelMatches.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <EmptyState message="No prompts with the same model found." />
          )}
        </TabsContent>
        <TabsContent value="popular" className="mt-4">
          {relatedData.popularPrompts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedData.popularPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <EmptyState message="No other popular prompts found." />
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center">
        <Link href="/p">
          <Button variant="outline">
            Browse All Public Prompts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
