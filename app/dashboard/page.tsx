'use client'

import { useState } from 'react'
import { PromptsTable } from '@/components/PromptsTable'
import { CommandPalette } from '@/components/CommandPalette'
import { Sidebar } from '@/components/Sidebar'
import { PromptForm } from '@/components/PromptForm'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import { Plus, Globe, Lock } from 'lucide-react'
import Link from 'next/link'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionsTable } from '@/components/CollectionsTable'

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    search: '',
    selectedTags: [] as string[],
    selectedModels: [] as string[],
  })
  const [showNewPromptForm, setShowNewPromptForm] = useState(false)

  const { data: prompts = [] } = useQuery({
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

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        prompts={prompts}
        filters={filters}
        onFilterChange={setFilters}
      />
      <div className="flex-1 space-y-6 p-8 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Prompts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your private and shared prompts
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/directory">
              <Button variant="outline" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Browse Directory
              </Button>
            </Link>
            <Button 
              onClick={() => setShowNewPromptForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Prompt
            </Button>
            <CommandPalette />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Private</span>
            </div>
            <p className="text-2xl font-bold mt-1">{privatePrompts.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Public</span>
            </div>
            <p className="text-2xl font-bold mt-1">{publicPrompts.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{prompts.length}</p>
          </div>
        </div>

        <Tabs defaultValue="prompts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          <TabsContent value="prompts">
            <PromptsTable prompts={prompts} filters={filters} />
          </TabsContent>
          <TabsContent value="collections">
            <CollectionsTable />
          </TabsContent>
        </Tabs>
      </div>
      
      <PromptForm
        open={showNewPromptForm}
        onOpenChange={setShowNewPromptForm}
      />
    </div>
  )
} 