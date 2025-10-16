import {
  ArrowRight,
  BarChart3,
  Code,
  GitBranch,
  History,
  Lock,
  Share2,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Product Overview — Prompt Manage',
  description: 'Organize, secure, and share your AI prompts with confidence. Built for teams, professionals, and enterprises who need reliable prompt management.',
  keywords: [
    'prompt management',
    'AI prompts',
    'team collaboration',
    'version control',
    'prompt sharing',
    'API access',
  ],
  openGraph: {
    title: 'Product Overview — Prompt Manage',
    description: 'Organize, secure, and share your AI prompts with confidence.',
    type: 'website',
  },
}

export default function ProductPage() {
  const features = [
    {
      icon: Lock,
      title: 'Secure Prompt Storage',
      description:
        'Store all your AI prompts in one encrypted, searchable workspace. Never lose a prompt again.',
      benefits: [
        'AES-256 encryption at rest and TLS 1.3 in transit',
        'Private and public prompt options',
        'Organized by tags, categories, and custom collections',
        'Full-text search across all your prompts',
      ],
      highlight: 'Enterprise-grade security',
    },
    {
      icon: Users,
      title: 'Team Collaboration & Roles',
      description:
        'Work together seamlessly with granular permissions and shared workspaces for your entire team.',
      benefits: [
        'Role-based access: Owner, Admin, Editor, Viewer',
        'Shared team workspaces with real-time sync',
        'Invite unlimited team members (Team & Enterprise plans)',
        'Activity feeds and collaboration notifications',
      ],
      highlight: 'Built for teams',
    },
    {
      icon: History,
      title: 'Version Control & History',
      description:
        'Track every change, restore previous versions, and maintain a complete audit trail of your prompts.',
      benefits: [
        'Automatic versioning on every edit',
        'One-click rollback to any previous version',
        'Change tracking with timestamps and user attribution',
        'Compare versions side-by-side',
      ],
      highlight: 'Never lose work',
    },
    {
      icon: Share2,
      title: 'Prompt Sharing & Permissions',
      description:
        'Share prompts publicly or privately with fine-grained control over who can view, edit, or run them.',
      benefits: [
        'Public sharing with SEO-optimized prompt pages',
        'Private sharing via secure links',
        'Granular permissions per prompt',
        'Embed prompts in documentation or websites',
      ],
      highlight: 'Share your way',
    },
    {
      icon: Code,
      title: 'API Access & Integrations',
      description:
        'Integrate Prompt Manage into your existing workflows with our powerful REST API and webhooks.',
      benefits: [
        'RESTful API for all CRUD operations',
        'Webhook support for real-time updates',
        'SDKs for JavaScript, Python, and Go (coming soon)',
        'Zapier and Make.com integrations',
      ],
      highlight: 'Developer-friendly',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Usage Insights',
      description:
        'Understand how your prompts perform with detailed analytics, token tracking, and cost monitoring.',
      benefits: [
        'Token usage and cost tracking per prompt',
        'Performance metrics and execution history',
        'Team-wide usage dashboards (Enterprise)',
        'Export reports in CSV or JSON',
      ],
      highlight: 'Data-driven decisions',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-white text-blue-600">Product Overview</Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Organize, secure, and share your prompts with confidence.
            </h1>
            <p className="mb-10 text-xl leading-relaxed md:text-2xl">
              Prompt Manage helps teams and professionals store, version, and collaborate on AI prompts —
              all in one secure platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/p">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Prompts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Managing AI prompts shouldn't be chaotic
            </h2>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
              Teams waste hours searching Slack threads, Google Docs, and scattered notes for the right
              prompt. Prompts get lost, overwritten, or shared insecurely.
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Prompt Manage brings order, security, and collaboration to your AI workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything you need to manage prompts</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Built for individuals, teams, and enterprises
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="transition-all hover:border-blue-300 hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-950">
                        <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 text-green-500">✓</span>
                          <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Teams Choose Prompt Manage */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why teams choose Prompt Manage
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <Shield className="mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-3 text-xl font-bold">Security First</h3>
                <p className="leading-relaxed opacity-90">
                  Enterprise-grade encryption, GDPR compliance, and SOC 2 certification (in progress). Your
                  IP is protected.
                </p>
              </div>

              <div className="text-center">
                <Zap className="mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-3 text-xl font-bold">Lightning Fast</h3>
                <p className="leading-relaxed opacity-90">
                  Search, edit, and share prompts in milliseconds. Built on modern infrastructure for speed
                  and reliability.
                </p>
              </div>

              <div className="text-center">
                <GitBranch className="mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-3 text-xl font-bold">Version Control</h3>
                <p className="leading-relaxed opacity-90">
                  Never lose work. Every edit is tracked, versioned, and restorable. Work with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Built for how you work with AI
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>For Marketing Teams</CardTitle>
                  <CardDescription>
                    Centralize campaign prompts, maintain brand voice consistency, and collaborate on
                    content generation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "We've cut content creation time by 40% by organizing all our prompts in one place." —
                    Marketing Director, SaaS Company
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Development Teams</CardTitle>
                  <CardDescription>
                    Store code generation prompts, integrate via API, and version control your AI
                    workflows.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "The API integration lets us programmatically access prompts in our CI/CD pipeline." —
                    Lead Engineer, Tech Startup
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Product Teams</CardTitle>
                  <CardDescription>
                    Test variations, track performance, and share winning prompts across departments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Version control means we can A/B test prompts and roll back if something doesn't work."
                    — Product Manager
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Enterprise</CardTitle>
                  <CardDescription>
                    Secure, compliant, scalable prompt management with advanced permissions and audit logs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "The granular permissions and audit trails give us the compliance confidence we need." —
                    VP Engineering, Fortune 500
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Start managing prompts smarter today.
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Join thousands of teams using Prompt Manage to organize, secure, and scale their AI
              workflows.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  Read Documentation
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              No credit card required • Free plan available • Upgrade anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

