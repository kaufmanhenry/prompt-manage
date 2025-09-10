import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { blogPosts } from '../posts';
import BlogPostClient from './BlogPostClient';

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Blog Post Not Found - Prompt Manage' };
  return {
    title: `${post.title} - Prompt Manage Blog`,
    description: post.summary,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();
  return <BlogPostClient post={post} />;
}
