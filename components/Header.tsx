'use client'

import { useQuery } from '@tanstack/react-query'
import { Globe, LogOut, Settings, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'

export function Header() {
  const pathname = usePathname()
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

  const searchParams = useSearchParams()

  const handleSignIn = async () => {
    const redirectParam = searchParams.get('redirect') || '/dashboard'
    const callbackUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    }/auth/callback?redirect=${encodeURIComponent(redirectParam)}`

    await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  }

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Image
              src="/logo.svg"
              alt="Prompt Manage"
              width={32}
              height={32}
              className="h-6 w-6 dark:invert"
            />
            <span className="hidden sm:inline">Prompt Manage</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm ${
                    pathname === '/dashboard'
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  } flex items-center gap-1 rounded-lg px-2 py-1 font-medium transition-colors hover:text-primary`}
                  onClick={(e) => {
                    if (pathname === '/dashboard') {
                      e.preventDefault()
                      window.location.reload()
                    }
                  }}
                >
                  <User2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Prompts</span>
                </Link>
              </>
            )}
            <Link
              href="/p"
              className={`text-sm ${
                pathname.startsWith('/p') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              } flex items-center gap-1 rounded-lg px-2 py-1 font-medium transition-colors hover:text-primary`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">Public</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex h-8 w-8 items-center  justify-center rounded-full bg-input"
                >
                  <span className="sr-only">Open user menu</span>
                  {session.user.email?.[0].toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {session.user.user_metadata?.display_name || 'User'}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={handleSignIn}>Sign in with Google</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
