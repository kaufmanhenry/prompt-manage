import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, MapPin, Globe } from 'lucide-react'
import { Metadata } from 'next'

interface UserProfile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  location: string | null
  created_at: string
}

interface Prompt {
  id: string
  name: string
  description: string | null
  prompt_text: string
  model: string
  tags: string[]
  view_count: number
  slug: string
  created_at: string
}

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for the user profile page
export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (!profile) {
      return {
        title: 'User Not Found - Prompt Manage',
        description: 'This user profile could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    const userProfile = profile as UserProfile
    const displayName = userProfile.display_name || 'Anonymous User'
    const description = userProfile.bio || 
      `View ${displayName}'s public AI prompts and profile on Prompt Manage.`
    
    const keywords = ['AI prompts', 'prompt sharing', displayName, 'Prompt Manage user'].join(', ')

    return {
      title: `${displayName} - User Profile | Prompt Manage`,
      description: description,
      keywords: keywords,
      authors: [{ name: displayName }],
      creator: 'Prompt Manage',
      publisher: 'Prompt Manage',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL('https://promptmanage.com'),
      alternates: {
        canonical: `/profile/${userProfile.id}`,
      },
      openGraph: {
        title: `${displayName} - User Profile`,
        description: description,
        url: `https://promptmanage.com/profile/${userProfile.id}`,
        siteName: 'Prompt Manage',
        images: [
          {
            url: 'https://promptmanage.com/og-image.svg',
            width: 1200,
            height: 630,
            alt: `${displayName} - Prompt Manage User Profile`,
          },
        ],
        locale: 'en_US',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${displayName} - User Profile`,
        description: description,
        images: ['https://promptmanage.com/og-image.svg'],
        creator: '@promptmanage',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch {
    return {
      title: 'User Not Found - Prompt Manage',
      description: 'This user profile could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Get user's public prompts
  const { data: prompts, error: promptsError } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (promptsError) {
    console.error('Error fetching prompts:', promptsError)
  }

  const userProfile = profile as UserProfile
  const userPrompts = (prompts || []) as Prompt[]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/p">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Public Directory
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-semibold text-primary">
                  {userProfile.display_name?.[0]?.toUpperCase() || userProfile.id[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userProfile.display_name || 'Anonymous User'}
                </h1>
                {userProfile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                    {userProfile.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {userProfile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {userProfile.location}
                    </div>
                  )}
                  {userProfile.website && (
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <div>
                    Member since {new Date(userProfile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prompts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Public Prompts ({userPrompts.length})
            </h2>
          </div>

          {userPrompts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  This user hasn&apos;t shared any prompts yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userPrompts.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        <Link
                          href={`/p/${prompt.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {prompt.name}
                        </Link>
                      </CardTitle>
                    </div>
                    {prompt.description && (
                      <CardDescription className="line-clamp-2">
                        {prompt.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {prompt.model}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {prompt.view_count} views
                      </span>
                    </div>
                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{prompt.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(prompt.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 