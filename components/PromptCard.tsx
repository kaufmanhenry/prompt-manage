'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyButton from '@/components/CopyButton'
import Link from 'next/link'

interface PromptCardProps {
  slug: string
}

interface PublicPrompt {
  id: string
  name: string
  description?: string | null
  prompt_text: string
  model: string
  tags: string[] | null
  slug: string
  view_count?: number | null
}

export function PromptCard({ slug }: PromptCardProps) {
  const [prompt, setPrompt] = useState<PublicPrompt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchPrompt = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('prompts')
          .select('id, name, description, prompt_text, model, tags, slug, view_count')
          .eq('slug', slug)
          .eq('is_public', true)
          .single()
        if (mounted) setPrompt((data as PublicPrompt) || null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPrompt()
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <Card className="p-4">
        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
      </Card>
    )
  }

  if (!prompt) return null

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {prompt.name}
          </h4>
          {prompt.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {prompt.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <CopyButton text={prompt.prompt_text} />
          <Link href={`/p/${prompt.slug}`}>
            <Button size="sm" variant="ghost">Open Prompt →</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">{prompt.model}</Badge>
        {prompt.tags?.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
        ))}
        {prompt.tags && prompt.tags.length > 3 && (
          <Badge variant="outline" className="text-xs">+{prompt.tags.length - 3} more</Badge>
        )}
      </div>
    </Card>
  )
}

export default PromptCard


