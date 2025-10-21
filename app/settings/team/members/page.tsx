'use client'

import { useQuery } from '@tanstack/react-query'
import { Mail, Shield, Trash2, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'

import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { useInviteTeamMember, useTeamMembers, useUserTeams } from '@/lib/hooks/use-teams'
import type { TeamRole } from '@/lib/types/teams'
import { createClient } from '@/utils/supabase/client'

export default function TeamMembersPage() {
  const { toast } = useToast()
  const { currentTeamId } = useTeamContext()
  const { data: teams } = useUserTeams()
  const currentTeam = teams?.find((t) => t.team_id === currentTeamId)
  const { data: members, isLoading: membersLoading } = useTeamMembers(currentTeamId ?? undefined)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('viewer')
  const inviteMember = useInviteTeamMember(currentTeamId ?? '')

  // Fetch user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentTeamId || !inviteEmail) return

    if (!inviteEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    try {
      await inviteMember.mutateAsync({
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
      })

      toast({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${inviteEmail}`,
      })

      setInviteEmail('')
      setInviteRole('viewer')
    } catch (error) {
      console.error('Error inviting member:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        variant: 'destructive',
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
      case 'editor':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  if (!currentTeamId || !currentTeam) {
    return (
      <div className="flex h-screen">
        <SettingsSidebar session={session} />
        <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="mb-8 h-8 w-1/4" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  const isPersonalTeam = currentTeam.is_personal
  const canInvite = currentTeam.role === 'owner' || currentTeam.role === 'admin'

  return (
    <div className="flex h-screen">
      <SettingsSidebar session={session} />
      <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
              Team Members
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage members and permissions for {currentTeam.teams.name}
            </p>
          </div>

          <div className="space-y-4">
            {/* Invite Members - Only show for non-personal teams */}
            {!isPersonalTeam && canInvite && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                      <UserPlus className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-base font-medium">Invite Member</span>
                  </CardTitle>
                  <CardDescription>Add new members to your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteMember} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="member@example.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={inviteRole}
                          onValueChange={(value) => setInviteRole(value as TeamRole)}
                        >
                          <SelectTrigger id="role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer - Can view prompts</SelectItem>
                            <SelectItem value="editor">Editor - Can edit prompts</SelectItem>
                            <SelectItem value="admin">Admin - Can manage team settings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" disabled={inviteMember.isPending}>
                      <UserPlus className="size-4" />
                      {inviteMember.isPending ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                    <Users className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-base font-medium">Current Members</span>
                </CardTitle>
                <CardDescription>
                  {isPersonalTeam
                    ? 'Personal teams can only have one member'
                    : 'People who have access to this team'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                ) : members && members.length > 0 ? (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            {member.user_profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.user_profiles?.display_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            <Shield className="mr-1 h-3 w-3" />
                            {member.role}
                          </Badge>
                          {!isPersonalTeam &&
                            canInvite &&
                            member.role !== 'owner' &&
                            member.user_id !== session?.user?.id && (
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No members found</div>
                )}
              </CardContent>
            </Card>

            {/* Role Permissions Info */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-base font-medium text-blue-900 dark:text-blue-100">
                  Role Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div>
                  <span className="font-medium">Owner:</span> Full control including team deletion
                  and billing
                </div>
                <div>
                  <span className="font-medium">Admin:</span> Can manage team settings and invite
                  members
                </div>
                <div>
                  <span className="font-medium">Editor:</span> Can create and edit prompts
                </div>
                <div>
                  <span className="font-medium">Viewer:</span> Can view prompts but cannot edit
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
