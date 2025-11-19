import {
  BarChart,
  Briefcase,
  Code,
  FileText,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Palette,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'AI Prompt Categories - Browse by Use Case | Prompt Manage',
  description:
    'Explore AI prompts organized by category. Find templates for coding, marketing, writing, design, education, and more across all AI models.',
  keywords: [
    'AI prompt categories',
    'prompt use cases',
    'ChatGPT categories',
    'coding prompts',
    'marketing prompts',
    'writing prompts',
    'AI templates by category',
  ],
  openGraph: {
    title: 'AI Prompt Categories - Browse by Use Case',
    description:
      'Explore AI prompts organized by category. Find templates for coding, marketing, writing, and more.',
    url: '/categories',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'AI Prompt Categories',
      },
    ],
  },
  alternates: {
    canonical: '/categories',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const categories = [
  {
    slug: 'coding',
    name: 'Coding & Development',
    description: 'Code generation, debugging, refactoring, and technical documentation prompts',
    icon: Code,
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    keywords: ['code', 'programming', 'developer', 'debug', 'function', 'api', 'software'],
  },
  {
    slug: 'marketing',
    name: 'Marketing & Advertising',
    description: 'SEO content, ad copy, social media, email campaigns, and growth strategies',
    icon: TrendingUp,
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    keywords: ['marketing', 'seo', 'advertising', 'campaign', 'social media', 'growth', 'email'],
  },
  {
    slug: 'writing',
    name: 'Content Writing',
    description: 'Blog posts, articles, copywriting, storytelling, and creative writing',
    icon: FileText,
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    keywords: ['writing', 'content', 'blog', 'article', 'copy', 'story', 'creative'],
  },
  {
    slug: 'design',
    name: 'Design & Creative',
    description: 'UI/UX design, branding, image generation prompts, and creative direction',
    icon: Palette,
    color: 'bg-pink-100 dark:bg-pink-900',
    textColor: 'text-pink-600 dark:text-pink-400',
    keywords: ['design', 'ui', 'ux', 'branding', 'creative', 'image', 'visual'],
  },
  {
    slug: 'business',
    name: 'Business & Strategy',
    description: 'Business planning, strategy, analysis, presentations, and decision-making',
    icon: Briefcase,
    color: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400',
    keywords: [
      'business',
      'strategy',
      'plan',
      'analysis',
      'presentation',
      'decision',
      'consulting',
    ],
  },
  {
    slug: 'customer-support',
    name: 'Customer Support',
    description: 'Customer service responses, FAQ generation, and support workflows',
    icon: MessageSquare,
    color: 'bg-cyan-100 dark:bg-cyan-900',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    keywords: ['customer', 'support', 'service', 'help', 'faq', 'response', 'chat'],
  },
  {
    slug: 'education',
    name: 'Education & Learning',
    description: 'Teaching materials, lesson plans, explanations, and educational content',
    icon: GraduationCap,
    color: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    keywords: ['education', 'teaching', 'learning', 'lesson', 'tutorial', 'explain', 'course'],
  },
  {
    slug: 'productivity',
    name: 'Productivity & Automation',
    description: 'Task automation, workflow optimization, time management, and efficiency',
    icon: Zap,
    color: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    keywords: ['productivity', 'automation', 'workflow', 'efficiency', 'task', 'organize', 'time'],
  },
  {
    slug: 'data-analysis',
    name: 'Data & Analytics',
    description: 'Data analysis, visualization, statistical insights, and reporting',
    icon: BarChart,
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    keywords: ['data', 'analytics', 'analysis', 'statistics', 'report', 'insight', 'visualization'],
  },
  {
    slug: 'research',
    name: 'Research & Analysis',
    description: 'Research assistance, summarization, literature review, and fact-finding',
    icon: Lightbulb,
    color: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-600 dark:text-red-400',
    keywords: ['research', 'summary', 'analysis', 'literature', 'study', 'fact', 'investigation'],
  },
  {
    slug: 'hr',
    name: 'HR & Recruiting',
    description: 'Job descriptions, interview questions, candidate screening, and HR workflows',
    icon: Users,
    color: 'bg-violet-100 dark:bg-violet-900',
    textColor: 'text-violet-600 dark:text-violet-400',
    keywords: ['hr', 'hiring', 'recruiting', 'interview', 'job', 'candidate', 'employee'],
  },
  {
    slug: 'sales',
    name: 'Sales & Lead Generation',
    description: 'Sales scripts, pitch decks, lead qualification, and outreach templates',
    icon: Target,
    color: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    keywords: ['sales', 'lead', 'pitch', 'outreach', 'prospecting', 'closing', 'revenue'],
  },
]

export default async function CategoriesPage() {
  const supabase = createServerSideClient()

  // Get all public prompts to count by category
  const { data: allPrompts } = await supabase
    .from('prompts')
    .select('name, description, prompt_text, tags')
    .eq('is_public', true)

  // Count prompts per category based on keyword matching
  const categoryCounts = new Map<string, number>()

  categories.forEach((category) => {
    const count =
      allPrompts?.filter((prompt) => {
        const searchText =
          `${prompt.name} ${prompt.description || ''} ${prompt.prompt_text} ${prompt.tags?.join(' ') || ''}`.toLowerCase()
        return category.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()))
      }).length || 0

    categoryCounts.set(category.slug, count)
  })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://promptmanage.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: '/categories',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Prompt Categories',
    description: 'Browse AI prompts organized by category and use case',
    url: '/categories',
    numberOfItems: categories.length,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Categories</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Browse Prompts by Category
            </h1>
            <p className="text-muted-foreground">
              Find AI prompts organized by use case and industry. From coding to marketing, we've
              got you covered.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground">
              {categories.length} categories • {allPrompts?.length || 0} total prompts
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              const count = categoryCounts.get(category.slug) || 0

              return (
                <Link key={category.slug} href={`/categories/${category.slug}`}>
                  <Card className="group cursor-pointer p-6 transition-all hover:border-primary hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`${category.color} rounded-lg p-3`}>
                        <Icon className={`h-6 w-6 ${category.textColor}`} />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {count} prompts
                      </Badge>
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {category.keywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {category.keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* SEO Footer Content */}
          <div className="mx-auto mt-16 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Find AI Prompts for Every Use Case
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Our <strong className="text-foreground">AI prompt category directory</strong>{' '}
                  helps you discover prompts tailored to your specific industry and use case.
                  Whether you're a developer looking for <strong>coding prompts</strong>, a marketer
                  seeking <strong>SEO and advertising templates</strong>, or a business owner
                  needing <strong>strategy and analysis tools</strong>, our organized categories
                  make it easy to find exactly what you need.
                </p>
                <p>
                  Each category contains curated prompts that work across multiple AI models
                  including ChatGPT, Claude, Gemini, and more. Browse by category to see prompts
                  ranked by popularity, or search within a specific category to narrow down your
                  results.
                </p>
                <p>
                  All prompts are free to use and copy. Want to organize your own prompts by
                  category?{' '}
                  <Link
                    href="/dashboard"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign up for free
                  </Link>{' '}
                  and start building your personal prompt library with custom tags and
                  categorization.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Link
                    href="/p"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse All Prompts →
                  </Link>
                  <Link
                    href="/p/tags"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse by Tag →
                  </Link>
                  <Link
                    href="/models"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse by Model →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
