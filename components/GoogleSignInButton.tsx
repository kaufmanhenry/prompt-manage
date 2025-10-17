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
      const callbackUrl = `${
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : '')
      }/auth/callback?redirect=${encodeURIComponent(redirectPath)}`

      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
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
