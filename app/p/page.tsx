'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PublicPrompt } from '@/lib/schemas/prompt'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CopyButton from '@/components/CopyButton'
import { Search, TrendingUp } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { FullPageLoading } from '@/components/ui/loading'

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
    (searchParams.get('sortBy') as 'recent' | 'popular') || 'recent'
  )
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const { toast } = useToast()
  const initialPage = Number(searchParams.get('page')) || 1
  const [page, setPage] = useState(initialPage)
  const promptsPerPage = 21

  const fetchPublicPrompts = async () => {
    try {
      let query = createClient()
        .from('prompts')
        .select('*')
        .eq('is_public', true)

      if (sortBy === 'recent') {
        query = query.order('updated_at', { ascending: false })
      } else {
        query = query.order('view_count', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error

      // Transform data to match the new schema with fallbacks
      const transformedData = (data || []).map(prompt => ({
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
      transformedData?.forEach(prompt => {
        prompt.tags?.forEach((tag: string) => tags.add(tag))
      })
      setAvailableTags(Array.from(tags))
    } catch (error) {
      console.error('Error fetching public prompts:', error)
      toast({
        title: "Error",
        description: "Failed to load public prompts.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      prompt.name.toLowerCase().includes(search.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(search.toLowerCase()) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Public Prompt Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and use prompts shared by the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                <SelectItem value="mistral-large">Mistral Large</SelectItem>
                <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                <SelectItem value="mistral-small">Mistral Small</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: 'recent' | 'popular') => setSortBy(value)}>
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
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => router.push(`/p/${prompt.slug}`)}
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1 flex-1">{prompt.name}</h3>
                    <Badge variant="secondary" className="ml-2">{prompt.model}</Badge>
                  </div>
                  {prompt.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {prompt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                    {prompt.tags && prompt.tags.length > 2 && (
                      <Badge variant="outline">+{prompt.tags.length - 2}</Badge>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <pre className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.prompt_text}
                  </pre>
                </div>
                
                {/* Stats for public prompts */}
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{prompt.view_count} views</span>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
                  <CopyButton text={prompt.prompt_text} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No prompts found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-8">
            <button
              className="px-3 py-1 rounded border bg-white dark:bg-gray-800 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded border bg-white dark:bg-gray-800 disabled:opacity-50"
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