'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  BarChart3,
  Clock,
  Eye,
  FileText,
  Globe,
  Plus,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { ImportExportDialog } from '@/components/ImportExportDialog'
import { PromptForm } from '@/components/PromptForm'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { usePaywall } from '@/hooks/usePaywall'
import type { Prompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

export default function DashboardHomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const { usage, subscription, canCreatePrompt, PaywallComponent } = usePaywall()
  const { currentTeamId } = useTeamContext()

  // Handle checkout success/cancel redirects
  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'success') {
      toast({
        title: 'Payment successful!',
        description: 'Your subscription is now active. Thank you for upgrading!',
      })
      void queryClient.invalidateQueries({ queryKey: ['subscription'] })
      router.replace('/dashboard')
    } else if (checkout === 'canceled') {
      toast({
        title: 'Checkout canceled',
        description: 'You can complete your subscription anytime from the pricing page.',
        variant: 'default',
      })
      router.replace('/dashboard')
    }
  }, [searchParams, toast, router, queryClient])

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      const { data } = await createClient()
        .from('user_profiles')
        .select('username')
        .eq('id', session.user.id)
        .single()
      return data as { username: string } | null
    },
    enabled: !!session?.user?.id,
  })

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts', session?.user?.id, currentTeamId],
    queryFn: async () => {
      if (!currentTeamId) return []

      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('team_id', currentTeamId)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Prompt[]
    },
    enabled: !!session?.user?.id && !!currentTeamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const stats = useMemo(() => {
    if (!prompts.length) {
      return {
        totalPrompts: 0,
        publicPrompts: 0,
        totalViews: 0,
        recentPrompts: [],
        topModels: [],
        topTags: [],
        promptsThisWeek: 0,
        promptsThisMonth: 0,
        weekGrowth: '0',
      }
    }

    const totalPrompts = prompts.length
    const publicPrompts = prompts.filter((p) => p.is_public).length
    const totalViews = prompts.reduce((sum, p) => sum + (p.view_count || 0), 0)
    const recentPrompts = prompts.slice(0, 5)

    const modelCounts = prompts.reduce(
      (acc, p) => {
        if (p.model) {
          acc[p.model] = (acc[p.model] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
    const topModels = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([model, count]) => ({ model, count }))

    const tagCounts = prompts.reduce(
      (acc, p) => {
        p.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }))

    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const promptsThisWeek = prompts.filter(
      (p) => new Date(p.updated_at || p.inserted_at || 0) > lastWeek,
    ).length
    const promptsThisMonth = prompts.filter(
      (p) => new Date(p.updated_at || p.inserted_at || 0) > lastMonth,
    ).length

    const weekGrowth = totalPrompts > 0 ? ((promptsThisWeek / totalPrompts) * 100).toFixed(1) : '0'

    return {
      totalPrompts,
      publicPrompts,
      totalViews,
      recentPrompts,
      topModels,
      topTags,
      promptsThisWeek,
      promptsThisMonth,
      weekGrowth,
    }
  }, [prompts])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar
          isLoading={true}
          prompts={[]}
          selectedPromptId={null}
          onSelectPrompt={() => {}}
          onNewPrompt={() => setShowCreateForm(true)}
          session={session}
        />
        <main className="flex-1 overflow-y-auto bg-accent/50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const hasPrompts = stats.totalPrompts > 0

  return (
    <div className="flex h-screen">
      <Sidebar
        isLoading={isLoading}
        prompts={prompts}
        selectedPromptId={null}
        onSelectPrompt={(id) => router.push(`/dashboard/prompts?prompt=${id}`)}
        onNewPrompt={() => setShowCreateForm(true)}
        session={session}
        currentPage="home"
      />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-accent/20">
        <div className="mx-auto max-w-7xl p-8">
          {/* Header with action */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {session?.user?.user_metadata?.display_name || 'there'}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {hasPrompts
                  ? `You have ${stats.totalPrompts} prompt${stats.totalPrompts === 1 ? '' : 's'} in your library`
                  : 'Get started by creating your first prompt'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {subscription?.plan !== 'free' && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => setShowImportExport(true)}
                >
                  <Upload className="h-4 w-4" />
                  Import / Export
                </Button>
              )}
              <Button
                onClick={() => {
                  if (!canCreatePrompt) {
                    toast({
                      title: 'Prompt Limit Reached',
                      description:
                        'You have reached your prompt limit. Please upgrade or delete prompts.',
                      variant: 'destructive',
                    })
                    return
                  }
                  setShowCreateForm(true)
                }}
                size="lg"
                className="gap-2"
                disabled={!canCreatePrompt}
              >
                <Plus className="h-4 w-4" />
                New Prompt
              </Button>
            </div>
          </div>

          {/* Usage Warning for Free Users */}
          {subscription?.plan === 'free' && usage && (
            <Card className="mb-8 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/50 dark:border-amber-800 dark:from-amber-950/20 dark:to-amber-950/10">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Free Plan Usage</CardTitle>
                    <CardDescription className="mt-1">
                      {usage.promptsTotal} of 25 prompts used
                    </CardDescription>
                  </div>
                  {usage.promptsTotal >= 20 && (
                    <Button size="sm" variant="default" asChild>
                      <Link href="/pricing">Upgrade</Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Progress
                  value={Math.min((usage.promptsTotal / 25) * 100, 100)}
                  className={`h-2 ${
                    usage.promptsTotal >= 25
                      ? '[&>div]:bg-red-500'
                      : usage.promptsTotal >= 20
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-emerald-500'
                  }`}
                />
                {usage.promptsTotal >= 25 && (
                  <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                    You've reached your limit. Upgrade for unlimited prompts.
                  </p>
                )}
                {usage.promptsTotal >= 20 && usage.promptsTotal < 25 && (
                  <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                    You're approaching your limit. Consider upgrading for unlimited prompts.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {PaywallComponent}

          {hasPrompts ? (
            <>
              {/* Quick Stats */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Total Prompts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalPrompts}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stats.publicPrompts} public · {stats.totalPrompts - stats.publicPrompts}{' '}
                      private
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.promptsThisWeek}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stats.weekGrowth}% of total prompts
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`transition-colors ${userProfile?.username ? 'cursor-pointer hover:bg-accent' : ''}`}
                  onClick={() => {
                    if (userProfile?.username) {
                      window.open(`/u/${userProfile.username}`, '_blank')
                    }
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      Total Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    {userProfile?.username && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        View public profile <ArrowRight className="h-3 w-3" />
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Prompts */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Recent Prompts
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Your most recently updated prompts
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/prompts">
                          View all
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.recentPrompts.map((prompt) => (
                        <Link
                          key={prompt.id}
                          href={`/dashboard/prompts?prompt=${prompt.id}`}
                          className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold group-hover:text-primary">
                                {prompt.name}
                              </p>
                              {prompt.is_public && (
                                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {prompt.model && <span>{prompt.model}</span>}
                              {prompt.view_count !== undefined && prompt.view_count > 0 && (
                                <>
                                  <span>·</span>
                                  <span>{prompt.view_count} views</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Models */}
                {stats.topModels.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Top Models
                      </CardTitle>
                      <CardDescription>Most used AI models in your prompts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.topModels.map(({ model, count }) => (
                          <div key={model} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{model}</span>
                              <span className="text-muted-foreground">
                                {count} prompt{count === 1 ? '' : 's'}
                              </span>
                            </div>
                            <Progress value={(count / stats.totalPrompts) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top Tags */}
                {stats.topTags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Popular Tags
                      </CardTitle>
                      <CardDescription>Most frequently used tags</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {stats.topTags.map(({ tag, count }) => (
                          <Link
                            key={tag}
                            href={`/dashboard/prompts?tag=${encodeURIComponent(tag)}`}
                            className="inline-flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/10"
                          >
                            <span>{tag}</span>
                            <span className="text-xs text-muted-foreground">({count})</span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 text-2xl font-semibold">Create your first prompt</h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                  Start building your AI prompt library. Create, organize, and manage prompts for
                  any use case.
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  size="lg"
                  className="gap-2"
                  disabled={!canCreatePrompt}
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Prompt
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <PromptForm prompt={null} open={showCreateForm} onOpenChange={setShowCreateForm} />
      <ImportExportDialog
        open={showImportExport}
        onOpenChange={setShowImportExport}
        promptCount={stats.totalPrompts}
      />
    </div>
  )
}
