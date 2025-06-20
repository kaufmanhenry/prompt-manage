'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Settings, LogOut } from 'lucide-react'

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

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-xl">
            Prompt Manage
          </Link>
          {/* Only show navigation links when user is logged in */}
          {session && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`text-sm ${
                  pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                } hover:text-primary transition-colors`}
              >
                My Prompts
              </Link>
              <Link
                href="/public"
                className={`text-sm ${
                  pathname.startsWith('/public') ? 'text-primary' : 'text-muted-foreground'
                } hover:text-primary transition-colors`}
              >
                Public Directory
              </Link>
              <Link
                href="/settings"
                className={`text-sm ${
                  pathname === '/settings'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                } hover:text-primary transition-colors`}
              >
                Settings
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
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
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
