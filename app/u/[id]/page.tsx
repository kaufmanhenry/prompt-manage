import { ArrowLeft, Globe, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
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
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const supabase = await createClient()
  const { id } = await params

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, name, description, model, tags, slug')
    .eq('user_id', id)
    .eq('is_public', true)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl p-6">
        <Link href="/directory">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>

        <div className="mb-8 flex items-center space-x-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
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
            <h1 className="text-3xl font-bold">
              {profile.display_name || 'Anonymous User'}
            </h1>
            {profile.bio && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {profile.bio}
              </p>
            )}
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
        </div>
      </div>
    </div>
  )
}
