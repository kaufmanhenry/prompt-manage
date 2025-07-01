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
import { Settings, LogOut, Sparkles, Globe, User2 } from 'lucide-react'

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
    <header className="border-b sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-semibold text-base tracking-tight flex items-center"
          >
            <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg h-6 w-6 mr-2">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-medium">Prompt Manage</span>
          </Link>
          {/* Only show navigation links when user is logged in */}
          {session && (
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`text-sm ${
                  pathname === '/dashboard'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary'
                } hover:text-primary transition-colors flex items-center gap-1 font-medium rounded-lg px-2 py-1`}
                onClick={(e) => {
                  if (pathname === '/dashboard') {
                    e.preventDefault()
                    window.location.reload()
                  }
                }}
              >
                <User2 className="w-4 h-4" />
                <span className="text-sm font-medium">Personal</span>
              </Link>
              <Link
                href="/p"
                className={`text-sm ${
                  pathname.startsWith('/p')
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground'
                } hover:text-primary transition-colors flex items-center gap-1 font-medium rounded-lg px-2 py-1`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Public</span>
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
                  className="relative h-8 w-8 rounded-full bg-input  flex items-center justify-center"
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
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center"
                >
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
