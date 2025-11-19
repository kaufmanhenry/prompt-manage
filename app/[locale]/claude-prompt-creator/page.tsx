import { Brain, CheckCircle, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import ClaudePromptCreator from '@/components/ClaudePromptCreator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { ScrollToToolButton } from './ScrollToToolButton'

export const metadata: Metadata = {
  title: 'Free Claude AI Prompt Creator - Generate Perfect Prompts | Prompt Manage',
  description:
    "Create perfect prompts for Claude AI. Generate better results with prompts tailored to Claude's strengths in reasoning, analysis, and creative problem-solving.",
  keywords: [
    'claude ai prompts',
    'claude prompt creator',
    'claude ai optimization',
    'anthropic claude prompts',
    'claude ai best practices',
    'claude prompt engineering',
    'free claude prompts',
    'claude ai tips',
    'claude reasoning prompts',
    'claude analysis prompts',
  ],
  openGraph: {
    title: 'Free Claude AI Prompt Creator - Generate Perfect Prompts',
    description:
      "Create perfect prompts for Claude AI. Generate better results with prompts tailored to Claude's strengths in reasoning, analysis, and creative problem-solving.",
    type: 'website',
    url: '/claude-prompt-creator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Claude AI Prompt Creator - Generate Perfect Prompts',
    description:
      "Create perfect prompts for Claude AI. Generate better results with prompts tailored to Claude's strengths in reasoning, analysis, and creative problem-solving.",
  },
  alternates: {
    canonical: '/claude-prompt-creator',
  },
}

export default function ClaudePromptCreatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-grid-pattern absolute inset-0 opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Brain className="h-4 w-4" />
                Free AI Tool
              </div>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Claude Prompt Creator
              </span>
              <br />
              Generate Perfect Prompts
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Create highly effective prompts for Claude AI. Leverage Claude's strengths in
              reasoning, analysis, and creative problem-solving with prompts tailored to your
              specific needs.
            </p>

            <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No Signup Required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant Generation</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <ScrollToToolButton />
              <Link href="/?redirect=/dashboard">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  <Users className="mr-2 h-5 w-5" />
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section id="claude-tool" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ClaudePromptCreator />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Why Use Our Claude Prompt Creator?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get better results from Claude AI with optimized prompts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Claude-Specific Optimization
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Prompts designed to leverage Claude's strengths in reasoning, analysis, and
                  ethical considerations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Context-Aware Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Prompts adapt to your domain, complexity level, and task type for optimal results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Best Practices Built-In
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Incorporates proven prompt engineering techniques for Claude AI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">8+</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Task Types</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Analysis, writing, problem-solving, and more
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">6</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Domains</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Creative, technical, business, academic, and more
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">95%</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                User Satisfaction
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Based on user feedback and testing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Perfect For Every Task
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              From creative writing to complex analysis
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Analysis & Research
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Market research, data analysis, and strategic planning
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <span className="text-2xl">✍️</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Creative Writing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Content creation, storytelling, and creative projects
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-2xl">🧠</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Problem Solving
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Complex reasoning, troubleshooting, and solution design
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Learning & Education
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Explanations, tutorials, and educational content
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Get More Than Just Prompt Generation
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              When you sign up for a free account, you unlock the full power of Prompt Manage's
              platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Link href="/p" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  300+ Prompt Templates
                </Link>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access our curated library of proven prompts for every task and domain.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-2xl">💾</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Save & Organize
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Save your generated prompts, create collections, and organize them by project.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Link href="/models" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Run Prompts Directly
                </Link>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Test your prompts on 20+ AI models including GPT-4, Claude, and Gemini.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/?redirect=/dashboard">
              <Button
                size="lg"
                className="bg-purple-600 px-8 py-3 text-lg text-white hover:bg-purple-700"
              >
                <Users className="mr-2 h-5 w-5" />
                Get Free Account - No Credit Card Required
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Join 10,000+ users already optimizing their AI workflows
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Ready to Get Better Results from Claude?
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of users who are already getting better results from Claude AI with
            optimized prompts.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <ScrollToToolButton />
            <Link href="/?redirect=/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Get Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Is the Claude Prompt Creator really free?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Our Claude Prompt Creator is completely free to use. No signup required, no
                hidden costs, no limits on usage.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                How is this different from ChatGPT prompts?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Claude has different strengths than ChatGPT. Our prompts are specifically optimized
                for Claude's reasoning abilities, ethical considerations, and analytical
                capabilities.{' '}
                <Link
                  href="/models"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Learn more about Claude's capabilities
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                What makes Claude prompts different?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Claude excels at reasoning, analysis, and ethical considerations. Our prompts
                leverage these strengths by asking for detailed explanations, considering multiple
                perspectives, and incorporating ethical reasoning when relevant.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Can I save my generated prompts?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes!{' '}
                <Link
                  href="/?redirect=/dashboard"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign up for a free account
                </Link>{' '}
                to save your generated prompts, create collections, and access additional features
                like{' '}
                <Link
                  href="/p"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  300+ prompt templates
                </Link>{' '}
                and team sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="bg-gradient-to-r from-purple-500 to-indigo-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your AI Workflow?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-purple-100">
            Don't just generate one prompt - build a complete library of high-performing prompts
            that your team can use and improve over time.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/?redirect=/dashboard">
              <Button
                size="lg"
                className="bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-lg hover:bg-gray-50"
              >
                <Users className="mr-2 h-5 w-5" />
                Start Building Your Library
              </Button>
            </Link>
            <Link href="/p">
              <Button
                size="lg"
                className="bg-gray-900 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gray-800"
              >
                Browse Templates First
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-purple-200">
            Free to use • No credit card required • Join 100s of users
          </p>
        </div>
      </section>
    </div>
  )
}
