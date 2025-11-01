import type { Metadata } from 'next'

import { createServerSideClient } from '@/utils/supabase/server'

import { CollectionPageClient } from './CollectionPageClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = createServerSideClient()
  const { data: c } = await supabase
    .from('prompt_collections')
    .select('title, description, cover_image_url, creator_id')
    .eq('slug', resolvedParams.slug)
    .eq('visibility', 'public')
    .single()

  if (!c) {
    return {
      title: 'Collection Not Found – Prompt Manage',
      description: 'This collection may have been deleted or is not publicly available.',
    }
  }

  // Fetch creator info for better SEO
  let creatorName = 'Prompt Manage'
  if (c.creator_id) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name, full_name, username')
      .eq('id', c.creator_id)
      .single()
    if (profile) {
      creatorName = profile.display_name || profile.full_name || creatorName
    }
  }

  const title = `${c.title} – Prompt Collection | Prompt Manage`
  const description =
    c.description ||
    `Explore "${c.title}" - a curated collection of AI prompts by ${creatorName}. Discover high-quality prompts for ChatGPT, Claude, Gemini, Suno, Runway, and more. Organize, manage, and share your AI prompts with the best CMS for prompt management.`
  const url = `https://promptmanage.com/collections/${resolvedParams.slug}`
  const keywords = `AI prompts, prompt collection, ${c.title}, ChatGPT prompts, Claude prompts, Gemini prompts, Suno prompts, Runway prompts, AI tools, prompt engineering, prompt management, ${c.title} collection`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Prompt Manage',
      images: c.cover_image_url
        ? [{ url: c.cover_image_url, alt: c.title }]
        : [
            {
              url: `https://promptmanage.com/og-image.svg`,
              alt: 'Prompt Manage',
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: c.cover_image_url ? [c.cover_image_url] : undefined,
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const resolvedParams = await params
  return <CollectionPageClient slug={resolvedParams.slug} />
}
