# Teams Frontend - React Implementation Guide

**Enterprise UI Components for Teams Feature**

---

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [State Management](#state-management)
3. [Core Components](#core-components)
4. [Routing Structure](#routing-structure)
5. [Hooks & Utilities](#hooks--utilities)
6. [Real-time Updates](#real-time-updates)
7. [Accessibility & UX](#accessibility--ux)

---

## Component Architecture

### Design System

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** React Query (TanStack Query) + Context API
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner toast library

### Component Hierarchy

```
app/
├── teams/
│   ├── page.tsx                    # Teams list
│   ├── new/page.tsx                # Create team
│   └── [slug]/
│       ├── layout.tsx              # Team layout with nav
│       ├── page.tsx                # Team dashboard
│       ├── prompts/
│       │   ├── page.tsx            # Prompts list
│       │   ├── new/page.tsx        # New prompt
│       │   └── [id]/page.tsx       # Prompt detail
│       ├── outputs/page.tsx        # Outputs list
│       ├── datasets/
│       │   ├── page.tsx            # Datasets list
│       │   └── [id]/page.tsx       # Dataset detail
│       ├── members/page.tsx        # Team members
│       ├── billing/page.tsx        # Billing & usage
│       └── settings/page.tsx       # Team settings

components/
├── teams/
│   ├── team-switcher.tsx           # Global team selector
│   ├── team-card.tsx               # Team display card
│   ├── create-team-dialog.tsx      # Team creation modal
│   ├── invite-member-dialog.tsx    # Invitation modal
│   ├── member-list.tsx             # Members table
│   ├── member-card.tsx             # Member display
│   ├── role-badge.tsx              # Role indicator
│   ├── usage-chart.tsx             # Cost/usage graphs
│   ├── billing-plan-card.tsx       # Plan display
│   └── upgrade-dialog.tsx          # Upgrade modal

lib/
├── hooks/
│   ├── use-teams.ts                # Team queries
│   ├── use-team-members.ts         # Member queries
│   ├── use-team-permissions.ts     # Permission checks
│   ├── use-team-usage.ts           # Usage data
│   └── use-team-billing.ts         # Billing queries

contexts/
└── team-context.tsx                # Current team state
```

---

## State Management

### React Query Setup

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

// Query keys for consistency
export const queryKeys = {
  teams: ['teams'] as const,
  team: (id: string) => ['teams', id] as const,
  teamMembers: (teamId: string) => ['teams', teamId, 'members'] as const,
  teamPrompts: (teamId: string) => ['teams', teamId, 'prompts'] as const,
  teamUsage: (teamId: string) => ['teams', teamId, 'usage'] as const,
  teamBilling: (teamId: string) => ['teams', teamId, 'billing'] as const,
}
```

### Team Context Provider

```typescript
// contexts/team-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TeamContextType {
  currentTeamId: string | null
  setCurrentTeamId: (id: string | null) => void
  currentRole: string | null
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<string | null>(null)

  return (
    <TeamContext.Provider value={{ currentTeamId, setCurrentTeamId, currentRole }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeamContext() {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error('useTeamContext must be used within TeamProvider')
  }
  return context
}
```

---

## Core Components

### 1. Team Switcher

```typescript
// components/teams/team-switcher.tsx
'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTeams } from '@/lib/hooks/use-teams'
import { useTeamContext } from '@/contexts/team-context'
import { cn } from '@/lib/utils'

export function TeamSwitcher() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: teams, isLoading } = useTeams()
  const { currentTeamId, setCurrentTeamId } = useTeamContext()

  const currentTeam = teams?.find(t => t.team_id === currentTeamId)

  const handleSelectTeam = (teamId: string) => {
    setCurrentTeamId(teamId)
    const team = teams?.find(t => t.team_id === teamId)
    router.push(`/teams/${team?.teams.slug}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select team"
          className="w-[200px] justify-between"
        >
          {currentTeam ? (
            <>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={currentTeam.teams.avatar_url || ''}
                  alt={currentTeam.teams.name}
                />
                <AvatarFallback>
                  {currentTeam.teams.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{currentTeam.teams.name}</span>
            </>
          ) : (
            <span>Select team...</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandList>
            <CommandGroup heading="Your Teams">
              {teams?.map((team) => (
                <CommandItem
                  key={team.team_id}
                  onSelect={() => handleSelectTeam(team.team_id)}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={team.teams.avatar_url || ''}
                      alt={team.teams.name}
                    />
                    <AvatarFallback>
                      {team.teams.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{team.teams.name}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentTeamId === team.team_id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push('/teams/new')
                  setOpen(false)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### 2. Create Team Dialog

```typescript
// components/teams/create-team-dialog.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createTeam } from '@/lib/api/teams'
import { queryKeys } from '@/lib/query-client'

const teamSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().optional()
})

type TeamFormData = z.infer<typeof teamSchema>

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams })
      toast.success('Team created successfully!')
      form.reset()
      onOpenChange(false)
      router.push(`/teams/${data.team.slug}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create team')
    }
  })

  const onSubmit = (data: TeamFormData) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Start collaborating with your team on AI prompts and workflows.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be visible to all team members
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's your team working on?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Team'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### 3. Team Dashboard

```typescript
// app/teams/[slug]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTeam, useTeamMembers, useTeamUsage } from '@/lib/hooks/use-teams'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UsageChart } from '@/components/teams/usage-chart'
import { MemberList } from '@/components/teams/member-list'
import { ActivityLog } from '@/components/teams/activity-log'
import { Users, FileText, Database, DollarSign } from 'lucide-react'

export default function TeamDashboard() {
  const params = useParams()
  const slug = params.slug as string

  const { data: team, isLoading: teamLoading } = useTeam(slug)
  const { data: members } = useTeamMembers(team?.id)
  const { data: usage } = useTeamUsage(team?.id)

  if (teamLoading) {
    return <div>Loading...</div>
  }

  const stats = [
    {
      title: 'Members',
      value: members?.length || 0,
      icon: Users,
      description: `${team?.tier} plan`
    },
    {
      title: 'Prompts',
      value: team?.prompt_count || 0,
      icon: FileText,
      description: 'Shared prompts'
    },
    {
      title: 'Datasets',
      value: team?.dataset_count || 0,
      icon: Database,
      description: 'Uploaded files'
    },
    {
      title: 'Monthly Cost',
      value: `$${(usage?.total_cost || 0).toFixed(2)}`,
      icon: DollarSign,
      description: 'This billing period'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{team?.name}</h1>
        <p className="text-muted-foreground">{team?.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
          <CardDescription>Daily token usage and costs</CardDescription>
        </CardHeader>
        <CardContent>
          <UsageChart data={usage?.timeSeries || []} />
        </CardContent>
      </Card>

      {/* Two-column layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Recently active members</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberList members={members?.slice(0, 5) || []} compact />
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest team actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityLog teamId={team?.id} limit={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 4. Invite Member Dialog

```typescript
// components/teams/invite-member-dialog.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inviteTeamMember } from '@/lib/api/teams'
import { queryKeys } from '@/lib/query-client'

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'viewer'])
})

type InviteFormData = z.infer<typeof inviteSchema>

interface InviteMemberDialogProps {
  teamId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({
  teamId,
  open,
  onOpenChange
}: InviteMemberDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'viewer'
    }
  })

  const inviteMutation = useMutation({
    mutationFn: (data: InviteFormData) => inviteTeamMember(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teamMembers(teamId) })
      toast.success('Invitation sent!')
      form.reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      if (error.message?.includes('Seat limit')) {
        toast.error('Upgrade to add more members', {
          action: {
            label: 'Upgrade',
            onClick: () => {
              // Navigate to billing
            }
          }
        })
      } else {
        toast.error(error.message || 'Failed to send invitation')
      }
    }
  })

  const onSubmit = (data: InviteFormData) => {
    inviteMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to collaborate on your team
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="viewer">
                        Viewer - Read-only access
                      </SelectItem>
                      <SelectItem value="editor">
                        Editor - Can create and edit
                      </SelectItem>
                      <SelectItem value="admin">
                        Admin - Can manage members
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controls what this member can do
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### 5. Usage Chart

```typescript
// components/teams/usage-chart.tsx
'use client'

import { useMemo } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { format } from 'date-fns'

interface UsageDataPoint {
  period: string
  tokens: number
  cost: number
}

interface UsageChartProps {
  data: UsageDataPoint[]
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = useMemo(() => {
    return data.map((point) => ({
      date: format(new Date(point.period), 'MMM dd'),
      cost: point.cost,
      tokens: point.tokens / 1000 // Convert to K tokens
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Cost
                    </span>
                    <span className="font-bold text-muted-foreground">
                      ${payload[0].value}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Tokens
                    </span>
                    <span className="font-bold">
                      {payload[0].payload.tokens}K
                    </span>
                  </div>
                </div>
              </div>
            )
          }}
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## Hooks & Utilities

### Team Hooks

```typescript
// lib/hooks/use-teams.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import * as api from '@/lib/api/teams'

export function useTeams() {
  return useQuery({
    queryKey: queryKeys.teams,
    queryFn: api.getTeams,
  })
}

export function useTeam(slugOrId: string) {
  return useQuery({
    queryKey: queryKeys.team(slugOrId),
    queryFn: () => api.getTeam(slugOrId),
    enabled: !!slugOrId,
  })
}

export function useTeamMembers(teamId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.teamMembers(teamId!),
    queryFn: () => api.getTeamMembers(teamId!),
    enabled: !!teamId,
  })
}

export function useTeamUsage(teamId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.teamUsage(teamId!),
    queryFn: () => api.getTeamUsage(teamId!),
    enabled: !!teamId,
    refetchInterval: 60000, // Refetch every minute
  })
}
```

### Permission Hook

```typescript
// lib/hooks/use-team-permissions.ts
import { useQuery } from '@tanstack/react-query'
import { checkPermission } from '@/lib/api/teams'

export function useTeamPermission(
  teamId: string | undefined,
  resourceType: string,
  action: string,
) {
  return useQuery({
    queryKey: ['team-permission', teamId, resourceType, action],
    queryFn: () => checkPermission(teamId!, resourceType, action),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

// Convenience hooks
export function useCanEditPrompts(teamId: string | undefined) {
  return useTeamPermission(teamId, 'prompt', 'write')
}

export function useCanManageMembers(teamId: string | undefined) {
  return useTeamPermission(teamId, 'team_settings', 'manage_members')
}

export function useCanViewBilling(teamId: string | undefined) {
  return useTeamPermission(teamId, 'team_settings', 'manage_billing')
}
```

---

## Routing Structure

### App Router Pages

```typescript
// app/teams/layout.tsx
import { TeamProvider } from '@/contexts/team-context'
import { TeamSwitcher } from '@/components/teams/team-switcher'

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <div className="flex min-h-screen">
        {/* Sidebar with team switcher */}
        <aside className="w-64 border-r bg-muted/40 p-4">
          <TeamSwitcher />
          {/* Navigation items */}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </TeamProvider>
  )
}
```

### Protected Routes

```typescript
// lib/middleware/require-team-access.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTeam } from '@/lib/hooks/use-teams'

export function withTeamAccess(Component: React.ComponentType<any>) {
  return function ProtectedComponent(props: any) {
    const router = useRouter()
    const { data: team, isLoading, error } = useTeam(props.params.slug)

    useEffect(() => {
      if (!isLoading && (error || !team)) {
        router.push('/teams')
      }
    }, [isLoading, error, team, router])

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (!team) {
      return null
    }

    return <Component {...props} team={team} />
  }
}
```

---

## Real-time Updates

### Supabase Realtime Subscriptions

```typescript
// lib/hooks/use-realtime-team.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { queryKeys } from '@/lib/query-client'

export function useRealtimeTeamUpdates(teamId: string | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!teamId) return

    const supabase = createClient()

    // Subscribe to team_members changes
    const membersSubscription = supabase
      .channel(`team-${teamId}-members`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_members',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.teamMembers(teamId) })
        },
      )
      .subscribe()

    // Subscribe to team_prompts changes
    const promptsSubscription = supabase
      .channel(`team-${teamId}-prompts`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_prompts',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.teamPrompts(teamId) })
        },
      )
      .subscribe()

    return () => {
      membersSubscription.unsubscribe()
      promptsSubscription.unsubscribe()
    }
  }, [teamId, queryClient])
}
```

---

## Summary

### Components Implemented

✅ **Core Components** (10)

- TeamSwitcher - Global team selector
- CreateTeamDialog - Team creation
- TeamCard - Team display
- TeamDashboard - Main dashboard
- InviteMemberDialog - Invitation UI
- MemberList - Members table
- MemberCard - Member display
- UsageChart - Cost/usage visualization
- BillingPlanCard - Plan display
- UpgradeDialog - Upgrade modal

✅ **Hooks** (8)

- useTeams - List teams
- useTeam - Single team
- useTeamMembers - Member list
- useTeamUsage - Usage stats
- useTeamPermission - Permission checks
- useCanEditPrompts - Shortcut hooks
- useCanManageMembers - Shortcut hooks
- useRealtimeTeamUpdates - Real-time sync

✅ **Pages** (12)

- /teams - Teams list
- /teams/new - Create team
- /teams/[slug] - Team dashboard
- /teams/[slug]/prompts - Prompts list
- /teams/[slug]/outputs - Outputs list
- /teams/[slug]/datasets - Datasets list
- /teams/[slug]/members - Members management
- /teams/[slug]/billing - Billing & usage
- /teams/[slug]/settings - Team settings
- ... and more

### Next Steps

Continue to [SECURITY.md](#) for security implementation details.
