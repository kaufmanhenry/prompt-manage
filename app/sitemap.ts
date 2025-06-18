import { createClient } from '@/utils/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://promptmanage.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
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
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/public`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  try {
    // Get public prompts
    const supabase = await createClient()
    const { data: publicPrompts } = await supabase
      .from('prompts')
      .select('id, slug, updated_at')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(1000) // Limit to prevent sitemap from getting too large

    const promptPages = (publicPrompts || []).map((prompt) => ({
      url: `${baseUrl}/p/${prompt.id}/${prompt.slug}`,
      lastModified: new Date(prompt.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Get public user profiles
    const { data: publicProfiles } = await supabase
      .from('user_profiles')
      .select('id, updated_at')
      .limit(1000)

    const profilePages = (publicProfiles || []).map((profile) => ({
      url: `${baseUrl}/profile/${profile.id}`,
      lastModified: new Date(profile.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }))

    return [...staticPages, ...promptPages, ...profilePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if there's an error
    return staticPages
  }
} 