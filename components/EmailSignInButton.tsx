'use client'

import { Mail } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { logger } from '@/lib/logger'
import { createClient } from '@/utils/supabase/client'

interface EmailSignInButtonProps extends React.ComponentProps<typeof Button> {
  redirectPath?: string
}

export function EmailSignInButton({
  redirectPath = '/dashboard',
  children,
  disabled,
  ...buttonProps
}: EmailSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const handleClick = () => {
    setShowDialog(true)
    setEmailSent(false)
    setEmail('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email?.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const callbackUrl = `${
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : '')
      }/auth/callback?redirect=${encodeURIComponent(redirectPath)}`

      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callbackUrl,
        },
      })

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        setEmailSent(true)
        toast({
          title: 'Email Sent!',
          description: 'Check your inbox for a magic link to sign in',
        })
      }
    } catch (err) {
      logger.error('Email sign-in error:', err)
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
    <>
      <Button onClick={handleClick} disabled={disabled || loading} {...buttonProps}>
        <Mail className="mr-2 h-4 w-4" />
        {children ?? 'Sign in with Email'}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in with Email</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a magic link to sign in instantly. No
              password required!
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  ✓ Email sent!
                </p>
                <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                  We've sent a magic link to <strong>{email}</strong>. Click the link in your email
                  to sign in.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Didn't receive the email?</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Check your spam/junk folder</li>
                  <li>Wait a few minutes and try again</li>
                  <li>Make sure you entered the correct email address</li>
                </ul>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }}
                className="w-full"
              >
                Send to a Different Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
