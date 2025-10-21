import { ArrowRight, BarChart3, Bot,CheckCircle, Cpu, Database, Globe, Layers, Lock, Shield, Star, Target, TrendingUp, Users, Workflow, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prompt Manage 2.0: Complete AI Workflow Automation Platform | Enterprise-Grade Prompt Management',
  description:
    'Transform your AI workflows with Prompt Manage 2.0 - the complete autonomous AI workflow platform. Features token tracking, cost management, team collaboration, version control, and automated multi-step workflows with data source integration.',
  keywords: [
    'AI workflow automation',
    'prompt management platform',
    'autonomous AI workflows',
    'token tracking',
    'AI cost management',
    'team collaboration',
    'enterprise AI tools',
    'workflow automation',
    'data source integration',
    'AI version control',
    'prompt optimization',
    'AI analytics',
    'multi-model support',
    'AI governance',
    'workflow orchestration',
  ],
  openGraph: {
    title: 'Prompt Manage 2.0: Complete AI Workflow Automation Platform',
    description: 'Transform your AI workflows with enterprise-grade prompt management, autonomous workflows, and comprehensive cost tracking.',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage 2.0 - AI Workflow Automation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Manage 2.0: Complete AI Workflow Automation Platform',
    description: 'Transform your AI workflows with enterprise-grade prompt management, autonomous workflows, and comprehensive cost tracking.',
  },
  alternates: {
    canonical: '/product',
  },
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Star className="mr-2 h-4 w-4" />
              Prompt Manage 2.0 - Complete AI Workflow Platform
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
              Transform Your AI Workflows
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Into Autonomous Systems
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              The complete AI workflow automation platform with enterprise-grade cost management, 
              autonomous workflows, and comprehensive team collaboration. From simple prompt management 
              to complex multi-step AI orchestrations.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core Platform Features */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Two Powerful Systems, One Complete Platform
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Prompt Manage 2.0 combines advanced prompt management with autonomous workflow automation 
            and comprehensive cost tracking for enterprise-grade AI operations.
          </p>
        </div>

        {/* System 1: Token Tracking & Cost Management */}
        <div className="mb-20 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 p-8 dark:from-emerald-900/20 dark:to-blue-900/20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                <BarChart3 className="mr-2 h-4 w-4" />
                System 1: Token Tracking & Cost Management
              </div>
              <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Complete Visibility & Control Over AI Spending
              </h3>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                Real-time cost preview, detailed token tracking, budget management, and optimization 
                recommendations. Never be surprised by AI costs again.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Real-time Cost Preview</h4>
                    <p className="text-gray-600 dark:text-gray-300">See exact costs before executing any prompt</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Detailed Token Analytics</h4>
                    <p className="text-gray-600 dark:text-gray-300">Input/output breakdown with usage patterns</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Budget Management</h4>
                    <p className="text-gray-600 dark:text-gray-300">Monthly limits with proactive alerts and reports</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                <div className="text-center">
                  <TrendingUp className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                  <h4 className="mb-2 text-lg font-semibold">Cost Optimization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatic recommendations for reducing AI costs while maintaining quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System 2: Autonomous AI Workflow Hub */}
        <div className="mb-20 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-8 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="order-2 flex items-center justify-center lg:order-1">
              <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                <div className="text-center">
                  <Workflow className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                  <h4 className="mb-2 text-lg font-semibold">Visual Workflow Builder</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Drag & drop interface for creating complex AI workflows
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Bot className="mr-2 h-4 w-4" />
                System 2: Autonomous AI Workflow Hub
              </div>
              <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Automated Multi-Step AI Workflows
              </h3>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                Connect data sources, orchestrate complex AI workflows, and automate entire 
                business processes with intelligent agents.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Data Source Integration</h4>
                    <p className="text-gray-600 dark:text-gray-300">Connect Google Sheets, Airtable, Notion, APIs, and more</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Workflow Orchestration</h4>
                    <p className="text-gray-600 dark:text-gray-300">Sequential, parallel, and conditional execution patterns</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Background Processing</h4>
                    <p className="text-gray-600 dark:text-gray-300">Reliable job processing with retries and monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Enterprise-Grade Features
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need for professional AI operations at scale
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Shield className="mb-4 h-8 w-8 text-blue-600" />
              <h4 className="mb-2 text-lg font-semibold">Enterprise Security</h4>
              <p className="text-gray-600 dark:text-gray-300">
                AES-256 encryption, TLS 1.3, SOC 2 compliance, and granular access controls
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Users className="mb-4 h-8 w-8 text-green-600" />
              <h4 className="mb-2 text-lg font-semibold">Team Collaboration</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Role-based permissions, shared workspaces, and real-time collaboration
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Database className="mb-4 h-8 w-8 text-purple-600" />
              <h4 className="mb-2 text-lg font-semibold">Version Control</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Git-like versioning with change tracking and rollback capabilities
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Globe className="mb-4 h-8 w-8 text-orange-600" />
              <h4 className="mb-2 text-lg font-semibold">Multi-Model Support</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Support for 20+ AI models including GPT-5, Claude 4, Gemini, and more
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Zap className="mb-4 h-8 w-8 text-yellow-600" />
              <h4 className="mb-2 text-lg font-semibold">Advanced Analytics</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Performance metrics, usage patterns, and optimization insights
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <Lock className="mb-4 h-8 w-8 text-red-600" />
              <h4 className="mb-2 text-lg font-semibold">Audit Logs</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Complete activity tracking and compliance reporting for enterprises
              </p>
            </div>
          </div>
        </div>

        {/* AI Models Support */}
        <div className="mb-20 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 p-8 dark:from-gray-800 dark:to-blue-900/20">
          <div className="mb-8 text-center">
            <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Support for 20+ AI Models
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              From the latest GPT-5 to open-source alternatives, we support all major AI models
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
              <div className="mb-2 text-2xl">🚀</div>
              <h4 className="font-semibold">GPT-5</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">OpenAI's Latest</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
              <div className="mb-2 text-2xl">🤖</div>
              <h4 className="font-semibold">GPT-4o</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Multimodal</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
              <div className="mb-2 text-2xl">🛡️</div>
              <h4 className="font-semibold">Claude 4</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Anthropic</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-800">
              <div className="mb-2 text-2xl">💎</div>
              <h4 className="font-semibold">Gemini 2.5</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Google</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/models"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Supported Models
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Perfect for Every Team
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              From startups to enterprises, Prompt Manage 2.0 scales with your AI operations
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
              <Target className="mb-4 h-8 w-8 text-blue-600" />
              <h4 className="mb-2 text-lg font-semibold">Marketing Teams</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Centralize campaign prompts, maintain brand voice consistency, and automate content workflows
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20">
              <Cpu className="mb-4 h-8 w-8 text-green-600" />
              <h4 className="mb-2 text-lg font-semibold">Development Teams</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Store code generation prompts, version control AI workflows, and integrate with CI/CD
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-900/20 dark:to-pink-900/20">
              <Layers className="mb-4 h-8 w-8 text-purple-600" />
              <h4 className="mb-2 text-lg font-semibold">Product Teams</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Test prompt variations, track performance metrics, and optimize AI-powered features
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-6 dark:from-orange-900/20 dark:to-red-900/20">
              <Shield className="mb-4 h-8 w-8 text-orange-600" />
              <h4 className="mb-2 text-lg font-semibold">Enterprise</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Secure, compliant, scalable AI operations with advanced governance and audit trails
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 rounded-2xl bg-gradient-to-r from-gray-900 to-blue-900 p-8 text-white dark:from-gray-800 dark:to-blue-800">
          <div className="mb-8 text-center">
            <h3 className="mb-4 text-3xl font-bold">Trusted by Teams Worldwide</h3>
            <p className="text-lg text-gray-300">
              Join thousands of teams already using Prompt Manage 2.0
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-400">20+</div>
              <div className="text-gray-300">AI Models Supported</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-400">99.9%</div>
              <div className="text-gray-300">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-purple-400">SOC 2</div>
              <div className="text-gray-300">Compliance Ready</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Transform Your AI Workflows?
          </h3>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Join thousands of teams already using Prompt Manage 2.0 to automate their AI operations
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
            >
              View Documentation
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No credit card required • Free plan available • Enterprise support
          </p>
        </div>
      </div>
    </div>
  )
}
