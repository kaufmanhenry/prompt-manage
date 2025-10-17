import { Sparkles, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import CopyButton from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { supportedModels } from '@/lib/models'
import { createServerSideClient } from '@/utils/supabase/server'

interface ModelPageProps {
  params: Promise<{
    model: string
  }>
}

// Helper function to get model data for both metadata and page rendering
async function getModelData(modelId: string) {
  const model = supportedModels.find((m) => m.id === modelId)

  if (!model) {
    const supabase = createServerSideClient()
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id')
      .eq('is_public', true)
      .eq('model', modelId)
      .limit(1)

    // If no prompts exist for this model, return null
    if (!prompts || prompts.length === 0) {
      return null
    }

    // Create a fallback model object for models with prompts but not in supportedModels
    return {
      id: modelId,
      name: modelId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      company: 'Unknown',
      type: 'Proprietary' as const,
      description: `AI model with prompts available on Prompt Manage.`,
      capabilities: ['General Purpose'],
      icon: '🤖',
      color: 'bg-gray-100 dark:bg-gray-900',
      textColor: 'text-gray-600 dark:text-gray-400',
      features: ['Available prompts'],
      useCases: ['General use'],
      companyUrl: '#',
    }
  }

  return model
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const modelId = decodeURIComponent(resolvedParams.model)

  const model = await getModelData(modelId)

  if (!model) {
    return {
      title: 'Model Not Found',
      description: 'The requested AI model could not be found.',
    }
  }

  const supabase = createServerSideClient()
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('is_public', true)
    .eq('model', modelId)

  const count = prompts?.length || 0

  const title = `${model.name} Prompts - ${count}+ AI Templates | Prompt Manage`
  const description = `Discover ${count}+ ready-to-use prompts for ${model.name}. ${model.description} Browse free ${model.name} prompt templates for all use cases.`

  return {
    title,
    description,
    keywords: [
      model.name,
      `${model.name} prompts`,
      `${model.name} templates`,
      model.company,
      'AI prompts',
      'prompt templates',
      'prompt engineering',
      ...model.capabilities,
    ],
    openGraph: {
      title,
      description,
      url: `https://promptmanage.com/prompts/${modelId}`,
      type: 'website',
      images: [
        {
          url: 'https://promptmanage.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: `${model.name} Prompts`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://promptmanage.com/og-image.svg'],
    },
    alternates: {
      canonical: `/prompts/${modelId}`,
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
}

export default async function ModelPromptsPage({ params }: ModelPageProps) {
  const resolvedParams = await params
  const modelId = decodeURIComponent(resolvedParams.model)

  const modelToUse = await getModelData(modelId)

  if (!modelToUse) {
    notFound()
  }

  const supabase = createServerSideClient()

  // Get prompts for this model
  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .eq('model', modelId)
    .order('view_count', { ascending: false })
    .limit(100)

  // Get popular tags for this model
  const tagCounts = new Map<string, number>()
  prompts?.forEach((prompt) => {
    prompt.tags?.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  // Schema.org markup
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://promptmanage.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Models',
        item: 'https://promptmanage.com/models',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: modelToUse.name,
        item: `https://promptmanage.com/prompts/${modelId}`,
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${modelToUse.name} AI Prompts`,
    description: `Collection of AI prompts for ${modelToUse.name}`,
    url: `https://promptmanage.com/prompts/${modelId}`,
    numberOfItems: prompts?.length || 0,
    about: {
      '@type': 'SoftwareApplication',
      name: modelToUse.name,
      applicationCategory: 'AI Assistant',
      operatingSystem: 'Web',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What makes ${modelToUse.name} different from other AI models?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${modelToUse.name} is known for its ${modelToUse.capabilities.slice(0, 2).join(' and ')} capabilities. As a ${modelToUse.type.toLowerCase()} model, it offers ${modelToUse.type === 'Proprietary' ? 'enterprise-grade reliability and advanced features' : 'transparency and customization options'} that make it particularly effective for ${modelToUse.useCases[0].toLowerCase()} and similar tasks.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I choose the right prompt for ${modelToUse.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Look for prompts that leverage ${modelToUse.name}'s strengths in ${modelToUse.capabilities[0].toLowerCase()}. Consider your specific use case, target audience, and desired output format. Our ${prompts?.length || 0} ${modelToUse.name} prompts are organized by popularity and use case to help you find the best fit.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use these ${modelToUse.name} prompts commercially?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! All prompts in our ${modelToUse.name} collection are free to use for both personal and commercial purposes. You can modify, adapt, and integrate them into your business workflows without any restrictions.`,
        },
      },
      {
        '@type': 'Question',
        name: `How often are new ${modelToUse.name} prompts added?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our community continuously adds new ${modelToUse.name} prompts. We update our collection regularly with the latest templates, trending prompts, and community-contributed solutions. Check back frequently or create an account to get notified of updates.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/models" className="hover:text-foreground">
              Models
            </Link>
            <span>/</span>
            <span className="text-foreground">{modelToUse.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-6 flex items-start gap-4">
              <div className={`${modelToUse.color} rounded-lg p-4`}>
                <span className="text-4xl">{modelToUse.icon}</span>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {modelToUse.name} Prompts
                  </h1>
                  <Badge
                    variant={modelToUse.type === 'Proprietary' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {modelToUse.type}
                  </Badge>
                </div>
                <p className="mb-3 text-lg text-muted-foreground">{modelToUse.description}</p>
                <p className="text-sm text-muted-foreground">
                  by <strong>{modelToUse.company}</strong> •{' '}
                  <span className="font-medium text-foreground">
                    {prompts?.length || 0} prompts
                  </span>{' '}
                  available
                </p>
              </div>
            </div>

            {/* Capabilities */}
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-medium text-foreground">Key Capabilities</h2>
              <div className="flex flex-wrap gap-2">
                {modelToUse.capabilities.map((capability) => (
                  <Badge key={capability} variant="outline">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Popular Tags for this model */}
            {popularTags.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 text-sm font-medium text-foreground">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(([tag, count]) => (
                    <Link key={tag} href={`/p/tags/${encodeURIComponent(tag)}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                        {tag} ({count})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prompts Grid */}
          {prompts && prompts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <Link key={prompt.id} href={`/p/${prompt.slug}`}>
                  <Card className="group flex h-full cursor-pointer flex-col p-4 transition-all hover:border-primary hover:shadow-md">
                    <div className="flex-grow">
                      <div className="mb-4">
                        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary">
                          {prompt.name}
                        </h3>
                        {prompt.description && (
                          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                            {prompt.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {prompt.tags?.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags && prompt.tags.length > 3 && (
                            <Badge variant="outline">+{prompt.tags.length - 3}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <pre className="line-clamp-3 text-wrap rounded-lg bg-accent p-2 text-xs font-medium text-muted-foreground">
                          {prompt.prompt_text}
                        </pre>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{prompt.view_count} views</span>
                        </div>
                        <CopyButton text={prompt.prompt_text} />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No {modelToUse.name} Prompts Yet
              </h3>
              <p className="mb-4 text-muted-foreground">
                Be the first to create a prompt for this model!
              </p>
              <Link
                href="/dashboard"
                className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Create Prompt
              </Link>
            </div>
          )}

          {/* Use Cases */}
          <div className="mx-auto mt-16 max-w-4xl border-t pb-8 pt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              What Can You Do With {modelToUse.name}?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {modelToUse.useCases.map((useCase, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-accent/50 p-4">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{useCase}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehensive Content Section */}
          <div className="mx-auto mt-12 max-w-4xl border-t pb-8 pt-12">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Complete Guide to {modelToUse.name} Prompts
              </h2>

              {/* What is [model] section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  What is {modelToUse.name}?
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">{modelToUse.name}</strong> is a{' '}
                    {modelToUse.type.toLowerCase()} AI model developed by{' '}
                    <strong className="text-foreground">{modelToUse.company}</strong>.
                    {modelToUse.description}
                  </p>
                  <p>
                    Our collection features{' '}
                    <strong className="text-foreground">
                      {prompts?.length || 0} prompts specifically designed for {modelToUse.name}
                    </strong>
                    , tested and refined by the community to deliver optimal results for various use
                    cases.
                  </p>
                </div>
              </div>

              {/* Key capabilities section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {modelToUse.name} Key Capabilities
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {modelToUse.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-lg bg-accent/50 p-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-sm text-foreground">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use cases section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Best Use Cases for {modelToUse.name}
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  <p>{modelToUse.name} excels at the following applications:</p>
                  <ul className="ml-4 space-y-2">
                    {modelToUse.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* How to optimize prompts section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  How to Optimize Prompts for {modelToUse.name}
                </h3>
                <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                  <p>
                    To get the best results from {modelToUse.name}, follow these optimization
                    strategies:
                  </p>
                  <ol className="ml-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Leverage {modelToUse.name}'s strengths:</strong> Focus on{' '}
                        {modelToUse.capabilities[0].toLowerCase()} and{' '}
                        {modelToUse.capabilities[1]?.toLowerCase()} tasks where this model performs
                        best.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Use specific instructions:</strong> {modelToUse.name} responds well
                        to detailed, structured prompts with clear objectives.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Provide context:</strong> Include relevant background information to
                        help {modelToUse.name} understand your specific needs.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      <span>
                        <strong>Iterate and refine:</strong> Test different prompt variations to
                        find the most effective approach for your use case.
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Frequently Asked Questions About {modelToUse.name}
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      What makes {modelToUse.name} different from other AI models?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {modelToUse.name} is known for its{' '}
                      {modelToUse.capabilities.slice(0, 2).join(' and ')} capabilities. As a{' '}
                      {modelToUse.type.toLowerCase()} model, it offers{' '}
                      {modelToUse.type === 'Proprietary'
                        ? 'enterprise-grade reliability and advanced features'
                        : 'transparency and customization options'}
                      that make it particularly effective for {modelToUse.useCases[0].toLowerCase()}{' '}
                      and similar tasks.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      How do I choose the right prompt for {modelToUse.name}?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Look for prompts that leverage {modelToUse.name}'s strengths in{' '}
                      {modelToUse.capabilities[0].toLowerCase()}. Consider your specific use case,
                      target audience, and desired output format. Our {prompts?.length || 0}{' '}
                      {modelToUse.name} prompts are organized by popularity and use case to help you
                      find the best fit.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      Can I use these {modelToUse.name} prompts commercially?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! All prompts in our {modelToUse.name} collection are free to use for both
                      personal and commercial purposes. You can modify, adapt, and integrate them
                      into your business workflows without any restrictions.
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <h4 className="mb-2 font-semibold text-foreground">
                      How often are new {modelToUse.name} prompts added?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our community continuously adds new {modelToUse.name} prompts. We update our
                      collection regularly with the latest templates, trending prompts, and
                      community-contributed solutions. Check back frequently or create an account to
                      get notified of updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related models section */}
              <div className="mb-8">
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Explore Other AI Models
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {supportedModels
                    .filter((m) => m.id !== modelId)
                    .slice(0, 3)
                    .map((relatedModel) => (
                      <Link
                        key={relatedModel.id}
                        href={`/prompts/${relatedModel.id}`}
                        className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-lg">{relatedModel.icon}</span>
                          <h4 className="font-semibold text-foreground">{relatedModel.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{relatedModel.description}</p>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Ready to Master {modelToUse.name}?
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create a free account to save your favorite {modelToUse.name} prompts, organize
                  them by project, and track your results.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/models"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent dark:border-gray-600"
                  >
                    Browse All Models
                  </Link>
                  <a
                    href={modelToUse.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent dark:border-gray-600"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
