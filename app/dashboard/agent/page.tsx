'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock,
  FolderIcon,
  Home,
  Plus,
  Settings,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { isAdminEmail } from '@/lib/admin'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/client'

type Agent = {
  id: string
  name: string
  mode: 'autonomous' | 'review'
  is_active: boolean
  temperature: number
  quality_threshold: number
  created_at: string
}

type AgentPrompt = {
  id: string
  topic: string
  keyword: string
  quality_score: number | null
  status: string
  created_at: string
  prompts?: { id: string; name: string; slug: string; is_public: boolean; view_count: number }
}

export default function AgentDashboardPage() {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'prompts' | 'keywords' | 'settings'>(
    'overview',
  )

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const isAdmin = session?.user?.email && isAdminEmail(session.user.email)

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch('/api/agent')
      const json = await res.json()
      return json.agents || []
    },
    enabled: !!isAdmin,
  })

  // Auto-select first agent if available
  if (agents.length > 0 && !selectedAgent) {
    setSelectedAgent(agents[0].id)
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['agent-stats', selectedAgent],
    queryFn: async () => {
      if (!selectedAgent) return null
      const res = await fetch(`/api/agent/stats?agent_id=${selectedAgent}`)
      const json = await res.json()
      return json
    },
    enabled: !!selectedAgent && !!isAdmin,
  })

  const { data: prompts = [], isLoading: promptsLoading } = useQuery({
    queryKey: ['agent-prompts', selectedAgent],
    queryFn: async () => {
      if (!selectedAgent) return []
      const res = await fetch(`/api/agent/prompts?agent_id=${selectedAgent}&limit=100`)
      const json = await res.json()
      return json.prompts || []
    },
    enabled: !!selectedAgent && !!isAdmin,
  })

  const { data: keywords = [] } = useQuery({
    queryKey: ['agent-keywords', selectedAgent],
    queryFn: async () => {
      if (!selectedAgent) return []
      const res = await fetch(`/api/agent/keywords?agent_id=${selectedAgent}`)
      const json = await res.json()
      return json.keywords || []
    },
    enabled: !!selectedAgent && !!isAdmin,
  })

  const { data: userPrompts = [] } = useQuery({
    queryKey: ['prompts', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  if (!isAdmin) {
    return (
      <div className="flex h-screen">
        <Sidebar
          prompts={[]}
          selectedPromptId={null}
          onSelectPrompt={() => {}}
          session={session}
          currentPage="home"
        />
        <main className="dashboard-main">
          <div className="dashboard-container">
            <Card className="p-8 text-center">
              <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (agentsLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar
          prompts={[]}
          selectedPromptId={null}
          onSelectPrompt={() => {}}
          session={session}
          currentPage="home"
        />
        <main className="dashboard-main">
          <div className="dashboard-container">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="mt-4 h-32 w-full" />
          </div>
        </main>
      </div>
    )
  }

  const handleGenerate = async () => {
    if (!selectedAgent) return

    const res = await fetch('/api/agent/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: selectedAgent, batch_size: 5 }),
    })

    const json = await res.json()
    if (json.success) {
      alert(`Generated ${json.generated} prompts!`)
      // Refresh queries
      window.location.reload()
    } else {
      alert(`Error: ${json.error}`)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        prompts={userPrompts}
        selectedPromptId={null}
        onSelectPrompt={() => {}}
        session={session}
        currentPage="home"
      />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Agent Dashboard</h1>
              <p className="text-muted-foreground">Manage autonomous prompt generation agents</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} disabled={!selectedAgent}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Batch
              </Button>
            </div>
          </div>

          {/* Agent Selector */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Agent</CardTitle>
              </CardHeader>
              <CardContent>
                {agents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No agents found.</p>
                    <Button onClick={() => router.push('/dashboard/agent/setup')}>
                      Create Your First Agent
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {agents.map((agent: Agent) => (
                      <Card
                        key={agent.id}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          selectedAgent === agent.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Bot className={`h-5 w-5 ${agent.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <h3 className="font-semibold">{agent.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {agent.mode === 'autonomous' ? 'Auto-publish' : 'Review mode'}
                              </p>
                            </div>
                            {agent.is_active ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          {selectedAgent && (
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
              <TabsList>
                <TabsTrigger value="overview">
                  <Activity className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="prompts">
                  <FolderIcon className="mr-2 h-4 w-4" />
                  Prompts ({prompts.length})
                </TabsTrigger>
                <TabsTrigger value="keywords">
                  <Settings className="mr-2 h-4 w-4" />
                  Keywords ({keywords.length})
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                {statsLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-32" />
                    ))}
                  </div>
                ) : stats ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.stats.total}</div>
                          <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Published</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.stats.published}</div>
                          <p className="text-xs text-muted-foreground">Public prompts</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.stats.review}</div>
                          <p className="text-xs text-muted-foreground">Awaiting approval</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Avg Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.stats.average_quality.toFixed(1)}</div>
                          <p className="text-xs text-muted-foreground">Quality score</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mb-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Generated Today</span>
                              <span className="font-semibold">{stats.stats.generated_today}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Generated This Week</span>
                              <span className="font-semibold">{stats.stats.generated_this_week}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Keywords</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {stats.top_keywords.slice(0, 5).map((k: any) => (
                              <div key={k.keyword} className="flex items-center justify-between text-sm">
                                <span>{k.keyword}</span>
                                <span className="font-semibold">{k.generated_count}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : null}
              </TabsContent>

              {/* Prompts Tab */}
              <TabsContent value="prompts" className="mt-6">
                <AgentPromptsTable prompts={prompts} isLoading={promptsLoading} />
              </TabsContent>

              {/* Keywords Tab */}
              <TabsContent value="keywords" className="mt-6">
                <AgentKeywordsTable keywords={keywords} agentId={selectedAgent} />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <AgentSettings agent={agents.find((a: Agent) => a.id === selectedAgent)} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}

// Agent Prompts Table Component
function AgentPromptsTable({
  prompts,
  isLoading,
}: {
  prompts: AgentPrompt[]
  isLoading: boolean
}) {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredPrompts =
    statusFilter === 'all' ? prompts : prompts.filter((p) => p.status === statusFilter)

  const handlePublish = async (id: string, action: string) => {
    const res = await fetch('/api/agent/publish', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_prompt_id: id, action }),
    })

    const json = await res.json()
    if (json.success) {
      window.location.reload()
    } else {
      alert(`Error: ${json.error}`)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated Prompts</CardTitle>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPrompts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No prompts found.</p>
          ) : (
            filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{prompt.topic}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(prompt.status)}`}>
                        {prompt.status}
                      </span>
                      {prompt.quality_score !== null && (
                        <span className="text-xs text-muted-foreground">
                          Quality: {prompt.quality_score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Keyword: {prompt.keyword}</p>
                    {prompt.prompts && (
                      <Link
                        href={`/p/${prompt.prompts.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Prompt → ({prompt.prompts.view_count} views)
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(prompt.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {prompt.status === 'review' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublish(prompt.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublish(prompt.id, 'publish')}
                        >
                          Publish
                        </Button>
                      </>
                    )}
                    {prompt.status === 'published' && prompt.prompts && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(prompt.id, 'unpublish')}
                      >
                        Unpublish
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Agent Keywords Table Component
function AgentKeywordsTable({ keywords, agentId }: { keywords: any[]; agentId: string }) {
  const [newKeyword, setNewKeyword] = useState('')

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return

    const res = await fetch('/api/agent/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: agentId,
        keywords: [newKeyword.trim()],
      }),
    })

    const json = await res.json()
    if (json.success) {
      setNewKeyword('')
      window.location.reload()
    } else {
      alert(`Error: ${json.error}`)
    }
  }

  const handleDeleteKeyword = async (keywordId: string) => {
    if (!confirm('Delete this keyword?')) return

    const res = await fetch(`/api/agent/keywords?keyword_id=${keywordId}`, {
      method: 'DELETE',
    })

    const json = await res.json()
    if (json.success) {
      window.location.reload()
    } else {
      alert(`Error: ${json.error}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keywords & Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add keyword..."
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
          />
          <Button onClick={handleAddKeyword}>Add</Button>
        </div>
        <div className="space-y-2">
          {keywords.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No keywords yet.</p>
          ) : (
            keywords.map((keyword) => (
              <div key={keyword.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <span className="font-medium">{keyword.keyword}</span>
                  {keyword.category && (
                    <span className="ml-2 text-sm text-muted-foreground">({keyword.category})</span>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Generated: {keyword.generated_count} times
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteKeyword(keyword.id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Agent Settings Component
function AgentSettings({ agent }: { agent: Agent | undefined }) {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    name: agent?.name || '',
    mode: agent?.mode || 'review',
    is_active: agent?.is_active ?? true,
    temperature: agent?.temperature || 0.7,
    quality_threshold: agent?.quality_threshold || 85,
  })

  const handleSave = async () => {
    if (!agent) return

    setLoading(true)
    try {
      const res = await fetch(`/api/agent/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const json = await res.json()
      if (json.agent) {
        alert('Settings saved!')
      } else {
        alert(`Error: ${json.error}`)
      }
    } catch (error) {
      alert('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  if (!agent) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Agent Name</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Mode</label>
          <select
            value={settings.mode}
            onChange={(e) => setSettings({ ...settings, mode: e.target.value as any })}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="review">Review Mode (Manual Approval)</option>
            <option value="autonomous">Autonomous Mode (Auto-Publish)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">
            Temperature: {settings.temperature.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
            className="mt-1 w-full"
          />
          <p className="text-xs text-muted-foreground">Higher = more creative, Lower = more focused</p>
        </div>
        <div>
          <label className="text-sm font-medium">
            Quality Threshold: {settings.quality_threshold}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.quality_threshold}
            onChange={(e) =>
              setSettings({ ...settings, quality_threshold: parseInt(e.target.value) })
            }
            className="mt-1 w-full"
          />
          <p className="text-xs text-muted-foreground">Minimum score to auto-publish (0-100)</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={settings.is_active}
            onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
            className="h-4 w-4"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Agent is Active
          </label>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    failed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }
  return classes[status] || classes.draft
}

