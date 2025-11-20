'use client'

import { useEffect, useState } from 'react'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { createClient } from '@/utils/supabase/client'

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
    void fetchPrompt()
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <Card className="p-4">
        <div className="mb-2 h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      </Card>
    )
  }

  if (!prompt) return null

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
            {prompt.name}
          </h4>
          {prompt.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {prompt.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex items-center gap-2">
          <CopyButton text={prompt.prompt_text} />
          <Link href={`/p/${prompt.slug}`}>
            <Button size="sm" variant="ghost">
              Open Prompt →
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {prompt.model}
        </Badge>
        {prompt.tags?.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {prompt.tags && prompt.tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{prompt.tags.length - 3} more
          </Badge>
        )}
      </div>
    </Card>
  )
}

export default PromptCard
