import type { Metadata } from 'next';
import Link from 'next/link';

import { blogPosts } from './posts';

export const metadata: Metadata = {
  title: 'Blog - Prompt Manage',
  description:
    'Read the latest articles, best practices, and insights from the Prompt Manage team on AI, prompt engineering, and more.',
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Blog Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt Manage Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Insights, best practices, and the latest in AI and prompt engineering.
          </p>
        </div>
        {/* Blog Post List */}
        <div className="space-y-10">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col gap-2"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{post.summary}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">By {post.author}</div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 text-blue-600 dark:text-blue-400 font-medium hover:underline w-fit"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
