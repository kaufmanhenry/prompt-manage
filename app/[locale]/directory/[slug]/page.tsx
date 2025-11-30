import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RelatedTools } from '@/components/directory/RelatedTools'
import { ToolContext } from '@/components/directory/ToolContext'
import type { AITool } from '@/components/directory/ToolDetail'
import ToolDetail from '@/components/directory/ToolDetail'
import { CommentSection } from '@/components/social/CommentSection'
import { createClient } from '@/utils/supabase/server'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getTool(slug: string) {
  const supabase = await createClient()

  // Fetch tool
  const { data: tool, error } = await supabase
    .from('ai_tools')
    .select(
      `
      *,
      category:primary_category_id(name)
    `,
    )
    .eq('slug', slug)
    .single()

  if (error || !tool) {
    return null
  }

  // Transform to match AITool interface
  // Note: Supabase returns category as an object, we map it to category_name
  const transformedTool: AITool = {
    ...tool,
    category_name: tool.category?.name || 'Uncategorized',
  }

  return transformedTool
}

async function _getFavoriteStatus(toolId: string) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return false

  const { data: favorite } = await supabase
    .from('tool_favorites')
    .select('id')
    .eq('tool_id', toolId)
    .eq('user_id', session.user.id)
    .single()

  return !!favorite
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  return {
    title: `${tool.name} - AI Tool Review & Features | Prompt Manage`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - AI Tool Review & Features`,
      description: tool.description,
      images: tool.banner_image_url
        ? [tool.banner_image_url]
        : tool.logo_url
          ? [tool.logo_url]
          : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - AI Tool Review & Features`,
      description: tool.description,
      images: tool.banner_image_url
        ? [tool.banner_image_url]
        : tool.logo_url
          ? [tool.logo_url]
          : [],
    },
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: upvoteData } = await supabase
    .from('tool_upvotes')
    .select('tool_id')
    .eq('tool_id', tool.id)
    .eq('user_id', session?.user?.id || '')
    .single()

  const isUpvoted = !!upvoteData

  // Get favorite status
  const { data: favoriteData } = await supabase
    .from('tool_favorites')
    .select('id')
    .eq('tool_id', tool.id)
    .eq('user_id', session?.user?.id || '')
    .single()

  const isFavorited = !!favoriteData

  // Check if user is admin
  const userIsAdmin = session?.user?.email === 'mikemoloney.business@gmail.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category_name,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: tool.monthly_price || '0',
      priceCurrency: 'USD',
    },
    aggregateRating: tool.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: tool.rating,
          reviewCount: tool.review_count,
        }
      : undefined,
    featureList: tool.key_features,
    applicationSubCategory: tool.category_name,
    screenshot: tool.banner_image_url || tool.logo_url,
    author: {
      '@type': 'Organization',
      name: tool.company_name,
      url: tool.company_website,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolDetail
        tool={tool}
        initialIsFavorited={isFavorited}
        isAdmin={userIsAdmin}
        initialIsUpvoted={isUpvoted}
      />

      <div className="mx-auto max-w-4xl space-y-12 px-4 pb-12 sm:px-6 lg:px-8">
        <ToolContext
          toolName={tool.name}
          description={tool.description}
          keyFeatures={tool.key_features}
        />

        <div className="border-t pt-12">
          <CommentSection toolId={tool.id} />
        </div>

        <RelatedTools categoryId={tool.primary_category_id} currentToolId={tool.id} />
      </div>
    </>
  )
}
