import { CheckCircle, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import PromptOptimizer from '@/components/PromptOptimizer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { ScrollToToolButton } from './ScrollToToolButton'

export const metadata: Metadata = {
  title: 'Free AI Prompt Optimizer - Get 3x Better Results | Prompt Manage',
  description:
    'Optimize your AI prompts for better results. Free tool analyzes prompts and provides specific suggestions for improvement. Get 3x better outputs from ChatGPT, Claude, and other AI models.',
  keywords: [
    'ai prompt optimizer',
    'prompt optimization',
    'chatgpt prompt optimizer',
    'claude prompt optimizer',
    'ai prompt improvement',
    'prompt engineering tool',
    'free prompt optimizer',
    'ai prompt analyzer',
    'prompt optimization tool',
    'chatgpt prompt improvement',
    'claude prompt improvement',
    'ai prompt best practices',
    'prompt engineering',
    'ai prompt generator',
    'prompt analysis tool',
    'gpt prompt optimizer',
    'openai prompt optimizer',
    'anthropic prompt optimizer',
    'ai prompt enhancer',
    'prompt quality checker',
  ],
  openGraph: {
    title: 'Free AI Prompt Optimizer - Get 3x Better Results',
    description:
      'Optimize your AI prompts for better results. Free tool analyzes prompts and provides specific suggestions for improvement.',
    type: 'website',
    url: 'https://promptmanage.com/optimizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Prompt Optimizer - Get 3x Better Results',
    description:
      'Optimize your AI prompts for better results. Free tool analyzes prompts and provides specific suggestions for improvement.',
  },
  alternates: {
    canonical: 'https://promptmanage.com/optimizer',
  },
}

export default function PromptOptimizerPage() {
  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Prompt Optimizer',
    description:
      'Free tool to optimize AI prompts for better results with ChatGPT, Claude, and other AI models',
    url: 'https://promptmanage.com/optimizer',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Prompt Manage',
      url: 'https://promptmanage.com',
    },
    featureList: [
      'Prompt analysis and scoring',
      'AI-powered optimization suggestions',
      'Support for multiple AI models',
      'Free to use',
      'No signup required',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="bg-grid-pattern absolute inset-0 opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  Free AI Tool
                </div>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Prompt Optimizer
                </span>
                <br />
                Get 3x Better AI Results
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                Transform your AI prompts from mediocre to exceptional. Our free tool analyzes your
                prompts and provides specific suggestions for improvement, helping you get better
                results from ChatGPT, Claude, and other AI models.{' '}
                <Link
                  href="/models"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  See all supported models
                </Link>
                .
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
                  <span>Instant Analysis</span>
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
        <section id="optimizer-tool" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PromptOptimizer />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Why Use Our Prompt Optimizer?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Get better results from AI with proven optimization techniques
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Instant Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get immediate feedback on your prompt's clarity, specificity, and structure with
                    our advanced analysis engine.{' '}
                    <Link
                      href="/docs/best-practices"
                      className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Learn more about prompt engineering
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Specific Suggestions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Receive actionable recommendations to improve your prompts, not generic advice.
                    Based on{' '}
                    <Link
                      href="/p"
                      className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      300+ proven templates
                    </Link>{' '}
                    from our community.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Optimized Versions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get improved versions of your prompts that follow best practices for AI
                    interaction.{' '}
                    <Link
                      href="/?redirect=/dashboard"
                      className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Save them to your library
                    </Link>{' '}
                    for future use.
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
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">3x</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  Better Results
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Average improvement in AI output quality
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">10k+</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  Prompts Analyzed
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  And counting since launch
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  User Satisfaction
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Based on user feedback
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
                Perfect For Every Use Case
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Whether you're a developer, content creator, or business professional
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-2xl">💻</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Developers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Optimize prompts for code generation, debugging, and technical documentation
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <span className="text-2xl">✍️</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Content Creators
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Improve prompts for blog posts, social media, and marketing copy
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Business Professionals
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enhance prompts for reports, emails, and strategic analysis
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <span className="text-2xl">🎓</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Students & Researchers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Optimize prompts for research, essays, and academic writing
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Get More Than Just Optimization
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
                  Access our curated library of proven prompts for every use case. Copy, customize,
                  and optimize.
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
                  Save your optimized prompts, create collections, and organize them by project or
                  team.
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
                  Test your prompts on 20+ AI models including GPT-4, Claude, and Gemini without
                  leaving the platform.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/?redirect=/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 px-8 py-3 text-lg text-white hover:bg-blue-700"
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
              Ready to Get Better AI Results?
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Join thousands of users who are already getting 3x better results from AI with
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
                  Is the Prompt Optimizer really free?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Our Prompt Optimizer is completely free to use. No signup required, no hidden
                  costs, no limits on usage.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Which AI models does this work with?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our optimization techniques work with all major AI models including ChatGPT,
                  Claude, Gemini, and others. The principles of good prompting are universal.{' '}
                  <Link
                    href="/models"
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    See our full list of supported models
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  How does the optimization work?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We analyze your prompt for clarity, specificity, context, format instructions, and
                  other key factors. Then we provide specific suggestions and an improved version
                  using proven prompt engineering techniques.{' '}
                  <Link
                    href="/docs/best-practices"
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Learn more about our methodology
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Can I save my optimized prompts?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes!{' '}
                  <Link
                    href="/?redirect=/dashboard"
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign up for a free account
                  </Link>{' '}
                  to save your optimized prompts, create collections, and access additional features
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
        <section className="bg-gradient-to-r from-emerald-500 to-blue-600 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your AI Workflow?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-emerald-100">
              Don't just optimize one prompt - build a complete library of high-performing prompts
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
            <p className="mt-6 text-sm text-emerald-200">
              Free to use • No credit card required • Join 100s of users
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
