import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

// Midjourney specific data
const midjourneyData = {
  name: 'Midjourney',
  company: 'Midjourney',
  description:
    'AI image generation platform with stunning artistic quality and creative control over style and composition.',
  icon: '🎨',
  color: 'bg-purple-100 dark:bg-purple-900',
  textColor: 'text-purple-600 dark:text-purple-400',
  capabilities: ['Image Generation', 'Art Creation', 'Style Control', 'High Quality Output'],
  features: [
    'Generate artistic images from text',
    'Fine-tune style and composition',
    'Multiple aspect ratios and quality settings',
    'V5 and V6 model support',
  ],
  useCases: [
    'Concept art and illustrations',
    'Book cover design',
    'Marketing visuals',
    'Social media content',
    'Product mockups',
    'Artistic exploration',
  ],
  companyUrl: 'https://midjourney.com',
  tag: 'midjourney',
  pricing: {
    basic: '$10/month - 3.3 hours/month',
    standard: '$30/month - 15 hours/month',
    pro: '$60/month - 30 hours/month',
  },
  competitors: ['DALL-E 3', 'Stable Diffusion', 'Leonardo AI'],
  tutorials: [
    {
      title: 'Midjourney Prompting Guide',
      url: 'https://docs.midjourney.com/docs/quick-start',
      description: 'Master the art of Midjourney prompts',
    },
    {
      title: 'Parameter Reference',
      url: 'https://docs.midjourney.com/docs/parameter-list',
      description: 'Complete guide to Midjourney parameters',
    },
    {
      title: 'Stylization Techniques',
      url: 'https://docs.midjourney.com/docs/stylize',
      description: 'Advanced styling and composition tips',
    },
  ],
  community: {
    discord: 'https://discord.gg/midjourney',
    twitter: 'https://twitter.com/midjourney',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .or(`tags.cs.{${midjourneyData.tag}},model_id.eq.midjourney`)

  const count = prompts?.length || 0

  const title = `Best Midjourney Prompts for AI Art Generation | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use Midjourney prompts for AI image generation. Create stunning art, illustrations, and visual content with our curated collection of Midjourney prompt templates.`

  return {
    title,
    description,
    keywords: [
      'Midjourney',
      'Midjourney prompts',
      'AI art generation',
      'AI image generation',
      'digital art',
      'prompt engineering',
      'concept art',
      'artificial intelligence',
      'creative AI',
      'visual generation',
    ],
    openGraph: {
      title,
      description,
      url: '/tools/midjourney',
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Midjourney Prompts',
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
      canonical: '/tools/midjourney',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function MidjourneyPromptsPage() {
  const supabase = createServerSideClient()

  // Get prompts for Midjourney
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .or(`tags.cs.{${midjourneyData.tag}},model_id.eq.midjourney`)
    .order('view_count', { ascending: false })
    .limit(50)

  // Get popular tags
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      if (tag !== midjourneyData.tag) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      }
    })
  })

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag)

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:p-6">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-foreground">
            AI Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">{midjourneyData.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-4">
              <div className={`${midjourneyData.color} rounded-lg p-4`}>
                <span className="text-5xl">{midjourneyData.icon}</span>
              </div>
              <div>
                <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
                  {midjourneyData.name} Prompts
                </h1>
                <p className="text-lg text-muted-foreground">{midjourneyData.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium text-foreground">{prompts?.length || 0} prompts</span>
                <span>available</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Community curated</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Always updated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {prompts && prompts.length > 0 ? (
          <div className="mb-12">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-semibold text-foreground">{prompt.name}</h3>
                    <CopyButton text={prompt.prompt_text} />
                  </div>
                  {prompt.description && (
                    <p className="mb-4 text-sm text-muted-foreground">{prompt.description}</p>
                  )}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {prompt.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/p/${prompt.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Prompt <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-12 text-center">
            <p className="text-muted-foreground">
              No prompts available yet. Be the first to share!
            </p>
          </div>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link key={tag} href={`/p/tags/${tag}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 text-center">
          <div className="mb-4">
            <span className="text-4xl">{midjourneyData.icon}</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Share Your Best Midjourney Prompts
          </h2>
          <p className="mb-6 text-muted-foreground">
            Help fellow creators achieve amazing results with Midjourney. Share your prompt
            expertise and build your reputation in the AI art community.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Share Your Prompts</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
