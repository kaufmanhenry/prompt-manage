'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  AlertCircle,
  Brain,
  Code,
  Database,
  Download,
  Eye,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/utils/supabase/client'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Check admin access
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !isAdminEmail(user.email)) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      setLoading(false)
    }

    void checkAdmin()
  }, [router, supabase])

  // Fetch free tool usage data
  const { data: freeToolData, isLoading: freeToolLoading } = useQuery({
    queryKey: ['admin-free-tool-usage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('free_tool_usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      return data
    },
    enabled: isAdmin,
  })

  // Fetch agents data
  const { data: agentsData, isLoading: agentsLoading } = useQuery({
    queryKey: ['admin-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select(
          `
          *,
          agent_generations(count),
          agent_metrics(*)
        `,
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: isAdmin,
  })

  // Fetch user statistics
  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, subscription_tier, created_at')

      if (error) throw error

      const total = data.length
      const free = data.filter((u) => u.subscription_tier === 'free').length
      const team = data.filter((u) => u.subscription_tier === 'team').length
      const enterprise = data.filter((u) => u.subscription_tier === 'enterprise').length

      return { total, free, team, enterprise }
    },
    enabled: isAdmin,
  })

  // Fetch detailed user list
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(
          'id, email, full_name, subscription_tier, subscription_status, subscription_period_end, created_at',
        )
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Get prompt counts for each user
      const usersWithCounts = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count: promptCount } = await supabase
            .from('prompts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)

          return {
            ...profile,
            prompt_count: promptCount || 0,
          }
        }),
      )

      return usersWithCounts
    },
    enabled: isAdmin,
  })

  // Fetch prompt statistics
  const { data: promptStats, isLoading: promptStatsLoading } = useQuery({
    queryKey: ['admin-prompt-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('prompts').select('id, is_public, created_at')

      if (error) throw error

      const total = data.length
      const publicPrompts = data.filter((p) => p.is_public).length
      const privatePrompts = total - publicPrompts

      return { total, public: publicPrompts, private: privatePrompts }
    },
    enabled: isAdmin,
  })

  // Export free tool data as CSV
  const exportFreeToolData = () => {
    if (!freeToolData) return

    const headers = ['Tool Name', 'User ID', 'IP Address', 'Saved to Library', 'Created At']
    const rows = freeToolData.map((item) => [
      item.tool_name,
      item.user_id || 'Anonymous',
      item.ip_address,
      item.saved_to_library ? 'Yes' : 'No',
      new Date(item.created_at).toLocaleString(),
    ])

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `free-tool-usage-${new Date().toISOString()}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  // Calculate free tool stats
  const freeToolStats = {
    total: freeToolData?.length || 0,
    claudeCreator: freeToolData?.filter((item) => item.tool_name === 'claude-creator').length || 0,
    cursorCreator: freeToolData?.filter((item) => item.tool_name === 'cursor-creator').length || 0,
    optimizer: freeToolData?.filter((item) => item.tool_name === 'optimizer').length || 0,
    saved: freeToolData?.filter((item) => item.saved_to_library).length || 0,
    loggedIn: freeToolData?.filter((item) => item.user_id !== null).length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">System overview and data management</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {userStatsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{userStats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {userStats?.team || 0} team, {userStats?.enterprise || 0} enterprise
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {promptStatsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{promptStats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {promptStats?.public || 0} public, {promptStats?.private || 0} private
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Tool Uses</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {freeToolLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{freeToolStats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {freeToolStats.saved} saved to library
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {agentsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {agentsData?.filter((a) => a.is_active).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {agentsData?.length || 0} total agents
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="free-tools" className="space-y-4">
          <TabsList>
            <TabsTrigger value="free-tools">
              <Sparkles className="mr-2 h-4 w-4" />
              Free Tool Usage
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Brain className="mr-2 h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="cost-tracking">
              <TrendingUp className="mr-2 h-4 w-4" />
              Cost & Tokens
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="mr-2 h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Free Tools Tab */}
          <TabsContent value="free-tools" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Free Tool Usage</CardTitle>
                    <CardDescription>
                      Recent usage of Claude Creator, Cursor Creator, and Optimizer
                    </CardDescription>
                  </div>
                  <Button onClick={exportFreeToolData} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Claude Creator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {freeToolStats.claudeCreator}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Cursor Creator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {freeToolStats.cursorCreator}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Optimizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {freeToolStats.optimizer}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {freeToolLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tool</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Saved</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {freeToolData?.slice(0, 50).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge
                              className={
                                item.tool_name === 'claude-creator'
                                  ? 'bg-purple-100 text-purple-800'
                                  : item.tool_name === 'cursor-creator'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                              }
                            >
                              {item.tool_name === 'claude-creator' && (
                                <Brain className="mr-1 h-3 w-3" />
                              )}
                              {item.tool_name === 'cursor-creator' && (
                                <Code className="mr-1 h-3 w-3" />
                              )}
                              {item.tool_name === 'optimizer' && (
                                <Sparkles className="mr-1 h-3 w-3" />
                              )}
                              {item.tool_name
                                .split('-')
                                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.user_id ? (
                              <Link
                                href={`/u/${item.user_id}`}
                                className="text-blue-600 hover:underline"
                              >
                                {item.user_id.slice(0, 8)}...
                              </Link>
                            ) : (
                              <span className="text-gray-500">Anonymous</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{item.ip_address}</TableCell>
                          <TableCell>
                            {item.saved_to_library ? (
                              <Badge className="bg-green-100 text-green-800">Yes</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(item.created_at).toLocaleDateString()}{' '}
                            {new Date(item.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (item.prompt_generated) {
                                  alert(item.prompt_generated)
                                }
                              }}
                              disabled={!item.prompt_generated}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost & Tokens Tab */}
          <TabsContent value="cost-tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Token & Cost Tracking System</CardTitle>
                <CardDescription>
                  Real-time monitoring of API usage, token consumption, and costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Token Tracking System Status:</strong> Ready to deploy
                    <br />
                    <br />
                    <strong>Migration Required:</strong> Run{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
                      20250115000000_token_tracking_system.sql
                    </code>{' '}
                    in Supabase SQL Editor
                    <br />
                    <br />
                    <strong>What you'll get:</strong>
                    <ul className="ml-4 mt-2 list-disc space-y-1">
                      <li>Real-time token usage tracking per prompt run</li>
                      <li>Cost calculation for all AI models (GPT-4, Claude, etc.)</li>
                      <li>Budget management and alerts</li>
                      <li>Usage analytics by user, team, and prompt</li>
                      <li>Monthly cost projections</li>
                      <li>Cost optimization suggestions</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Database Tables</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>prompt_runs</span>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>token_usage</span>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>user_budgets</span>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>cost_alerts</span>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>model_pricing</span>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">React Components</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>TokenPreview</span>
                        <Badge className="bg-green-100 text-green-800">Built</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>TokenUsageDisplay</span>
                        <Badge className="bg-green-100 text-green-800">Built</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>BudgetWarning</span>
                        <Badge className="bg-green-100 text-green-800">Built</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3 text-blue-600" />
                        <span>Real-time tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span>Cost projections</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-yellow-600" />
                        <span>Budget alerts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-3 w-3 text-purple-600" />
                        <span>Usage analytics</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">Documentation</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="rounded-lg border p-3">
                        <p className="font-medium">📚 Master Index</p>
                        <p className="text-sm text-muted-foreground">
                          docs/features/TOKEN-TRACKING-README.md
                        </p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="font-medium">🏗️ System Architecture</p>
                        <p className="text-sm text-muted-foreground">
                          docs/features/token-tracking-system.md
                        </p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="font-medium">🔌 API Implementation</p>
                        <p className="text-sm text-muted-foreground">
                          docs/features/token-tracking-api-implementation.md
                        </p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <p className="font-medium">🎨 UI Components</p>
                        <p className="text-sm text-muted-foreground">
                          docs/features/token-tracking-ui-components.md
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                      🚀 Ready to Deploy
                    </h4>
                    <p className="mb-4 text-sm text-blue-800 dark:text-blue-200">
                      Everything is built and ready. Just run the migration to activate:
                    </p>
                    <ol className="list-decimal space-y-2 pl-4 text-sm text-blue-900 dark:text-blue-100">
                      <li>Go to Supabase Dashboard → SQL Editor</li>
                      <li>
                        Open{' '}
                        <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900">
                          supabase/migrations/20250115000000_token_tracking_system.sql
                        </code>
                      </li>
                      <li>Copy and paste into SQL Editor</li>
                      <li>Click "Run"</li>
                      <li>Refresh this dashboard to see live data</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI Agents</CardTitle>
                    <CardDescription>Autonomous agents generating prompts</CardDescription>
                  </div>
                  <Link href="/dashboard/agents">
                    <Button variant="outline" size="sm">
                      Manage Agents
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {agentsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Generations</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentsData?.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell className="font-medium">{agent.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{agent.department}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge>{agent.strategy}</Badge>
                          </TableCell>
                          <TableCell>
                            {agent.is_active ? (
                              <Badge className="bg-green-100 text-green-800">
                                <Activity className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>{agent.agent_generations?.[0]?.count || 0}</TableCell>
                          <TableCell>
                            <Link href={`/dashboard/agents?id=${agent.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>User Overview</CardTitle>
                <CardDescription>User statistics and subscription breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {userStatsLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userStats?.total || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Free</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-gray-600">
                          {userStats?.free || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Team</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                          {userStats?.team || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Enterprise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                          {userStats?.enterprise || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed User List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                      Complete list of registered users with subscription details
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{allUsers?.length || 0} total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-2">
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : allUsers && allUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Prompts</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Subscription End</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span className="text-sm">{user.email}</span>
                                <span className="text-xs text-muted-foreground">
                                  ID: {user.id.slice(0, 8)}...
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.full_name || <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.subscription_tier === 'enterprise'
                                    ? 'bg-purple-100 text-purple-800'
                                    : user.subscription_tier === 'team'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {user.subscription_tier || 'free'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.subscription_status ? (
                                <Badge
                                  variant={
                                    user.subscription_status === 'active' ? 'default' : 'outline'
                                  }
                                  className={
                                    user.subscription_status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : ''
                                  }
                                >
                                  {user.subscription_status}
                                </Badge>
                              ) : (
                                <Badge variant="outline">free</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span>{user.prompt_count}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </TableCell>
                            <TableCell>
                              {user.subscription_period_end ? (
                                <span className="text-sm">
                                  {new Date(user.subscription_period_end).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    },
                                  )}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">No users found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Database and system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Database Status</p>
                      <p className="text-sm text-muted-foreground">Supabase connection</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Activity className="mr-1 h-3 w-3" />
                      Healthy
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Admin Access</p>
                      <p className="text-sm text-muted-foreground">Current permissions</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Full Access</Badge>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Link href="/dashboard/agents">
                      <Button variant="outline">
                        <Brain className="mr-2 h-4 w-4" />
                        Manage Agents
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Prompts
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
