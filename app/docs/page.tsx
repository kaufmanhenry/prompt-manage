import { ArrowLeft, BookOpen, Plus, Search, Share2, Users } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn how to get the most out of Prompt Manage
          </p>
        </div>

        {/* Docs Navigation Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Documentation Pages
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
            <li>
              <Link
                href="/docs/best-practices"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Prompt Management Best Practices
              </Link>
            </li>
            <li>
              <Link
                href="/docs/account-settings"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Editing Account Settings
              </Link>
            </li>
            <li>
              <Link
                href="/docs/change-password"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Changing Your Password
              </Link>
            </li>
            <li>
              <Link
                href="/docs/signup-help"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Signing Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Get Help Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Get Help
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
            <li>
              <Link
                href="/docs/account-settings"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Editing Account Settings
              </Link>
            </li>
            <li>
              <Link
                href="/docs/change-password"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Changing Your Password
              </Link>
            </li>
            <li>
              <Link
                href="/docs/signup-help"
                className="text-blue-600 underline dark:text-blue-400"
              >
                Signing Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Quick Start Guide
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  1. Create
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your first prompt with a name, description, and tags
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  2. Organize
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use tags and filters to keep your prompts organized
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  3. Share
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share prompts publicly or keep them private
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Private Prompt Library
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Prompt Manage acts as your personal library for AI prompts.
                    Every prompt you create is private by default, giving you
                    complete control over your content. Organize prompts with
                    tags, descriptions, and categories to make them easy to find
                    when you need them.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>
                      • Store prompts for any AI model (GPT-4, Claude, Gemini,
                      etc.)
                    </li>
                    <li>• Add descriptions and tags for easy organization</li>
                    <li>• Search and filter your prompts instantly</li>
                    <li>• Copy prompts with one click</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Publicly Share Prompts!
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Share individual prompts with friends and colleagues when
                    you publish on Prompt Manage. Each prompt gets its own
                    public page when shared. SOON: Collections
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Share individual prompts with unique URLs</li>
                    <li>• Public pages work without authentication</li>
                    <li>• Track view counts on shared prompts</li>
                    <li>• Make prompts private again anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Community Discovery
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Browse prompts shared by the community in our public
                    directory. Discover new techniques, find inspiration, and
                    learn from others. The directory is searchable and
                    filterable by model, tags, and popularity.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Browse hundreds of shared prompts</li>
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
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Organization
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Tag-based organization system</li>
                <li>• Model-specific categorization</li>
                <li>• Advanced search and filtering</li>
                <li>• Bulk operations (Pro)</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Sharing
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• One-click public sharing</li>
                <li>• Unique URLs for each prompt</li>
                <li>• View count tracking</li>
                <li>• Social media integration</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Productivity
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• One-click copy to clipboard</li>
                <li>• Keyboard shortcuts</li>
                <li>• Dark/light mode</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Security
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Best Practices
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Naming Your Prompts
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use descriptive names that clearly indicate what the prompt
                  does. Include the target model or use case in the name for
                  easy identification.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Using Tags Effectively
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create a consistent tagging system. Use tags for model types,
                  use cases, difficulty levels, and any other categories that
                  help you organize your prompts.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Writing Descriptions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Include clear descriptions that explain what the prompt does,
                  what inputs it expects, and what outputs it produces. This
                  helps when sharing with others.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Sharing Responsibly
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only share prompts that you&apos;re comfortable making public.
                  Remember that shared prompts can be viewed by anyone with the
                  link.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Ready to get started?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Create your first prompt and start organizing your AI workflow
          </p>
          <Link href="/auth/login">
            <Button size="lg">Start Using Prompt Manage</Button>
          </Link>
        </div>

        {/* Editing Account Settings */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Editing Account Settings{' '}
            <Link
              href="/docs/account-settings"
              className="ml-2 text-base text-blue-600 underline dark:text-blue-400"
            >
              (Full Help)
            </Link>
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <ol className="list-decimal space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                Go to your profile or dashboard and click on{' '}
                <strong>Settings</strong> in the navigation menu.
              </li>
              <li>
                Update your display name, email address, or other available
                fields as needed.
              </li>
              <li>
                Click <strong>Save</strong> to apply your changes.
              </li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">
              Note: Some fields (such as email) may require verification or
              additional security steps.
            </p>
          </div>
        </div>

        {/* Changing Your Password */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Changing Your Password{' '}
            <Link
              href="/docs/change-password"
              className="ml-2 text-base text-blue-600 underline dark:text-blue-400"
            >
              (Full Help)
            </Link>
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <ol className="list-decimal space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                Navigate to <strong>Settings</strong> from your profile or
                dashboard.
              </li>
              <li>
                Find the <strong>Password</strong> section.
              </li>
              <li>
                Enter your current password, then your new password twice to
                confirm.
              </li>
              <li>
                Click <strong>Change Password</strong> to update your password.
              </li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">
              If you forget your password, use the{' '}
              <strong>Forgot Password</strong> link on the sign-in page to reset
              it via email.
            </p>
          </div>
        </div>

        {/* Signing Up */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Signing Up{' '}
            <Link
              href="/docs/signup-help"
              className="ml-2 text-base text-blue-600 underline dark:text-blue-400"
            >
              (Full Help)
            </Link>
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <ol className="list-decimal space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                Go to the <strong>Sign Up</strong> page from the main navigation
                or homepage.
              </li>
              <li>
                Enter your email address, create a password, and fill in any
                required fields.
              </li>
              <li>
                Click <strong>Sign Up</strong> to create your account.
              </li>
              <li>
                Check your email for a verification link and follow the
                instructions to verify your account.
              </li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">
              If you do not receive a verification email, check your spam folder
              or request a new one from the sign-up page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
