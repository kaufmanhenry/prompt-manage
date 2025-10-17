'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bot, Pause, Play, Star, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

interface Agent {
  id: string
  name: string
  description: string
  strategy: string
  is_active: boolean
  config: Record<string, unknown>
  created_at: string
  department: string
  output_type: string
  output_format: Record<string, unknown>
  target_audience: string
  tone: string
  length_preference: string
  brand_guidelines: Record<string, unknown>
  quality_standards: Record<string, unknown>
  required_elements: Record<string, unknown>
  key_phrases: string[]
  forbidden_phrases: string[]
  style_guide: string
  examples: Record<string, unknown>
  review_required: boolean
  min_quality_score: number
  agent_generations: Array<{ count: number }>
  agent_metrics: Array<{
    date: string
    prompts_generated: number
    total_cost_usd: number
    avg_quality_score: number
    prompts_published: number
    total_views: number
  }>
}

const DEPARTMENTS = [
  { value: 'marketing', label: 'Marketing', icon: '📊' },
  { value: 'support', label: 'Support', icon: '💬' },
  { value: 'legal', label: 'Legal', icon: '⚖️' },
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'engineering', label: 'Engineering', icon: '⚙️' },
  { value: 'sales', label: 'Sales', icon: '💰' },
  { value: 'content', label: 'Content', icon: '✍️' },
  { value: 'product', label: 'Product', icon: '📦' },
  { value: 'operations', label: 'Operations', icon: '🔧' },
  { value: 'general', label: 'General', icon: '📂' },
] as const

const OUTPUT_TYPES = [
  { value: 'prompt', label: 'AI Prompt', icon: '💡' },
  { value: 'blog_post', label: 'Blog Post', icon: '📝' },
  { value: 'documentation', label: 'Documentation', icon: '📚' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'social_media', label: 'Social Media', icon: '📱' },
  { value: 'code', label: 'Code Snippet', icon: '💻' },
  { value: 'presentation', label: 'Presentation', icon: '📊' },
  { value: 'script', label: 'Script', icon: '🎬' },
  { value: 'whitepaper', label: 'Whitepaper', icon: '📄' },
  { value: 'case_study', label: 'Case Study', icon: '📖' },
  { value: 'tutorial', label: 'Tutorial', icon: '🎓' },
  { value: 'newsletter', label: 'Newsletter', icon: '📰' },
  { value: 'landing_page', label: 'Landing Page', icon: '🌐' },
  { value: 'product_description', label: 'Product Description', icon: '🏷️' },
  { value: 'ads', label: 'Ad Copy', icon: '📢' },
  { value: 'report', label: 'Report', icon: '📈' },
  { value: 'other', label: 'Other', icon: '📌' },
] as const

const TONE_OPTIONS = [
  'professional',
  'casual',
  'friendly',
  'formal',
  'conversational',
  'authoritative',
  'empathetic',
  'persuasive',
  'educational',
  'entertaining',
] as const

const LENGTH_OPTIONS = ['concise', 'medium', 'detailed', 'comprehensive'] as const

