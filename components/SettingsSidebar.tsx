'use client'

import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, CreditCard, LogOut, Settings, User } from 'lucide-react'
import Image from 'next/image'
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

interface SettingsSidebarProps {
  session?: Session | null
}

export function SettingsSidebar({ session }: SettingsSidebarProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const navItems = [
    {
      href: '/settings',
      label: 'Account',
      icon: User,
      active: pathname === '/settings',
    },
    {
      href: '/settings/billing',
      label: 'Billing',
      icon: CreditCard,
      active: pathname === '/settings/billing',
    },
  ]

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
      {/* Header */}
      <div className="shrink-0 border-b p-4">
        <div className="mb-2 flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Prompt Manage"
            width={24}
            height={24}
            className="h-6 w-6 dark:invert"
          />
          <h1 className="text-lg font-semibold">Prompt Manage</h1>
        </div>
        <p className="text-xs text-muted-foreground">Settings</p>
      </div>

      {/* Navigation */}
      <div className="shrink-0 space-y-1 px-4 pt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium tab-inactive transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.active ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* User Profile Footer */}
      <div className="shrink-0 border-t bg-background p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 px-2 py-2 hover:bg-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {session?.user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <span className="truncate text-sm font-medium">
                  {session?.user?.user_metadata?.display_name || 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email || ''}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
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
      </div>
    </aside>
  )
}
