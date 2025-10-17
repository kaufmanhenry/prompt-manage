import { Eye, Lock, Palette, Save, Settings, Share2, Trash2, User } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Documentation - Prompt Manage',
  description:
    'Learn how to use Prompt Manage. Complete guides for signing up, saving prompts, sharing publicly, editing your profile, and more.',
  keywords: [
    'prompt manage documentation',
    'how to use prompt manage',
    'save AI prompts',
    'share prompts',
    'prompt management guide',
  ],
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Documentation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about using Prompt Manage effectively.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 16, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Quick Links */}
          <div className="mb-12 grid gap-4 md:grid-cols-2">
            <Link
              href="#sign-up"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">How to Sign Up</span>
            </Link>
            <Link
              href="#save-prompts"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Save className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">How to Save Prompts</span>
            </Link>
            <Link
              href="#share-prompts"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Share2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                How to Share Prompts Publicly
              </span>
            </Link>
            <Link
              href="#edit-profile"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                How to Edit Your Profile
              </span>
            </Link>
            <Link
              href="#change-password"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                How to Change Password
              </span>
            </Link>
            <Link
              href="#dark-mode"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                How to Turn on Dark Mode
              </span>
            </Link>
            <Link
              href="#delete-prompt"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Trash2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                How to Delete a Prompt
              </span>
            </Link>
            <Link
              href="#browse-directory"
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Browse Public Prompts
              </span>
            </Link>
          </div>

          {/* Documentation Sections */}
          <div className="space-y-12">
            {/* How to Sign Up */}
            <section id="sign-up" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Sign Up
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>
                      Click{' '}
                      <strong className="text-gray-900 dark:text-white">
                        "Sign in with Google"
                      </strong>{' '}
                      on the homepage or any page
                    </li>
                    <li>Authorize Prompt Manage to access your Google account</li>
                    <li>You'll be automatically redirected to your dashboard</li>
                    <li>
                      Your account is now created! You can start saving and organizing prompts
                      immediately
                    </li>
                  </ol>
                  <div className="mt-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">
                      <strong>Note:</strong> We use Google Sign-In for secure, password-free
                      authentication. Your account is created automatically on first sign-in.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Save Prompts */}
            <section id="save-prompts" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Save className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Save Prompts
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>There are two ways to save prompts to your library:</p>

                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Option 1: Create a New Prompt
                    </h3>
                    <ol className="list-decimal space-y-2 pl-6">
                      <li>Go to your Dashboard</li>
                      <li>
                        Click the{' '}
                        <strong className="text-gray-900 dark:text-white">"New Prompt"</strong>{' '}
                        button
                      </li>
                      <li>Fill in the required fields:</li>
                      <ul className="ml-6 mt-2 list-disc space-y-1">
                        <li>
                          <strong className="text-gray-900 dark:text-white">Name:</strong> A
                          descriptive title for your prompt
                        </li>
                        <li>
                          <strong className="text-gray-900 dark:text-white">Description:</strong>{' '}
                          What the prompt does (optional but recommended)
                        </li>
                        <li>
                          <strong className="text-gray-900 dark:text-white">Prompt Text:</strong>{' '}
                          The actual prompt content
                        </li>
                        <li>
                          <strong className="text-gray-900 dark:text-white">Model:</strong> Select
                          which AI model to use (GPT-4o, Claude, Gemini, etc.)
                        </li>
                        <li>
                          <strong className="text-gray-900 dark:text-white">Tags:</strong> Add tags
                          to organize your prompts
                        </li>
                      </ul>
                      <li>
                        Click{' '}
                        <strong className="text-gray-900 dark:text-white">"Save Prompt"</strong>
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Option 2: Copy from Public Directory
                    </h3>
                    <ol className="list-decimal space-y-2 pl-6">
                      <li>
                        Browse the{' '}
                        <Link
                          href="/p"
                          className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          Public Prompt Directory
                        </Link>
                      </li>
                      <li>Find a prompt you like</li>
                      <li>
                        Click the{' '}
                        <strong className="text-gray-900 dark:text-white">
                          "Copy to My Library"
                        </strong>{' '}
                        button
                      </li>
                      <li>The prompt is instantly saved to your dashboard</li>
                      <li>You can edit it to customize for your needs</li>
                    </ol>
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <strong>Pro Tip:</strong> Use consistent tags across your prompts (like
                      "marketing," "email," "social") to make them easier to find and filter later.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Share Prompts Publicly */}
            <section id="share-prompts" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Share2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Share Prompts Publicly
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    Share your best prompts with the community! When you make a prompt public, it
                    appears in the Public Prompt Directory and gets its own shareable URL.
                  </p>
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>Go to your Dashboard</li>
                    <li>Click on the prompt you want to share</li>
                    <li>
                      Click the <strong className="text-gray-900 dark:text-white">"Edit"</strong>{' '}
                      button
                    </li>
                    <li>
                      Scroll down and toggle{' '}
                      <strong className="text-gray-900 dark:text-white">
                        "Make this prompt public"
                      </strong>{' '}
                      to <strong>ON</strong>
                    </li>
                    <li>
                      Click{' '}
                      <strong className="text-gray-900 dark:text-white">"Save Changes"</strong>
                    </li>
                    <li>
                      Your prompt now has a public URL like{' '}
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        promptmanage.com/p/your-prompt-slug
                      </code>
                    </li>
                  </ol>

                  <div className="mt-4 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <p className="mb-2 text-sm font-semibold text-purple-900 dark:text-purple-200">
                      What happens when you share publicly:
                    </p>
                    <ul className="list-disc space-y-1 pl-6 text-sm text-purple-900 dark:text-purple-200">
                      <li>Your prompt appears in the Public Prompt Directory</li>
                      <li>It gets a unique, shareable URL</li>
                      <li>View counts are tracked</li>
                      <li>Others can copy it to their own libraries</li>
                      <li>You can make it private again anytime</li>
                    </ul>
                  </div>

                  <div className="mt-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Privacy Note:</strong> Only share prompts you're comfortable making
                      public. Don't include sensitive information, API keys, or proprietary content.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Edit Your Profile */}
            <section id="edit-profile" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Edit Your Profile
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>
                      Click on your profile picture or name in the top right corner of any page
                    </li>
                    <li>
                      Select <strong className="text-gray-900 dark:text-white">"Settings"</strong>{' '}
                      from the dropdown menu
                    </li>
                    <li>Update any of the following:</li>
                    <ul className="ml-6 mt-2 list-disc space-y-1">
                      <li>
                        <strong className="text-gray-900 dark:text-white">Display Name:</strong> The
                        name shown on your public profile
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-white">Bio:</strong> A short
                        description about yourself (optional)
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-white">Profile Picture:</strong>{' '}
                        Your Google account photo is used by default
                      </li>
                    </ul>
                    <li>
                      Click{' '}
                      <strong className="text-gray-900 dark:text-white">"Save Changes"</strong>
                    </li>
                  </ol>
                  <div className="mt-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">
                      <strong>Note:</strong> Your display name and bio appear on your public profile
                      page when you share prompts publicly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Change Password */}
            <section id="change-password" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Change Your Password
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    Since Prompt Manage uses Google Sign-In, you don't manage a password directly
                    with us. Instead, your account security is managed through Google.
                  </p>

                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      To change your Google account password:
                    </h3>
                    <ol className="list-decimal space-y-2 pl-6">
                      <li>
                        Go to{' '}
                        <a
                          href="https://myaccount.google.com/security"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          Google Account Security
                        </a>
                      </li>
                      <li>
                        Click on{' '}
                        <strong className="text-gray-900 dark:text-white">"Password"</strong>
                      </li>
                      <li>Follow Google's prompts to update your password</li>
                      <li>
                        Your new password will automatically apply to Prompt Manage and all other
                        Google services
                      </li>
                    </ol>
                  </div>

                  <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <strong>Security Tip:</strong> Enable 2-factor authentication on your Google
                      account for extra security across all services, including Prompt Manage.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Turn on Dark Mode */}
            <section id="dark-mode" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Palette className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Turn on Dark Mode
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>Toggle between light and dark mode directly in Prompt Manage.</p>

                  <ol className="list-decimal space-y-3 pl-6">
                    <li>
                      Click on your profile picture or name in the top right corner of any page
                    </li>
                    <li>
                      Select <strong className="text-gray-900 dark:text-white">"Settings"</strong>{' '}
                      from the dropdown menu
                    </li>
                    <li>
                      Look for the{' '}
                      <strong className="text-gray-900 dark:text-white">"Dark Mode"</strong> toggle
                    </li>
                    <li>Click the toggle to switch between light and dark mode</li>
                    <li>
                      Your preference is saved automatically and will apply across all your devices
                    </li>
                  </ol>

                  <div className="mt-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">
                      <strong>Note:</strong> Your dark mode preference is saved to your account, so
                      it stays consistent across all devices where you're signed in.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Delete a Prompt */}
            <section id="delete-prompt" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Delete a Prompt
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>Go to your Dashboard</li>
                    <li>Find the prompt you want to delete</li>
                    <li>Click on the prompt to open it</li>
                    <li>
                      Click the <strong className="text-gray-900 dark:text-white">"Delete"</strong>{' '}
                      button (usually a trash icon)
                    </li>
                    <li>Confirm the deletion when prompted</li>
                    <li>The prompt is permanently removed from your library</li>
                  </ol>

                  <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                    <p className="text-sm text-red-900 dark:text-red-200">
                      <strong>Warning:</strong> Deleting a prompt is permanent and cannot be undone.
                      If it was shared publicly, it will also be removed from the Public Prompt
                      Directory.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Browse Public Prompts */}
            <section id="browse-directory" className="scroll-mt-8">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                    <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How to Browse Public Prompts
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    The Public Prompt Directory has 300+ community-shared prompts ready to use with
                    any AI model.
                  </p>
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>
                      Go to the{' '}
                      <Link
                        href="/p"
                        className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        Public Prompt Directory
                      </Link>
                    </li>
                    <li>Use the filters to narrow your search:</li>
                    <ul className="ml-6 mt-2 list-disc space-y-1">
                      <li>
                        <strong className="text-gray-900 dark:text-white">Search:</strong> Find
                        prompts by keyword
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-white">Model:</strong> Filter by
                        AI model (GPT-4o, Claude, Gemini, etc.)
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-white">Tags:</strong> Browse by
                        category (marketing, coding, content, etc.)
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-white">Sort:</strong> View by
                        most recent or most popular
                      </li>
                    </ul>
                    <li>Click on any prompt to view details</li>
                    <li>
                      Click{' '}
                      <strong className="text-gray-900 dark:text-white">
                        "Copy to My Library"
                      </strong>{' '}
                      to save it (requires sign-in)
                    </li>
                  </ol>

                  <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <strong>Pro Tip:</strong> You don't need an account to browse the directory,
                      but signing in lets you save prompts to your library and customize them.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Need More Help */}
          <div className="mt-16 rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Need More Help?
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Check out our best practices guide or explore the platform
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs/best-practices">
                <Button variant="outline" size="lg">
                  View Best Practices
                </Button>
              </Link>
              <Link href="/p">
                <Button size="lg">Browse Public Prompts</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
