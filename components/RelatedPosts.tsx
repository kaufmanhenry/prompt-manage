'use client'

import { Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

interface RelatedPost {
  slug: string
  title: string
  summary: string
  date: string
  category: string
  tags: string[]
  author: string
}

interface RelatedPostsProps {
  currentPostSlug: string
  currentPostCategory: string
  currentPostTags: string[]
}

export function RelatedPosts({ currentPostSlug, currentPostCategory, currentPostTags }: RelatedPostsProps) {
  // Static data - in a real app, this would come from your database
  const allPosts: RelatedPost[] = [
    {
      slug: 'getting-started-guide',
      title: 'Getting Started with Prompt Manage: Your Complete Guide to AI Prompt Management',
      summary: 'Learn how to sign up, organize your prompts, and master the Prompt Lab to maximize your AI productivity.',
      date: '2025-01-15',
      category: 'Getting Started',
      tags: ['getting started', 'tutorial', 'prompt management', 'AI productivity', 'guide'],
      author: 'Prompt Manage Team'
    },
    {
      slug: 'top-gpt5-prompts-for-marketers',
      title: 'Top 10 GPT-5 Prompts for Marketers (2025 Edition)',
      summary: 'Discover 10 high-performing GPT-5 prompts for marketing use cases like SEO, email, social, and video.',
      date: '2025-08-07',
      category: 'Marketing',
      tags: ['GPT-5', 'Marketing', 'Prompts', 'AI', 'Prompt Manage'],
      author: 'Prompt Manage Team'
    },
    {
      slug: 'gpt-5-for-marketers',
      title: 'GPT-5 Is Here — How Marketers Can Use It to Gain a Competitive Edge',
      summary: 'Explore how GPT-5 unlocks new potential for marketers, including use cases, strategies, and examples.',
      date: '2025-08-07',
      category: 'AI Best Practices',
      tags: ['GPT-5', 'Marketing', 'AI', 'Prompts', 'Prompt Manage'],
      author: 'Prompt Manage Team'
    },
    {
      slug: 'prompt-chaos-is-real',
      title: "Prompt Chaos Is Real — Here's How Teams Are Fixing It",
      summary: 'Discover why managing AI prompts across multiple tools leads to lost time and how teams are solving this.',
      date: '2025-01-15',
      category: 'AI Best Practices',
      tags: ['prompt management', 'team collaboration', 'AI workflows', 'productivity', 'best practices'],
      author: 'Prompt Manage Team'
    },
    {
      slug: 'understanding-context-engineering',
      title: 'Understanding Context Engineering: The Next Evolution of Prompt Engineering',
      summary: 'Discover why context engineering is the next big leap in prompt engineering, and how it can unlock AI power.',
      date: '2025-06-24',
      category: 'AI Best Practices',
      tags: ['context engineering', 'prompt engineering', 'AI', 'best practices'],
      author: 'Prompt Manage Team'
    }
  ]

  // Filter out current post and find related posts
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPostSlug)
    .filter(post => 
      post.category === currentPostCategory || 
      post.tags.some(tag => currentPostTags.includes(tag))
    )
    .slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Related Articles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Continue exploring our latest insights and best practices
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <article
            key={post.slug}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="p-6">
              <div className="mb-3 flex items-center space-x-2">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {post.category}
                </span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>

              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                {post.summary}
              </p>

              <div className="mb-4 flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  By {post.author}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          View All Articles
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
