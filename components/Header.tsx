'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Globe, HelpCircle, LogOut, Settings } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { EmailSignInButton } from '@/components/EmailSignInButton'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { logger } from '@/lib/logger'
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
      logger.error('Error signing out:', error)
      // Even if sign out fails, try to redirect
      router.push('/')
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-base font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
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
                (pathname === '/p' || pathname.startsWith('/p/')) &&
                !pathname.startsWith('/pricing') &&
                !pathname.startsWith('/product') &&
                !pathname.startsWith('/prompts')
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-foreground/5 hover:text-foreground`}
            >
              <Globe className="h-4 w-4" />
              <span>Prompts</span>
            </Link>
            <Link
              href="/docs"
              className={`text-sm ${
                pathname === '/docs' || pathname.startsWith('/docs/')
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-foreground/5 hover:text-foreground`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </Link>
            <Link
              href="/pricing"
              className={`text-sm ${
                pathname === '/pricing' || pathname.startsWith('/pricing/')
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-foreground/5 hover:text-foreground`}
            >
              <span>Pricing</span>
            </Link>
            <Link
              href="/support"
              className={`text-sm ${
                pathname === '/support' || pathname.startsWith('/support/')
                  ? 'bg-foreground/5 text-foreground'
                  : 'text-foreground/60'
              } flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-foreground/5 hover:text-foreground`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
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
              <Button onClick={handleSignIn} size="sm">
                Sign in with Google
              </Button>
              <EmailSignInButton
                size="sm"
                variant="ghost"
                className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                or email
              </EmailSignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
