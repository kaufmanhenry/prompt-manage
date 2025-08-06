  'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Check, ArrowRight } from 'lucide-react'
import { FullPageLoading } from '@/components/ui/loading'

interface PendingPromptCopy {
  promptId: string
  promptName: string
  redirectUrl: string
}

export default function CopyPromptPage() {
  const [loading, setLoading] = useState(true)
  const [, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

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

  useEffect(() => {
    const handlePromptCopy = async () => {
      if (!session) {
        router.push('/dashboard')
        return
      }

      const pendingCopy = localStorage.getItem('pendingPromptCopy')
      if (!pendingCopy) {
        router.push('/dashboard')
        return
      }

      try {
        const { promptId, promptName, redirectUrl }: PendingPromptCopy = JSON.parse(pendingCopy)
        
        // Copy the prompt
        const response = await fetch('/api/prompts/copy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_prompt_id: promptId,
            new_name: `${promptName} (Copy)`
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to copy prompt')
        }

        setCopied(true)
        toast({
          title: "Prompt Copied!",
          description: `"${promptName}" has been added to your personal prompts.`,
        })

        // Clear the pending copy from localStorage
        localStorage.removeItem('pendingPromptCopy')

        // Redirect after a short delay to show the success state
        setTimeout(() => {
          router.push(redirectUrl)
        }, 2000)

      } catch (error) {
        console.error('Copy prompt error:', error)
        setError(error instanceof Error ? error.message : 'Failed to copy prompt')
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to copy prompt',
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    handlePromptCopy()
  }, [session, router, toast])

  if (loading) {
    return <FullPageLoading text="Copying prompt to your library..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Check className="h-6 w-6 text-green-500" />
            Prompt Saved!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The prompt has been successfully added to your personal library.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 