'use client'

import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

import { logger } from '@/lib/logger'
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
        const supabase = createClient()

        // Get current user session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          logger.error('Error getting session in PromptProvider:', sessionError)
          return []
        }

        // If no session, return empty array (not logged in)
        if (!session?.user?.id) {
          return []
        }

        // Fetch user's prompts only
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })

        if (error) {
          logger.error('Error fetching prompts:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          })
          return []
        }

        return (data as Prompt[]) || []
      } catch (error) {
        logger.error('Error in PromptProvider:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error instanceof Error ? error.stack : String(error),
        })
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
