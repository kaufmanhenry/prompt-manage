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
  return <PromptContext.Provider value={{ prompts, isLoading }}>{children}</PromptContext.Provider>
}

export function usePrompts() {
  return useContext(PromptContext)
}
