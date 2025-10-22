'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ArrowUpRight,
  BarChart3,
  Clock,
  Eye,
  FileText,
  Globe,
  Sparkles,
  TrendingUp,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { PromptForm } from '@/components/PromptForm'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Prompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

export default function DashboardHomePage() {
  const router = useRouter()
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Prompt[]
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Calculate statistics
  const stats = useMemo(() => {
    if (!prompts.length) {
      return {
        totalPrompts: 0,
        publicPrompts: 0,
        totalViews: 0,
        recentPrompts: [],
        topModels: [],
        topTags: [],
      }
    }

    const totalPrompts = prompts.length
    const publicPrompts = prompts.filter((p) => p.is_public).length
    const totalViews = prompts.reduce((sum, p) => sum + (p.view_count || 0), 0)

    // Get 5 most recent prompts
    const recentPrompts = prompts.slice(0, 5)

    // Calculate top models
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
      .slice(0, 5)
      .map(([model, count]) => ({ model, count }))

    // Calculate top tags
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
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    return {
      totalPrompts,
      publicPrompts,
      totalViews,
      recentPrompts,
      topModels,
      topTags,
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

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
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.user_metadata?.display_name || 'User'}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid-stat-cards">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
                <div title="Total Prompts">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPrompts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publicPrompts} public, {stats.totalPrompts - stats.publicPrompts} private
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Public Prompts</CardTitle>
                <div 
                  title="View your public profile"
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => window.open(`/u/${session?.user?.user_metadata?.username || session?.user?.id}`, '_blank')}
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publicPrompts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPrompts > 0
                    ? Math.round((stats.publicPrompts / stats.totalPrompts) * 100)
                    : 0}
                  % of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <div title="Total Views">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all public prompts</p>
              </CardContent>
            </Card>

            <Card className="flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Sparkles className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Create New Prompt</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Start building your next AI prompt
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="w-full"
                >
                  Create Prompt
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentPrompts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Sparkles className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-medium">No prompts yet</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Create your first prompt to get started
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>Create Prompt</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentPrompts.map((prompt) => (
                      <Link
                        key={prompt.id}
                        href={`/dashboard/prompts?prompt=${prompt.id}`}
                        className="flex items-start justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{prompt.name}</p>
                            {prompt.is_public && (
                              <Globe className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          {prompt.description && (
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {prompt.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {prompt.model && <span>{prompt.model}</span>}
                            {prompt.view_count !== undefined && prompt.view_count > 0 && (
                              <>
                                <span>•</span>
                                <span>{prompt.view_count} views</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topModels.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No model data available
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.topModels.map(({ model, count }, index) => (
                      <div key={model} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{model}</p>
                            <p className="text-sm text-muted-foreground">{count} prompts</p>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-accent">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(count / stats.totalPrompts) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Tags */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Top Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topTags.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No tags found. Add tags to your prompts to organize them better.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {stats.topTags.map(({ tag, count }) => (
                      <Link
                        key={tag}
                        href={`/dashboard/prompts?tag=${encodeURIComponent(tag)}`}
                        className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
                      >
                        <span className="font-medium">{tag}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {count}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Prompt Form */}
      <PromptForm 
        prompt={null} 
        open={showCreateForm} 
        onOpenChange={setShowCreateForm} 
      />
    </div>
  )
}
