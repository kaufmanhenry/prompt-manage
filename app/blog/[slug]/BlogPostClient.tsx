'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { PromptCard } from '@/components/PromptCard'
import { createClient } from '@/utils/supabase/client'

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
  const [latestPrompts, setLatestPrompts] = useState<{ name: string; slug: string }[]>([])
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

  useEffect(() => {
    async function fetchLatestPrompts() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('prompts')
          .select('name, slug')
          .eq('is_public', true)
          .order('inserted_at', { ascending: false })
          .limit(10)
        setLatestPrompts((data || []).filter((p) => p.slug))
      } catch (e) {
        console.error(e)
      }
    }
    if (post.slug === 'top-gpt5-prompts-for-marketers') {
      void fetchLatestPrompts()
    }
  }, [post.slug])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back to blog link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Blog
          </Link>
        </div>
        {/* Post metadata */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString()}
          </span>
        </div>
        {/* Title */}
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {/* Author */}
        <div className="mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          By {post.author}
        </div>
        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Blog content rendered as HTML */}
        <article
          className="prose prose-lg prose-gray dark:prose-invert prose-headings:font-bold
            prose-headings:text-gray-900 dark:prose-headings:text-white prose-h2:text-2xl
            prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2 prose-h3:text-xl
            prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800 dark:prose-h3:text-gray-200 prose-h4:text-lg
            prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-gray-700 dark:prose-h4:text-gray-300 prose-p:text-gray-700
            dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-ul:my-6
            prose-ol:my-6 prose-li:text-gray-700
            dark:prose-li:text-gray-300 prose-li:mb-2 prose-strong:text-gray-900
            dark:prose-strong:text-white prose-strong:font-semibold prose-a:text-blue-600
            dark:prose-a:text-blue-400 prose-a:font-medium prose-a:underline prose-a:underline-offset-2 prose-a:decoration-2 focus:prose-a:outline-none focus:prose-a:ring-2 focus:prose-a:ring-blue-500 prose-blockquote:border-l-4
            prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 max-w-none
            [&_.twitter-tweet]:mx-auto [&_.twitter-tweet]:my-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.slug === 'top-gpt5-prompts-for-marketers' && (
          <div className="mt-8">
            {latestPrompts.map((p) => (
              <div key={p.slug} className="mb-10">
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{p.name}</h3>
                <div className="not-prose mb-3">
                  <PromptCard slug={p.slug} />
                </div>
                <Link
                  href={`/p/${p.slug}`}
                  className="rounded-sm text-blue-600 underline decoration-2 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                >
                  View full prompt →
                </Link>
              </div>
            ))}

            <hr className="my-10 border-gray-200 dark:border-gray-700" />
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Looking to create and manage your own GPT-5 prompts?
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Try{' '}
                <Link
                  href="/"
                  className="rounded-sm text-blue-600 underline decoration-2 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                >
                  Prompt Manage
                </Link>{' '}
                — the easiest way to organize, run, and share prompts with your team. No more messy
                docs or copy-paste chaos.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Explore all public prompts →{' '}
                <Link
                  href="/p"
                  className="rounded-sm text-blue-600 underline decoration-2 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                >
                  Prompt Directory
                </Link>
                <br />
                Build your first custom workflow →{' '}
                <Link
                  href="/dashboard"
                  className="rounded-sm text-blue-600 underline decoration-2 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                >
                  Create a Prompt
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
