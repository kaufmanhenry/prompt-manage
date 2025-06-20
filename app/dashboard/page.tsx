'use client'

import { useState } from 'react'
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
  const [filters, setFilters] = useState({
    search: '',
    selectedTags: [] as string[],
    selectedModels: [] as string[],
  })
  const [showNewPromptForm, setShowNewPromptForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .order('updated_at', { ascending: false })
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
      
      return transformedData as Prompt[]
    },
  })

  const privatePrompts = prompts.filter(p => !p.is_public)
  const publicPrompts = prompts.filter(p => p.is_public)
  const totalViews = publicPrompts.reduce((sum, p) => sum + (p.view_count || 0), 0)

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
  }

  const handleCloseEditForm = () => {
    setEditingPrompt(null)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar
        prompts={prompts}
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
                  onClick={() => setShowNewPromptForm(true)}
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
                    {isLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      prompts.length
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
                    {isLoading ? (
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
                    {isLoading ? (
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
                    {isLoading ? (
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
                    {isLoading ? 'Loading...' : `${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                
                {prompts.length > 0 && (
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
              prompts={prompts} 
              filters={filters} 
              onEditPrompt={handleEditPrompt}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
      
      {/* Forms */}
      <PromptForm
        open={showNewPromptForm}
        onOpenChange={setShowNewPromptForm}
      />
      <PromptForm
        prompt={editingPrompt}
        open={!!editingPrompt}
        onOpenChange={handleCloseEditForm}
      />
    </div>
  )
} 