'use client'

import { LinkIcon, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingText } from '@/components/ui/loading'
import { createClient } from '@/utils/supabase/client'

interface DerivativePromptsProps {
  promptId: string
}

interface DerivativePrompt {
  id: string
  name: string
  user_id: string
  created_at: string
}

export function DerivativePrompts({ promptId }: DerivativePromptsProps) {
  const [derivatives, setDerivatives] = useState<DerivativePrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDerivatives = async () => {
      try {
        const { data, error } = await createClient().rpc('get_derivative_prompts', {
          prompt_id: promptId,
        })

        if (error) {
          console.error('Error fetching derivatives:', error)
          setError('Failed to load derivative prompts')
          return
        }

        setDerivatives(data || [])
      } catch (err) {
        console.error('Error fetching derivatives:', err)
        setError('Failed to load derivative prompts')
      } finally {
        setLoading(false)
      }
    }

    void fetchDerivatives()
  }, [promptId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Derivative Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingText text="Loading..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return null // Don't show error state, just hide the component
  }

  if (derivatives.length === 0) {
    return null // Don't show if no derivatives
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          Derivative Prompts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>
              {derivatives.length} user{derivatives.length !== 1 ? 's' : ''} have copied this prompt
            </span>
          </div>

          <div className="space-y-2">
            {derivatives.slice(0, 3).map((derivative) => (
              <div key={derivative.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-gray-700 dark:text-gray-300">{derivative.name}</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(derivative.created_at).toLocaleDateString()}
                </Badge>
              </div>
            ))}

            {derivatives.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{derivatives.length - 3} more derivative
                {derivatives.length - 3 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
