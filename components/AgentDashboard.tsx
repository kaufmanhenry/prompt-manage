'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bot, Pause, Play, Star, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

export function AgentDashboard() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    strategy: '',
    config: {}
  })

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
    mutationFn: async (agentData: { name: string; description: string; strategy: string; config: Record<string, unknown> }) => {
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
      setCreateForm({ name: '', description: '', strategy: '', config: {} })
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
        description: `Quality score: ${data.generation.quality_score.toFixed(2)}`
      })
      void queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: () => {
      toast({ title: 'Failed to generate prompt', variant: 'destructive' })
    },
  })

  const agents: Agent[] = agentsData?.agents || []

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
                  {agents.filter(a => a.is_active).length} active
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
                  {agents.reduce((sum, agent) => 
                    sum + (agent.agent_generations[0]?.count || 0), 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agents.reduce((sum, agent) => 
                    sum + (agent.agent_metrics.reduce((mSum, metric) => 
                      mSum + metric.total_views, 0)), 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated prompts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Quality</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {agents.length > 0 ? (
                    agents.reduce((sum, agent) => {
                      const avgScore = agent.agent_metrics.reduce((mSum, metric) => 
                        mSum + metric.avg_quality_score, 0) / agent.agent_metrics.length || 0
                      return sum + avgScore
                    }, 0) / agents.length
                  ).toFixed(2) : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of 1.0
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                      {agent.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{agent.strategy}</Badge>
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
                        {agent.agent_metrics.length > 0 ? 
                          (agent.agent_metrics.reduce((sum, m) => sum + m.avg_quality_score, 0) / 
                           agent.agent_metrics.length).toFixed(2) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAgentMutation.mutate({ 
                        id: agent.id, 
                        is_active: !agent.is_active 
                      })}
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
                    {/* Settings button for future agent configuration */}
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
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Marketing Manager Agent"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this agent will generate prompts for"
              />
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={createForm.strategy} onValueChange={(value) => setCreateForm(prev => ({ ...prev, strategy: value }))}>
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
