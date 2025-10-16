'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

interface UseFreeTool Options {
  toolName: string // 'claude-creator', 'cursor-creator', 'optimizer'
}

interface RateLimitInfo {
  allowed: boolean
  count: number
  limit: number
  remaining: number
  resetAt?: string
}

export function useFreeTool({ toolName }: UseFreeToolOptions) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null)
  const [fingerprint, setFingerprint] = useState<string>('')
  const { toast } = useToast()
  const supabase = createClient()

  // Generate browser fingerprint
  useEffect(() => {
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('fingerprint', 2, 2)
        return canvas.toDataURL().slice(-50)
      }
      return `${navigator.userAgent}-${new Date().getTimezoneOffset()}`
    }
    setFingerprint(generateFingerprint())
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    void checkAuth()
  }, [supabase])

  // Check rate limit
  const checkRateLimit = async (): Promise<boolean> => {
    if (isLoggedIn) {
      return true // No rate limit for logged-in users
    }

    try {
      const response = await fetch(
        `/api/free-tool-usage?tool=${encodeURIComponent(toolName)}&fingerprint=${encodeURIComponent(fingerprint)}`
      )
      const data = await response.json()

      if (response.ok) {
        setRateLimit(data)
        return data.allowed
      }

      return false
    } catch (error) {
      console.error('Error checking rate limit:', error)
      return true // Allow on error to avoid blocking users
    }
  }

  // Log usage
  const logUsage = async (promptGenerated: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/free-tool-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          promptGenerated,
          fingerprint
        })
      })

      const data = await response.json()

      if (response.status === 429) {
        toast({
          title: 'Rate Limit Reached',
          description: data.message || 'You\'ve used all 3 free uses. Sign up for unlimited access!',
          variant: 'destructive'
        })
        return false
      }

      if (response.ok) {
        setRateLimit({
          allowed: true,
          count: 3 - (data.remaining || 0),
          limit: 3,
          remaining: data.remaining || 0
        })
        return true
      }

      return false
    } catch (error) {
      console.error('Error logging usage:', error)
      return true // Allow on error
    }
  }

  // Save prompt to library
  const saveToLibrary = async (promptData: {
    name: string
    prompt_text: string
    model: string
    tags?: string[]
    description?: string
  }): Promise<{ success: boolean; promptId?: string }> => {
    // Check if logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Store in sessionStorage and redirect to login
      sessionStorage.setItem('pendingPrompt', JSON.stringify({
        ...promptData,
        toolName
      }))

      toast({
        title: 'Sign in to save',
        description: 'Create a free account to save this prompt to your library.',
      })

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/?redirect=/dashboard'
      }, 1500)

      return { success: false }
    }

    try {
      const response = await fetch('/api/save-free-tool-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promptData,
          toolName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save prompt',
          variant: 'destructive'
        })
        return { success: false }
      }

      toast({
        title: 'Saved!',
        description: 'Prompt saved to your library.',
      })

      return { success: true, promptId: data.prompt?.id }
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to save prompt. Please try again.',
        variant: 'destructive'
      })
      return { success: false }
    }
  }

  return {
    isLoggedIn,
    rateLimit,
    checkRateLimit,
    logUsage,
    saveToLibrary
  }
}

