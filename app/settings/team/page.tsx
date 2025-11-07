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
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
              Team Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage settings and billing for {currentTeam.teams.name}
            </p>
          </div>

          <div className="space-y-4">
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

            <Separator className="my-8" />

            {/* BILLING SECTION */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Billing & Subscription</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your team's subscription and billing
                </p>
              </div>

              {/* Permission warning for non-owners/admins */}
              {!canEdit && (
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                  <CardContent className="pt-6">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Only team owners and admins can manage team billing. Contact your team owner
                      to upgrade or manage team subscriptions.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Current Plan</CardTitle>
                  <CardDescription>Active subscription tier for this team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTierBadgeColor(tier)}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </Badge>
                        {status && (
                          <Badge className={getStatusBadgeColor(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        )}
                      </div>
                      {tier === 'free' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          This team is currently on the free plan
                        </p>
                      )}
                      {tier === 'pro' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          $5/month • Unlimited prompts and collaboration
                        </p>
                      )}
                      {tier === 'enterprise' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          $27/month • Enterprise features and priority support
                        </p>
                      )}
                      {teamPeriodEnd && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Renews on {formatDate(teamPeriodEnd)}
                        </p>
                      )}
                    </div>
                    {tier === 'free' && canEdit && (
                      <Button asChild>
                        <a href="/pricing">Upgrade Plan</a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Billing Management */}
              {hasActiveSubscription && canEdit && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                        <CreditCard className="size-4 text-muted-foreground" />
                      </div>
                      <span className="text-base font-medium">Billing Management</span>
                    </CardTitle>
                    <CardDescription>
                      Update payment methods, view invoices, and manage your subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleManageBilling}
                      disabled={!!loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Manage Billing
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      You'll be redirected to Stripe's secure billing portal where you can:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Update payment methods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>View and download invoices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Update billing information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Cancel your subscription</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Plan Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Plan Features</CardTitle>
                  <CardDescription>What's included in this team's plan</CardDescription>
                </CardHeader>
                <CardContent>
                  {tier === 'free' && (
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>25 prompts max storage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400">✗</span>
                        <span className="text-gray-500">Cannot run prompts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Public sharing only</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Limited Prompt Lab access</span>
                      </li>
                    </ul>
                  )}
                  {tier === 'pro' && (
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Unlimited prompts and runs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Full Prompt Lab access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Shared libraries and collaboration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Role-based access and permissions</span>
                      </li>
                    </ul>
                  )}
                  {tier === 'enterprise' && (
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Everything in Pro</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Run prompts on latest AI models</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Advanced security features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Priority support</span>
                      </li>
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="mb-2">
                    If you have questions about billing or need assistance with your subscription:
                  </p>
                  <ul className="space-y-1">
                    <li>
                      • Email:{' '}
                      <a href="mailto:support@promptmanage.com" className="underline">
                        support@promptmanage.com
                      </a>
                    </li>
                    <li>
                      • Visit our{' '}
                      <a href="/support" className="underline">
                        Support Center
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-8" />

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
