import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code, GitBranch, Shield, Users, Zap, CheckCircle, BarChart3, Database, Terminal } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Engineers & Product Teams - Version Control, Testing & Management for System Prompts | Prompt Manage',
  description: 'AI engineers and product teams use Prompt Manage for version control, prompt testing, change history, team access, and output logging to manage hundreds of system prompts efficiently.',
  keywords: 'AI engineers, product teams, system prompts, version control, prompt testing, change history, output logging, API',
}

export default function AIEngineersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              <Code className="w-4 h-4 mr-2" />
              For AI Engineers & Product Teams
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Manage Hundreds of<br />
            <span className="text-purple-600 dark:text-purple-400">System Prompts</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Version control, testing, and management for AI engineers and product teams. Track changes, test variants, and maintain a single source of truth for all your system prompts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Terminal className="mr-2 h-5 w-5" />
                View API Docs
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Diagram */}
        <div className="py-16 bg-white dark:bg-gray-800 rounded-2xl mb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Enterprise-Grade Prompt Infrastructure
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Built for teams managing complex AI systems at scale
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GitBranch className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Version Control</h3>
                <p className="text-gray-600 dark:text-gray-400">Git-like branching, merging, and rollback for all prompts</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Testing & Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">A/B test prompts, track performance, and optimize outputs</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Output Logging</h3>
                <p className="text-gray-600 dark:text-gray-400">Comprehensive logging and monitoring for all prompt executions</p>
              </div>
            </div>
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  RK
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Dr. Rachel Kim</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Head of ML, DataFlow Inc.</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic text-center">
                "Prompt Manage gives us the infrastructure we need to manage 500+ system prompts across our AI platform. 
                The version control and testing features are game-changers for our engineering team."
              </p>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Built for Technical Teams
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Git-Like Version Control
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Branch, merge, and rollback prompts with full change history and conflict resolution.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Branch and merge workflows
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Conflict resolution tools
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Full audit trail
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Advanced Testing & Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test prompt variants, track performance metrics, and optimize for specific outcomes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  A/B testing framework
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance dashboards
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Custom evaluation metrics
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Comprehensive Logging
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Log every prompt execution with inputs, outputs, metadata, and performance metrics.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Input/output logging
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance metrics
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Error tracking and alerts
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Enterprise Security
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                SOC 2 compliant with enterprise SSO, role-based access, and audit trails.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  SSO integration
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Role-based permissions
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  SOC 2 compliance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* API & Integration */}
        <div className="py-16 bg-white dark:bg-gray-800 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful API & Integrations
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Integrate Prompt Manage into your existing workflows and tools
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Terminal className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">REST API</h3>
                <p className="text-gray-600 dark:text-gray-400">Full CRUD operations for prompts, testing, and analytics</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Code className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SDKs</h3>
                <p className="text-gray-600 dark:text-gray-400">Python, JavaScript, and Go SDKs for easy integration</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Webhooks</h3>
                <p className="text-gray-600 dark:text-gray-400">Real-time notifications for prompt changes and deployments</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link href="/docs">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Terminal className="mr-2 h-5 w-5" />
                  View API Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to scale your prompt infrastructure?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join engineering teams who've already streamlined their AI prompt management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Terminal className="mr-2 h-5 w-5" />
                View API Docs
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 14-day free trial • Enterprise SSO support
          </p>
        </div>
      </div>
    </div>
  )
} 