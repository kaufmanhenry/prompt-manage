import { Eye, FolderOpen, Globe, Lock, Plus, Share2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Collections Guide — Prompt Manage',
  description:
    'Learn how to create, organize, and share prompt collections. Organize your AI prompts into curated collections for better management and sharing.',
  keywords: [
    'prompt collections',
    'organize prompts',
    'share collections',
    'prompt management',
    'AI prompt collections',
  ],
  openGraph: {
    title: 'Collections Guide — Prompt Manage',
    description: 'Learn how to create and organize prompt collections effectively.',
    type: 'website',
  },
}

export default function CollectionsGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/docs"
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Documentation
          </Link>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <FolderOpen className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Prompt Collections</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Organize your AI prompts into curated collections. Create private collections for your
            personal use or share public collections with the community.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: January 30, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* What Are Collections */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <FolderOpen className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">What Are Collections?</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Collections are curated groups of related prompts that help you organize your prompt
                library. Think of them as folders or playlists for your AI prompts—each collection
                can contain multiple prompts that share a common theme, use case, or purpose.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                      Private Collections
                    </h3>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Keep collections private for personal use or team collaboration. Only you can see
                    and manage private collections.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Public Collections
                    </h3>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Share collections with the community. Public collections appear in search results,
                    get their own URL, and can be discovered by others.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Creating a Collection */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Plus className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Creating a Collection</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Follow these steps to create your first collection:
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      1
                    </div>
                    <h3 className="text-lg font-semibold">Navigate to Collections</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Go to your Dashboard and click{' '}
                    <Link
                      href="/dashboard/collections"
                      className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      "Collections"
                    </Link>{' '}
                    in the sidebar, or visit{' '}
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-900">
                      /dashboard/collections
                    </code>
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      2
                    </div>
                    <h3 className="text-lg font-semibold">Click "New Collection"</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the{' '}
                    <strong className="text-gray-900 dark:text-gray-100">"New Collection"</strong>{' '}
                    button at the top of the page to open the collection creation form.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      3
                    </div>
                    <h3 className="text-lg font-semibold">Fill in Collection Details</h3>
                  </div>
                  <div className="space-y-3 text-gray-600 dark:text-gray-400">
                    <p>
                      <strong className="text-gray-900 dark:text-gray-100">Title (required):</strong>{' '}
                      Choose a descriptive name for your collection. Examples:
                    </p>
                    <ul className="ml-6 list-disc space-y-1">
                      <li>"GPT-4 Marketing Prompts"</li>
                      <li>"Claude Code Review Collection"</li>
                      <li>"Content Creation Templates"</li>
                    </ul>
                    <p>
                      <strong className="text-gray-900 dark:text-gray-100">Description:</strong> Add
                      a description explaining what your collection contains and when to use it.
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-gray-100">Cover Image (optional):</strong>{' '}
                      Add a cover image URL to make your collection visually appealing.
                    </p>
                    <p>
                      <strong className="text-gray-900 dark:text-gray-100">Visibility:</strong> Choose
                      between:
                    </p>
                    <ul className="ml-6 list-disc space-y-1">
                      <li>
                        <strong>Private:</strong> Only visible to you
                      </li>
                      <li>
                        <strong>Public:</strong> Visible to everyone and indexed for SEO
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      4
                    </div>
                    <h3 className="text-lg font-semibold">Save Your Collection</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click <strong className="text-gray-900 dark:text-gray-100">"Save Collection"</strong>{' '}
                    to create your collection. You can add prompts to it immediately or later.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Adding Prompts to Collections */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Plus className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Adding Prompts to Collections</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                There are several ways to add prompts to your collections:
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">From the Collections Page</h3>
                  <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Go to Dashboard → Collections</li>
                    <li>Click "Add Prompts" on any collection</li>
                    <li>Search or browse your prompts</li>
                    <li>Select prompts using checkboxes</li>
                    <li>Click "Add Selected" to add multiple prompts at once</li>
                  </ol>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">From Prompt Pages</h3>
                  <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>On any prompt page or card, click "Add to Collection"</li>
                    <li>Choose an existing collection or "Create New Collection"</li>
                    <li>If creating new, fill in the form and click "Create & Add Prompt"</li>
                    <li>The prompt is immediately added to the collection</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Pro Tip:</strong> You can add multiple prompts to a collection at once from
                  the Collections page. Select multiple prompts using checkboxes, then click "Add
                  Selected" to add them all at once.
                </p>
              </div>
            </div>
          </section>

          {/* Publishing Collections */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Share2 className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Publishing Collections</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Publishing a collection makes it publicly visible and discoverable. Here's how to
                publish or unpublish a collection:
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">Requirements for Publishing</h3>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>
                      <strong className="text-gray-900 dark:text-gray-100">Description:</strong> Your
                      collection must have a description before it can be made public. This helps
                      others understand what your collection contains.
                    </li>
                    <li>
                      <strong className="text-gray-900 dark:text-gray-100">At least one prompt:</strong>{' '}
                      While not required, collections with prompts are more valuable to the community.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">How to Publish</h3>
                  <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Go to Dashboard → Collections</li>
                    <li>Find the collection you want to publish</li>
                    <li>
                      Click the dropdown menu (three dots) on the collection card
                    </li>
                    <li>Click "Publish"</li>
                    <li>
                      If your collection doesn't have a description, you'll be prompted to add one
                    </li>
                    <li>
                      Once published, your collection is live at{' '}
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-900">
                        /collections/[slug]
                      </code>
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">How to Unpublish</h3>
                  <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Go to Dashboard → Collections</li>
                    <li>Find the collection you want to unpublish</li>
                    <li>Click the dropdown menu (three dots) on the collection card</li>
                    <li>Click "Unpublish"</li>
                    <li>
                      Your collection is now private and only visible to you
                    </li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                <p className="mb-2 text-sm font-semibold text-purple-900 dark:text-purple-100">
                  What Happens When You Publish:
                </p>
                <ul className="ml-4 list-disc space-y-1 text-sm text-purple-800 dark:text-purple-200">
                  <li>Your collection appears in the public Collections directory</li>
                  <li>It gets a unique, shareable URL: <code>promptmanage.com/collections/[slug]</code></li>
                  <li>View counts are tracked</li>
                  <li>It's indexed for search engines (SEO)</li>
                  <li>Others can discover and view your collection</li>
                  <li>You can share it on social media</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Viewing Public Collections */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Eye className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Browsing Public Collections</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Discover collections created by the community and find inspiration for your own
                prompts.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">Browse Collections</h3>
                  <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>
                      Visit{' '}
                      <Link
                        href="/collections"
                        className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        /collections
                      </Link>
                    </li>
                    <li>Browse trending, popular, and newest collections</li>
                    <li>Use the search bar to find specific collections</li>
                    <li>Filter by tags or sort by different criteria</li>
                  </ol>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">View a Collection</h3>
                  <ol className="ml-4 list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Click on any collection to view its details</li>
                    <li>See all prompts in the collection</li>
                    <li>View creator profile and stats</li>
                    <li>Share the collection on social media</li>
                    <li>Copy individual prompts to your library</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <FolderOpen className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Best Practices</h2>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    ✅ Naming Collections
                  </h3>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>Use descriptive, specific titles</li>
                    <li>Include keywords that others might search for</li>
                    <li>Keep titles concise but informative</li>
                    <li>Examples: "GPT-4 Marketing Prompts" or "Claude Code Review Collection"</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
                    ✅ Writing Descriptions
                  </h3>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>Clearly explain what the collection contains</li>
                    <li>Mention the AI models or use cases covered</li>
                    <li>Include examples of what prompts are included</li>
                    <li>Make it search-friendly with relevant keywords</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-purple-900 dark:text-purple-100">
                    ✅ Organizing Prompts
                  </h3>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-purple-800 dark:text-purple-200">
                    <li>Group related prompts together</li>
                    <li>Aim for 5-20 prompts per collection for optimal engagement</li>
                    <li>Update collections regularly with new prompts</li>
                    <li>Remove outdated or low-quality prompts</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-orange-900 dark:text-orange-100">
                    ✅ SEO Optimization
                  </h3>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-orange-800 dark:text-orange-200">
                    <li>Use descriptive titles and descriptions</li>
                    <li>Add relevant tags to your collections</li>
                    <li>Include cover images for visual appeal</li>
                    <li>Share your collections on social media</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <FolderOpen className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Use Cases</h2>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">Personal Organization</h3>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Organize your prompts by:
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Project: Group prompts for specific projects or clients</li>
                    <li>AI Model: Create collections for ChatGPT, Claude, Gemini, etc.</li>
                    <li>Use Case: Marketing prompts, coding prompts, creative writing</li>
                    <li>Topic: Research prompts, business prompts, educational content</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">Team Collaboration</h3>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Share collections with your team:
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Team Collections: Share collections with team members</li>
                    <li>Version Control: Keep track of prompt iterations</li>
                    <li>Best Practices: Create collections of approved prompts</li>
                    <li>Knowledge Sharing: Build a shared prompt library</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">Public Sharing</h3>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Build your reputation:
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Showcase Work: Build public collections to showcase your skills</li>
                    <li>Community Contribution: Share valuable collections</li>
                    <li>SEO Benefits: Public collections are indexed and searchable</li>
                    <li>Social Sharing: Share collections on social media</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold">Learning & Discovery</h3>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Discover new prompts:
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Browse Collections: Explore trending and popular collections</li>
                    <li>Follow Creators: See collections from creators you follow</li>
                    <li>Search by Tags: Find collections by specific topics</li>
                    <li>Copy Prompts: Save prompts from collections to your library</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900/50">
              <h2 className="mb-6 text-xl font-semibold">Related Resources</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/dashboard/collections"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Go to Collections</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your collections in the dashboard
                  </p>
                </Link>
                <Link
                  href="/collections"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Browse Public Collections</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover collections from the community
                  </p>
                </Link>
                <Link
                  href="/docs/best-practices"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Best Practices Guide</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn how to write effective prompts
                  </p>
                </Link>
                <Link
                  href="/docs"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Full Documentation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Explore all documentation pages
                  </p>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

