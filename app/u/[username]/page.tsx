import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createServerSideClient } from '@/utils/supabase/server'

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = createServerSideClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, bio_markdown, username, avatar_url')
    .eq('username', resolvedParams.username)
    .single()

  const title = profile?.display_name
    ? `${profile.display_name} – Prompt Manage`
    : `Creator – Prompt Manage`
  const description = profile?.bio_markdown || 'Creator profile on Prompt Manage.'
  const url = `https://promptmanage.com/u/${resolvedParams.username}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: profile?.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
    twitter: { card: 'summary', title, description },
  }
}

export default async function CreatorProfilePage({ params }: Props) {
  const resolvedParams = await params
  const supabase = createServerSideClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select(
      'id, display_name, username, is_verified, avatar_url, bio_markdown, twitter_url, linkedin_url, instagram_url, youtube_url, website_url, profile_views, featured_prompt_ids, featured_collection_ids',
    )
    .eq('username', resolvedParams.username)
    .single()

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">Profile not found</h1>
        <p className="text-muted-foreground">This creator does not exist.</p>
      </div>
    )
  }

  // Increment profile views (best-effort)
  void supabase
    .from('user_profiles')
    .update({ profile_views: (profile.profile_views || 0) + 1 })
    .eq('id', profile.id)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center gap-4">
        {/* Avatar */}
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {profile.display_name || profile.username}
            {profile.is_verified && (
              <Badge className="inline-flex items-center gap-1 bg-emerald-600">
                <Check className="h-3 w-3" /> Verified
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
      </div>

      {/* Socials */}
      <div className="mb-8 flex flex-wrap gap-3 text-sm">
        {profile.website_url && (
          <Link className="text-foreground underline" href={profile.website_url}>
            Website
          </Link>
        )}
        {profile.twitter_url && (
          <Link className="text-foreground underline" href={profile.twitter_url}>
            X
          </Link>
        )}
        {profile.linkedin_url && (
          <Link className="text-foreground underline" href={profile.linkedin_url}>
            LinkedIn
          </Link>
        )}
        {profile.instagram_url && (
          <Link className="text-foreground underline" href={profile.instagram_url}>
            Instagram
          </Link>
        )}
        {profile.youtube_url && (
          <Link className="text-foreground underline" href={profile.youtube_url}>
            YouTube
          </Link>
        )}
      </div>

      {/* Bio */}
      {profile.bio_markdown && (
        <Card className="mb-8 p-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>{profile.bio_markdown}</p>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-semibold">{profile.profile_views || 0}</div>
          <div className="text-xs text-muted-foreground">Profile Views</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-semibold">–</div>
          <div className="text-xs text-muted-foreground">Prompts Published</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-semibold">–</div>
          <div className="text-xs text-muted-foreground">Collections</div>
        </Card>
      </div>

      {/* Featured sections (placeholders if empty) */}
      <div className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Featured Prompts</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(profile.featured_prompt_ids || []).length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">No featured prompts yet.</Card>
          ) : (
            (profile.featured_prompt_ids || []).map((id: string) => (
              <Card key={id} className="p-6 text-sm text-muted-foreground">
                Prompt {id}
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Featured Collections</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(profile.featured_collection_ids || []).length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">No featured collections yet.</Card>
          ) : (
            (profile.featured_collection_ids || []).map((id: string) => (
              <Card key={id} className="p-6 text-sm text-muted-foreground">
                Collection {id}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
