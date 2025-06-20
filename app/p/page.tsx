'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PublicPrompt } from '@/lib/schemas/prompt'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CopyButton from '@/components/CopyButton'
import { Search, Eye, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

export default function PublicDirectoryPage() {
  const [prompts, setPrompts] = useState<PublicPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchPublicPrompts()
  }, [sortBy])

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

  const handleCopyPrompt = async (prompt: PublicPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text)
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      })
    } catch (error) {
      console.error('Copy prompt error:', error)
      toast({
        title: "Error",
        description: "Failed to copy prompt.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading public prompts...</p>
        </div>
      </div>
    )
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
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => window.open(`/p/${prompt.slug}`, '_blank')}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold line-clamp-1 flex-1 pr-2">
                  {prompt.name}
                </h3>
                <Badge variant="secondary">{prompt.model}</Badge>
              </div>
              <div className="flex-grow space-y-2">
                {prompt.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {prompt.description}
                  </p>
                )}
                <div className="relative">
                  <pre className="text-sm text-muted-foreground line-clamp-3 bg-gray-50 dark:bg-gray-800/50 rounded-md py-3 pl-3 pr-10">
                    {prompt.prompt_text}
                  </pre>
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(prompt.prompt_text)
                      toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' })
                    }}
                  >
                    <CopyButton text={prompt.prompt_text} />
                  </div>
                </div>
<<<<<<<< HEAD:app/p/page.tsx

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleCopyPrompt(prompt)}
                  >
                    Copy Prompt
                  </Button>
                  <Link href={`/p/${prompt.slug}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
========
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {prompt.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
>>>>>>>> mike:app/directory/page.tsx
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
      </div>
    </div>
  )
} 