'use client'

import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowUp,
  CreditCard,
  ExternalLink,
  Save,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { useDeleteTeam, useUpdateTeam, useUserTeams } from '@/lib/hooks/use-teams'
import { PRICING_CONFIG } from '@/lib/pricing'
import { createClient } from '@/utils/supabase/client'

export default function TeamSettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { currentTeamId, setCurrentTeamId } = useTeamContext()
  const { data: teams } = useUserTeams()
  const currentTeam = teams?.find((t) => t.team_id === currentTeamId)

  const [teamName, setTeamName] = useState(currentTeam?.teams.name || '')
  const [teamDescription, setTeamDescription] = useState(currentTeam?.teams.description || '')
  const [loading, setLoading] = useState<string | null>(null)

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

  // Fetch user subscription status
  const { data: subscriptionStatus, refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const response = await fetch('/api/subscription/status')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }
      return response.json()
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

  const handleUpgrade = async (plan: 'team' | 'pro') => {
    setLoading(`upgrade-${plan}`)
    try {
      const response = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'upgrade', plan }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upgrade subscription')
      }

      if (data.url) {
        window.location.href = data.url
        return
      }

      toast({
        title: 'Success',
        description: 'Subscription upgraded successfully',
      })

      void refetchSubscription()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upgrade subscription',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  const handleCancel = async () => {
    setLoading('cancel')
    try {
      const response = await fetch('/api/subscription/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      toast({
        title: 'Success',
        description: 'Subscription will be canceled at the end of the billing period',
      })

      void refetchSubscription()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  const handleManageBilling = async () => {
    if (!currentTeamId) return

    setLoading('portal')
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId: currentTeamId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to access billing portal')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to access billing portal',
        variant: 'destructive',
      })
      setLoading(null)
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
      case 'pro':
      case 'team':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
  const tier = currentTeam.teams.tier || 'free'
  const status = currentTeam.teams.subscription_status
  const teamPeriodEnd = currentTeam.teams.subscription_period_end
  const hasActiveSubscription = currentTeam.teams.stripe_customer_id && tier !== 'free'
  const currentPlan = subscriptionStatus?.subscription?.plan || 'free'
  const subscriptionStatusValue = subscriptionStatus?.subscription?.status || 'active'
  const periodEnd = subscriptionStatus?.subscription?.currentPeriodEnd
  const statusMessage = subscriptionStatus?.statusMessage

  return (
    <div className="flex h-screen">
      <SettingsSidebar session={session} />
      <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Team & Billing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage {currentTeam.teams.name} settings and subscription
            </p>
          </div>

          <div className="space-y-8">
            {/* Status Message Banner */}
            {statusMessage && (
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-amber-900 dark:text-amber-200">{statusMessage}</p>
                </CardContent>
              </Card>
            )}

            {/* Team Information */}
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>
                  {canEdit
                    ? "Update your team's name and description"
                    : 'View only - contact your team owner to make changes'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
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
                    <Label>Your Role</Label>
                    <Input value={currentTeam.role} disabled className="capitalize" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamDescription">Description</Label>
                  <Textarea
                    id="teamDescription"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Describe your team's purpose"
                    rows={3}
                    disabled={!canEdit}
                  />
                </div>

                {canEdit && (
                  <div className="flex justify-end">
                    <Button onClick={handleSaveTeam} disabled={updateTeam.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      {updateTeam.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* BILLING & SUBSCRIPTION */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your team's plan and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan Status */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold capitalize">{tier} Plan</span>
                      {status && status !== 'active' && (
                        <Badge variant="outline" className={getStatusBadgeColor(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      )}
                    </div>
                    {tier === 'free' && (
                      <p className="text-sm text-muted-foreground">25 prompts limit</p>
                    )}
                    {tier === 'pro' && (
                      <p className="text-sm text-muted-foreground">
                        $5/month • Unlimited prompts
                      </p>
                    )}
                    {tier === 'team' && (
                      <p className="text-sm text-muted-foreground">
                        $27/month • Team collaboration
                      </p>
                    )}
                    {teamPeriodEnd && (
                      <p className="text-xs text-muted-foreground">
                        Renews {formatDate(teamPeriodEnd)}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      {tier === 'free' && (
                        <Button asChild>
                          <a href="/pricing">Upgrade</a>
                        </Button>
                      )}
                      {hasActiveSubscription && (
                        <Button variant="outline" onClick={handleManageBilling} disabled={!!loading}>
                          {loading === 'portal' ? 'Loading...' : 'Manage'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Permission Warning */}
                {!canEdit && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Only team owners and admins can manage billing
                    </AlertDescription>
                  </Alert>
                )}

                {/* Upsell for Free Plan */}
                {tier === 'free' && canEdit && (
                  <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Unlock Your Full Potential</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Upgrade to Pro and remove all limits
                      </p>
                    </div>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <ArrowUp className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          <strong>Unlimited prompts</strong> - never worry about storage limits
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowUp className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          <strong>Team collaboration</strong> - invite members and work together
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowUp className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          <strong>Import & export</strong> - bulk manage your prompt library
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowUp className="mt-0.5 h-4 w-4 text-primary" />
                        <span>
                          <strong>Priority support</strong> - get help when you need it
                        </span>
                      </div>
                    </div>
                    <Button asChild className="mt-6 w-full" size="lg">
                      <a href="/pricing">Upgrade to Pro - $5/month</a>
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Cancel anytime. No long-term contracts.
                    </p>
                  </div>
                )}

                {/* Current Plan Features */}
                {tier !== 'free' && (
                  <div>
                    <h4 className="mb-3 text-sm font-medium">What's Included</h4>
                    <div className="grid gap-2 text-sm">
                      {tier === 'pro' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Unlimited prompts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Team collaboration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Import & export tools</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Priority support</span>
                          </div>
                        </>
                      )}
                      {tier === 'team' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Everything in Pro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Advanced team permissions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Dedicated account manager</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>SLA & guaranteed uptime</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone - Only show for non-personal teams and owners */}
            {!isPersonalTeam && isOwner && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for this team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Delete Team</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete this team and all data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteTeam}
                      disabled={deleteTeam.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
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
