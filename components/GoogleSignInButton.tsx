'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

interface GoogleSignInButtonProps extends React.ComponentProps<typeof Button> {
  redirectPath?: string
}

export function GoogleSignInButton({
  redirectPath = '/dashboard',
  children,
  disabled,
  ...buttonProps
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleClick = async () => {
    setLoading(true)
    try {
      // For localhost, use window.location.origin; for production, use env var
      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`

      // Log for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Google OAuth callback URL:', callbackUrl)
      }

      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })

      if (error) {
        console.error('Google OAuth error:', error)
        toast({
          title: 'Sign-in Error',
          description:
            error.message ||
            'Unable to sign in with Google. Please check your Supabase redirect URL configuration.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      toast({
        title: 'Error',
        description:
          err instanceof Error
            ? err.message
            : 'An error occurred. Please try again or use email sign-in instead.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={disabled || loading} {...buttonProps}>
      {loading ? 'Redirecting…' : (children ?? 'Sign in with Google')}
    </Button>
  )
}
