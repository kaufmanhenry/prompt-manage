'use client'

import { useState } from 'react'
import { PromptsTable } from '@/components/PromptsTable'
import { CommandPalette } from '@/components/CommandPalette'
import { Sidebar } from '@/components/Sidebar'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    search: '',
    selectedTags: [] as string[],
    selectedModels: [] as string[],
  })

  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Prompt[]
    },
  })

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        prompts={prompts}
        filters={filters}
        onFilterChange={setFilters}
      />
      <div className="flex-1 space-y-6 p-8 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Prompts</h1>
          <CommandPalette />
        </div>
        <PromptsTable prompts={prompts} filters={filters} />
      </div>
    </div>
  )
} 