'use client'

import { useQuery } from '@tanstack/react-query'
import { CreditCard, ExternalLink } from 'lucide-react'
import { useState } from 'react'

import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function BillingPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  // Fetch user session and profile with subscription data
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return session
    },
  })

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile-billing'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_profiles')
        .select(
          'subscription_tier, subscription_status, subscription_period_end, stripe_customer_id',
        )
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
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
      setLoading(false)
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

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <SettingsSidebar session={session} />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      </div>
    )
  }

  const tier = profile?.subscription_tier || 'free'
  const status = profile?.subscription_status
  const periodEnd = profile?.subscription_period_end
  const hasActiveSubscription = profile?.stripe_customer_id && tier !== 'free'

  return (
    <div className="flex h-screen">
      <SettingsSidebar session={session} />
      <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and billing information
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription tier</CardDescription>
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
                      You're currently on the free plan
                    </p>
                  )}
                  {tier === 'team' && (
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
                {tier === 'free' && (
                  <Button asChild>
                    <a href="/pricing">Upgrade Plan</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing Management */}
          {hasActiveSubscription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Management
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
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>What's included in your current plan</CardDescription>
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
              {tier === 'team' && (
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
                    <span>Everything in Team</span>
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
