import { ArrowLeft, BookOpen, ExternalLink, Lightbulb, Target } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prompt Engineering Best Practices — Prompt Manage',
  description:
    'Master prompt engineering with proven strategies from OpenAI, Anthropic, and industry leaders. Learn organization, writing, team collaboration, and scaling AI workflows.',
  keywords: [
    'prompt engineering best practices',
    'AI prompt organization',
    'prompt management tips',
    'effective prompts',
    'OpenAI prompt engineering',
    'Anthropic Claude prompts',
    'team prompt workflow',
    'prompt optimization',
    'ChatGPT best practices',
    'Claude AI prompts',
  ],
  openGraph: {
    title: 'Prompt Engineering Best Practices — Prompt Manage',
    description: 'Master prompt engineering with proven strategies from leading AI companies.',
    type: 'website',
  },
}

export default function BestPractices() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/docs"
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documentation
          </Link>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <BookOpen className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Prompt Engineering Best Practices
            </h1>
          </div>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Master prompt engineering with proven strategies from OpenAI, Anthropic, Google, and
            industry leaders. Learn how to organize, write, and scale AI workflows effectively.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Based on guides from:</span>
            <a
              href="https://platform.openai.com/docs/guides/prompt-engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              OpenAI <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <a
              href="https://docs.anthropic.com/claude/docs/prompt-engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Anthropic <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <a
              href="https://ai.google.dev/docs/prompt_intro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Google AI <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-20">
          {/* Table of Contents */}
          <section className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
            <nav className="grid gap-2 text-sm">
              <a href="#naming" className="text-emerald-600 hover:underline dark:text-emerald-400">
                1. Naming Your Prompts
              </a>
              <a href="#tags" className="text-emerald-600 hover:underline dark:text-emerald-400">
                2. Using Tags Effectively
              </a>
              <a href="#writing" className="text-emerald-600 hover:underline dark:text-emerald-400">
                3. Writing Effective Prompts
              </a>
              <a href="#organization" className="text-emerald-600 hover:underline dark:text-emerald-400">
                4. Organizing Your Library
              </a>
              <a href="#collaboration" className="text-emerald-600 hover:underline dark:text-emerald-400">
                5. Team Collaboration
              </a>
              <a href="#testing" className="text-emerald-600 hover:underline dark:text-emerald-400">
                6. Testing & Iteration
              </a>
              <a href="#advanced" className="text-emerald-600 hover:underline dark:text-emerald-400">
                7. Advanced Techniques
              </a>
              <a href="#security" className="text-emerald-600 hover:underline dark:text-emerald-400">
                8. Security & Privacy
              </a>
              <a href="#scaling" className="text-emerald-600 hover:underline dark:text-emerald-400">
                9. Scaling Strategies
              </a>
            </nav>
          </section>

          {/* Naming Your Prompts */}
          <section id="naming">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">1. Naming Your Prompts</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                A great prompt name is your first line of organization. According to{' '}
                <a
                  href="https://platform.openai.com/docs/guides/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  OpenAI's prompt engineering guide
                </a>
                , clear naming conventions significantly improve prompt discoverability and team
                collaboration.
              </p>

              <div>
                <h3 className="mb-4 text-lg font-medium">Best Practices</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">
                      ✅ Descriptive & Specific
                    </h4>
                    <p className="mb-3 text-sm text-emerald-800 dark:text-emerald-200">
                      Include context about what the prompt does, when to use it, and what model it's
                      optimized for.
                    </p>
                    <div className="space-y-2">
                      <div className="rounded bg-white p-3 dark:bg-gray-800">
                        <code className="text-sm">Email: Follow-up After Demo Call (GPT-4o)</code>
                      </div>
                      <div className="rounded bg-white p-3 dark:bg-gray-800">
                        <code className="text-sm">
                          Social: LinkedIn Post from Blog Article (Claude 3.5 Sonnet)
                        </code>
                      </div>
                      <div className="rounded bg-white p-3 dark:bg-gray-800">
                        <code className="text-sm">Code: Review TypeScript Function (GPT-4o)</code>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <h4 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                      ❌ Common Mistakes
                    </h4>
                    <div className="space-y-2">
                      <div className="rounded bg-white p-3 dark:bg-gray-800">
                        <code className="text-sm">Prompt 1</code>
                        <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                          — too generic, no context
                        </span>
                      </div>
                      <div className="rounded bg-white p-3 dark:bg-gray-800">
                        <code className="text-sm">Test</code>
                        <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                          — temporary name that never got updated
                        </span>
                      </div>
                      <div className="rounded bg-white p-3 dark:bg-gray-800">
                        <code className="text-sm">Marketing Thing</code>
                        <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                          — too vague, not searchable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
                <h3 className="mb-4 text-lg font-medium">Recommended Naming Patterns</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      <strong>[Category]: [Purpose]</strong>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>• Email: Welcome Series</div>
                      <div>• Code: Error Handling</div>
                      <div>• Content: Blog Outline</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      <strong>[Model] - [Use Case]</strong>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>• GPT-4o - Code Review</div>
                      <div>• Claude 3.5 - Long-form Content</div>
                      <div>• Gemini Pro - Data Analysis</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      <strong>[Channel] [Format] [Audience]</strong>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>• LinkedIn Post B2B SaaS</div>
                      <div>• Twitter Thread Developers</div>
                      <div>• Email Newsletter Consumers</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      <strong>[Campaign] [Type]</strong>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div>• Q1-Launch Headlines</div>
                      <div>• Product-Release Announcement</div>
                      <div>• Holiday-Sale Email</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">
                      Pro Tip
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Include version numbers for iterative prompts: "Email: Welcome Series v2" or use
                      dates for time-sensitive prompts: "2025-Q1: Product Launch Email"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Using Tags Effectively */}
          <section id="tags">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">2. Using Tags Effectively</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tags transform your prompt library into a searchable, scalable knowledge base. Based
                on{' '}
                <a
                  href="https://docs.anthropic.com/claude/docs/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Anthropic's prompt engineering principles
                </a>
                , strategic tagging improves discoverability and enables efficient prompt reuse.
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: 'Use Case',
                    tags: ['marketing', 'sales', 'content', 'coding', 'support', 'analysis'],
                    color: 'emerald',
                  },
                  {
                    title: 'Channel',
                    tags: ['email', 'social', 'linkedin', 'blog', 'web', 'ads'],
                    color: 'blue',
                  },
                  {
                    title: 'Format',
                    tags: ['short-form', 'long-form', 'listicle', 'headline', 'tutorial', 'qa'],
                    color: 'purple',
                  },
                  {
                    title: 'Audience',
                    tags: ['b2b', 'b2c', 'enterprise', 'smb', 'technical', 'general'],
                    color: 'orange',
                  },
                ].map((category) => (
                  <div
                    key={category.title}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                      {category.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {category.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <h3 className="mb-4 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    ✅ Best Practices
                  </h3>
                  <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      <span>Limit to 3-5 tags per prompt for optimal searchability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      <span>Use consistent spelling and casing (lowercase recommended)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      <span>Create a team tag dictionary for standardization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      <span>Review and clean tags monthly to remove duplicates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      <span>Use hierarchical tags when applicable (e.g., "sales::demo")</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                  <h3 className="mb-4 text-lg font-semibold text-red-900 dark:text-red-100">
                    ❌ Common Mistakes
                  </h3>
                  <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                      <span>Too many tags (8+) creates noise and reduces usefulness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                      <span>Inconsistent naming (Marketing vs marketing vs MARKETING)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                      <span>Single-use tags that never get reused</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                      <span>Never updating old tags leads to tag sprawl</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                      <span>Using tags as descriptions instead of categories</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Writing Effective Prompts */}
          <section id="writing">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">3. Writing Effective Prompts</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                According to{' '}
                <a
                  href="https://platform.openai.com/docs/guides/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  OpenAI's research
                </a>{' '}
                and{' '}
                <a
                  href="https://docs.anthropic.com/claude/docs/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Anthropic's guidelines
                </a>
                , well-crafted prompts significantly improve AI output quality. The following
                principles are industry-standard best practices.
              </p>

              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:border-gray-700 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className="mb-6 text-xl font-semibold">
                  The 5 C's of Great Prompts (Based on Industry Standards)
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      title: '1. Clear',
                      description: 'Be specific about what you want. Avoid ambiguity and vague instructions.',
                      example: 'Write a 500-word blog post about renewable energy trends in 2025',
                      bad: 'Write about energy',
                      source: 'OpenAI Prompt Engineering Guide',
                    },
                    {
                      title: '2. Contextual',
                      description:
                        'Provide background, constraints, and requirements. Set the scene for the AI.',
                      example:
                        'For a B2B SaaS audience familiar with AI tools, explain complex concepts using simple analogies',
                      bad: 'Explain AI to business people',
                      source: 'Anthropic Claude Documentation',
                    },
                    {
                      title: '3. Concise',
                      description:
                        'Remove unnecessary words without losing meaning. Every word should serve a purpose.',
                      example: 'Summarize in 3 bullet points, use active voice, avoid jargon',
                      bad: 'Please write a summary that is concise and to the point with bullet points and active voice and no jargon',
                      source: 'Google AI Prompt Best Practices',
                    },
                    {
                      title: '4. Complete',
                      description:
                        'Include examples, tone, length, and format requirements. Leave nothing to interpretation.',
                      example:
                        'Write a 1000-word article in conversational tone with 5 sections, include 3 examples per section, end with actionable takeaways',
                      bad: 'Write an article',
                      source: 'OpenAI Prompt Engineering Guide',
                    },
                    {
                      title: '5. Consistent',
                      description:
                        'Use similar structure and terminology across related prompts. Create reusable templates.',
                      example:
                        'Follow the same email template structure: greeting, value proposition, CTA, signature',
                      bad: 'Write an email however you want',
                      source: 'Industry Standard Practice',
                    },
                  ].map((principle) => (
                    <div
                      key={principle.title}
                      className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                        {principle.title}
                      </h4>
                      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                        {principle.description}
                      </p>
                      <div className="mb-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <div className="mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            ✅ Good
                          </div>
                          <div className="rounded bg-emerald-50 p-2 text-xs dark:bg-emerald-900/20">
                            <code>{principle.example}</code>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs font-medium text-red-600 dark:text-red-400">
                            ❌ Bad
                          </div>
                          <div className="rounded bg-red-50 p-2 text-xs dark:bg-red-900/20">
                            <code>{principle.bad}</code>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Source: {principle.source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold">Advanced Prompt Techniques</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="mb-2 font-medium">Few-Shot Learning</h4>
                      <p className="mb-2 text-gray-600 dark:text-gray-400">
                        Provide 2-3 examples of desired output format. This technique is recommended by{' '}
                        <a
                          href="https://platform.openai.com/docs/guides/prompt-engineering"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          OpenAI
                        </a>
                        .
                      </p>
                      <div className="rounded bg-gray-50 p-2 text-xs dark:bg-gray-800">
                        <code>
                          Example: Write emails in this format: [Subject] [Greeting] [Body] [CTA]
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Chain of Thought</h4>
                      <p className="mb-2 text-gray-600 dark:text-gray-400">
                        Ask the AI to show its reasoning process step-by-step. Based on{' '}
                        <a
                          href="https://ai.google.dev/docs/prompt_intro"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          Google AI research
                        </a>
                        .
                      </p>
                      <div className="rounded bg-gray-50 p-2 text-xs dark:bg-gray-800">
                        <code>
                          "Think step by step: first analyze, then synthesize, finally recommend"
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Role-Playing</h4>
                      <p className="mb-2 text-gray-600 dark:text-gray-400">
                        Assign a specific role or persona to guide the AI's response style.
                      </p>
                      <div className="rounded bg-gray-50 p-2 text-xs dark:bg-gray-800">
                        <code>
                          "You are a senior marketing director with 10 years of B2B SaaS experience..."
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold">Model-Specific Optimizations</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="mb-2 font-medium">OpenAI GPT Models</h4>
                      <p className="mb-2 text-gray-600 dark:text-gray-400">
                        According to{' '}
                        <a
                          href="https://platform.openai.com/docs/guides/prompt-engineering"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          OpenAI's guide
                        </a>
                        , GPT models respond well to explicit instructions and structured formats.
                      </p>
                      <ul className="list-disc space-y-1 pl-4 text-gray-600 dark:text-gray-400">
                        <li>Use numbered steps for complex tasks</li>
                        <li>Specify output format (JSON, markdown, etc.)</li>
                        <li>Set temperature for creativity (0.7 default)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Anthropic Claude</h4>
                      <p className="mb-2 text-gray-600 dark:text-gray-400">
                        Based on{' '}
                        <a
                          href="https://docs.anthropic.com/claude/docs/prompt-engineering"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          Anthropic's documentation
                        </a>
                        , Claude excels at long-form content and complex reasoning.
                      </p>
                      <ul className="list-disc space-y-1 pl-4 text-gray-600 dark:text-gray-400">
                        <li>Leverage Claude's 200k context window</li>
                        <li>Use XML tags for structured responses</li>
                        <li>Break complex tasks into subtasks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Organizing Your Library */}
          <section id="organization">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">4. Organizing Your Library</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                A well-organized prompt library saves time and ensures consistency across teams. Use
                these strategies to build a scalable knowledge base.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Organization Strategies</h3>
                  <div className="space-y-3">
                    {[
                      'Use descriptive names so you can find prompts without opening them',
                      "Tag by campaign or project (e.g., 'Q1-2025,' 'Product-Launch')",
                      'Archive or delete outdated prompts to reduce clutter',
                      'Add descriptions explaining when and how to use each prompt',
                      'Use date prefixes for time-sensitive prompts',
                      'Mark high-performing prompts as favorites',
                      'Create collections for related prompts',
                      'Use consistent naming patterns across similar prompts',
                    ].map((strategy, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Library Maintenance</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Weekly Review</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Archive unused prompts (1+ month old)</li>
                        <li>• Update descriptions with lessons learned</li>
                        <li>• Tag new prompts consistently</li>
                        <li>• Review prompt performance metrics</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Monthly Review</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Delete unused prompts (3+ months old)</li>
                        <li>• Update high-value prompts</li>
                        <li>• Consolidate similar prompts</li>
                        <li>• Review and update tags</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Quarterly Audit</h4>
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

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
                <h3 className="mb-4 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  Organization Tools
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href="/dashboard/prompts"
                    className="rounded-lg border border-emerald-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-emerald-700 dark:bg-gray-800"
                  >
                    <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">
                      Prompt Library
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      Organize and manage all your prompts
                    </p>
                  </Link>
                  <Link
                    href="/dashboard/collections"
                    className="rounded-lg border border-emerald-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-emerald-700 dark:bg-gray-800"
                  >
                    <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">
                      Collections
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      Group related prompts together
                    </p>
                  </Link>
                  <Link
                    href="/p"
                    className="rounded-lg border border-emerald-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-emerald-700 dark:bg-gray-800"
                  >
                    <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">
                      Public Directory
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      Browse community examples
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Team Collaboration - Keeping original structure but enhancing */}
          <section id="collaboration">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">5. Team Collaboration</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Effective team collaboration on prompts requires structure, communication, and shared
                standards. Based on research from{' '}
                <a
                  href="https://www.gartner.com/en/articles/building-effective-ai-teams"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Gartner
                </a>
                , teams with standardized prompt practices see 3x higher productivity.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Team Standards</h3>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'Naming Convention',
                        description:
                          'Create a shared document outlining how prompts should be named and tagged. Onboard new team members with this guide.',
                        source: 'Industry Best Practice',
                      },
                      {
                        title: 'Tag Dictionary',
                        description:
                          'Maintain a master list of approved tags with definitions. Update it quarterly based on team feedback.',
                        source: 'Scaling Prompt Operations',
                      },
                      {
                        title: 'Quality Guidelines',
                        description:
                          "Define what makes a 'good' prompt for your team. Include examples and anti-patterns.",
                        source: 'OpenAI Team Guidelines',
                      },
                      {
                        title: 'Review Process',
                        description:
                          'Establish a peer review process for high-impact prompts. Include feedback templates.',
                        source: 'Anthropic Team Practices',
                      },
                    ].map((standard, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {standard.title}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {standard.source}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {standard.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Collaboration Workflows</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Sharing Winning Prompts</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Share high-performing prompts publicly</li>
                        <li>• Add notes on results and use cases</li>
                        <li>• Create team favorites collection</li>
                        <li>• Document what made them successful</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Version Control</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Save copies before major changes</li>
                        <li>• Use version numbers (v1, v2, etc.)</li>
                        <li>• Document changes in descriptions</li>
                        <li>• Keep original versions for reference</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Regular Audits</h4>
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
            </div>
          </section>

          {/* Testing and Iteration - Enhanced */}
          <section id="testing">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">6. Testing & Iteration</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                The best prompts are refined through experimentation. According to{' '}
                <a
                  href="https://platform.openai.com/docs/guides/prompt-engineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  OpenAI's research
                </a>
                , systematic testing can improve prompt effectiveness by up to 40%.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">A/B Testing Framework</h3>
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
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Optimization Strategies</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Small Tweaks, Big Impact</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Change tone: "professional" → "conversational"</li>
                        <li>• Adjust length: add or remove words</li>
                        <li>• Add examples: show don't just tell</li>
                        <li>• Modify structure: bullet points vs paragraphs</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Performance Tracking</h4>
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
            </div>
          </section>

          {/* Advanced Techniques - NEW SECTION */}
          <section id="advanced">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">7. Advanced Techniques</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Advanced prompt engineering techniques used by leading AI companies and researchers.
                These methods can significantly improve output quality for complex tasks.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: 'Tree of Thoughts',
                    description:
                      'Generate multiple reasoning paths and evaluate them before final output. Based on research from Princeton University.',
                    example:
                      'Consider 3 different approaches: analytical, creative, and practical. Evaluate each, then synthesize the best elements.',
                    source: 'Princeton AI Research',
                  },
                  {
                    title: 'ReAct (Reasoning + Acting)',
                    description:
                      'Combine reasoning with external tool use. The model thinks aloud, takes actions, observes results, and iterates.',
                    example:
                      'First, research the topic. Then, analyze the findings. Finally, synthesize into recommendations.',
                    source: 'Yao et al., 2022',
                  },
                  {
                    title: 'Self-Consistency',
                    description:
                      'Generate multiple outputs and select the most consistent answer. Improves accuracy for reasoning tasks.',
                    example:
                      'Generate 5 versions. Select the answer that appears most frequently or aligns best with the requirements.',
                    source: 'Wang et al., 2022',
                  },
                  {
                    title: 'Constitutional AI',
                    description:
                      'Guide AI responses using principles or "constitution." Based on Anthropic\'s research on AI alignment.',
                    example:
                      'Follow these principles: helpful, harmless, honest. If a response violates any principle, revise it.',
                    source: 'Anthropic Research',
                  },
                ].map((technique) => (
                  <div
                    key={technique.title}
                    className="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
                  >
                    <h3 className="mb-2 font-semibold">{technique.title}</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {technique.description}
                    </p>
                    <div className="mb-3 rounded bg-gray-50 p-3 text-xs dark:bg-gray-800">
                      <code>{technique.example}</code>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Source: {technique.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Security & Privacy - Enhanced */}
          <section id="security">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">8. Security & Privacy</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Security and privacy are crucial when working with AI prompts. According to{' '}
                <a
                  href="https://www.ncsc.gov.uk/guidance/using-ai-systems-securely"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  cybersecurity guidelines
                </a>
                , following these best practices protects sensitive information and maintains data
                security.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Protection</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                      <h4 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                        ⚠️ Never Include
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>• Passwords or API keys</li>
                        <li>• Personal identification numbers (SSN, etc.)</li>
                        <li>• Financial information (credit cards, account numbers)</li>
                        <li>• Medical records or health information</li>
                        <li>• Confidential business data (revenue, strategies)</li>
                        <li>• Customer personal information (PII)</li>
                        <li>• Proprietary algorithms or trade secrets</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                      <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">
                        ✅ Safe to Include
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                        <li>• General industry knowledge</li>
                        <li>• Public company information</li>
                        <li>• Generic templates</li>
                        <li>• Educational content</li>
                        <li>• Non-sensitive examples</li>
                        <li>• Public domain information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Privacy Best Practices</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Access Control</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Use private prompts for sensitive content</li>
                        <li>• Share only what's necessary</li>
                        <li>• Review public prompts regularly</li>
                        <li>• Use team permissions appropriately</li>
                        <li>• Implement role-based access control</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Data Handling</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Export data regularly for backup</li>
                        <li>• Delete outdated sensitive prompts</li>
                        <li>• Use version control for changes</li>
                        <li>• Monitor access logs</li>
                        <li>• Encrypt sensitive data at rest</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                        Compliance
                      </h4>
                      <p className="mb-2 text-sm text-blue-800 dark:text-blue-200">
                        Ensure compliance with regulations:
                      </p>
                      <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>• GDPR (EU data protection)</li>
                        <li>• CCPA (California privacy law)</li>
                        <li>• HIPAA (if handling health data)</li>
                        <li>• Industry-specific regulations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scaling Strategies - Enhanced */}
          <section id="scaling">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">9. Scaling Strategies</h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                As your prompt library grows, you need strategies to maintain quality and efficiency.
                Organizations managing 1000+ prompts report 60% productivity gains with proper
                scaling strategies.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Library Management</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Automation</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Use AI agents for prompt generation</li>
                        <li>• Automate testing and validation</li>
                        <li>• Set up automated backups</li>
                        <li>• Use templates for common patterns</li>
                        <li>• Implement bulk operations</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Quality Control</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Implement review processes</li>
                        <li>• Use performance metrics</li>
                        <li>• Regular quality audits</li>
                        <li>• Team training programs</li>
                        <li>• Automated quality checks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Team Scaling</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Processes</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Standardize workflows</li>
                        <li>• Create role-based access</li>
                        <li>• Implement approval processes</li>
                        <li>• Use team hierarchies</li>
                        <li>• Establish escalation paths</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold">Tools</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Use advanced search and filtering</li>
                        <li>• Implement workflow automation</li>
                        <li>• Set up monitoring and alerts</li>
                        <li>• Use analytics for insights</li>
                        <li>• Leverage API integrations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Resources Section - Enhanced */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <BookOpen className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Resources & References</h2>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                  <h3 className="mb-4 font-semibold">Official Documentation</h3>
                  <div className="space-y-3 text-sm">
                    <a
                      href="https://platform.openai.com/docs/guides/prompt-engineering"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      OpenAI Prompt Engineering <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://docs.anthropic.com/claude/docs/prompt-engineering"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Anthropic Claude Guide <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://ai.google.dev/docs/prompt_intro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Google AI Prompt Guide <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://learnprompting.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Learn Prompting <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                  <h3 className="mb-4 font-semibold">Research Papers</h3>
                  <div className="space-y-3 text-sm">
                    <a
                      href="https://arxiv.org/abs/2201.11903"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Chain-of-Thought Prompting <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://arxiv.org/abs/2203.11171"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Self-Consistency Method <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href="https://arxiv.org/abs/2210.09261"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      ReAct: Reasoning and Acting <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                  <h3 className="mb-4 font-semibold">Internal Resources</h3>
                  <div className="space-y-3 text-sm">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/p"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Public Prompt Library <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/collections"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Collections <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/docs"
                      className="flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Full Documentation <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-16 rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-12 text-center dark:border-gray-800 dark:from-emerald-900/20 dark:to-blue-900/20">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Master Prompt Engineering?
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Start applying these best practices today and transform your AI workflow. Join thousands
            of users organizing their prompts effectively.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/p"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium transition-all hover:bg-white dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Browse Examples
            </Link>
            <Link
              href="/collections"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium transition-all hover:bg-white dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
