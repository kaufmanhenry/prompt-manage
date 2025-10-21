import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Practices — Prompt Manage',
  description:
    'Master prompt engineering with proven strategies for organization, writing, team collaboration, and scaling AI workflows.',
  keywords: [
    'prompt engineering best practices',
    'AI prompt organization',
    'prompt management tips',
    'effective prompts',
    'team prompt workflow',
    'prompt optimization',
  ],
  openGraph: {
    title: 'Best Practices — Prompt Manage',
    description: 'Master prompt engineering with proven strategies and best practices.',
    type: 'website',
  },
}

export default function BestPractices() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/docs"
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documentation
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Best Practices</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Master prompt engineering with proven strategies for organization, writing, and team
            collaboration.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Naming Your Prompts */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Naming Your Prompts</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                A great prompt name should be descriptive, specific, and instantly recognizable.
                Think of it as the title of a book—it should tell you exactly what's inside.
              </p>

              <div>
                <h3 className="mb-4 text-lg font-medium">Good Examples</h3>
                <div className="space-y-2">
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Email: Follow-up After Demo Call</code>
                  </div>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Social: LinkedIn Post from Blog Article</code>
                  </div>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">GPT-4o: Generate Product Description</code>
                  </div>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Claude: Code Review and Optimization</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">Poor Examples</h3>
                <div className="space-y-2">
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Prompt 1</code>
                    <span className="ml-2 text-sm text-gray-500">— too generic</span>
                  </div>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Test</code>
                    <span className="ml-2 text-sm text-gray-500">— no context</span>
                  </div>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Marketing Thing</code>
                    <span className="ml-2 text-sm text-gray-500">— too vague</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">Naming Patterns</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>[Category]: [Purpose]</strong> — Email: Welcome Series
                  </p>
                  <p>
                    <strong>[Model] - [Use Case]</strong> — GPT-4 - Code Review
                  </p>
                  <p>
                    <strong>[Channel] [Format] [Audience]</strong> — LinkedIn Post B2B
                  </p>
                  <p>
                    <strong>[Campaign] [Type]</strong> — Q1-Launch Headlines
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Using Tags Effectively */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Using Tags Effectively</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Tags are the backbone of prompt organization. Use them strategically to create a
                searchable, filterable library that scales with your team.
              </p>

              <div>
                <h3 className="mb-4 text-lg font-medium">Recommended Tag Categories</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Use Case</h4>
                    <div className="flex flex-wrap gap-1">
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
                    </div>
                  </div>
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Channel</h4>
                    <div className="flex flex-wrap gap-1">
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
                    </div>
                  </div>
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Format</h4>
                    <div className="flex flex-wrap gap-1">
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
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Audience</h4>
                    <div className="flex flex-wrap gap-1">
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

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Best Practices</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Limit to 3-5 tags per prompt</li>
                    <li>• Use consistent spelling and casing</li>
                    <li>• Create a team tag dictionary</li>
                    <li>• Review and clean tags monthly</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">Common Mistakes</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Too many tags (overwhelming)</li>
                    <li>• Inconsistent naming</li>
                    <li>• Single-use tags</li>
                    <li>• Never updating old tags</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Writing Effective Prompts */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Writing Effective Prompts</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                The quality of your output depends on the quality of your prompt. Follow these
                proven principles to create prompts that consistently deliver great results.
              </p>

              <div>
                <h3 className="mb-4 text-lg font-medium">The 5 C's of Great Prompts</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">1. Clear</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Be specific about what you want. Avoid ambiguity.
                    </p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Write a 500-word blog post about sustainable energy</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">2. Contextual</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Provide background, constraints, and requirements.
                    </p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>For B2B SaaS audience, include industry statistics</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">3. Concise</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Remove unnecessary words without losing meaning.
                    </p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Use active voice, avoid jargon</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">4. Complete</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Include examples, tone, length, and format requirements.
                    </p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Include 3 bullet points, use conversational tone</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">5. Consistent</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use similar structure and terminology across related prompts.
                    </p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Follow the same template structure for all email prompts</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Poor Example</h3>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Write a blog post about marketing</code>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Too vague, no context, no specifications
                  </p>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">Good Example</h3>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">
                      Write a 1000-word blog post for B2B SaaS marketers on "How to Build a Content
                      Calendar." Include 3 actionable tips, use a conversational tone, and include
                      section headers for readability.
                    </code>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Clear, contextual, complete specifications
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Organizing Your Library */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Organizing Your Library</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                A well-organized prompt library saves time and ensures consistency. Here's how to
                build one that scales with your team.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Organization Strategies
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Use descriptive names so you can find prompts without opening them',
                      "Tag by campaign or project (e.g., 'Q1-2025,' 'Product-Launch')",
                      'Archive or delete outdated prompts to reduce clutter',
                      'Add descriptions explaining when and how to use each prompt',
                      'Use date prefixes for time-sensitive prompts',
                      'Mark high-performing prompts as favorites',
                    ].map((strategy, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Library Maintenance
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Monthly Review
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Delete unused prompts (3+ months old)</li>
                        <li>• Update high-value prompts</li>
                        <li>• Consolidate similar prompts</li>
                        <li>• Review and update tags</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Quarterly Audit
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Analyze prompt performance</li>
                        <li>• Identify top performers</li>
                        <li>• Archive seasonal prompts</li>
                        <li>• Update team guidelines</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Organization Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/prompts"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Prompt Library
                  </Link>
                  <Link
                    href="/docs/prompt-editing#organization"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Organization Guide
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Team Collaboration */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Team Collaboration</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Effective team collaboration on prompts requires structure, communication, and
                shared standards. Here's how to build a collaborative prompt culture.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Standards
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'Naming Convention',
                        description:
                          'Create a shared document outlining how prompts should be named and tagged. Onboard new team members with this guide.',
                      },
                      {
                        title: 'Tag Dictionary',
                        description:
                          'Maintain a master list of approved tags with definitions. Update it quarterly based on team feedback.',
                      },
                      {
                        title: 'Quality Guidelines',
                        description:
                          "Define what makes a 'good' prompt for your team. Include examples and anti-patterns.",
                      },
                      {
                        title: 'Review Process',
                        description:
                          'Establish a peer review process for high-impact prompts. Include feedback templates.',
                      },
                    ].map((standard, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {standard.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {standard.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Collaboration Workflows
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Sharing Winning Prompts
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Share high-performing prompts publicly</li>
                        <li>• Add notes on results and use cases</li>
                        <li>• Create team favorites collection</li>
                        <li>• Document what made them successful</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Version Control
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Save copies before major changes</li>
                        <li>• Use version numbers (v1, v2, etc.)</li>
                        <li>• Document changes in descriptions</li>
                        <li>• Keep original versions for reference</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Regular Audits
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Schedule quarterly prompt reviews</li>
                        <li>• Clean up outdated content</li>
                        <li>• Update high-performing prompts</li>
                        <li>• Share insights with the team</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Team Resources</h4>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/docs/teams"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Teams Documentation
                  </Link>
                  <Link
                    href="/p"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Public Prompt Library
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Testing and Iteration */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Testing & Iteration</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                The best prompts are refined through experimentation. Here's a systematic approach
                to testing and improving your prompts.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    A/B Testing Framework
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Create 2-3 variations of the same prompt',
                      'Test them with identical inputs',
                      'Compare outputs for quality, tone, and accuracy',
                      'Keep the winner and iterate on it',
                      'Delete or archive the losing variants',
                      'Document what made the winner successful',
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Optimization Strategies
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Small Tweaks, Big Impact
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Change tone: "professional" → "conversational"</li>
                        <li>• Adjust length: add or remove words</li>
                        <li>• Add examples: show don't just tell</li>
                        <li>• Modify structure: bullet points vs paragraphs</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Performance Tracking
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Track usage frequency</li>
                        <li>• Monitor output quality scores</li>
                        <li>• Collect user feedback</li>
                        <li>• Measure time to completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Testing Tools</h4>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/docs/prompt-run-history"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Run History Tracking
                  </Link>
                  <Link
                    href="/docs/derivative-prompts"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Derivative Prompts
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Security & Privacy */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Security & Privacy</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Security and privacy are crucial when working with AI prompts. Follow these
                guidelines to protect sensitive information and maintain data security.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Data Protection
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        ⚠️ Never Include
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Passwords or API keys</li>
                        <li>• Personal identification numbers</li>
                        <li>• Financial information</li>
                        <li>• Medical records</li>
                        <li>• Confidential business data</li>
                        <li>• Customer personal information</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        ✅ Safe to Include
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• General industry knowledge</li>
                        <li>• Public company information</li>
                        <li>• Generic templates</li>
                        <li>• Educational content</li>
                        <li>• Non-sensitive examples</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Privacy Best Practices
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Access Control
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Use private prompts for sensitive content</li>
                        <li>• Share only what's necessary</li>
                        <li>• Review public prompts regularly</li>
                        <li>• Use team permissions appropriately</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Data Handling</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Export data regularly for backup</li>
                        <li>• Delete outdated sensitive prompts</li>
                        <li>• Use version control for changes</li>
                        <li>• Monitor access logs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Security Resources
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/security"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Security Overview
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/docs/account-management#privacy-security"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Account Security Guide
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Scaling Strategies */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Scaling Strategies</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                As your prompt library grows, you need strategies to maintain quality and
                efficiency. Here's how to scale your prompt operations.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Library Management
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Automation</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Use AI agents for prompt generation</li>
                        <li>• Automate testing and validation</li>
                        <li>• Set up automated backups</li>
                        <li>• Use templates for common patterns</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Quality Control
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Implement review processes</li>
                        <li>• Use performance metrics</li>
                        <li>• Regular quality audits</li>
                        <li>• Team training programs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Scaling
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Processes</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Standardize workflows</li>
                        <li>• Create role-based access</li>
                        <li>• Implement approval processes</li>
                        <li>• Use team hierarchies</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Tools</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Use advanced search and filtering</li>
                        <li>• Implement workflow automation</li>
                        <li>• Set up monitoring and alerts</li>
                        <li>• Use analytics for insights</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Scaling Resources
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/docs/teams"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    AI Agents Guide
                  </Link>
                  <Link
                    href="/docs/workflows"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Workflow Engine
                  </Link>
                  <Link
                    href="/docs/teams/scaling"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Team Scaling
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Tools & Resources */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Tools & Resources</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Essential tools and resources to help you implement these best practices
                effectively.
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Built-in Features
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Link
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Prompt Library
                      </Link>
                      <span className="ml-2">— Organize and manage prompts</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Link
                        href="/docs/version-history"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Version Control
                      </Link>
                      <span className="ml-2">— Track changes and revert</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Link
                        href="/docs/teams"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Team Collaboration
                      </Link>
                      <span className="ml-2">— Share and collaborate</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    External Tools
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Notion</strong> — Document templates and guidelines
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Slack</strong> — Team communication and sharing
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Google Sheets</strong> — Track performance metrics
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Learning Resources
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Link
                        href="/docs"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Documentation
                      </Link>
                      <span className="ml-2">— Complete guides</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Link
                        href="/p"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Public Library
                      </Link>
                      <span className="ml-2">— Examples and inspiration</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-blue-400">
                      <Link
                        href="/support"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Support
                      </Link>
                      <span className="ml-2">— Get help when needed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Start Checklist
                </h3>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Set up naming conventions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Create tag dictionary</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Write quality guidelines</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Set up review process</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Train your team</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Schedule regular audits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Monitor performance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span>Iterate and improve</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Ready to Master Prompt Management?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Start applying these best practices today and transform your AI workflow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/p"
              className="inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Browse Examples
            </Link>
            <Link
              href="/docs"
              className="inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Read More Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
