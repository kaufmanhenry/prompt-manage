'use client'

import Link from 'next/link'
import { useEffect,useState } from 'react'


interface BlogSidebarProps {
  currentPost?: {
    slug: string
    category: string
    tags: string[]
  }
}

interface BlogPost {
  slug: string
  title: string
  category: string
  date: string
  tags: string[]
}

export function BlogSidebar({ currentPost }: BlogSidebarProps) {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchBlogData() {
      try {
        // For now, we'll use static data since we don't have a blog posts table
        // In a real implementation, you'd fetch from your database
        const staticPosts: BlogPost[] = [
          {
            slug: 'getting-started-guide',
            title: 'Getting Started with Prompt Manage',
            category: 'Getting Started',
            date: '2025-01-15',
            tags: ['getting started', 'tutorial', 'prompt management']
          },
          {
            slug: 'top-gpt5-prompts-for-marketers',
            title: 'Top 10 GPT-5 Prompts for Marketers',
            category: 'Marketing',
            date: '2025-08-07',
            tags: ['GPT-5', 'Marketing', 'Prompts']
          },
          {
            slug: 'gpt-5-for-marketers',
            title: 'GPT-5 Is Here — How Marketers Can Use It',
            category: 'AI Best Practices',
            date: '2025-08-07',
            tags: ['GPT-5', 'Marketing', 'AI']
          },
          {
            slug: 'prompt-chaos-is-real',
            title: "Prompt Chaos Is Real — Here's How Teams Are Fixing It",
            category: 'AI Best Practices',
            date: '2025-01-15',
            tags: ['prompt management', 'team collaboration']
          },
          {
            slug: 'understanding-context-engineering',
            title: 'Understanding Context Engineering',
            category: 'AI Best Practices',
            date: '2025-06-24',
            tags: ['context engineering', 'prompt engineering']
          }
        ]

        setRecentPosts(staticPosts.slice(0, 5))
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(staticPosts.map(post => post.category)))
        setCategories(uniqueCategories)
        
        // Extract and count tags
        const allTags = staticPosts.flatMap(post => post.tags)
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        const sortedTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([tag]) => tag)
        
        setPopularTags(sortedTags)
      } catch (error) {
        console.error('Error fetching blog data:', error)
      }
    }

    void fetchBlogData()
  }, [])

  return (
    <aside className="w-full space-y-8 lg:w-80">
      {/* Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Search Blog
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/blog?category=${encodeURIComponent(category)}`}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPost?.category === category
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Recent Posts
        </h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`group block ${
                  currentPost?.slug === post.slug ? 'cursor-default opacity-50' : ''
                }`}
              >
                <h4 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                currentPost?.tags.includes(tag)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Stay Updated
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Get the latest AI and prompt engineering insights delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Subscribe
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Quick Links
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Create Prompts
            </Link>
          </li>
          <li>
            <Link
              href="/p"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Public Directory
            </Link>
          </li>
          <li>
            <Link
              href="/docs"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentation
            </Link>
          </li>
          <li>
            <Link
              href="/support"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Support
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
