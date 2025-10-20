'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

import type { Prompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

const PromptContext = createContext<{ prompts: Prompt[]; isLoading: boolean }>({
  prompts: [],
  isLoading: true,
})

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['allPrompts'],
    queryFn: async () => {
      try {
        const { data, error } = await createClient()
          .from('prompts')
          .select('*')
          .order('updated_at', { ascending: false })
        if (error) {
          console.error('Error fetching prompts:', error)
          return []
        }
        return data as Prompt[]
      } catch (error) {
        console.error('Error in PromptProvider:', error)
        return []
      }
    },
    retry: false, // Disable retries to prevent infinite loops
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  return <PromptContext.Provider value={{ prompts, isLoading }}>{children}</PromptContext.Provider>
}

export function usePrompts() {
  return useContext(PromptContext)
}
