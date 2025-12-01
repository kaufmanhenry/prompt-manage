import type { Metadata } from 'next'

import { createClient } from '@/utils/supabase/server'

import { PublicPromptPageClient } from './PublicPromptPageClient'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('is_public', true)
    .single()

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
      description: 'The requested prompt could not be found.',
    }
  }

  const description =
    prompt.description ||
    `${prompt.name} - AI prompt for ${prompt.model}. ${prompt.prompt_text.substring(0, 120)}...`

  const title = `${prompt.name} - ${prompt.model} Prompt | Prompt Manage`

  return {
    title,
    description,
    keywords: [
      prompt.name,
      prompt.model,
      'AI prompt',
      'prompt template',
      ...(prompt.tags || []),
      'ChatGPT',
      'Claude',
      'Gemini',
      'prompt engineering',
    ],
    openGraph: {
      title,
      description,
      url: `/p/${prompt.slug}`,
      type: 'article',
      publishedTime: prompt.inserted_at,
      modifiedTime: prompt.updated_at,
      tags: prompt.tags || [],
      siteName: 'Prompt Manage',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: prompt.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: `/p/${prompt.slug}`,
    },
  }
}

export default async function PublicPromptPage({ params }: PageProps) {
  const resolvedParams = await params
  return <PublicPromptPageClient params={resolvedParams} />
}
