import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Folder,
  Lightbulb,
  Search,
  Tag,
  Target,
  Trash2,
  Users,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Prompt Management Best Practices - Prompt Manage',
  description:
    'Learn best practices for organizing AI prompts, writing effective prompt templates, using tags, and scaling prompt workflows for teams.',
  keywords: [
    'prompt engineering best practices',
    'AI prompt organization',
    'prompt management tips',
    'effective prompts',
    'team prompt workflow',
  ],
}

export default function BestPractices() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/docs">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Prompt Management Best Practices
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Master the art of organizing, writing, and scaling AI prompts for maximum efficiency and
            team collaboration.
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. Naming Your Prompts */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  1. Naming Your Prompts
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>A great prompt name should be descriptive, specific, and instantly recognizable.</p>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    ✅ Good Examples:
                  </h3>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        Email: Follow-up After Demo Call
                      </code>
                    </li>
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        Social: LinkedIn Post from Blog Article
                      </code>
                    </li>
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        GPT-4o: Generate Product Description
                      </code>
                    </li>
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        Claude: Code Review and Optimization
                      </code>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    ❌ Poor Examples:
                  </h3>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        Prompt 1
                      </code>{' '}
                      <span className="text-sm">— too generic</span>
                    </li>
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        Test
                      </code>{' '}
                      <span className="text-sm">— no context</span>
                    </li>
                    <li>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                        Marketing Thing
                      </code>{' '}
                      <span className="text-sm">— too vague</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex gap-2">
                    <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm text-blue-900 dark:text-blue-200">
                      <strong>Pro Tip:</strong> Use a consistent naming pattern across your team,
                      like <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-800">
                        [Category]: [Purpose]
                      </code>{' '}
                      or <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-800">
                        [Model] - [Use Case]
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Using Tags Effectively */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                  <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  2. Using Tags Effectively
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>Tags are the backbone of prompt organization. Use them strategically!</p>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Recommended Tag Categories:
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Use Case</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          marketing
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          sales
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          content
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          coding
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          analysis
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Channel</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          email
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          social
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          linkedin
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          blog
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          ads
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Format</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          short-form
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          long-form
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          listicle
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          headline
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Audience</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          b2b
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          b2c
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          enterprise
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                          smb
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                    <div className="text-sm text-purple-900 dark:text-purple-200">
                      <strong>Best Practice:</strong> Limit to 3-5 tags per prompt. Too many tags
                      dilute their usefulness.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Writing Effective Prompts */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  3. Writing Effective Prompts
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>The quality of your output depends on the quality of your prompt.</p>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    The 5 C's of Great Prompts:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        1
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Clear:</strong> Be
                        specific about what you want. Avoid ambiguity.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        2
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Contextual:</strong>{' '}
                        Provide background, constraints, and requirements.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        3
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Concise:</strong> Remove
                        unnecessary words without losing meaning.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        4
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Complete:</strong> Include
                        examples, tone, length, and format requirements.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        5
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Consistent:</strong> Use
                        similar structure and terminology across related prompts.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <p className="mb-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    Example: Good vs. Poor Prompt
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="mb-1 text-xs font-medium text-red-700 dark:text-red-400">
                        ❌ Poor:
                      </div>
                      <code className="block rounded bg-white p-2 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        Write a blog post about marketing
                      </code>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-green-700 dark:text-green-400">
                        ✅ Good:
                      </div>
                      <code className="block rounded bg-white p-2 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        Write a 1000-word blog post for B2B SaaS marketers on "How to Build a
                        Content Calendar." Include 3 actionable tips, use a conversational tone, and
                        include section headers for readability.
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Organizing Your Library */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/40">
                  <Folder className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  4. Organizing Your Library
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>A well-organized prompt library saves time and ensures consistency.</p>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Organization Strategies:
                  </h3>
                  <ul className="space-y-2 pl-6">
                    <li className="flex gap-2">
                      <Search className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Use descriptive names
                        </strong>{' '}
                        so you can find prompts without opening them
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <Tag className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Tag by campaign or project
                        </strong>{' '}
                        (e.g., "Q1-2025," "Product-Launch")
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <Trash2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Archive or delete outdated prompts
                        </strong>{' '}
                        to reduce clutter
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Add descriptions
                        </strong>{' '}
                        explaining when and how to use each prompt
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                  <div className="flex gap-2">
                    <Zap className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                    <div className="text-sm text-orange-900 dark:text-orange-200">
                      <strong>Quick Tip:</strong> Review your prompt library monthly. Delete what
                      you haven't used in 3+ months and update high-value prompts based on what's
                      working.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Team Collaboration */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/40">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  5. Tips for Teams
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>Scale your prompt operations with team-wide best practices.</p>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                      Establish a Naming Convention
                    </h4>
                    <p className="text-sm">
                      Create a shared document outlining how prompts should be named and tagged.
                      Onboard new team members with this guide.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                      Share Winning Prompts
                    </h4>
                    <p className="text-sm">
                      When a prompt performs exceptionally well, share it publicly or with your team.
                      Add notes on results and use cases.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                      Version Control
                    </h4>
                    <p className="text-sm">
                      When updating high-value prompts, save a copy with a version number (e.g.,
                      "Email Template v2") before making changes.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                      Regular Prompt Audits
                    </h4>
                    <p className="text-sm">
                      Schedule quarterly reviews to clean up your library, update high-performing
                      prompts, and remove what's no longer needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Testing and Iteration */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900/40">
                  <Zap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  6. Testing and Iteration
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>The best prompts are refined through experimentation.</p>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    A/B Testing Framework:
                  </h3>
                  <ol className="list-decimal space-y-2 pl-6">
                    <li>Create 2-3 variations of the same prompt</li>
                    <li>Test them with the same inputs</li>
                    <li>Compare outputs for quality, tone, and accuracy</li>
                    <li>Keep the winner and iterate on it</li>
                    <li>Delete or archive the losing variants</li>
                  </ol>
                </div>

                <div className="mt-4 rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                  <div className="flex gap-2">
                    <Lightbulb className="h-5 w-5 flex-shrink-0 text-pink-600 dark:text-pink-400" />
                    <div className="text-sm text-pink-900 dark:text-pink-200">
                      <strong>Pro Tip:</strong> Small tweaks can yield big improvements. Try
                      changing tone ("professional" → "conversational"), length, or adding examples
                      to see what works best.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Ready to Optimize Your Prompts?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Start applying these best practices today
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
            <Link href="/p">
              <Button variant="outline" size="lg">
                Browse Examples
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

