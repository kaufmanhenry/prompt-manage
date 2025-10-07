import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Code, Terminal, Zap, ArrowRight, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CursorPromptCreator from '@/components/CursorPromptCreator'
import { ScrollToToolButton } from './ScrollToToolButton'

export const metadata: Metadata = {
  title: 'Free Cursor AI Prompt Creator - Generate Perfect Code Prompts | Prompt Manage',
  description: 'Create perfect prompts for Cursor AI code editor. Generate better code with prompts tailored to your specific needs. Free tool for developers.',
  keywords: [
    'cursor ai prompts',
    'cursor prompt creator',
    'cursor ai code generation',
    'ai code editor prompts',
    'cursor ai tips',
    'code generation prompts',
    'ai programming assistant',
    'cursor ai best practices',
    'free cursor prompts',
    'cursor ai optimization'
  ],
  openGraph: {
    title: 'Free Cursor AI Prompt Creator - Generate Perfect Code Prompts',
    description: 'Create perfect prompts for Cursor AI code editor. Generate better code with prompts tailored to your specific needs.',
    type: 'website',
    url: 'https://promptmanage.com/cursor-prompt-creator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Cursor AI Prompt Creator - Generate Perfect Code Prompts',
    description: 'Create perfect prompts for Cursor AI code editor. Generate better code with prompts tailored to your specific needs.',
  },
  alternates: {
    canonical: 'https://promptmanage.com/cursor-prompt-creator',
  },
}

export default function CursorPromptCreatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <Code className="h-4 w-4" />
                Free Developer Tool
              </div>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cursor Prompt Creator
              </span>
              <br />
              Generate Perfect Code Prompts
            </h1>
            
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Create highly effective prompts for Cursor AI code editor. Get better code generation with prompts tailored to your specific programming needs, frameworks, and complexity levels.
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
      <section id="cursor-tool" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CursorPromptCreator />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Why Use Our Cursor Prompt Creator?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get better results from Cursor AI with optimized prompts
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Framework-Specific
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate prompts tailored to React, Vue, Express, Django, and other popular frameworks.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Complexity-Aware
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Prompts adapt to beginner, intermediate, or advanced skill levels for optimal results.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Best Practices
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built-in prompts follow Cursor AI best practices for maximum code quality.
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
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">50+</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Languages & Frameworks</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Supported for prompt generation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">5k+</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Prompts Generated</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">By developers worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">95%</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Developer Satisfaction</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Based on user feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Perfect For Every Development Task
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              From simple components to complex applications
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-2xl">⚛️</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                React Components
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate hooks, components, and state management code
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <span className="text-2xl">🔧</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                API Development
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create REST APIs, GraphQL schemas, and database queries
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <span className="text-2xl">🧪</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Testing Code
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate unit tests, integration tests, and test utilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Documentation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create JSDoc comments, README files, and API docs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
              Get More Than Just Prompt Generation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              When you sign up for a free account, you unlock the full power of Prompt Manage's platform.
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
                Access our curated library of proven prompts for every development task.
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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Get Free Account - No Credit Card Required
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Join 10,000+ developers already optimizing their AI workflows
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-6">
            Ready to Generate Better Code?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers who are already getting better results from Cursor AI with optimized prompts.
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
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is the Cursor Prompt Creator really free?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Our Cursor Prompt Creator is completely free to use. No signup required, no hidden costs, no limits on usage.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Which programming languages are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We support 50+ programming languages including JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, Swift, and more. <Link href="/models" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">See our full list of supported languages</Link>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How does the prompt generation work?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We analyze your requirements and generate prompts using proven patterns that work best with Cursor AI. Our prompts include specific technical details, constraints, and output requirements. <Link href="/docs/best-practices" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Learn more about our methodology</Link>.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I save my generated prompts?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! <Link href="/?redirect=/dashboard" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">Sign up for a free account</Link> to save your generated prompts, create collections, and access additional features like <Link href="/p" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">300+ prompt templates</Link> and team sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-blue-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Don't just generate one prompt - build a complete library of high-performing prompts that your team can use and improve over time.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/?redirect=/dashboard">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                <Users className="mr-2 h-5 w-5" />
                Start Building Your Library
              </Button>
            </Link>
            <Link href="/p">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 text-lg">
                Browse Templates First
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-emerald-200">
            Free forever • No credit card required • Join 10,000+ developers
          </p>
        </div>
      </section>
    </div>
  )
}
