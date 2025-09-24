'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/loading'
import { useToast } from '@/components/ui/use-toast'
import { usePromptRouting } from '@/hooks/usePromptRouting'
import { createClient } from '@/utils/supabase/client'

interface CopyPromptButtonProps {
  promptId: string
  promptName: string
  className?: string
  onCopySuccess?: (newPromptId: string) => void
}

export function CopyPromptButton({
  promptId,
  promptName,
  className,
  onCopySuccess,
}: CopyPromptButtonProps) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { navigateToPrompt } = usePromptRouting()
  const router = useRouter()

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await createClient().auth.getSession()
      if (error) throw error
      return session
    },
  })

  const handleCopy = async () => {
    // Check if user is authenticated
    if (!session) {
      // Persist copy intent and initiate Google OAuth
      const redirectAfterLogin = '/auth/copy-prompt'
      localStorage.setItem(
        'pendingPromptCopy',
        JSON.stringify({
          promptId,
          promptName,
          redirectUrl: window.location.href,
        })
      )
      await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${
            process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
          }/auth/callback?redirect=${encodeURIComponent(redirectAfterLogin)}`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/prompts/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_prompt_id: promptId,
          new_name: `${promptName} (Copy)`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to copy prompt')
      }

      setCopied(true)
      toast({
        title: 'Prompt Copied!',
        description: `"${promptName}" has been added to your personal prompts.`,
      })

      // Call the callback if provided, otherwise navigate to the new prompt
      if (onCopySuccess && data.prompt?.id) {
        onCopySuccess(data.prompt.id)
      } else if (data.prompt?.id) {
        // Navigate to the newly copied prompt
        navigateToPrompt(data.prompt.id)
      }
    } catch (error) {
      console.error('Copy prompt error:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to copy prompt',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCopy}
      disabled={loading || copied}
      className={className}
      variant={copied ? 'default' : 'outline'}
    >
      {loading ? (
        <Spinner size="sm" className="mr-2" />
      ) : copied ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {copied ? 'Copied!' : loading ? 'Copying...' : 'Copy to My Prompts'}
    </Button>
  )
}
