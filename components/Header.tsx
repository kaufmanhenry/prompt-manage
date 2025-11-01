'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Globe, HelpCircle, LogOut, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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
  const router = useRouter()
  const queryClient = useQueryClient()
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
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
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
    try {
      const { error } = await createClient().auth.signOut()
      if (error) throw error

      // Clear all React Query cache
      queryClient.clear()

      // Redirect to home page
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if sign out fails, try to redirect
      router.push('/')
      router.refresh()
    }
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
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/p"
              className={`text-sm ${
                pathname.startsWith('/p') ? 'bg-foreground/5 text-foreground' : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:text-foreground hover:bg-foreground/5`}
            >
              <Globe className="h-4 w-4" />
              <span>Prompts</span>
            </Link>
            <Link
              href="/collections"
              className={`text-sm ${
                pathname.startsWith('/collections')
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:text-foreground hover:bg-foreground/5`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
              <span>Collections</span>
            </Link>
            <Link
              href="/docs"
              className={`text-sm ${
                pathname.startsWith('/docs') ? 'bg-foreground/5 text-foreground' : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:text-foreground hover:bg-foreground/5`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </Link>
            <Link
              href="/pricing"
              className={`text-sm ${
                pathname.startsWith('/pricing') ? 'bg-foreground/5 text-foreground' : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:text-foreground hover:bg-foreground/5`}
            >
              <span>Pricing</span>
            </Link>
            <Link
              href="/support"
              className={`text-sm ${
                pathname.startsWith('/support') ? 'bg-foreground/5 text-foreground' : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:text-foreground hover:bg-foreground/5`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
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
                {[
                  'mike@filtergrade.com',
                  'mikemoloney.business@gmail.com',
                  'hkaufman19@gmail.com',
                ].includes(session.user.email?.toLowerCase() || '') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin" className="flex items-center text-purple-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mr-2 h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                          />
                        </svg>
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
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
