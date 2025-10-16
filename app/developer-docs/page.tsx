import { ArrowRight, BookOpen, Code, Key, Lock, Terminal,Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Developer Documentation — Prompt Manage API',
  description: 'Integrate Prompt Manage into your workflows with our REST API. Upload, organize, query, and manage prompts programmatically.',
  keywords: ['API', 'developer docs', 'REST API', 'authentication', 'webhook', 'integration'],
  openGraph: {
    title: 'Developer Documentation — Prompt Manage API',
    description: 'Integrate Prompt Manage into your workflows with our REST API.',
    type: 'website',
  },
}

export default function DeveloperDocsPage() {
  const endpointCategories = [
    {
      name: 'Prompts',
      description: 'Create, read, update, delete, and search prompts',
      endpoints: ['GET /api/prompts', 'POST /api/prompts', 'PUT /api/prompts/:id', 'DELETE /api/prompts/:id'],
    },
    {
      name: 'Teams',
      description: 'Manage team workspaces, members, and permissions',
      endpoints: ['GET /api/teams', 'POST /api/teams', 'PUT /api/teams/:id/members', 'DELETE /api/teams/:id'],
    },
    {
      name: 'Workspaces',
      description: 'Organize prompts into collections and workspaces',
      endpoints: ['GET /api/workspaces', 'POST /api/workspaces', 'PUT /api/workspaces/:id', 'GET /api/workspaces/:id/prompts'],
    },
    {
      name: 'Audit Logs',
      description: 'Access activity logs and version history (Enterprise)',
      endpoints: ['GET /api/audit-logs', 'GET /api/prompts/:id/versions', 'GET /api/teams/:id/activity'],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <Badge className="mb-4 bg-blue-600">Developer Documentation</Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Prompt Manage API
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-300">
              Integrate Prompt Manage into your AI workflows with our powerful REST API. Upload, organize,
              query, and manage prompts programmatically with full version control and team collaboration.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/settings">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Key className="mr-2 h-4 w-4" />
                  Get API Key
                </Button>
              </Link>
              <Link href="#quickstart">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-100 hover:bg-gray-800">
                  Quick Start Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What the API Enables */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-3xl font-bold">What the API enables</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-gray-700 bg-gray-800">
                <CardHeader>
                  <Code className="mb-2 h-8 w-8 text-blue-400" />
                  <CardTitle>Upload & Organize</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Programmatically create and organize prompts, tag them, and assign to workspaces or
                    teams.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800">
                <CardHeader>
                  <Terminal className="mb-2 h-8 w-8 text-blue-400" />
                  <CardTitle>Query & Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Search prompts by tags, models, or full-text. Retrieve specific versions and metadata.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800">
                <CardHeader>
                  <Zap className="mb-2 h-8 w-8 text-blue-400" />
                  <CardTitle>Automate Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Integrate with CI/CD pipelines, trigger webhooks, and sync prompts with external tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section id="authentication" className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <Lock className="h-10 w-10 text-blue-400" />
              <h2 className="text-3xl font-bold">Authentication</h2>
            </div>

            <p className="mb-6 text-lg text-gray-300">
              All API requests must be authenticated using one of the following methods:
            </p>

            <div className="space-y-6">
              <Card className="border-gray-700 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-400" />
                    API Keys (Recommended)
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Generate API keys from your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-gray-950 p-4 font-mono text-sm">
                    <pre className="overflow-x-auto text-green-400">
{`curl -X GET https://api.promptmanage.com/v1/prompts \\
  -H "Authorization: Bearer pm_live_abc123xyz456" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    Include your API key in the <code className="rounded bg-gray-800 px-1 py-0.5">Authorization</code> header
                    as a Bearer token.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-900">
                <CardHeader>
                  <CardTitle>OAuth 2.0</CardTitle>
                  <CardDescription className="text-gray-400">
                    For applications accessing user data on their behalf
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-gray-300">
                    OAuth 2.0 is available for Enterprise customers building integrations that require user
                    consent.
                  </p>
                  <div className="rounded-lg bg-gray-950 p-4 font-mono text-sm">
                    <pre className="overflow-x-auto text-green-400">
{`# Step 1: Redirect user to authorize
https://promptmanage.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=prompts:read prompts:write&
  response_type=code

# Step 2: Exchange code for access token
curl -X POST https://api.promptmanage.com/oauth/token \\
  -d "grant_type=authorization_code" \\
  -d "code=AUTHORIZATION_CODE" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET"`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Example Request & Response */}
      <section id="quickstart" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold">Example Request & Response</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-semibold text-blue-400">Create a new prompt</h3>
                <div className="rounded-lg bg-gray-950 p-4 font-mono text-sm">
                  <pre className="overflow-x-auto text-green-400">
{`POST /api/v1/prompts
Content-Type: application/json
Authorization: Bearer pm_live_abc123xyz456

{
  "name": "Marketing Email Generator",
  "description": "Generate compelling marketing emails",
  "prompt_text": "Write a marketing email for {{product}} targeting {{audience}}",
  "model": "gpt-4",
  "tags": ["marketing", "email", "copywriting"],
  "is_public": false,
  "workspace_id": "ws_abc123"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-blue-400">Response</h3>
                <div className="rounded-lg bg-gray-950 p-4 font-mono text-sm">
                  <pre className="overflow-x-auto text-yellow-400">
{`HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "pmt_xyz789",
  "user_id": "usr_abc123",
  "name": "Marketing Email Generator",
  "description": "Generate compelling marketing emails",
  "prompt_text": "Write a marketing email for {{product}} targeting {{audience}}",
  "model": "gpt-4",
  "tags": ["marketing", "email", "copywriting"],
  "is_public": false,
  "workspace_id": "ws_abc123",
  "slug": "marketing-email-generator",
  "version": 1,
  "created_at": "2025-01-16T10:30:00Z",
  "updated_at": "2025-01-16T10:30:00Z"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoint Categories */}
      <section className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-3xl font-bold">API Endpoint Categories</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {endpointCategories.map((category) => (
                <Card key={category.name} className="border-gray-700 bg-gray-900">
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="text-gray-400">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.endpoints.map((endpoint) => (
                        <div
                          key={endpoint}
                          className="rounded bg-gray-950 px-3 py-2 font-mono text-sm text-green-400"
                        >
                          {endpoint}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits & Security */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold">Rate Limits & Security</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-gray-700 bg-gray-800">
                <CardHeader>
                  <CardTitle>Rate Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <div>
                      <strong>Free Plan:</strong> 100 requests/hour
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <div>
                      <strong>Team Plan:</strong> 1,000 requests/hour
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <div>
                      <strong>Enterprise Plan:</strong> 10,000 requests/hour (custom limits available)
                    </div>
                  </div>
                  <p className="mt-4 text-gray-400">
                    Rate limit headers are included in all responses. Retry after the time specified in{' '}
                    <code className="rounded bg-gray-900 px-1 py-0.5">Retry-After</code>.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-700 bg-gray-800">
                <CardHeader>
                  <CardTitle>Security Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Always use HTTPS for API requests</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Store API keys securely (env variables, secret managers)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Rotate API keys regularly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Use read-only keys when possible</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Monitor API usage for unusual activity</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Docs Links */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <BookOpen className="mx-auto mb-6 h-16 w-16" />
            <h2 className="mb-6 text-3xl font-bold">Ready to dive deeper?</h2>
            <p className="mb-8 text-xl">
              Explore our comprehensive API reference, guides, and code examples.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/docs/api-reference">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Full API Reference
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/guides">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Integration Guides
                </Button>
              </Link>
              <Link href="/docs/webhooks">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Webhooks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

