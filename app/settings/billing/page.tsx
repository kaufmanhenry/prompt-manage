'use client'

import { useQuery } from '@tanstack/react-query'
import { CreditCard, ExternalLink, ArrowUp, ArrowDown, X } from 'lucide-react'
import { useState } from 'react'

import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { useUserTeams } from '@/lib/hooks/use-teams'
import { STRIPE_CONFIG } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/client'

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const { currentTeamId } = useTeamContext()
  const { data: teams, isLoading } = useUserTeams()
  const currentTeam = teams?.find((t) => t.team_id === currentTeamId)

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

  const currentPlan = subscriptionStatus?.subscription?.plan || 'free'
  const subscriptionStatusValue = subscriptionStatus?.subscription?.status || 'active'
  const periodEnd = subscriptionStatus?.subscription?.currentPeriodEnd
  const statusMessage = subscriptionStatus?.statusMessage

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

      // If redirect URL, navigate to checkout
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

  if (isLoading || !currentTeamId || !currentTeam) {
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

  const tier = currentTeam.teams.tier || 'free'
  const status = currentTeam.teams.subscription_status
  const periodEnd = currentTeam.teams.subscription_period_end
  const hasActiveSubscription = currentTeam.teams.stripe_customer_id && tier !== 'free'
  const isOwnerOrAdmin = currentTeam.role === 'owner' || currentTeam.role === 'admin'

  return (
    <div className="flex h-screen">
      <SettingsSidebar session={session} />
      <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
              Billing & Subscription
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage subscription and billing for {currentTeam.teams.name}
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

            {/* User Subscription Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Your Subscription</CardTitle>
                <CardDescription>Manage your personal subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTierBadgeColor(currentPlan)}>
                          {STRIPE_CONFIG.plans[currentPlan as keyof typeof STRIPE_CONFIG.plans]
                            ?.name || 'Free'}
                        </Badge>
                        {subscriptionStatusValue && (
                          <Badge className={getStatusBadgeColor(subscriptionStatusValue)}>
                            {subscriptionStatusValue.charAt(0).toUpperCase() +
                              subscriptionStatusValue.slice(1)}
                          </Badge>
                        )}
                      </div>
                      {currentPlan === 'free' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Store up to 25 prompts in your account privately
                        </p>
                      )}
                      {currentPlan === 'team' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${STRIPE_CONFIG.plans.team.price}/month • Unlimited prompts and team sharing
                        </p>
                      )}
                      {currentPlan === 'pro' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${STRIPE_CONFIG.plans.pro.price}/month • Everything in Team plus advanced
                          features
                        </p>
                      )}
                      {periodEnd && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Renews on {formatDate(periodEnd)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentPlan === 'free' && (
                      <>
                        <Button
                          onClick={() => handleUpgrade('team')}
                          disabled={loading === 'upgrade-team'}
                          variant="default"
                        >
                          {loading === 'upgrade-team' ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowUp className="mr-2 h-4 w-4" />
                              Upgrade to Team
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleUpgrade('pro')}
                          disabled={loading === 'upgrade-pro'}
                          variant="outline"
                        >
                          {loading === 'upgrade-pro' ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowUp className="mr-2 h-4 w-4" />
                              Upgrade to Pro
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    {currentPlan === 'team' && (
                      <>
                        <Button
                          onClick={() => handleUpgrade('pro')}
                          disabled={loading === 'upgrade-pro'}
                          variant="default"
                        >
                          {loading === 'upgrade-pro' ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowUp className="mr-2 h-4 w-4" />
                              Upgrade to Pro
                            </>
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" disabled={loading === 'cancel'}>
                              <X className="mr-2 h-4 w-4" />
                              Cancel Subscription
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Your subscription will remain active until the end of your billing
                                period ({periodEnd ? formatDate(periodEnd) : 'next payment date'}
                                ). After that, you'll be moved to the free plan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleCancel}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Cancel Subscription
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    {currentPlan === 'pro' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" disabled={loading === 'cancel'}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel Subscription
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Your subscription will remain active until the end of your billing
                              period ({periodEnd ? formatDate(periodEnd) : 'next payment date'}
                              ). After that, you'll be moved to the free plan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancel}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Cancel Subscription
                            </AlertDialogAction>
                          </AlertDialogContent>
                        </AlertDialog>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permission warning for non-owners/admins */}
            {!isOwnerOrAdmin && (
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                <CardContent className="pt-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Only team owners and admins can manage team billing. Contact your team owner to
                    upgrade or manage team subscriptions.
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
                    {periodEnd && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Renews on {formatDate(periodEnd)}
                      </p>
                    )}
                  </div>
                  {tier === 'free' && isOwnerOrAdmin && (
                    <Button asChild>
                      <a href="/pricing">Upgrade Plan</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Management */}
            {hasActiveSubscription && isOwnerOrAdmin && (
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
                    disabled={loading}
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
                      <span>Private collections with advanced security</span>
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
        </div>
      </div>
    </div>
  )
}
