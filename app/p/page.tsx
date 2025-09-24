'use client'

import { Search, TrendingUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FullPageLoading } from '@/components/ui/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { supportedModels } from '@/lib/models'
import type { PublicPrompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

function PublicDirectoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [prompts, setPrompts] = useState<PublicPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get('model') || 'all')
  const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') || 'all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>(
    (searchParams.get('sortBy') as 'recent' | 'popular') || 'recent',
  )
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const { toast } = useToast()
  const initialPage = Number(searchParams.get('page')) || 1
  const [page, setPage] = useState(initialPage)
  const promptsPerPage = 21

  const fetchPublicPrompts = useCallback(async () => {
    try {
      let query = createClient().from('prompts').select('*').eq('is_public', true)

      if (sortBy === 'recent') {
        query = query.order('updated_at', { ascending: false })
      } else {
        query = query.order('view_count', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error

      // Transform data to match the new schema with fallbacks
      const transformedData = (data || []).map((prompt) => ({
        ...prompt,
        description: prompt.description || null,
        is_public: prompt.is_public || false,
        slug: prompt.slug || null,
        view_count: prompt.view_count || 0,
        inserted_at: prompt.inserted_at || prompt.created_at || null,
      }))

      setPrompts(transformedData as PublicPrompt[])

      // Extract unique tags
      const tags = new Set<string>()
      transformedData?.forEach((prompt) => {
        prompt.tags?.forEach((tag: string) => tags.add(tag))
      })
      setAvailableTags(Array.from(tags))
    } catch (error) {
      console.error('Error fetching public prompts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load public prompts.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [sortBy, toast])

  useEffect(() => {
    fetchPublicPrompts()
  }, [sortBy, fetchPublicPrompts])

  // Sync filters/page with URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedModel !== 'all') params.set('model', selectedModel)
    if (selectedTag !== 'all') params.set('tag', selectedTag)
    if (sortBy !== 'recent') params.set('sortBy', sortBy)
    if (page > 1) params.set('page', String(page))
    router.replace(`${pathname}?${params.toString()}`)
  }, [search, selectedModel, selectedTag, sortBy, page, pathname, router])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [search, selectedModel, selectedTag, sortBy])

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(search.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(search.toLowerCase()) ||
      prompt.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))

    const matchesModel = selectedModel === 'all' || prompt.model === selectedModel
    const matchesTag = selectedTag === 'all' || prompt.tags?.includes(selectedTag)

    return matchesSearch && matchesModel && matchesTag
  })

  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage)
  const paginatedPrompts = filteredPrompts.slice((page - 1) * promptsPerPage, page * promptsPerPage)

  if (loading) {
    return <FullPageLoading text="Loading public prompts..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            Public Prompt Directory
          </h1>
          <p className="text-muted-foreground">Discover and use prompts shared by the community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search prompts by name, description, content, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {supportedModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value: 'recent' | 'popular') => setSortBy(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            {filteredPrompts.length} prompt
            {filteredPrompts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="flex h-full cursor-pointer flex-col p-4 transition-shadow hover:shadow-sm"
              onClick={() => router.push(`/p/${prompt.slug}`)}
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 flex-1 text-lg font-semibold">{prompt.name}</h3>
                  </div>
                  {prompt.description && (
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {prompt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="ml-2">
                      {prompt.model}
                    </Badge>
                    {prompt.tags?.slice(0, 2).map((tag) => (
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

                {/* Stats for public prompts */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{prompt.view_count} views</span>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CopyButton text={prompt.prompt_text} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No prompts found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-8">
            <button
              className="rounded border bg-white px-3 py-1 disabled:opacity-50 dark:bg-gray-800"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="rounded border bg-white px-3 py-1 disabled:opacity-50 dark:bg-gray-800"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PublicDirectoryPage() {
  return (
    <Suspense fallback={<FullPageLoading text="Loading public prompts..." />}>
      <PublicDirectoryContent />
    </Suspense>
  )
}
