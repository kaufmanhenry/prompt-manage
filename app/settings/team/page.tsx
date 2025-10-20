'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Save, Settings, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { useDeleteTeam, useUpdateTeam, useUserTeams } from '@/lib/hooks/use-teams'
import { createClient } from '@/utils/supabase/client'

export default function TeamSettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { currentTeamId, setCurrentTeamId } = useTeamContext()
  const { data: teams } = useUserTeams()
  const currentTeam = teams?.find((t) => t.team_id === currentTeamId)

  const [teamName, setTeamName] = useState(currentTeam?.teams.name || '')
  const [teamDescription, setTeamDescription] = useState(currentTeam?.teams.description || '')

  const updateTeam = useUpdateTeam(currentTeamId || '')
  const deleteTeam = useDeleteTeam()

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

  // Update local state when team changes
  useState(() => {
    if (currentTeam) {
      setTeamName(currentTeam.teams.name)
      setTeamDescription(currentTeam.teams.description || '')
    }
  })

  const handleSaveTeam = async () => {
    if (!currentTeamId || !currentTeam) return

    if (!teamName.trim()) {
      toast({
        title: 'Error',
        description: 'Team name is required',
        variant: 'destructive',
      })
      return
    }

    try {
      await updateTeam.mutateAsync({
        name: teamName.trim(),
        description: teamDescription.trim() || undefined,
      })

      toast({
        title: 'Success',
        description: 'Team settings updated successfully!',
      })
    } catch (error) {
      console.error('Error updating team:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update team settings',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTeam = async () => {
    if (!currentTeamId || !currentTeam) return

    // Prevent deletion of personal team
    if (currentTeam.is_personal) {
      toast({
        title: 'Cannot Delete',
        description: 'You cannot delete your personal team',
        variant: 'destructive',
      })
      return
    }

    if (
      !confirm(
        `Are you sure you want to delete "${currentTeam.teams.name}"? This action cannot be undone and will delete all prompts and data associated with this team.`,
      )
    ) {
      return
    }

    try {
      await deleteTeam.mutateAsync(currentTeamId)

      toast({
        title: 'Team Deleted',
        description: 'The team has been deleted successfully',
      })

      // Switch to default team
      const defaultTeam = teams?.find((t) => t.is_personal)
      if (defaultTeam) {
        setCurrentTeamId(defaultTeam.team_id)
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting team:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete team',
        variant: 'destructive',
      })
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
  const isOwner = currentTeam.role === 'owner'
  const canEdit = isOwner || currentTeam.role === 'admin'

  return (
    <div className="flex h-screen">
      <SettingsSidebar session={session} />
      <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
              Team Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage settings for {currentTeam.teams.name}
            </p>
          </div>

          <div className="space-y-4">
            {/* Team Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                    <Settings className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-base font-medium">Team Information</span>
                </CardTitle>
                <CardDescription>
                  Update your team's name and description
                  {!canEdit && ' (View only - you need admin or owner permissions to edit)'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Description</Label>
                  <Textarea
                    id="teamDescription"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Describe your team's purpose..."
                    rows={3}
                    disabled={!canEdit}
                  />
                </div>

                {isPersonalTeam && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is your personal team. You can customize the name and description.
                    </AlertDescription>
                  </Alert>
                )}

                {canEdit && (
                  <Button
                    onClick={handleSaveTeam}
                    disabled={updateTeam.isPending}
                    className="w-full md:w-auto"
                  >
                    <Save className="size-4" />
                    {updateTeam.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Team Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Team Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team ID:</span>
                  <span className="font-mono text-xs">{currentTeam.team_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Role:</span>
                  <span className="font-medium capitalize">{currentTeam.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Type:</span>
                  <span className="font-medium">
                    {isPersonalTeam ? 'Personal Team' : 'Shared Team'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium capitalize">{currentTeam.teams.tier}</span>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone - Only show for non-personal teams and owners */}
            {!isPersonalTeam && isOwner && (
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                      <Trash2 className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-base font-medium">Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Delete Team</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete this team and all associated prompts and data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteTeam}
                      disabled={deleteTeam.isPending}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleteTeam.isPending ? 'Deleting...' : 'Delete Team'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
