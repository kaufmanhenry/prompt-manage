'use client'

import type { Session } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, FileText, LogOut, Settings, User, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useUserTeams } from '@/lib/hooks/use-teams'
import { createClient } from '@/utils/supabase/client'

interface SettingsSidebarProps {
  session?: Session | null
}

export function SettingsSidebar({ session }: SettingsSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: teams } = useUserTeams()

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

  const personalNavItems = [
    {
      href: '/settings',
      label: 'Account',
      icon: User,
      active: pathname === '/settings',
    },
    {
      href: '/settings/legal',
      label: 'Legal',
      icon: FileText,
      active: pathname === '/settings/legal',
    },
  ]

  // Helper to get team nav items for a specific team
  const getTeamNavItems = (teamId: string) => [
    {
      href: `/settings/team/${teamId}`,
      label: 'Team & Billing',
      icon: Settings,
      active: pathname === `/settings/team/${teamId}`,
    },
    {
      href: `/settings/team/${teamId}/members`,
      label: 'Members',
      icon: Users,
      active: pathname === `/settings/team/${teamId}/members`,
    },
  ]

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
      {/* Header */}
      <div className="shrink-0 border-b p-4">
        <Link href="/dashboard" className="mb-2 flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
          <Image
            src="/logo.svg"
            alt="Prompt Manage"
            width={24}
            height={24}
            className="h-6 w-6 dark:invert"
          />
          <h1 className="text-lg font-semibold">Prompt Manage</h1>
        </Link>
        <p className="text-xs text-muted-foreground">Settings</p>
      </div>

      {/* User Info */}
      <div className="shrink-0 border-b bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {session?.user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">
              {session?.user?.user_metadata?.display_name || 'User'}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {session?.user?.email || ''}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pt-4">
        <Link
          href="/dashboard"
          className="tab-inactive flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Personal Settings */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal
          </h3>
          <div className="space-y-1">
            {personalNavItems.map((item) => {
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
        </div>

        {/* All Teams Settings */}
        {teams && teams.length > 0 && (
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Teams
            </h3>
            <div className="space-y-3">
              {teams.map((team) => {
                const teamNavItems = getTeamNavItems(team.team_id)
                return (
                  <div key={team.team_id} className="space-y-1">
                    {/* Team Name */}
                    <div className="px-3 py-1">
                      <div className="text-sm font-medium">
                        {team.teams.name}
                        {team.is_personal && (
                          <span className="ml-2 text-xs text-muted-foreground">(Personal)</span>
                        )}
                      </div>
                    </div>
                    {/* Team Nav Items */}
                    <div className="space-y-1 pl-3">
                      {teamNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                              item.active ? 'tab-active' : 'tab-inactive'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="shrink-0 border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
