'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'

import { BlackFridayBanner } from '@/components/BlackFridayBanner'
import CopyButton from '@/components/CopyButton'
import { EmailSignInButton } from '@/components/EmailSignInButton'
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
import { getModelsByCategory } from '@/lib/models'
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

      if (result.error) {
        // Handle specific error cases
        if (response.status === 503) {
          console.warn(
            'Database not configured - this is expected in development without .env.local',
          )
          setPrompts([])
          setTotalCount(0)
          return // Don't show error toast for known configuration issue
        }
        throw new Error(result.error)
      }

      setPrompts(result.prompts || [])
      setTotalCount(result.totalCount || 0)

      // Fetch available tags separately (cached) - skip if no Supabase
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
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
          // Silently fail if Supabase not configured
          console.warn('Could not fetch tags:', error)
          setAvailableTags([])
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching public prompts:', error)
      }
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
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:p-6">
        {/* Black Friday Banner */}
        {/* Black Friday Banner */}
        <BlackFridayBanner source="public_prompts" />

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
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/prompts/${encodeURIComponent(prompt.model!)}`)
                          }}
                          className="transition-opacity hover:opacity-80"
                        >
                          <Badge variant="secondary" className="cursor-pointer">
                            {prompt.model}
                          </Badge>
                        </button>
                      )}

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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{prompt.view_count || 0} views</span>
                        <span>
                          {prompt.inserted_at
                            ? new Date(prompt.inserted_at).toLocaleDateString()
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
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
                        className={`rounded-md px-3 py-2 text-sm font-medium ${pageNum === page
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
        <div className="mt-16 rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Share Your Best Prompts with the Community
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-7 text-gray-600 dark:text-gray-400">
            Share your AI prompts with thousands of creators and get discovered. Build your
            reputation as a prompt engineer while helping others achieve better results. Join our
            community of professionals sharing cutting-edge prompts for ChatGPT, Claude, Gemini,
            Midjourney, Suno, Runway, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Share Your Prompts
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <GoogleSignInButton />
                <EmailSignInButton
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  or email
                </EmailSignInButton>
              </div>
            )}
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-800"
            >
              Explore AI Tools
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Join 60+ creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Share & discover prompts</span>
            </div>
          </div>
        </div>

        {/* Sign up CTA */}
        {!session && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Ready to create your own prompts?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Join thousands of users who are organizing their AI prompts and boosting their
              productivity.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <GoogleSignInButton size="lg" className="px-6 py-3">
                Sign in with Google
              </GoogleSignInButton>
              <EmailSignInButton
                variant="ghost"
                size="sm"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                or sign in with email
              </EmailSignInButton>
            </div>
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
