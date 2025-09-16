import type { Metadata } from 'next'
import Link from 'next/link'

import { blogPosts } from './posts'

export const metadata: Metadata = {
  title: 'Blog - Prompt Manage',
  description:
    'Read the latest articles, best practices, and insights from the Prompt Manage team on AI, prompt engineering, and more.',
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Blog Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Prompt Manage Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Insights, best practices, and the latest in AI and prompt
            engineering.
          </p>
        </div>
        {/* Blog Post List */}
        <div className="space-y-10">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col gap-2 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                {post.summary}
              </p>
              <div className="mb-2 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                By {post.author}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 w-fit font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
