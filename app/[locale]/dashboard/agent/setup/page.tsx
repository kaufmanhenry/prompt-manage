'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { isAdminEmail } from '@/utils/admin'
import { createClient } from '@/utils/supabase/client'

const DEFAULT_KEYWORDS = [
  'photography',
  'filmmaking',
  'AI art',
  'marketing',
  'writing',
  'coding',
  'business',
  'content creation',
  'social media',
  'design',
  'education',
  'productivity',
  'healthcare',
  'finance',
  'real estate',
  'ecommerce',
  'startup',
  'creativity',
  'productivity',
  'research',
]

export default function AgentSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: 'PromptManage Agent',
    mode: 'review' as 'autonomous' | 'review',
    temperature: 0.7,
    quality_threshold: 85,
    keywords: DEFAULT_KEYWORDS.join('\n'),
  })

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
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get or create agent team
      const supabase = createClient()
      const { data: teams } = await supabase
        .from('teams')
        .select('id')
        .eq('name', 'PromptManage Agent')
        .limit(1)

      let team_id: string | null = null
      if (teams && teams.length > 0) {
        team_id = teams[0].id
      } else {
        // Create agent team with slug generation (will auto-generate via trigger)
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert({
            name: 'PromptManage Agent',
            slug: 'promptmanage-agent', // Will be validated by trigger if needed
            description: 'Autonomous AI agent for generating prompts',
            tier: 'enterprise',
            is_active: true,
            is_verified: true,
          })
          .select('id')
          .single()

        if (teamError || !newTeam) {
          throw new Error('Failed to create agent team')
        }

        team_id = newTeam.id

        // Add user as owner
        await supabase.from('team_members').insert({
          team_id: newTeam.id,
          user_id: session?.user?.id,
          role: 'owner',
          is_active: true,
        })
      }

      // Create agent
      const keywords = formData.keywords
        .split('\n')
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          team_id,
          mode: formData.mode,
          temperature: formData.temperature,
          quality_threshold: formData.quality_threshold,
          keywords,
        }),
      })

      const json = await res.json()

      if (json.agent) {
        router.push('/dashboard/agent')
      } else {
        alert(`Error: ${json.error || 'Failed to create agent'}`)
      }
    } catch (error) {
      console.error('Error setting up agent:', error)
      alert('Error setting up agent. Please try again.')
    } finally {
      setLoading(false)
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Setup AI Agent</h1>
            <p className="text-muted-foreground">
              Configure your autonomous prompt generation agent
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="PromptManage Agent"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mode">Mode</Label>
                  <select
                    id="mode"
                    value={formData.mode}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="review">Review Mode (Manual Approval)</option>
                    <option value="autonomous">Autonomous Mode (Auto-Publish)</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formData.mode === 'review'
                      ? 'Prompts will be saved for manual review before publishing'
                      : 'Prompts will be automatically published if quality score meets threshold'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="temperature">
                    Temperature: {formData.temperature.toFixed(2)}
                  </Label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                    }
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Higher = more creative, Lower = more focused
                  </p>
                </div>

                <div>
                  <Label htmlFor="quality_threshold">
                    Quality Threshold: {formData.quality_threshold}
                  </Label>
                  <input
                    id="quality_threshold"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.quality_threshold}
                    onChange={(e) =>
                      setFormData({ ...formData, quality_threshold: parseInt(e.target.value) })
                    }
                    className="mt-1 w-full"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum quality score (0-100) to auto-publish in autonomous mode
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords">Initial Keywords (one per line)</Label>
                  <Textarea
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    rows={10}
                    placeholder="photography&#10;filmmaking&#10;AI art&#10;..."
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    The agent will generate prompts for these keywords. You can add more later.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Agent'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/agent')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
