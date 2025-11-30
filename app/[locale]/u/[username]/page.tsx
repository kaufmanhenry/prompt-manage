import { Calendar, Github, Globe, Link as LinkIcon, MapPin, Twitter } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'

interface ProfilePageProps {
  params: Promise<{
    username: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, bio')
    .eq('username', username)
    .single()

  if (!profile) {
    return {
      title: 'User Not Found',
    }
  }

  return {
    title: `${profile.display_name} (@${username}) - Prompt Manage`,
    description: profile.bio || `Check out ${profile.display_name}'s profile on Prompt Manage.`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Fetch profile with social links
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select(
      `
      *,
      followers:user_follows!following_id(count),
      following:user_follows!follower_id(count)
    `,
    )
    .eq('username', username)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Fetch recent activity (e.g., submitted tools or public prompts)
  // For now, we'll just fetch submitted tools
  const { data: tools } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('submitted_by', profile.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container max-w-4xl py-10">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Sidebar / Profile Info */}
        <aside className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-4xl">
                {profile.display_name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-2xl font-bold">{profile.display_name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>

            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
            )}
          </div>

          <div className="space-y-3 text-sm">
            {profile.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {new URL(profile.website).hostname}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDate(profile.created_at)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {profile.twitter_url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.github_url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.website && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <div className="flex justify-center gap-8 border-t pt-6">
            <div className="text-center">
              <div className="text-xl font-bold">{profile.followers?.[0]?.count || 0}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{profile.following?.[0]?.count || 0}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Following
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Submitted Tools</h2>
            {tools && tools.length > 0 ? (
              <div className="grid gap-4">
                {tools.map((tool) => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <a href={`/tool/${tool.slug}`} className="hover:underline">
                          {tool.name}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                No tools submitted yet.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
