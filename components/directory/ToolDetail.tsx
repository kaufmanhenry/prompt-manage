'use client'

import { ExternalLink, Heart, Share2, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

export interface AITool {
  id: string
  name: string
  slug: string
  website_url: string
  description: string
  full_description: string
  logo_url: string | null
  banner_image_url: string | null
  video_url: string | null
  company_name: string
  company_website: string | null
  contact_email: string
  primary_category_id: string
  category_name: string
  pricing_model: string
  monthly_price: number | null
  annual_price: number | null
  pricing_details_url: string | null
  has_free_trial: boolean
  trial_duration_days: number | null
  key_features: string[]
  use_cases: string[]
  integrations: string[]
  platforms: string[]
  ai_models_used: string[]
  api_available: boolean
  rating: number | null
  review_count: number
  favorite_count: number
  view_count: number
  upvote_count: number
  is_open_source: boolean
  github_url: string | null
  founded_year: number | null
  created_at: string
  is_verified: boolean
  is_featured: boolean
}

interface RelatedTool {
  id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  rating: number | null
  category_name: string
}

interface ToolDetailProps {
  tool: AITool
  initialIsFavorited: boolean
  isAdmin?: boolean
  relatedTools?: RelatedTool[]
}

export default function ToolDetail({
  tool,
  initialIsFavorited,
  isAdmin,
  relatedTools = [],
}: ToolDetailProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [logoError, setLogoError] = useState(false)
  const [bannerError, setBannerError] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  // Track page view
  useEffect(() => {
    const trackView = async () => {
      try {
        await supabase
          .from('ai_tools')
          .update({ view_count: (tool.view_count || 0) + 1 })
          .eq('id', tool.id)
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }

    void trackView()
  }, [tool.id, tool.view_count, supabase])

  const handleFavorite = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save favorites',
        variant: 'destructive',
      })
      return
    }

    try {
      if (isFavorited) {
        await supabase
          .from('tool_favorites')
          .delete()
          .eq('tool_id', tool.id)
          .eq('user_id', session.user.id)

        // Decrement favorite count
        await supabase
          .from('ai_tools')
          .update({ favorite_count: Math.max(0, (tool.favorite_count || 0) - 1) })
          .eq('id', tool.id)
      } else {
        await supabase.from('tool_favorites').insert({
          tool_id: tool.id,
          user_id: session.user.id,
        })

        // Increment favorite count
        await supabase
          .from('ai_tools')
          .update({ favorite_count: (tool.favorite_count || 0) + 1 })
          .eq('id', tool.id)
      }
      setIsFavorited(!isFavorited)
    } catch (error: unknown) {
      console.error('Failed to toggle favorite:', error)
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      })
    }
  }

  const handleWebsiteClick = async () => {
    try {
      // Track click
      await supabase.from('tool_clicks').insert({
        tool_id: tool.id,
      })

      // Increment click count
      await supabase
        .from('ai_tools')
        .update({ click_count: (tool.view_count || 0) + 1 })
        .eq('id', tool.id)
    } catch (err) {
      console.error('Error tracking click:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link copied',
          description: 'Tool URL copied to clipboard',
        })
      } catch (err) {
        console.error('Error copying to clipboard:', err)
      }
    }
  }

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null

    try {
      // Handle various YouTube URL formats
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?.*?v=([a-zA-Z0-9_-]{11})/,
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match?.[1]) {
          return `https://www.youtube.com/embed/${match[1]}`
        }
      }

      // If already an embed URL, return as is
      if (url.includes('youtube.com/embed/')) {
        return url
      }

      return null
    } catch {
      return null
    }
  }

  const videoEmbedUrl = tool.video_url ? getYouTubeEmbedUrl(tool.video_url) : null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Banner Image */}
      {tool.banner_image_url && !bannerError && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 sm:h-64">
          <Image
            src={tool.banner_image_url}
            alt={`${tool.name} banner`}
            fill
            className="object-cover"
            onError={() => setBannerError(true)}
            unoptimized
          />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-6">
            {/* Logo */}
            {tool.logo_url && !logoError ? (
              <div className="relative h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24">
                <Image
                  src={tool.logo_url}
                  alt={`${tool.name} logo`}
                  fill
                  className="rounded-xl object-cover shadow-md"
                  onError={() => setLogoError(true)}
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-md dark:from-emerald-900 dark:to-teal-900 sm:h-24 sm:w-24">
                <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 sm:text-4xl">
                  {tool.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
                {tool.is_verified && <Badge className="bg-emerald-600">Verified</Badge>}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{tool.company_name}</p>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-500">{tool.category_name}</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link href={tool.website_url} target="_blank" onClick={handleWebsiteClick}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavorite}
                  className={isFavorited ? 'bg-red-50 text-red-600 dark:bg-red-950/30' : ''}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                {isAdmin && (
                  <Link href={`/directory/${tool.slug}/edit`}>
                    <Button variant="outline">Edit Tool</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="space-y-3">
            {tool.rating && (
              <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  {tool.rating.toFixed(1)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Based on {tool.review_count} reviews
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">About</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{tool.description}</p>
              {tool.full_description && (
                <p className="text-gray-600 dark:text-gray-400">{tool.full_description}</p>
              )}
            </div>

            {/* Video Demo/Tutorial */}
            {videoEmbedUrl && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Video Demo
                </h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                  <iframe
                    src={videoEmbedUrl}
                    title={`${tool.name} video demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}

            {/* Key Features */}
            {tool.key_features && tool.key_features.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Key Features
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tool.key_features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                    >
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Use Cases */}
            {tool.use_cases && tool.use_cases.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Use Cases
                </h2>
                <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
                  {tool.use_cases.map((useCase) => (
                    <li key={useCase}>{useCase}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Details */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Technical Details
              </h2>

              <div className="space-y-4">
                {tool.ai_models_used && tool.ai_models_used.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">AI Models</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.ai_models_used.map((model) => (
                        <Badge key={model} variant="secondary">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tool.platforms && tool.platforms.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.platforms.map((platform) => (
                        <Badge key={platform} variant="outline">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tool.integrations && tool.integrations.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Integrations</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.integrations.map((integration) => (
                        <Badge key={integration} variant="outline">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tool.api_available && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/20 dark:text-blue-200">
                    ✅ API available for developers
                  </div>
                )}

                {tool.is_open_source && (
                  <div>
                    {tool.github_url ? (
                      <Link
                        href={tool.github_url}
                        target="_blank"
                        className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                      >
                        View on GitHub
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✅ Open source project
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Pricing</h3>
              <div className="mb-4">
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {tool.pricing_model === 'free'
                    ? 'Free'
                    : tool.pricing_model === 'freemium'
                      ? 'Freemium'
                      : tool.pricing_model === 'free_trial'
                        ? 'Free Trial'
                        : 'Paid'}
                </span>
              </div>

              {tool.monthly_price && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${tool.monthly_price}
                  </p>
                </div>
              )}

              {tool.annual_price && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Annual</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${tool.annual_price}
                  </p>
                </div>
              )}

              {tool.has_free_trial && (
                <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/20 dark:text-blue-200">
                  🎉 Free trial: {tool.trial_duration_days || 'Available'}
                  {tool.trial_duration_days ? ` days` : ''}
                </div>
              )}

              {tool.pricing_details_url && (
                <Link href={tool.pricing_details_url} target="_blank" className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    View Pricing Details
                  </Button>
                </Link>
              )}
            </Card>

            {/* Company Info */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">About Company</h3>
              {tool.company_website && (
                <Link
                  href={tool.company_website}
                  target="_blank"
                  className="mb-3 block text-sm text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  {tool.company_website}
                </Link>
              )}
              {tool.founded_year && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Founded: {tool.founded_year}
                </p>
              )}
            </Card>

            {/* Share */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Share</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Help others discover this tool
              </p>
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Explore More</h3>
              <div className="space-y-2">
                <Link
                  href="/directory"
                  className="block rounded-lg p-2 text-sm text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  Browse All AI Tools →
                </Link>
                <Link
                  href={`/directory?category=${tool.primary_category_id}`}
                  className="block rounded-lg p-2 text-sm text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  View {tool.category_name} Tools →
                </Link>
                <Link
                  href="/tools"
                  className="block rounded-lg p-2 text-sm text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  View Prompt Collections →
                </Link>
                <Link
                  href="/directory/submit"
                  className="block rounded-lg p-2 text-sm text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  Submit Your Tool →
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <div className="mx-auto mt-12 max-w-4xl border-t px-4 pt-12 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Related {tool.category_name} Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore other tools in the {tool.category_name} category
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link key={relatedTool.id} href={`/directory/${relatedTool.slug}`}>
                  <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-900">
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-start gap-4">
                        {relatedTool.logo_url ? (
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <Image
                              src={relatedTool.logo_url}
                              alt={relatedTool.name}
                              fill
                              className="rounded-lg object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900">
                            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                              {relatedTool.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                            {relatedTool.name}
                          </h3>
                          {relatedTool.rating && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {relatedTool.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                        {relatedTool.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/directory?category=${tool.primary_category_id}`}>
                <Button variant="outline" size="lg">
                  View All {tool.category_name} Tools →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
