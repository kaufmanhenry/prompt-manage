'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Github } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        const redirectTo = searchParams.get('redirect') || '/dashboard'
        window.location.href = redirectTo
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsOAuthLoading(true)
    try {
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${
            window.location.origin
          }/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })
      if (error) {
        setMessage(error.message)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsOAuthLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage('Please enter your email address first.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email for the password reset link!')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your Prompt Manage account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          {message && (
            <p className="text-sm text-muted-foreground text-center">
              {message}
            </p>
          )}
        </form>

        <div className="space-y-2 text-center">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Forgot your password?
          </button>

          <div className="text-sm">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
