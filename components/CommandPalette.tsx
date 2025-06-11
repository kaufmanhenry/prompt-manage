'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'

export function CommandPalette() {
  const router = useRouter()
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
    <CommandDialog>
      <CommandInput placeholder="Search prompts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Prompts">
          {prompts.map((prompt: Prompt) => (
            <CommandItem
              key={prompt.id}
              onSelect={() => {
                router.push(`/dashboard?prompt=${prompt.id}`)
              }}
            >
              {prompt.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 