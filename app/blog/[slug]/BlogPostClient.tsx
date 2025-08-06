"use client"
import Link from 'next/link'
import { useEffect } from 'react'

interface BlogPost {
  title: string
  html: string
  slug: string
  date: string
  category: string
  tags: string[]
  excerpt?: string
  author?: string
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void
      }
    }
  }
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  useEffect(() => {
    // Load Twitter widgets script
    if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      document.head.appendChild(script)
    } else if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">← Back to Blog</Link>
        </div>
        {/* Post metadata */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{post.category}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
        </div>
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{post.title}</h1>
        {/* Author */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">By {post.author}</div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
          ))}
        </div>
        {/* Blog content rendered as HTML */}
        <article
          className="prose prose-lg prose-gray dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
            prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-gray-700 dark:prose-h4:text-gray-300
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:my-6 prose-ol:my-6
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:underline hover:prose-a:no-underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
            [&_.twitter-tweet]:mx-auto [&_.twitter-tweet]:my-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  )
} 