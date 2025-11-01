'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An unknown error occurred'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-center">Sign-In Error</CardTitle>
          <CardDescription className="text-center">
            We encountered an issue while signing you in. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive dark:text-destructive-foreground">{error}</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">Common fixes:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Make sure you're using a supported browser</li>
              <li>Check that cookies are enabled</li>
              <li>Try clearing your browser cache</li>
              <li>If using Google, ensure redirect URLs are configured in Supabase</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild className="flex-1">
              <Link href="/">Try Again</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/support">Get Help</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
