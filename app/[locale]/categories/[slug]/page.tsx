import { TrendingUp } from 'lucide-react'
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
  Users,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = categories.find((c) => c.slug === resolvedParams.slug)

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    }
  }

  const title = `${category.name} Prompts - AI Templates | Prompt Manage`
  const description = `Discover AI prompts for ${category.name.toLowerCase()}. ${category.description} Browse free templates for ChatGPT, Claude, Gemini, and more.`

  return {
    title,
    description,
    keywords: [
      category.name,
      ...category.keywords.map((k) => `${k} prompts`),
      'AI prompts',
      'prompt templates',
    ],
    openGraph: {
      title,
      description,
      url: `/categories/${category.slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: `${category.name} Prompts`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: `/categories/${category.slug}`,
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
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = categories.find((c) => c.slug === resolvedParams.slug)

  if (!category) {
    notFound()
  }

  const supabase = createServerSideClient()

  // Get all public prompts
  const { data: allPrompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .order('view_count', { ascending: false })

  // Filter prompts that match category keywords
  const categoryPrompts =
    allPrompts?.filter((prompt) => {
      const searchText =
        `${prompt.name} ${prompt.description || ''} ${prompt.prompt_text} ${prompt.tags?.join(' ') || ''}`.toLowerCase()
      return category.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()))
    }) || []

  // Get popular tags in this category
  const tagCounts = new Map<string, number>()
  categoryPrompts.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const Icon = category.icon

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
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `/categories/${category.slug}`,
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} AI Prompts`,
    description: category.description,
    url: `/categories/${category.slug}`,
    numberOfItems: categoryPrompts.length,
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
            <Link href="/categories" className="hover:text-foreground">
              Categories
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-start gap-4">
              <div className={`${category.color} rounded-lg p-4`}>
                <Icon className={`h-8 w-8 ${category.textColor}`} />
              </div>
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                  {category.name} Prompts
                </h1>
                <p className="mb-2 text-lg text-muted-foreground">{category.description}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{categoryPrompts.length}</span>{' '}
                  prompts available
                </p>
              </div>
            </div>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="mt-4">
                <h2 className="mb-2 text-sm font-medium text-foreground">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(([tag, count]) => (
                    <Link key={tag} href={`/p/tags/${encodeURIComponent(tag)}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        {tag} ({count})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prompts Grid */}
          {categoryPrompts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryPrompts.slice(0, 50).map((prompt) => (
                <Link key={prompt.id} href={`/p/${prompt.slug}`}>
                  <Card className="group flex h-full cursor-pointer flex-col p-4 transition-all hover:border-primary hover:shadow-md">
                    <div className="flex-grow">
                      <div className="mb-4">
                        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary">
                          {prompt.name}
                        </h3>
                        {prompt.description && (
                          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                            {prompt.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{prompt.model}</Badge>
                          {prompt.tags?.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags && prompt.tags.length > 2 && (
                            <Badge variant="outline">+{prompt.tags.length - 2}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <pre className="line-clamp-3 text-wrap rounded-lg bg-accent p-2 text-xs font-medium text-muted-foreground">
                          {prompt.prompt_text}
                        </pre>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{prompt.view_count} views</span>
                        </div>
                        <CopyButton text={prompt.prompt_text} />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Icon className={`mx-auto mb-4 h-12 w-12 ${category.textColor}`} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No {category.name} Prompts Yet
              </h3>
              <p className="mb-4 text-muted-foreground">
                Be the first to create a prompt in this category!
              </p>
              <Link
                href="/dashboard"
                className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Create Prompt
              </Link>
            </div>
          )}

          {/* SEO Footer Content */}
          <div className="mx-auto mt-16 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                About {category.name} Prompts
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Our <strong className="text-foreground">{category.name}</strong> category features{' '}
                  {categoryPrompts.length} AI prompts specifically designed for{' '}
                  {category.description.toLowerCase()}. All prompts work across multiple AI models
                  including ChatGPT, Claude, Gemini, and more.
                </p>
                <p>
                  Whether you're looking for ready-to-use templates or inspiration for your own
                  prompts, our {category.name.toLowerCase()} collection has you covered. All prompts
                  are community-curated and ranked by popularity to help you find the best
                  templates.
                </p>
                <p>
                  Want to create and organize your own {category.name.toLowerCase()} prompts?{' '}
                  <Link
                    href="/dashboard"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign up for free
                  </Link>{' '}
                  and start building your personal prompt library with custom tags and
                  categorization.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/categories"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    ← Browse All Categories
                  </Link>
                  <Link
                    href="/p"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View All Prompts →
                  </Link>
                  <Link
                    href="/p/tags"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Browse by Tag →
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
