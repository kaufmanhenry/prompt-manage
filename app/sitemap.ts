import fs from 'fs'
import type { MetadataRoute } from 'next'
import path from 'path'

import { supportedModels } from '@/lib/models'
import { createServerSideClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://promptmanage.com'

  // Static pages - High priority pages for indexing
  const staticPages = [
    // Core pages - highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/p`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95, // Public directory is key content hub
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9, // Trending content
    },
    {
      url: `${baseUrl}/p/tags`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9, // Tag directory
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Categories directory
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Important content page
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8, // Helpful content
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // Specific documentation pages
    {
      url: `${baseUrl}/docs/best-practices`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75, // High-value SEO content
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Tools and utilities
    {
      url: `${baseUrl}/generator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Legal pages - lower priority
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
  ]

  // Generate legal pages from markdown files
  const legalDir = path.join(process.cwd(), 'legal')
  let legalPages: MetadataRoute.Sitemap = []

  if (fs.existsSync(legalDir)) {
    const legalFiles = fs.readdirSync(legalDir).filter((f) => f.endsWith('.md'))
    legalPages = legalFiles.map((file) => {
      const slug = file.replace(/\.md$/, '')
      return {
        url: `${baseUrl}/legal/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.2,
      }
    })
  }

  // Model-specific landing pages
  const modelPages = supportedModels.map((model) => ({
    url: `${baseUrl}/prompts/${model.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Category pages
  const categories = [
    'coding',
    'marketing',
    'writing',
    'design',
    'business',
    'customer-support',
    'education',
    'productivity',
    'data-analysis',
    'research',
    'hr',
    'sales',
  ]

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  try {
    // Get public prompts using server-side client
    const supabase = createServerSideClient()
    const { data: publicPrompts } = await supabase
      .from('prompts')
      .select('id, slug, updated_at, tags')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(1000) // Limit to prevent sitemap from getting too large

    // Individual prompts - core content, higher priority
    const promptPages = (publicPrompts || []).map((prompt) => ({
      url: `${baseUrl}/p/${prompt.slug}`,
      lastModified: new Date(prompt.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7, // Increased priority for valuable content
    }))

    // Extract unique tags from prompts
    const uniqueTags = new Set<string>()
    publicPrompts?.forEach((prompt) => {
      prompt.tags?.forEach((tag: string) => uniqueTags.add(tag))
    })

    // Tag pages (limit to top 100 most common tags)
    const tagPages = Array.from(uniqueTags)
      .slice(0, 100)
      .map((tag) => ({
        url: `${baseUrl}/p/tags/${encodeURIComponent(tag)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    // Get public user profiles
    const { data: publicProfiles } = await supabase
      .from('user_profiles')
      .select('id, updated_at')
      .limit(1000)

    const profilePages = (publicProfiles || []).map((profile) => ({
      url: `${baseUrl}/u/${profile.id}`,
      lastModified: new Date(profile.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

    return [
      ...staticPages,
      ...legalPages,
      ...modelPages,
      ...categoryPages,
      ...tagPages,
      ...promptPages,
      ...profilePages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages, legal pages, model pages, and category pages if there's an error
    return [...staticPages, ...legalPages, ...modelPages, ...categoryPages]
  }
}
