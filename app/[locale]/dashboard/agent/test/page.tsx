'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Sidebar } from '@/components/Sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdminEmail } from '@/lib/admin'
import { generateTestReport } from '@/lib/agent/test-agent'
import { createClient } from '@/utils/supabase/client'

export default function AgentTestPage() {
  const [testRunning, setTestRunning] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null)

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

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch('/api/agent')
      const json = await res.json()
      return json.agents || []
    },
    enabled: !!isAdmin,
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

  const runTests = async () => {
    if (agents.length === 0) {
      alert('No agents found. Please create an agent first.')
      return
    }

    setTestRunning(true)
    try {
      const agentId = agents[0].id
      const testReport = await generateTestReport(agentId)
      setReport(testReport)
    } catch (error) {
      console.error('Test error:', error)
      alert('Test failed. Check console for details.')
    } finally {
      setTestRunning(false)
    }
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Agent QA & Testing</h1>
            <p className="text-muted-foreground">
              Test agent functionality and review prompt quality
            </p>
          </div>

          <div className="mb-6">
            <Button onClick={runTests} disabled={testRunning || agents.length === 0}>
              {testRunning ? 'Running Tests...' : 'Run Full Test Suite'}
            </Button>
          </div>

          {report && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{report.testsRun}</div>
                      <div className="text-sm text-muted-foreground">Tests Run</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{report.passed}</div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{report.failed}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{report.warnings}</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {report.qualityMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="mb-1 text-sm text-muted-foreground">Clarity</div>
                        <div className="text-2xl font-bold">
                          {report.qualityMetrics.clarity.toFixed(1)}/100
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-muted-foreground">Usefulness</div>
                        <div className="text-2xl font-bold">
                          {report.qualityMetrics.usefulness.toFixed(1)}/100
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-muted-foreground">Uniqueness</div>
                        <div className="text-2xl font-bold">
                          {report.qualityMetrics.uniqueness.toFixed(1)}/100
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-muted-foreground">SEO Optimization</div>
                        <div className="text-2xl font-bold">
                          {report.qualityMetrics.seoOptimization.toFixed(1)}/100
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <div className="mb-1 text-sm text-muted-foreground">Overall Quality</div>
                      <div className="text-3xl font-bold">
                        {report.qualityMetrics.overall.toFixed(1)}/100
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {report.results.map((result: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded border p-3"
                      >
                        <div className="flex-1">
                          <div className="font-semibold">{result.test}</div>
                          <div className="text-sm text-muted-foreground">{result.message}</div>
                        </div>
                        <Badge
                          variant={
                            result.status === 'pass'
                              ? 'default'
                              : result.status === 'fail'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {report.recommendations && report.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-2">
                      {report.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