export function AgentDashboard() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    strategy: '',
    department: 'general',
    output_type: 'prompt',
    target_audience: '',
    tone: 'professional',
    length_preference: 'medium',
    output_format: {},
    brand_guidelines: {},
    quality_standards: {},
    required_elements: {},
    key_phrases: [] as string[],
    forbidden_phrases: [] as string[],
    style_guide: '',
    examples: {},
    review_required: false,
    min_quality_score: 0.7,
    config: {},
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showQualityControl, setShowQualityControl] = useState(false)

  // Fetch agents
  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')
      return response.json()
    },
  })

  // Toggle agent active status
  const toggleAgentMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const response = await fetch('/api/agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active }),
      })
      if (!response.ok) throw new Error('Failed to update agent')
      return response.json()
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agents'] })
      toast({ title: 'Agent updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update agent', variant: 'destructive' })
    },
  })

  // Create new agent
  const createAgentMutation = useMutation({
    mutationFn: async (agentData: typeof createForm) => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData),
      })
      if (!response.ok) throw new Error('Failed to create agent')
      return response.json()
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agents'] })
      toast({ title: 'Agent created successfully' })
      setShowCreateDialog(false)
      setShowAdvanced(false)
      setCreateForm({
        name: '',
        description: '',
        strategy: '',
        department: 'general',
        output_type: 'prompt',
        target_audience: '',
        tone: 'professional',
        length_preference: 'medium',
        output_format: {},
        brand_guidelines: {},
        quality_standards: {},
        required_elements: {},
        key_phrases: [],
        forbidden_phrases: [],
        style_guide: '',
        examples: {},
        review_required: false,
        min_quality_score: 0.7,
        config: {},
      })
    },
    onError: () => {
      toast({ title: 'Failed to create agent', variant: 'destructive' })
    },
  })

  // Trigger manual generation
  const generateMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const response = await fetch(`/api/agents/schedule?agentId=${agentId}`)
      if (!response.ok) throw new Error('Failed to generate prompt')
      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: 'Prompt generated!',
        description: `Quality score: ${data.generation.quality_score.toFixed(2)}`,
      })
      void queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: () => {
      toast({ title: 'Failed to generate prompt', variant: 'destructive' })
    },
  })

  const agents: Agent[] = agentsData?.agents || []

  // Filter agents by department
  const filteredAgents = selectedDepartment
    ? agents.filter((agent) => agent.department === selectedDepartment)
    : agents

  // Group agents by department
  const agentsByDepartment = agents.reduce(
    (acc, agent) => {
      const dept = agent.department || 'general'
      if (!acc[dept]) acc[dept] = []
      acc[dept].push(agent)
      return acc
    },
    {} as Record<string, Agent[]>,
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autonomous Agents</h1>
          <p className="text-muted-foreground">
            AI agents that continuously generate useful prompts for the public directory
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Bot className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Department Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Department:</span>
        <Button
          size="sm"
          variant={!selectedDepartment ? 'default' : 'outline'}
          onClick={() => setSelectedDepartment(null)}
        >
          All ({agents.length})
        </Button>
        {DEPARTMENTS.map((dept) => {
          const count = agentsByDepartment[dept.value]?.length || 0
          if (count === 0) return null
          return (
            <Button
              key={dept.value}
              size="sm"
              variant={selectedDepartment === dept.value ? 'default' : 'outline'}
              onClick={() => setSelectedDepartment(dept.value)}
            >
              {dept.icon} {dept.label} ({count})
            </Button>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {agents.filter((a) => a.is_active).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prompts Generated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agents.reduce((sum, agent) => sum + (agent.agent_generations[0]?.count || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agents.reduce(
                    (sum, agent) =>
                      sum +
                      agent.agent_metrics.reduce((mSum, metric) => mSum + metric.total_views, 0),
                    0,
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Generated prompts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Quality</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agents.length > 0
                    ? (
                        agents.reduce((sum, agent) => {
                          const avgScore =
                            agent.agent_metrics.reduce(
                              (mSum, metric) => mSum + metric.avg_quality_score,
                              0,
                            ) / agent.agent_metrics.length || 0
                          return sum + avgScore
                        }, 0) / agents.length
                      ).toFixed(2)
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">Out of 1.0</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                      {agent.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{agent.strategy}</Badge>
                    {agent.department && (
                      <Badge variant="secondary">
                        {DEPARTMENTS.find((d) => d.value === agent.department)?.icon}{' '}
                        {DEPARTMENTS.find((d) => d.value === agent.department)?.label}
                      </Badge>
                    )}
                    {agent.output_type && agent.output_type !== 'prompt' && (
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {OUTPUT_TYPES.find((t) => t.value === agent.output_type)?.icon}{' '}
                        {OUTPUT_TYPES.find((t) => t.value === agent.output_type)?.label}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Generated</div>
                      <div className="text-muted-foreground">
                        {agent.agent_generations[0]?.count || 0} prompts
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Quality</div>
                      <div className="text-muted-foreground">
                        {agent.agent_metrics.length > 0
                          ? (
                              agent.agent_metrics.reduce((sum, m) => sum + m.avg_quality_score, 0) /
                              agent.agent_metrics.length
                            ).toFixed(2)
                          : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleAgentMutation.mutate({
                          id: agent.id,
                          is_active: !agent.is_active,
                        })
                      }
                      disabled={toggleAgentMutation.isPending}
                    >
                      {agent.is_active ? (
                        <Pause className="mr-1 h-3 w-3" />
                      ) : (
                        <Play className="mr-1 h-3 w-3" />
                      )}
                      {agent.is_active ? 'Pause' : 'Start'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateMutation.mutate(agent.id)}
                      disabled={generateMutation.isPending}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Generate
                    </Button>
                    {/* Settings button for future configuration */}
                    {/* <Button
                      size="sm"
                      variant="ghost"
                    >
                      <Settings className="h-3 w-3" />
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="text-center text-muted-foreground">
            Detailed metrics and analytics coming soon...
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Agent Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Create a new autonomous agent to generate prompts for specific personas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Marketing Manager Agent"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe what this agent will generate prompts for"
              />
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <Select
                value={createForm.strategy}
                onValueChange={(value) => setCreateForm((prev) => ({ ...prev, strategy: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending Topics</SelectItem>
                  <SelectItem value="niche">Niche Industry</SelectItem>
                  <SelectItem value="educational">Educational Content</SelectItem>
                  <SelectItem value="seasonal">Seasonal Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={createForm.department}
                onValueChange={(value) => setCreateForm((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.icon} {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="output_type">Output Type</Label>
              <Select
                value={createForm.output_type}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, output_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {OUTPUT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? '▼' : '▶'} Advanced Options
              </Button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <>
                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Input
                    id="target_audience"
                    value={createForm.target_audience}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, target_audience: e.target.value }))
                    }
                    placeholder="e.g., marketing professionals, developers"
                  />
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={createForm.tone}
                    onValueChange={(value) => setCreateForm((prev) => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length_preference">Length Preference</Label>
                  <Select
                    value={createForm.length_preference}
                    onValueChange={(value) =>
                      setCreateForm((prev) => ({ ...prev, length_preference: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {LENGTH_OPTIONS.map((length) => (
                        <SelectItem key={length} value={length}>
                          {length.charAt(0).toUpperCase() + length.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Quality Control Section */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowQualityControl(!showQualityControl)}
              >
                {showQualityControl ? '▼' : '▶'} Quality Control & Brand Guidelines
              </Button>
            </div>

            {showQualityControl && (
              <>
                <div>
                  <Label htmlFor="style_guide">Style Guide</Label>
                  <Textarea
                    id="style_guide"
                    value={createForm.style_guide}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, style_guide: e.target.value }))
                    }
                    placeholder="e.g., Use active voice. Keep paragraphs under 4 sentences. Include examples."
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Writing rules and guidelines</p>
                </div>

                <div>
                  <Label htmlFor="key_phrases">Key Phrases (comma-separated)</Label>
                  <Input
                    id="key_phrases"
                    value={createForm.key_phrases.join(', ')}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        key_phrases: e.target.value
                          .split(',')
                          .map((p) => p.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="e.g., proven strategies, data-backed, actionable insights"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Phrases to include in content
                  </p>
                </div>

                <div>
                  <Label htmlFor="forbidden_phrases">Forbidden Phrases (comma-separated)</Label>
                  <Input
                    id="forbidden_phrases"
                    value={createForm.forbidden_phrases.join(', ')}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        forbidden_phrases: e.target.value
                          .split(',')
                          .map((p) => p.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="e.g., click here, buy now, guaranteed results"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Phrases to never use</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_quality_score">Min Quality Score</Label>
                    <Input
                      id="min_quality_score"
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={createForm.min_quality_score}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          min_quality_score: parseFloat(e.target.value),
                        }))
                      }
                    />
                    <p className="mt-1 text-xs text-muted-foreground">0.0 - 1.0 (0.7 = good)</p>
                  </div>
                  <div className="flex items-end">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={createForm.review_required}
                        onChange={(e) =>
                          setCreateForm((prev) => ({ ...prev, review_required: e.target.checked }))
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Require manual review</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createAgentMutation.mutate(createForm)}
                disabled={!createForm.name || !createForm.strategy || createAgentMutation.isPending}
              >
                {createAgentMutation.isPending ? 'Creating...' : 'Create Agent'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
