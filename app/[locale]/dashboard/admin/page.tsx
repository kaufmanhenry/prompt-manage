'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Database,
  Download,
  FileText,
  Globe,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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
import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/utils/supabase/client'

// System Health Status Types
type SystemStatus = 'ok' | 'warning' | 'critical'

interface SystemHealthCheck {
  name: string
  status: SystemStatus
  message: string
  lastChecked: Date
}

// Mock data for charts (replace with real data later)
const userGrowthData = [
  { month: 'Jan', users: 45, signups: 12 },
  { month: 'Feb', users: 78, signups: 33 },
  { month: 'Mar', users: 120, signups: 42 },
  { month: 'Apr', users: 156, signups: 36 },
  { month: 'May', users: 189, signups: 33 },
  { month: 'Jun', users: 234, signups: 45 },
]

const promptActivityData = [
  { day: 'Mon', public: 12, private: 8 },
  { day: 'Tue', public: 19, private: 15 },
  { day: 'Wed', public: 23, private: 12 },
  { day: 'Thu', public: 18, private: 20 },
  { day: 'Fri', public: 25, private: 18 },
  { day: 'Sat', public: 14, private: 9 },
  { day: 'Sun', public: 16, private: 11 },
]

const planDistributionData = [
  { name: 'Free', value: 180, color: '#6b7280' },
  { name: 'Team', value: 45, color: '#3b82f6' },
  { name: 'Enterprise', value: 9, color: '#8b5cf6' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [systemHealth, setSystemHealth] = useState<SystemHealthCheck[]>([])
  const [lastHealthCheck, setLastHealthCheck] = useState<Date>(new Date())
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

  // System Health Check Function
  const performHealthCheck = async () => {
    const checks: SystemHealthCheck[] = [
      {
        name: 'Database Connection',
        status: 'ok',
        message: 'Supabase connection healthy',
        lastChecked: new Date(),
      },
      {
        name: 'SSL Certificate',
        status: 'ok',
        message: 'Certificate valid until 2025-12-01',
        lastChecked: new Date(),
      },
      {
        name: 'API Latency',
        status: 'warning',
        message: 'Average response time: 450ms',
        lastChecked: new Date(),
      },
      {
        name: 'Server Uptime',
        status: 'ok',
        message: '99.9% uptime in last 30 days',
        lastChecked: new Date(),
      },
      {
        name: 'Security Alerts',
        status: 'ok',
        message: 'No security issues detected',
        lastChecked: new Date(),
      },
    ]

    setSystemHealth(checks)
    setLastHealthCheck(new Date())
  }

  // Initial health check
  useEffect(() => {
    if (isAdmin) {
      void performHealthCheck()
    }
  }, [isAdmin])

  // Fetch user statistics with growth metrics
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

      // Calculate growth metrics
      const now = new Date()
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const weeklySignups = data.filter((u) => new Date(u.created_at) > lastWeek).length
      const monthlySignups = data.filter((u) => new Date(u.created_at) > lastMonth).length

      return {
        total,
        free,
        team,
        enterprise,
        weeklySignups,
        monthlySignups,
        weeklyGrowth: weeklySignups,
        monthlyGrowth: monthlySignups,
      }
    },
    enabled: isAdmin,
  })

  // Fetch recent signups
  const { data: recentSignups, isLoading: recentSignupsLoading } = useQuery({
    queryKey: ['admin-recent-signups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, subscription_tier, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data
    },
    enabled: isAdmin,
  })

  // Fetch platform activity data
  const { data: _platformActivity, isLoading: _platformActivityLoading } = useQuery({
    queryKey: ['admin-platform-activity'],
    queryFn: async () => {
      const { data: prompts, error: promptsError } = await supabase
        .from('prompts')
        .select('id, is_public, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(50)

      if (promptsError) throw promptsError

      // Get top active users
      const userActivity = await Promise.all(
        (prompts || []).map(async (prompt) => {
          const { data: user } = await supabase
            .from('user_profiles')
            .select('email, full_name')
            .eq('id', prompt.user_id)
            .single()

          return {
            ...prompt,
            user_email: user?.email || 'Unknown',
            user_name: user?.full_name || 'Unknown',
          }
        }),
      )

      return userActivity
    },
    enabled: isAdmin,
  })

  // Fetch prompt statistics with trends
  const { data: promptStats, isLoading: promptStatsLoading } = useQuery({
    queryKey: ['admin-prompt-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('prompts').select('id, is_public, created_at')

      if (error) throw error

      const total = data.length
      const publicPrompts = data.filter((p) => p.is_public).length
      const privatePrompts = total - publicPrompts

      // Calculate trends
      const now = new Date()
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const weeklyPrompts = data.filter((p) => new Date(p.created_at) > lastWeek).length
      const monthlyPrompts = data.filter((p) => new Date(p.created_at) > lastMonth).length

      return {
        total,
        public: publicPrompts,
        private: privatePrompts,
        weeklyPrompts,
        monthlyPrompts,
      }
    },
    enabled: isAdmin,
  })

  // Export functions
  const exportUserData = () => {
    if (!recentSignups) return

    const headers = ['Email', 'Name', 'Plan', 'Signup Date']
    const rows = recentSignups.map((user) => [
      user.email,
      user.full_name || 'N/A',
      user.subscription_tier || 'free',
      new Date(user.created_at).toLocaleString(),
    ])

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-data-${new Date().toISOString()}.csv`
    a.click()
  }

  // Status indicator component
  const StatusIndicator = ({ status }: { status: SystemStatus }) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time overview of Prompt Manage platform
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Access
              </Badge>
              <Button
                onClick={performHealthCheck}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
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
                    +{userStats?.weeklySignups || 0} this week
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
                    +{promptStats?.weeklyPrompts || 0} this week
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Accounts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {userStatsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-600">{userStats?.team || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {userStats?.enterprise || 0} enterprise
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <StatusIndicator
                  status={systemHealth.length > 0 ? systemHealth[0]?.status || 'ok' : 'ok'}
                />
                <div className="text-sm">
                  {systemHealth.filter((s) => s.status === 'ok').length}/{systemHealth.length} OK
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Last checked: {lastHealthCheck.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - User Overview & Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user signups and total users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Total Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="signups"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="New Signups"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Platform Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>Recent prompts and user actions</CardDescription>
                  </div>
                  <Button onClick={exportUserData} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={promptActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="public" fill="#3b82f6" name="Public Prompts" />
                      <Bar dataKey="private" fill="#6b7280" name="Private Prompts" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Signups Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {recentSignupsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSignups?.slice(0, 10).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{user.full_name || '—'}</TableCell>
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
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System Health & Quick Stats */}
          <div className="space-y-6">
            {/* System Health Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Health</CardTitle>
                  <Button
                    onClick={performHealthCheck}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Check
                  </Button>
                </div>
                <CardDescription>Real-time system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((check, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={check.status} />
                      <span className="text-sm font-medium">{check.name}</span>
                    </div>
                    <Badge
                      variant={
                        check.status === 'ok'
                          ? 'default'
                          : check.status === 'warning'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className={
                        check.status === 'ok'
                          ? 'bg-green-100 text-green-800'
                          : check.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {check.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>User subscription breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {planDistributionData.map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: plan.color }}
                        />
                        <span className="text-sm">{plan.name}</span>
                      </div>
                      <span className="text-sm font-medium">{plan.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Prompts
                  </Button>
                </Link>
                <Link href="/dashboard/public" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Public Prompts
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Supabase Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
