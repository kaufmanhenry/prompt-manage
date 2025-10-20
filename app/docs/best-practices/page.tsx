import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Folder,
  Search,
  Settings,
  Shield,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
          <Link href="/docs" className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documentation
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Best Practices
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Master prompt engineering with proven strategies for organization, writing, and team collaboration.
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
                A great prompt name should be descriptive, specific, and instantly recognizable. Think of it as the title of a book—it should tell you exactly what's inside.
              </p>

              <div>
                <h3 className="mb-2 text-base font-medium">Good Examples</h3>
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
                <h3 className="mb-2 text-base font-medium">Poor Examples</h3>
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
                <h3 className="mb-2 text-base font-medium">Naming Patterns</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>[Category]: [Purpose]</strong> — Email: Welcome Series</p>
                  <p><strong>[Model] - [Use Case]</strong> — GPT-4 - Code Review</p>
                  <p><strong>[Channel] [Format] [Audience]</strong> — LinkedIn Post B2B</p>
                  <p><strong>[Campaign] [Type]</strong> — Q1-Launch Headlines</p>
                </div>
              </div>
            </div>
          </section>

          {/* Using Tags Effectively */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Using Tags Effectively</h2>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Tags are the backbone of prompt organization. Use them strategically to create a searchable, filterable library that scales with your team.
              </p>

              <div>
                <h3 className="mb-2 text-base font-medium">Recommended Tag Categories</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Use Case</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">marketing</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">sales</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">content</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">coding</span>
                    </div>
                  </div>
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Channel</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">email</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">social</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">linkedin</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">blog</span>
                    </div>
                  </div>
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Format</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">short-form</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">long-form</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">listicle</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">headline</span>
                    </div>
                  </div>
                  <div className="rounded border p-4">
                    <h4 className="mb-2 font-medium">Audience</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">b2b</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">b2c</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">enterprise</span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">smb</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-base font-medium">Best Practices</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Limit to 3-5 tags per prompt</li>
                    <li>• Use consistent spelling and casing</li>
                    <li>• Create a team tag dictionary</li>
                    <li>• Review and clean tags monthly</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-base font-medium">Common Mistakes</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
                The quality of your output depends on the quality of your prompt. Follow these proven principles to create prompts that consistently deliver great results.
              </p>

              <div>
                <h3 className="mb-2 text-base font-medium">The 5 C's of Great Prompts</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-1 font-medium">1. Clear</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Be specific about what you want. Avoid ambiguity.</p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Write a 500-word blog post about sustainable energy</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">2. Contextual</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Provide background, constraints, and requirements.</p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>For B2B SaaS audience, include industry statistics</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">3. Concise</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remove unnecessary words without losing meaning.</p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Use active voice, avoid jargon</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">4. Complete</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Include examples, tone, length, and format requirements.</p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Include 3 bullet points, use conversational tone</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">5. Consistent</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use similar structure and terminology across related prompts.</p>
                    <div className="mt-1 rounded bg-gray-50 p-2 text-xs dark:bg-gray-900">
                      <code>Follow the same template structure for all email prompts</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-base font-medium">Poor Example</h3>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Write a blog post about marketing</code>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Too vague, no context, no specifications</p>
                </div>
                <div>
                  <h3 className="mb-2 text-base font-medium">Good Example</h3>
                  <div className="rounded bg-gray-50 p-3 dark:bg-gray-900">
                    <code className="text-sm">Write a 1000-word blog post for B2B SaaS marketers on "How to Build a Content Calendar." Include 3 actionable tips, use a conversational tone, and include section headers for readability.</code>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Clear, contextual, complete specifications</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Organizing Your Library */}
          <section id="organization">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-600 p-2">
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">4. Organizing Your Library</CardTitle>
                    <CardDescription>Build a scalable, maintainable prompt library</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    A well-organized prompt library saves time and ensures consistency. Here's how to build one that scales with your team.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Strategies</h3>
                      <div className="space-y-3">
                        {[
                          { icon: Search, text: "Use descriptive names so you can find prompts without opening them" },
                          { icon: Tag, text: "Tag by campaign or project (e.g., 'Q1-2025,' 'Product-Launch')" },
                          { icon: Trash2, text: "Archive or delete outdated prompts to reduce clutter" },
                          { icon: BookOpen, text: "Add descriptions explaining when and how to use each prompt" },
                          { icon: Clock, text: "Use date prefixes for time-sensitive prompts" },
                          { icon: Star, text: "Mark high-performing prompts as favorites" }
                        ].map((strategy, index) => (
                          <div key={index} className="flex gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <strategy.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{strategy.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Library Maintenance</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200">Monthly Review</h4>
                          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                            <li>• Delete unused prompts (3+ months old)</li>
                            <li>• Update high-value prompts</li>
                            <li>• Consolidate similar prompts</li>
                            <li>• Review and update tags</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                          <h4 className="font-semibold text-green-900 dark:text-green-200">Quarterly Audit</h4>
                          <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-300">
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
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Organization Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/dashboard/prompts" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Prompt Library <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/docs/prompt-editing#organization" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Organization Guide <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 5. Team Collaboration */}
          <section id="teamwork">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-600 p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">5. Team Collaboration</CardTitle>
                    <CardDescription>Scale your prompt operations with team-wide best practices</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Effective team collaboration on prompts requires structure, communication, and shared standards. Here's how to build a collaborative prompt culture.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Standards</h3>
                      <div className="space-y-3">
                        {[
                          {
                            title: "Naming Convention",
                            description: "Create a shared document outlining how prompts should be named and tagged. Onboard new team members with this guide.",
                            icon: FileText
                          },
                          {
                            title: "Tag Dictionary", 
                            description: "Maintain a master list of approved tags with definitions. Update it quarterly based on team feedback.",
                            icon: Tag
                          },
                          {
                            title: "Quality Guidelines",
                            description: "Define what makes a 'good' prompt for your team. Include examples and anti-patterns.",
                            icon: CheckCircle2
                          },
                          {
                            title: "Review Process",
                            description: "Establish a peer review process for high-impact prompts. Include feedback templates.",
                            icon: Users
                          }
                        ].map((standard, index) => (
                          <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <standard.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{standard.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{standard.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collaboration Workflows</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200">Sharing Winning Prompts</h4>
                          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                            <li>• Share high-performing prompts publicly</li>
                            <li>• Add notes on results and use cases</li>
                            <li>• Create team favorites collection</li>
                            <li>• Document what made them successful</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                          <h4 className="font-semibold text-green-900 dark:text-green-200">Version Control</h4>
                          <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-300">
                            <li>• Save copies before major changes</li>
                            <li>• Use version numbers (v1, v2, etc.)</li>
                            <li>• Document changes in descriptions</li>
                            <li>• Keep original versions for reference</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-200">Regular Audits</h4>
                          <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-300">
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
                      <Link href="/docs/teams" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Teams Documentation <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/p" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Public Prompt Library <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 6. Testing and Iteration */}
          <section id="testing">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-pink-600 p-2">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">6. Testing & Iteration</CardTitle>
                    <CardDescription>Optimize your prompts through systematic experimentation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    The best prompts are refined through experimentation. Here's a systematic approach to testing and improving your prompts.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">A/B Testing Framework</h3>
                      <div className="space-y-3">
                        {[
                          "Create 2-3 variations of the same prompt",
                          "Test them with identical inputs",
                          "Compare outputs for quality, tone, and accuracy", 
                          "Keep the winner and iterate on it",
                          "Delete or archive the losing variants",
                          "Document what made the winner successful"
                        ].map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700 dark:bg-pink-900/40 dark:text-pink-400">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Optimization Strategies</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200">Small Tweaks, Big Impact</h4>
                          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                            <li>• Change tone: "professional" → "conversational"</li>
                            <li>• Adjust length: add or remove words</li>
                            <li>• Add examples: show don't just tell</li>
                            <li>• Modify structure: bullet points vs paragraphs</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                          <h4 className="font-semibold text-green-900 dark:text-green-200">Performance Tracking</h4>
                          <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-300">
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
                      <Link href="/docs/prompt-run-history" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Run History Tracking <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/docs/derivative-prompts" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Derivative Prompts <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 7. Security & Privacy */}
          <section id="security">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-600 p-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">7. Security & Privacy</CardTitle>
                    <CardDescription>Protect sensitive information and maintain data security</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Security and privacy are crucial when working with AI prompts. Follow these guidelines to protect sensitive information and maintain data security.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Protection</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                          <h4 className="font-semibold text-red-900 dark:text-red-200">⚠️ Never Include</h4>
                          <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-300">
                            <li>• Passwords or API keys</li>
                            <li>• Personal identification numbers</li>
                            <li>• Financial information</li>
                            <li>• Medical records</li>
                            <li>• Confidential business data</li>
                            <li>• Customer personal information</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                          <h4 className="font-semibold text-green-900 dark:text-green-200">✅ Safe to Include</h4>
                          <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-300">
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy Best Practices</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200">Public vs Private</h4>
                          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                            <li>• Make prompts private by default</li>
                            <li>• Only share non-sensitive prompts publicly</li>
                            <li>• Review prompts before making public</li>
                            <li>• Use team sharing for sensitive content</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-200">Access Control</h4>
                          <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-300">
                            <li>• Use team permissions appropriately</li>
                            <li>• Regularly review access levels</li>
                            <li>• Remove access for former team members</li>
                            <li>• Monitor prompt access logs</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Security Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/security" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Security Overview <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/privacy" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Privacy Policy <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/docs/getting-started/account-management#security" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Account Security Guide <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 8. Scaling Strategies */}
          <section id="scaling">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-600 p-2">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">8. Scaling Strategies</CardTitle>
                    <CardDescription>Grow your prompt operations efficiently</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    As your prompt library grows, you need strategies to maintain quality and efficiency. Here's how to scale your prompt operations.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Phases</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Phase 1: Foundation (0-50 prompts)</h4>
                          <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Establish naming conventions</li>
                            <li>• Create basic tag system</li>
                            <li>• Focus on quality over quantity</li>
                            <li>• Document best practices</li>
                          </ul>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Phase 2: Organization (50-200 prompts)</h4>
                          <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Implement hierarchical tags</li>
                            <li>• Create prompt templates</li>
                            <li>• Establish review processes</li>
                            <li>• Build team guidelines</li>
                          </ul>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Phase 3: Automation (200+ prompts)</h4>
                          <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Implement automated workflows</li>
                            <li>• Use AI agents for generation</li>
                            <li>• Create prompt factories</li>
                            <li>• Build analytics dashboards</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scaling Tools</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200">Template Systems</h4>
                          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                            <li>• Create reusable prompt templates</li>
                            <li>• Use variable substitution</li>
                            <li>• Build template libraries</li>
                            <li>• Standardize common patterns</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                          <h4 className="font-semibold text-green-900 dark:text-green-200">Automation</h4>
                          <ul className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-300">
                            <li>• Use AI agents for generation</li>
                            <li>• Implement batch processing</li>
                            <li>• Create automated workflows</li>
                            <li>• Build prompt factories</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-200">Analytics</h4>
                          <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-300">
                            <li>• Track prompt performance</li>
                            <li>• Monitor usage patterns</li>
                            <li>• Identify optimization opportunities</li>
                            <li>• Build performance dashboards</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Scaling Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/docs/features/autonomous-agents" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        AI Agents Guide <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/docs/features/autonomous-workflows-engine" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Workflow Engine <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                      <Link href="/docs/teams/scaling" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        Team Scaling <ExternalLink className="ml-1 inline h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 9. Tools & Resources */}
          <section id="tools">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-600 p-2">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">9. Tools & Resources</CardTitle>
                    <CardDescription>Essential tools and resources for prompt management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Leverage these tools and resources to maximize your prompt management efficiency and effectiveness.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Built-in Tools</h4>
                      <div className="space-y-2">
                        <Link href="/claude-prompt-creator" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Claude Prompt Creator
                        </Link>
                        <Link href="/cursor-prompt-creator" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Cursor Prompt Creator
                        </Link>
                        <Link href="/optimizer" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Prompt Optimizer
                        </Link>
                        <Link href="/dashboard/prompts" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Prompt Library
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Documentation</h4>
                      <div className="space-y-2">
                        <Link href="/docs/getting-started/account-management" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Account Management
                        </Link>
                        <Link href="/docs/prompt-editing" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Prompt Editing Guide
                        </Link>
                        <Link href="/docs/teams" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Team Collaboration
                        </Link>
                        <Link href="/docs/features" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Feature Documentation
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Community</h4>
                      <div className="space-y-2">
                        <Link href="/p" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Public Prompt Library
                        </Link>
                        <Link href="/trending" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Trending Prompts
                        </Link>
                        <Link href="/categories" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Browse by Category
                        </Link>
                        <Link href="/support" className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                          Support Center
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
                    <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Quick Start Checklist</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Set up your account and profile</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Create your first prompt</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Establish naming conventions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Set up your tag system</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Review security guidelines</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Explore public prompts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Set up team collaboration</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Schedule regular reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="text-2xl">Ready to Master Prompt Management?</CardTitle>
              <CardDescription className="text-blue-100">
                Start applying these best practices today and transform your AI workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/p">
                  <Button variant="outline" size="lg" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Examples
                  </Button>
                </Link>
                <Link href="/claude-prompt-creator">
                  <Button variant="outline" size="lg" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Create Prompts
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Read More Docs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
