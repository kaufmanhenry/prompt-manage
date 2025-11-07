'use client'

import { useQuery } from '@tanstack/react-query'
import { Info, Mail, RefreshCw, Trash2, UserPlus, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import {
  useCancelTeamInvitation,
  useInviteTeamMember,
  useResendTeamInvitation,
  useTeamInvitations,
  useTeamMembers,
  useUserTeams,
} from '@/lib/hooks/use-teams'
import type { TeamRole } from '@/lib/types/teams'
import { createClient } from '@/utils/supabase/client'

export default function TeamMembersPage() {
  const { toast } = useToast()
  const params = useParams()
  const teamId = params.teamId as string
  const { data: teams } = useUserTeams()
  const team = teams?.find((t) => t.team_id === teamId)
  const { data: members, isLoading: membersLoading } = useTeamMembers(teamId ?? undefined)
  const { data: invitations, isLoading: invitationsLoading } = useTeamInvitations(
    teamId ?? undefined,
  )

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('viewer')
  const inviteMember = useInviteTeamMember(teamId ?? '')
  const cancelInvitation = useCancelTeamInvitation(teamId ?? '')
  const resendInvitation = useResendTeamInvitation(teamId ?? '')

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

    if (!teamId || !inviteEmail) return

    if (!inviteEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    try {
      const invitation = await inviteMember.mutateAsync({
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
      })

      // Send invitation email
      try {
        await fetch('/api/teams/invite/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invitationId: invitation.id }),
        })
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError)
        // Don't fail the whole operation if email fails
      }

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
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-950'
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-950'
      case 'editor':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-950'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
  }

  if (!teamId || !team) {
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

  const isPersonalTeam = team.is_personal
  const canInvite = team.role === 'owner' || team.role === 'admin'

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
              Manage members and permissions for {team.teams.name}
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
                        <div className="flex items-center gap-2">
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
                              <SelectItem value="admin">
                                Admin - Can manage team settings
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <TooltipProvider>
                            <Tooltip>
                              <div className="relative">
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex items-center justify-center"
                                  >
                                    <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="w-80">
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="font-semibold">Owner:</span> Full control
                                      including team deletion and billing
                                    </div>
                                    <div>
                                      <span className="font-semibold">Admin:</span> Can manage team
                                      settings and invite members
                                    </div>
                                    <div>
                                      <span className="font-semibold">Editor:</span> Can create and
                                      edit prompts
                                    </div>
                                    <div>
                                      <span className="font-semibold">Viewer:</span> Can view
                                      prompts but cannot edit
                                    </div>
                                  </div>
                                </TooltipContent>
                              </div>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
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

            {/* Pending Invitations */}
            {!isPersonalTeam && canInvite && invitations && invitations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                      <Mail className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-base font-medium">Pending Invitations</span>
                  </CardTitle>
                  <CardDescription>Invitations that haven't been accepted yet</CardDescription>
                </CardHeader>
                <CardContent>
                  {invitationsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invitations
                        .filter((inv) => inv.status === 'pending')
                        .map((invitation) => (
                          <div
                            key={invitation.id}
                            className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Mail className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{invitation.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  Invited {new Date(invitation.created_at).toLocaleDateString()} •
                                  Expires {new Date(invitation.expires_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getRoleBadgeColor(invitation.role)}>
                                {invitation.role}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await resendInvitation.mutateAsync(invitation.id)

                                    // Send invitation email
                                    try {
                                      await fetch('/api/teams/invite/send-email', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ invitationId: invitation.id }),
                                      })
                                    } catch (emailError) {
                                      console.error('Failed to send invitation email:', emailError)
                                      // Don't fail the whole operation if email fails
                                    }

                                    toast({
                                      title: 'Invitation Resent',
                                      description: `Invitation to ${invitation.email} has been resent`,
                                    })
                                  } catch (error) {
                                    toast({
                                      title: 'Error',
                                      description:
                                        error instanceof Error
                                          ? error.message
                                          : 'Failed to resend invitation',
                                      variant: 'destructive',
                                    })
                                  }
                                }}
                                disabled={resendInvitation.isPending}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={async () => {
                                  try {
                                    await cancelInvitation.mutateAsync(invitation.id)
                                    toast({
                                      title: 'Invitation Canceled',
                                      description: `Invitation to ${invitation.email} has been canceled`,
                                    })
                                  } catch (error) {
                                    toast({
                                      title: 'Error',
                                      description:
                                        error instanceof Error
                                          ? error.message
                                          : 'Failed to cancel invitation',
                                      variant: 'destructive',
                                    })
                                  }
                                }}
                                disabled={cancelInvitation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
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
                          <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
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
          </div>
        </div>
      </div>
    </div>
  )
}
