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
  CommandSeparator,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import { PlusIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
      <CommandInput 
        placeholder="Search prompts..." 
        className="border-none focus:ring-0"
      />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          No prompts found.
        </CommandEmpty>
        <CommandGroup heading="Prompts">
          {prompts.map((prompt: Prompt) => (
            <CommandItem
              key={prompt.id}
              onSelect={() => {
                router.push(`/dashboard?prompt=${prompt.id}`)
              }}
              className="flex items-center gap-2"
            >
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium">{prompt.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {prompt.model}
                  </Badge>
                  {prompt.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              router.push('/dashboard?new=true')
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            <span>Create New Prompt</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 