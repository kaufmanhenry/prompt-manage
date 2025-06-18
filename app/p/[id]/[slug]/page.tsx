import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Prompt } from '@/lib/schemas/prompt'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CopyButton from '@/components/CopyButton'
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

interface PublicPromptPageProps {
  params: Promise<{
    id: string
    slug: string
  }>
}

// Generate metadata for the prompt page
export async function generateMetadata({
  params,
}: PublicPromptPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()

  try {
    const { data: prompt } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('is_public', true)
      .single()

    if (!prompt) {
      return {
        title: 'Prompt Not Found - Prompt Manage',
        description:
          'This prompt may have been deleted or is not publicly available.',
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    const promptData = prompt as Prompt
    const description =
      promptData.description ||
      `AI prompt for ${promptData.model}: ${promptData.prompt_text.substring(
        0,
        150
      )}...`

    const tags = promptData.tags || []
    const keywords = ['AI prompt', promptData.model, ...tags].join(', ')

    const metadata: Metadata = {
      title: `${promptData.name} - AI Prompt | Prompt Manage`,
      description: description,
      keywords: keywords,
      authors: [{ name: 'Prompt Manage User' }],
      creator: 'Prompt Manage',
      publisher: 'Prompt Manage',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL('https://promptmanage.com'),
      alternates: {
        canonical: `/p/${promptData.id}/${promptData.slug}`,
      },
      openGraph: {
        title: `${promptData.name} - AI Prompt`,
        description: description,
        url: `https://promptmanage.com/p/${promptData.id}/${promptData.slug}`,
        siteName: 'Prompt Manage',
        images: [
          {
            url: 'https://promptmanage.com/og-image.svg',
            width: 1200,
            height: 630,
            alt: `${promptData.name} - AI Prompt`,
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${promptData.name} - AI Prompt`,
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

    // Add article metadata if we have timestamps
    if (promptData.inserted_at || promptData.updated_at) {
      metadata.other = {
        'article:author': 'Prompt Manage User',
        'article:section': 'AI Prompts',
        'article:tag': tags,
      }

      if (promptData.inserted_at) {
        metadata.other['article:published_time'] = promptData.inserted_at
      }
      if (promptData.updated_at) {
        metadata.other['article:modified_time'] = promptData.updated_at
      }
    }

    return metadata
  } catch (error) {
    console.error('Metadata generation error:', error)
    return {
      title: 'Prompt Not Found - Prompt Manage',
      description:
        'This prompt may have been deleted or is not publicly available.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default async function PublicPromptPage({
  params,
}: PublicPromptPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  try {
    const { data: prompt, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('is_public', true)
      .single()

    if (error || !prompt) {
      notFound()
    }

    const promptData = prompt as Prompt

    // Increment view count
    await supabase.rpc('increment_prompt_views', {
      prompt_id: resolvedParams.id,
    })

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {promptData.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Shared by User</span>
                  </div>
                  {promptData.updated_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated{' '}
                        {new Date(promptData.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Prompt</span>
                    <CopyButton text={promptData.prompt_text} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                      {promptData.prompt_text}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Model Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-sm">
                    {promptData.model}
                  </Badge>
                </CardContent>
              </Card>

              {/* Tags */}
              {promptData.tags && promptData.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {promptData.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Usage Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2">1. Copy the prompt text above</p>
                    <p className="mb-2">
                      2. Paste it into your AI model of choice
                    </p>
                    <p>3. Customize the variables as needed</p>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>
                      💡 Tip: This prompt is designed for {promptData.model}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {promptData.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {promptData.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Prompt page error:', error)
    notFound()
  }
}
