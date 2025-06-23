'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PromptsTable } from '@/components/PromptsTable'
import { CommandPalette } from '@/components/CommandPalette'
import { Sidebar } from '@/components/Sidebar'
import { PromptForm } from '@/components/PromptForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import { Plus, Globe, Lock, FileText, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    search: '',
    selectedTags: [] as string[],
    selectedModels: [] as string[],
  })
  const [showNewPromptForm, setShowNewPromptForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [page, setPage] = useState(1)
  const promptsPerPage = 21

  // Fetch session (user)
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await createClient().auth.getSession()
      if (error) throw error
      return session
    },
  })

  // Fetch prompts
  const { data: prompts = [], isLoading: isPromptsLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      const transformedData = (data || []).map(prompt => ({
        ...prompt,
        description: prompt.description || null,
        is_public: prompt.is_public || false,
        slug: prompt.slug || null,
        view_count: prompt.view_count || 0,
        inserted_at: prompt.inserted_at || prompt.created_at || null,
      }))
      return transformedData as Prompt[]
    },
  })

  // Only show prompts created by the current user
  const userPrompts = session?.user?.id
    ? prompts.filter(p => p.user_id === session.user.id)
    : []

  // Handle URL parameters (move above early returns)
  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    const newParam = searchParams.get('new')
    if (promptParam) {
      // Find the prompt by slug or ID
      const prompt = userPrompts.find(p => 
        p.slug === promptParam || 
        p.id === promptParam ||
        p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24) === promptParam
      )
      if (prompt) {
        setEditingPrompt(prompt)
      }
    } else if (newParam === 'true') {
      setShowNewPromptForm(true)
    }
  }, [searchParams, userPrompts])

  // Loading state for session or prompts
  if (isSessionLoading || isPromptsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // If not logged in, redirect or show message
  if (!session?.user?.id) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return <div className="flex items-center justify-center h-screen">Please log in to view your prompts.</div>
  }

  const privatePrompts = userPrompts.filter(p => !p.is_public)
  const publicPrompts = userPrompts.filter(p => p.is_public)
  const totalViews = publicPrompts.reduce((sum, p) => sum + (p.view_count || 0), 0)

  const filteredPrompts = userPrompts.filter((prompt) => {
    const matchesSearch = !filters.search || 
      prompt.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(filters.search.toLowerCase());
    const matchesTags = filters.selectedTags.length === 0 || 
      filters.selectedTags.some(tag => prompt.tags?.includes(tag));
    const matchesModels = filters.selectedModels.length === 0 || 
      filters.selectedModels.includes(prompt.model);
    return matchesSearch && matchesTags && matchesModels;
  });

  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const paginatedPrompts = filteredPrompts.slice((page - 1) * promptsPerPage, page * promptsPerPage);

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    // Update URL with prompt parameter
    const promptSlug = prompt.slug || prompt.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24)
    router.push(`/dashboard?prompt=${promptSlug}`)
  }

  const handleCloseEditForm = () => {
    setEditingPrompt(null)
    // Clear URL parameter
    router.push('/dashboard')
  }

  const handleNewPrompt = () => {
    setShowNewPromptForm(true)
    router.push('/dashboard?new=true')
  }

  const handleCloseNewForm = () => {
    setShowNewPromptForm(false)
    router.push('/dashboard')
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      selectedTags: [],
      selectedModels: [],
    })
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar
        prompts={userPrompts}
        filters={filters}
        onFilterChange={setFilters}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Static Header */}
          <div className="px-6 pt-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                      My Prompts
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your private and shared prompts
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href="/p">
                  <Button variant="outline" className="flex items-center gap-2 shadow-sm">
                    <Globe className="h-4 w-4" />
                    Browse Public
                  </Button>
                </Link>
                <Button 
                  onClick={handleNewPrompt}
                  className="flex items-center gap-2 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  New Prompt
                </Button>
                <CommandPalette />
              </div>
            </div>

            {/* Stats Overview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards... */}
              <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Prompts
                  </CardTitle>
                  <FileText className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isPromptsLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      userPrompts.length
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    All your prompts
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Private
                  </CardTitle>
                  <Lock className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isPromptsLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      privatePrompts.length
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Personal prompts
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Public
                  </CardTitle>
                  <Globe className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isPromptsLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      publicPrompts.length
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Shared prompts
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Views
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isPromptsLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      totalViews.toLocaleString()
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Public prompt views
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Prompts Section Header */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Your Prompts
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isPromptsLoading ? 'Loading...' : `${filteredPrompts.length} prompt${filteredPrompts.length !== 1 ? 's' : ''} found`}
                  </p>
                </div>
                
                {userPrompts.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Filtered by:</span>
                    {filters.search && (
                      <Badge variant="secondary" className="text-xs">
                        Search: &quot;{filters.search}&quot;
                      </Badge>
                    )}
                    {filters.selectedTags.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {filters.selectedTags.length} tag{filters.selectedTags.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {filters.selectedModels.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {filters.selectedModels.length} model{filters.selectedModels.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Scrollable Prompts Table */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
            <PromptsTable 
              prompts={paginatedPrompts} 
              filters={filters} 
              onEditPrompt={handleEditPrompt}
              onNewPrompt={handleNewPrompt}
              onClearFilters={handleClearFilters}
              isLoading={isPromptsLoading}
            />
          </div>
          
          {/* Pagination Controls - Only show when not editing a prompt */}
          {!editingPrompt && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-6">
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
        </main>
      </div>
      
      {/* Forms */}
      <PromptForm
        open={showNewPromptForm}
        onOpenChange={handleCloseNewForm}
      />
      <PromptForm
        prompt={editingPrompt}
        open={!!editingPrompt}
        onOpenChange={(open) => {
          if (!open) handleCloseEditForm();
        }}
      />
    </div>
  )
} 