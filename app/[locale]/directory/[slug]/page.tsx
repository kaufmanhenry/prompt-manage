import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { AITool } from '@/components/directory/ToolDetail'
import ToolDetail from '@/components/directory/ToolDetail'
import { isAdmin } from '@/utils/admin'
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

async function getFavoriteStatus(toolId: string) {
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
  const isFavorited = await getFavoriteStatus(tool.id)
  const userIsAdmin = isAdmin(session?.user?.email)

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
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolDetail tool={tool} initialIsFavorited={isFavorited} isAdmin={userIsAdmin} />
    </>
  )
}
