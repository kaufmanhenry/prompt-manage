'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const USE_CASES = [
  {
    role: 'Marketing Managers',
    icon: '📊',
    color: 'bg-blue-50 dark:bg-blue-950',
    description: 'Create campaigns, analyze data, and optimize content at scale',
    useCases: [
      {
        title: 'Campaign Brief Generator',
        description: 'Generate comprehensive marketing campaign briefs in seconds',
        example:
          'Input: Product + Target Audience → Output: Full campaign strategy with messaging, channels, and KPIs',
        tags: ['Strategy', 'Planning', 'ROI'],
        promptTemplate:
          'Create a marketing campaign for [product] targeting [audience] with a budget of [amount]',
      },
      {
        title: 'SEO Content Optimizer',
        description: 'Optimize blog posts and landing pages for search engines',
        example:
          'Input: Draft content → Output: SEO-optimized version with keywords, meta tags, and structure',
        tags: ['SEO', 'Content', 'Organic'],
        promptTemplate: 'Optimize this content for SEO: [content]. Target keyword: [keyword]',
      },
      {
        title: 'Social Media Calendar',
        description: 'Generate a month of social posts across all platforms',
        example:
          'Input: Brand voice + Topics → Output: 30 days of platform-specific posts with hashtags',
        tags: ['Social', 'Planning', 'Engagement'],
        promptTemplate: 'Create a 30-day social media calendar for [brand] focusing on [topics]',
      },
      {
        title: 'Email Sequence Builder',
        description: 'Create automated email nurture sequences',
        example: 'Input: Goal + Audience → Output: 5-email sequence with subject lines and CTAs',
        tags: ['Email', 'Automation', 'Conversion'],
        promptTemplate: 'Build an email nurture sequence to [goal] for [audience segment]',
      },
    ],
  },
  {
    role: 'Content Creators',
    icon: '✍️',
    color: 'bg-purple-50 dark:bg-purple-950',
    description: 'Streamline content production with AI-powered workflows',
    useCases: [
      {
        title: 'Video Script Generator',
        description: 'Create engaging video scripts for YouTube, TikTok, Instagram',
        example: 'Input: Topic + Length → Output: Full script with hooks, timestamps, and CTAs',
        tags: ['Video', 'Scripts', 'Engagement'],
        promptTemplate: 'Write a [length]-minute video script about [topic] for [platform]',
      },
      {
        title: 'Blog Post Expander',
        description: 'Turn outlines into full 1500+ word blog posts',
        example: 'Input: Outline + Keywords → Output: SEO-optimized long-form article',
        tags: ['Blogging', 'SEO', 'Long-form'],
        promptTemplate: 'Expand this outline into a 1500-word blog post: [outline]',
      },
      {
        title: 'Content Repurposer',
        description: 'Turn one piece of content into multiple formats',
        example:
          'Input: Blog post → Output: Twitter thread, LinkedIn post, Instagram carousel, video script',
        tags: ['Repurposing', 'Multi-platform', 'Efficiency'],
        promptTemplate:
          'Repurpose this content for [platform1], [platform2], [platform3]: [content]',
      },
      {
        title: 'Headline Optimizer',
        description: 'Generate high-converting headlines and titles',
        example: 'Input: Topic → Output: 10 headline variations optimized for clicks',
        tags: ['Headlines', 'CTR', 'A/B Testing'],
        promptTemplate: 'Generate 10 compelling headlines for: [topic]',
      },
    ],
  },
  {
    role: 'Small Business Owners',
    icon: '🏪',
    color: 'bg-green-50 dark:bg-green-950',
    description: 'Save time and money with AI-powered business operations',
    useCases: [
      {
        title: 'Customer Response Templates',
        description: 'Handle common customer inquiries professionally',
        example: 'Input: Inquiry type → Output: Professional, empathetic response templates',
        tags: ['Support', 'Templates', 'Efficiency'],
        promptTemplate: 'Create a professional response template for [inquiry type]',
      },
      {
        title: 'Product Description Writer',
        description: 'Create compelling product descriptions that sell',
        example: 'Input: Product features → Output: Benefit-driven descriptions for ecommerce',
        tags: ['Ecommerce', 'Copywriting', 'Sales'],
        promptTemplate: 'Write a product description for [product] highlighting [features]',
      },
      {
        title: 'Business Plan Generator',
        description: 'Create investor-ready business plan sections',
        example:
          'Input: Business idea → Output: Executive summary, market analysis, financial projections',
        tags: ['Planning', 'Strategy', 'Fundraising'],
        promptTemplate: 'Create a business plan section for [section type] for my [business]',
      },
      {
        title: 'Job Description Builder',
        description: 'Write clear, attractive job postings',
        example: 'Input: Role + Requirements → Output: Complete job description with benefits',
        tags: ['Hiring', 'HR', 'Recruitment'],
        promptTemplate:
          'Create a job description for [role] with these requirements: [requirements]',
      },
    ],
  },
  {
    role: 'Software Developers',
    icon: '💻',
    color: 'bg-orange-50 dark:bg-orange-950',
    description: 'Accelerate development with AI code assistants',
    useCases: [
      {
        title: 'Code Documentation Generator',
        description: 'Auto-generate comprehensive code documentation',
        example: 'Input: Code → Output: JSDoc comments, README sections, API docs',
        tags: ['Documentation', 'DevOps', 'Maintenance'],
        promptTemplate: 'Document this code: [code]',
      },
      {
        title: 'Bug Debugger Assistant',
        description: 'Troubleshoot and fix code issues faster',
        example: 'Input: Error + Code → Output: Root cause analysis and fix suggestions',
        tags: ['Debugging', 'Testing', 'QA'],
        promptTemplate: "Debug this error: [error]. Here's my code: [code]",
      },
      {
        title: 'API Integration Guide',
        description: 'Generate step-by-step API integration instructions',
        example: 'Input: API docs → Output: Implementation guide with code examples',
        tags: ['APIs', 'Integration', 'Tutorial'],
        promptTemplate: 'Create integration guide for [API] in [language]',
      },
      {
        title: 'Test Case Generator',
        description: 'Create comprehensive test cases automatically',
        example: 'Input: Function → Output: Unit tests, edge cases, test data',
        tags: ['Testing', 'Quality', 'Automation'],
        promptTemplate: 'Generate test cases for: [function or feature]',
      },
    ],
  },
  {
    role: 'Customer Support Teams',
    icon: '💬',
    color: 'bg-pink-50 dark:bg-pink-950',
    description: 'Deliver faster, more consistent customer support',
    useCases: [
      {
        title: 'Ticket Response Generator',
        description: 'Draft professional responses to support tickets',
        example: 'Input: Ticket content → Output: Empathetic, solution-focused response',
        tags: ['Support', 'Efficiency', 'Satisfaction'],
        promptTemplate: 'Draft a support response for: [ticket]',
      },
      {
        title: 'FAQ Builder',
        description: 'Create comprehensive FAQ sections',
        example: 'Input: Product/Service → Output: 20+ common questions with answers',
        tags: ['Self-service', 'Knowledge Base', 'Deflection'],
        promptTemplate: 'Generate FAQs for [product/service]',
      },
      {
        title: 'Escalation Email Writer',
        description: 'Handle difficult situations professionally',
        example: 'Input: Issue → Output: Diplomatic escalation email with solutions',
        tags: ['De-escalation', 'Professional', 'Resolution'],
        promptTemplate: 'Write an escalation response for: [situation]',
      },
      {
        title: 'Help Article Creator',
        description: 'Turn solutions into reusable help articles',
        example: 'Input: Solution → Output: Step-by-step help article with screenshots',
        tags: ['Documentation', 'Self-service', 'Scalability'],
        promptTemplate: 'Create a help article for: [how to do X]',
      },
    ],
  },
  {
    role: 'Sales Professionals',
    icon: '💰',
    color: 'bg-yellow-50 dark:bg-yellow-950',
    description: 'Close more deals with AI-powered sales tools',
    useCases: [
      {
        title: 'Cold Email Personalizer',
        description: 'Create personalized outreach at scale',
        example: 'Input: Prospect info → Output: Personalized email with value proposition',
        tags: ['Outbound', 'Personalization', 'Conversion'],
        promptTemplate: 'Write a personalized cold email for [prospect] about [solution]',
      },
      {
        title: 'Proposal Generator',
        description: 'Create winning sales proposals quickly',
        example: 'Input: Deal details → Output: Professional proposal with pricing and terms',
        tags: ['Proposals', 'Closing', 'Professional'],
        promptTemplate: 'Generate a sales proposal for [deal] including [requirements]',
      },
      {
        title: 'Objection Handler',
        description: 'Get proven responses to common objections',
        example: 'Input: Objection → Output: Empathetic response with social proof',
        tags: ['Objections', 'Closing', 'Training'],
        promptTemplate: 'How to handle this objection: [objection]',
      },
      {
        title: 'Follow-up Sequence',
        description: 'Automate your follow-up strategy',
        example: 'Input: Stage + Goal → Output: 7-touch follow-up sequence',
        tags: ['Follow-up', 'Automation', 'Pipeline'],
        promptTemplate: 'Create a follow-up sequence for [stage] to achieve [goal]',
      },
    ],
  },
]

