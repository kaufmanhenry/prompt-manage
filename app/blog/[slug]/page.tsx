import { blogPosts } from '../posts'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { Metadata } from 'next'

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) return { title: 'Blog Post Not Found - Prompt Manage' }
  return {
    title: `${post.title} - Prompt Manage Blog`,
    description: post.summary,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) return notFound()
  return <BlogPostClient post={post} />
} 