import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Plus, Search, Share2, Users, Zap } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn how to get the most out of Prompt Manage
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Start Guide
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Create</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your first prompt with a name, description, and tags
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. Organize</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use tags and filters to keep your prompts organized
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. Share</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share prompts publicly or keep them private
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Private Prompt Library
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Prompt Manage acts as your personal library for AI prompts. Every prompt you create is private by default, giving you complete control over your content. Organize prompts with tags, descriptions, and categories to make them easy to find when you need them.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Store prompts for any AI model (GPT-4, Claude, Gemini, etc.)</li>
                    <li>• Add descriptions and tags for easy organization</li>
                    <li>• Search and filter your prompts instantly</li>
                    <li>• Copy prompts with one click</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                  <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Publicly Share Prompts!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Share individual prompts with friends and colleagues when you publish on Prompt Manage. Each prompt gets its own public page when shared. SOON: Collections
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Share individual prompts with unique URLs</li>
                    <li>• Public pages work without authentication</li>
                    <li>• Track view counts on shared prompts</li>
                    <li>• Make prompts private again anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Community Discovery
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Browse prompts shared by the community in our public directory. Discover new techniques, find inspiration, and learn from others. The directory is searchable and filterable by model, tags, and popularity.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Browse thousands of shared prompts</li>
                    <li>• Search by model, tags, or keywords</li>
                    <li>• Filter by popularity and recency</li>
                    <li>• Copy prompts directly to your library</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Organization</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Tag-based organization system</li>
                <li>• Model-specific categorization</li>
                <li>• Advanced search and filtering</li>
                <li>• Bulk operations (Pro)</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Sharing</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• One-click public sharing</li>
                <li>• Unique URLs for each prompt</li>
                <li>• View count tracking</li>
                <li>• Social media integration</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Productivity</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• One-click copy to clipboard</li>
                <li>• Keyboard shortcuts</li>
                <li>• Dark/light mode</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Security</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Private by default</li>
                <li>• Secure authentication</li>
                <li>• Data encryption</li>
                <li>• GDPR compliant</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Best Practices
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Naming Your Prompts</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Use descriptive names that clearly indicate what the prompt does. Include the target model or use case in the name for easy identification.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Using Tags Effectively</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create a consistent tagging system. Use tags for model types, use cases, difficulty levels, and any other categories that help you organize your prompts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Writing Descriptions</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Include clear descriptions that explain what the prompt does, what inputs it expects, and what outputs it produces. This helps when sharing with others.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sharing Responsibly</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Only share prompts that you're comfortable making public. Remember that shared prompts can be viewed by anyone with the link.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first prompt and start organizing your AI workflow
          </p>
          <Link href="/auth/login">
            <Button size="lg">
              Start Using Prompt Manage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 