type UseCase = {
  title: string
  description: string
  example: string
  tags: string[]
  promptTemplate: string
}

export default function UseCasesClient() {
  const [selectedRole, setSelectedRole] = useState(USE_CASES[0])
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Use Cases & Examples
            </h1>
            <p className="mb-8 text-xl leading-8 text-gray-600 dark:text-gray-400">
              See how professionals across industries use Prompt Manage to organize their AI prompts
              and streamline their workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/p">
                <Button variant="outline" size="lg">
                  Browse Prompts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Browse by Role
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {USE_CASES.map((role) => (
              <button
                key={role.role}
                onClick={() => {
                  setSelectedRole(role)
                  setSelectedUseCase(null)
                }}
                className={`rounded-lg border-2 p-4 transition-all ${
                  selectedRole.role === role.role
                    ? 'border-gray-900 bg-gray-100 dark:border-gray-100 dark:bg-gray-800'
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900'
                }`}
              >
                <div className="mb-2 text-center text-3xl">{role.icon}</div>
                <div className="text-center text-sm font-medium text-gray-900 dark:text-white">
                  {role.role}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Role Use Cases */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 border-b border-gray-200 pb-8 dark:border-gray-800">
            <div className="mb-4 flex items-center gap-4">
              <div className="text-4xl">{selectedRole.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedRole.role}
                </h2>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                  {selectedRole.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {selectedRole.useCases.map((useCase, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
              >
                <button
                  className="w-full p-6 text-left"
                  onClick={() =>
                    setSelectedUseCase(selectedUseCase?.title === useCase.title ? null : useCase)
                  }
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {useCase.title}
                    </h3>
                    <span className="ml-4 text-lg font-normal text-gray-400 group-hover:text-gray-600">
                      {selectedUseCase?.title === useCase.title ? '−' : '+'}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {useCase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {selectedUseCase?.title === useCase.title && (
                    <div className="mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                          Example:
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {useCase.example}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                          Prompt Template:
                        </h4>
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 font-mono text-xs dark:border-gray-800 dark:bg-gray-950">
                          {useCase.promptTemplate}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Link href="/p" className="flex-1">
                          <Button className="w-full" size="sm">
                            Find Similar Prompts
                          </Button>
                        </Link>
                        <Link href="/dashboard" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Create Prompt
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to 10x Your Productivity?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Join thousands of professionals using AI to work smarter, not harder. Start managing
            your prompts today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-2xl bg-gray-900 p-12 dark:bg-gray-900">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to organize your AI prompts?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                Create a free account to start organizing, tagging, and securely storing all your AI
                prompts in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
