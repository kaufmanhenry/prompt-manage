'use client'

import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'

const PromptContext = createContext<{ prompts: Prompt[]; isLoading: boolean }>({ prompts: [], isLoading: true })

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
  return (
    <PromptContext.Provider value={{ prompts, isLoading }}>
      {children}
    </PromptContext.Provider>
  )
}

export function usePrompts() {
  return useContext(PromptContext)
} 