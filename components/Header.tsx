'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

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
    <header className="border-b">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-xl">
            Prompt Manage
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm ${
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              } hover:text-primary transition-colors`}
            >
              Prompts
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-sm">
                  {session.user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
