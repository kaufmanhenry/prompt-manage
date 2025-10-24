'use client'

import { useQuery } from '@tanstack/react-query'
import { Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'

import CopyButton from '@/components/CopyButton'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
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
import { useToast } from '@/components/ui/use-toast'
import { getModelsByCompany } from '@/lib/models'
import type { PublicPrompt } from '@/lib/schemas/prompt'
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
  const modelsByCompany = getModelsByCompany()

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

  const fetchPublicPrompts = useCallback(async () => {
    try {
      setLoading(true)

      // Build query parameters
      const params = new URLSearchParams()
      if (debouncedSearch.trim()) params.set('search', debouncedSearch)
      if (selectedModel !== 'all') params.set('model', selectedModel)
      if (selectedTag !== 'all') params.set('tag', selectedTag)
      if (sortBy !== 'recent') params.set('sortBy', sortBy)
      params.set('page', page.toString())
      params.set('limit', promptsPerPage.toString())

      const response = await fetch(`/api/prompts/public?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      setPrompts(result.prompts || [])
      setTotalCount(result.totalCount || 0)

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
    // Use shallow routing to prevent page refresh
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <FullPageLoading />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
            Public Prompt Directory
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and use AI prompts shared by our community. Find prompts for ChatGPT, Claude,
            Gemini, and more.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
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
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Models</SelectLabel>
                  <SelectItem value="all">All Models</SelectItem>
                </SelectGroup>
                {Object.entries(modelsByCompany).map(([company, models]) => (
                  <SelectGroup key={company}>
                    <SelectLabel>{company}</SelectLabel>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={handleTagChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Tags</SelectLabel>
                  <SelectItem value="all">All Tags</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Popular Tags</SelectLabel>
                  {availableTags.slice(0, 20).map((tag) => (
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
                    <TrendingUp className="h-4 w-4" />
                    Most Recent
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
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
        {filteredPrompts.length === 0 ? (
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
                <Link key={prompt.id} href={`/p/${prompt.slug}`}>
                  <Card className="group relative flex h-full cursor-pointer flex-col p-4 transition-all hover:border-primary hover:shadow-md">
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

                    <div className="mt-auto space-y-2">
                      {/* Model */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/prompts/${encodeURIComponent(prompt.model)}`)
                        }}
                        className="transition-opacity hover:opacity-80"
                      >
                        <Badge variant="secondary" className="ml-2 cursor-pointer">
                          {prompt.model}
                        </Badge>
                      </button>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags?.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/p/tags/${encodeURIComponent(tag)}`)
                            }}
                            className="transition-opacity hover:opacity-80"
                          >
                            <Badge variant="outline" className="cursor-pointer">
                              {tag}
                            </Badge>
                          </button>
                        ))}
                        {prompt.tags && prompt.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{prompt.tags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{prompt.view_count || 0} views</span>
                        <span>
                          {prompt.inserted_at
                            ? new Date(prompt.inserted_at).toLocaleDateString()
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
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

        {/* Share Your Prompts CTA */}
        <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 text-center">
          <div className="mb-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Share Your Best Prompts with the Community
          </h2>
          <p className="mb-6 text-muted-foreground">
            Have you created amazing prompts that others would love? Share them with our community
            and help fellow creators discover new possibilities. Join thousands of prompt engineers
            building the future of AI together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <button className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90">
                  Share Your Prompts
                </button>
              </Link>
            ) : (
              <GoogleSignInButton />
            )}
            <Link href="/tools">
              <button className="rounded-lg border border-gray-300 px-6 py-3 text-foreground hover:bg-accent dark:border-gray-600">
                Explore AI Tools
              </button>
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Join 40+ creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Share & discover prompts</span>
            </div>
          </div>
        </div>

        {/* Sign up CTA */}
        {!session && (
          <div className="mt-8 rounded-lg bg-primary/10 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Ready to create your own prompts?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Join thousands of users who are organizing their AI prompts and boosting their
              productivity.
            </p>
            <GoogleSignInButton />
          </div>
        )}
      </div>
    </div>
  )
}

export default function PublicDirectoryPage() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <PublicDirectoryContent />
    </Suspense>
  )
}
