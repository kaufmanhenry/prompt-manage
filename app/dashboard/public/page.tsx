'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'

import { AddToCollectionDialog } from '@/components/AddToCollectionDialog'
import CopyButton from '@/components/CopyButton'
import { Sidebar } from '@/components/Sidebar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FullPageLoading } from '@/components/ui/loading'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { getModelsByCategory } from '@/lib/models'
import type { Prompt, PublicPrompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

function PublicDirectoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [prompts, setPrompts] = useState<PublicPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get('model') || 'all')
  const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') || 'all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>(
    (searchParams.get('sortBy') as 'recent' | 'popular') || 'recent',
  )
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()
  const initialPage = Number(searchParams.get('page')) || 1
  const [page, setPage] = useState(initialPage)
  const promptsPerPage = 21
  const modelsByCategory = getModelsByCategory()

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [search])

  // Get user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  // Fetch user's prompts for sidebar
  const { data: userPrompts = [], isLoading: isLoadingUserPrompts } = useQuery({
    queryKey: ['prompts', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Prompt[]
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const fetchPublicPrompts = useCallback(async () => {
    try {
      setLoading(true)

      // Build query with server-side filtering
      let query = createClient()
        .from('prompts')
        .select('*', { count: 'exact' })
        .eq('is_public', true)

      // Apply filters
      if (selectedModel !== 'all') {
        query = query.eq('model', selectedModel)
      }

      if (selectedTag !== 'all') {
        query = query.contains('tags', [selectedTag])
      }

      if (debouncedSearch.trim()) {
        query = query.or(`name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`)
      }

      // Apply sorting
      if (sortBy === 'recent') {
        query = query.order('updated_at', { ascending: false })
      } else {
        query = query.order('view_count', { ascending: false })
      }

      // Apply pagination
      const from = (page - 1) * promptsPerPage
      const to = from + promptsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

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
      setTotalCount(count || 0)

      // Fetch available tags separately (cached)
      const { data: tagData } = await createClient()
        .from('prompts')
        .select('tags')
        .eq('is_public', true)
        .limit(1000) // Limit for performance

      const tags = new Set<string>()
      tagData?.forEach((prompt) => {
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
  }, [sortBy, selectedModel, selectedTag, debouncedSearch, page, toast])

  useEffect(() => {
    void fetchPublicPrompts()
  }, [fetchPublicPrompts])

  // Update URL when filters change (debounced to prevent excessive updates)
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (selectedModel !== 'all') params.set('model', selectedModel)
    if (selectedTag !== 'all') params.set('tag', selectedTag)
    if (sortBy !== 'recent') params.set('sortBy', sortBy)
    if (page > 1) params.set('page', page.toString())

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newUrl, { scroll: false })
  }, [debouncedSearch, selectedModel, selectedTag, sortBy, page, pathname, router])

  const filteredPrompts = prompts

  const totalPages = Math.ceil(totalCount / promptsPerPage)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page when searching
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    setPage(1)
  }

  const handleTagChange = (value: string) => {
    setSelectedTag(value)
    setPage(1)
  }

  const handleSortChange = (value: 'recent' | 'popular') => {
    setSortBy(value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Scroll the main content area to top
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isLoading={isLoadingUserPrompts}
        prompts={userPrompts}
        selectedPromptId={null}
        onSelectPrompt={(id) => router.push(`/dashboard/prompts?prompt=${id}`)}
        session={session}
        currentPage="public"
      />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Public Directory</h1>
            <p className="text-muted-foreground">
              Discover and use AI prompts shared by our community
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search prompts..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Model Filter */}
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by model" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  <SelectGroup>
                    <SelectLabel>All Models</SelectLabel>
                    <SelectItem value="all">All Models</SelectItem>
                  </SelectGroup>
                  {Object.entries(modelsByCategory).map(
                    ([category, models]) =>
                      models.length > 0 && (
                        <SelectGroup key={category}>
                          <SelectLabel>
                            {category === 'LLM' && 'Language Models'}
                            {category === 'Music' && 'Music Generation'}
                            {category === 'Video' && 'Video Generation'}
                            {category === 'Image' && 'Image Generation'}
                            {category === 'Voice' && 'Voice Synthesis'}
                            {category === 'Code' && 'Code Assistants'}
                          </SelectLabel>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ),
                  )}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              <Select value={selectedTag} onValueChange={handleTagChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  <SelectGroup>
                    <SelectLabel>All Tags</SelectLabel>
                    <SelectItem value="all">All Tags</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Popular Tags</SelectLabel>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Most Recent
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredPrompts.length} of {totalCount} prompts
              {search && ` for "${search}"`}
              {selectedModel !== 'all' && ` using ${selectedModel}`}
              {selectedTag !== 'all' && ` tagged with "${selectedTag}"`}
            </div>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="mb-3 h-6 w-3/4" />
                  <Skeleton className="mb-3 h-16 w-full" />
                  <Skeleton className="mb-2 h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                </Card>
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                No prompts found matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="group relative flex h-full flex-col p-4 transition-all hover:border-primary hover:shadow-md"
                  >
                    <Link href={`/p/${prompt.slug}`} className="flex-1">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary">
                          {prompt.name}
                        </h3>
                        <div className="ml-2 flex-shrink-0">
                          <CopyButton text={prompt.prompt_text} />
                        </div>
                      </div>

                      {prompt.description && (
                        <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                          {prompt.description}
                        </p>
                      )}
                    </Link>

                    {/* Action Bar - Not clickable, separate from prompt card */}
                    <div
                      className="mt-3 flex items-center justify-between border-t pt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-wrap gap-2">
                        {/* Model */}
                        {prompt.model && (
                          <Link
                            href={`/prompts/${encodeURIComponent(prompt.model)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="transition-opacity hover:opacity-80"
                          >
                            <Badge variant="secondary" className="ml-2 cursor-pointer">
                              {prompt.model}
                            </Badge>
                          </Link>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags?.slice(0, 3).map((tag) => (
                            <Link
                              key={tag}
                              href={`/p/tags/${encodeURIComponent(tag)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="transition-opacity hover:opacity-80"
                            >
                              <Badge variant="outline" className="cursor-pointer">
                                {tag}
                              </Badge>
                            </Link>
                          ))}
                          {prompt.tags && prompt.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{prompt.tags.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{prompt.view_count || 0} views</span>
                          <span>
                            {prompt.inserted_at
                              ? new Date(prompt.inserted_at).toLocaleDateString()
                              : 'Recently'}
                          </span>
                        </div>
                      </div>
                      {prompt.id && (
                        <AddToCollectionDialog promptId={prompt.id} promptName={prompt.name} />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`rounded-md px-3 py-2 text-sm font-medium ${
                            pageNum === page
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPublicDirectoryPage() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <PublicDirectoryContent />
    </Suspense>
  )
}
