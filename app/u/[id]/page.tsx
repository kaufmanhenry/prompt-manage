import { ArrowLeft, Globe, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'

interface PublicPrompt {
  id: string
  name: string
  description?: string
  model: string
  tags: string[]
  slug: string
}

interface PublicProfilePageProps {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function PublicProfilePage({ params, searchParams }: PublicProfilePageProps) {
  const supabase = await createClient()
  const { id } = await params
  const resolvedSearch: { page?: string } = (await (searchParams || Promise.resolve({}))) || {}
  const pageParam = Number.parseInt(resolvedSearch.page || '1', 10)
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const PAGE_SIZE = 12
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  const { data: prompts, count } = await supabase
    .from('prompts')
    .select('id, name, description, model, tags, slug', { count: 'exact' })
    .eq('user_id', id)
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .range(from, to)

  const total = count || 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // Aggregate creator categories (tags) across all public prompts
  const { data: allTagRows } = await supabase
    .from('prompts')
    .select('tags')
    .eq('user_id', id)
    .eq('is_public', true)
    .limit(2000)

  const tagSet = new Set<string>()
  for (const row of allTagRows || []) {
    for (const t of (row as { tags?: string[] }).tags || []) {
      if (t) tagSet.add(t)
    }
  }
  const creatorCategories = Array.from(tagSet).slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-6">
        <Link href="/p">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>

        <div className="mb-8 flex items-center space-x-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            {profile.avatar_url ? (
              <img
                src={
                  profile.avatar_url.startsWith('http')
                    ? profile.avatar_url
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url.replace(/^avatars\//, '')}`
                }
                alt={profile.display_name || 'User'}
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <UserIcon className="h-12 w-12 text-gray-500" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.display_name || 'Anonymous User'}</h1>
            {profile.bio && <p className="mt-2 text-gray-600 dark:text-gray-400">{profile.bio}</p>}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center text-blue-500 hover:underline"
              >
                <Globe className="mr-2 h-4 w-4" />
                {profile.website}
              </a>
            )}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Public Prompts</h2>
          <p className="mb-6 text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
            {profile.display_name || 'This creator'} has published{' '}
            <span className="font-semibold">{total}</span> AI prompts in the{' '}
            <Link href="/p">Public Prompt Directory</Link> on <Link href="/">Prompt Manage</Link>.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(prompts as PublicPrompt[])?.map((prompt) => (
              <Link href={`/p/${prompt.slug}`} key={prompt.id}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{prompt.name}</CardTitle>
                    {prompt.description && (
                      <p className="pt-2 text-sm text-gray-500 dark:text-gray-400">
                        {prompt.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{prompt.model}</Badge>
                      {prompt.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {total > 0 ? (
                <span>
                  Showing {from + 1}–{Math.min(from + ((prompts || []).length || 0), total)} of{' '}
                  {total}
                </span>
              ) : (
                <span>No public prompts yet.</span>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/u/${id}?page=${page - 1}`} aria-disabled={page <= 1}>
                <Button variant="outline" size="sm" disabled={page <= 1}>
                  Previous
                </Button>
              </Link>
              <Link href={`/u/${id}?page=${page + 1}`} aria-disabled={page >= totalPages}>
                <Button variant="outline" size="sm" disabled={page >= totalPages}>
                  Next
                </Button>
              </Link>
            </div>
          </div>
          {/* Creator Footer Auto-Text (no card styling) */}
          <div className="mt-12 border-t pt-8">
            <h3 className="mb-2 text-center text-base font-semibold text-foreground">
              About This Creator
            </h3>
            <div className="mx-auto max-w-3xl text-base leading-7 text-muted-foreground">
              <p className="[&_a]:underline [&_a]:underline-offset-4">
                <span className="font-semibold">{profile.display_name || 'This creator'}</span> has
                published <span className="font-semibold">{total}</span> AI prompts in the{' '}
                <Link href="/p">Public Prompt Directory</Link> on{' '}
                <Link href="/">Prompt Manage</Link>, covering ChatGPT, Google Gemini, Claude, Grok,
                and more.{' '}
                {creatorCategories.length > 0 && (
                  <>
                    They often publish in categories like{' '}
                    {creatorCategories.map((cat, i) => (
                      <span key={cat}>
                        <Link href={`/p/tags/${encodeURIComponent(cat)}`}>{cat}</Link>
                        {i < creatorCategories.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    .
                  </>
                )}{' '}
                <Link href={`/u/${id}`}>Explore more prompts</Link> from{' '}
                {profile.display_name || 'this creator'} or{' '}
                <Link href="/p">browse the full directory</Link> to discover new ways to write,
                brainstorm, code, and create with AI.
              </p>

              {creatorCategories.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {creatorCategories.map((cat) => (
                    <Badge key={cat} variant="outline">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
