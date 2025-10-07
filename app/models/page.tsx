import { ArrowLeft, Brain, Code, Eye, Globe, Settings, Shield, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { supportedModels } from '@/lib/models'

export const metadata: Metadata = {
  title: 'Supported AI Models - Prompt Manage',
  description:
    'Explore the top AI models available on Prompt Manage, including GPT-4o, Claude 4, Gemini 2.5 Pro, Llama 3.1, DeepSeek, Mixtral, and more.',
  keywords:
    'AI models, GPT-4o, GPT-4o mini, Claude 4, Gemini 2.5, Gemini 1.5, Llama 3.1, DeepSeek, Mixtral, Mistral, Grok, Qwen, Cohere, prompt management',
  authors: [{ name: 'Prompt Manage' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://promptmanage.com'),
  alternates: {
    canonical: '/models',
  },
  openGraph: {
    title: 'Supported AI Models - Prompt Manage',
    description:
      'Explore the top AI models available on Prompt Manage, including GPT-4o, Claude 4, Gemini 2.5 Pro, Llama 3.1, DeepSeek, Mixtral, and more.',
    url: 'https://promptmanage.com/models',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Supported Models',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supported AI Models - Prompt Manage',
    description: 'Explore the comprehensive list of AI models supported on Prompt Manage.',
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

export default function ModelsPage() {
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
        name: 'Supported AI Models',
        item: 'https://promptmanage.com/models',
      },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Supported AI Models',
    description: 'Comprehensive list of AI models supported by Prompt Manage',
    url: 'https://promptmanage.com/models',
    about: {
      '@type': 'SoftwareApplication',
      name: 'Prompt Manage',
    },
    numberOfItems: supportedModels.length,
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
      <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Supported AI Models
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            Discover the comprehensive range of AI models supported on Prompt Manage. From
            cutting-edge proprietary models to powerful open-source alternatives, we integrate with
            the most important LLMs to streamline your prompt management needs and prompt
            engineering workflows.
          </p>
        </div>

        {/* Model Categories */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Model Categories
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Proprietary Models
                </h3>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                High-performance models from leading AI companies with advanced capabilities,
                extensive training, and enterprise-grade reliability.
              </p>
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Key Benefits for Enterprise:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Advanced multimodal capabilities</li>
                <li>• Extensive safety measures</li>
                <li>• Enterprise-grade support</li>
                <li>• Regular updates and improvements</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Open Source Models
                </h3>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Community-driven models offering transparency, customizability, and the freedom to
                modify and deploy according to your specific needs.
              </p>
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Key Benefits for Enterprise:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Full transparency and control</li>
                <li>• Customizable and deployable</li>
                <li>• Cost-effective solutions</li>
                <li>• Research and development friendly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Integrated AI Models
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {supportedModels.map((model, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${model.color} rounded-lg p-2`}>
                      <span className="text-2xl">{model.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {model.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{model.company}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      model.type === 'Proprietary'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {model.type}
                  </span>
                </div>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{model.description}</p>
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Key Capabilities:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.map((capability, capIndex) => (
                      <span
                        key={capIndex}
                        className={`rounded-full px-2 py-1 text-xs ${model.color} ${model.textColor}`}
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Key Use Cases:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {model.useCases.map((useCase, useCaseIndex) => (
                      <li key={useCaseIndex} className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">•</span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <a
                    href={model.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Visit {model.company} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capability Overview */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Model Capabilities Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
                <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Multimodal
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Process text, images, audio, and video inputs seamlessly
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 p-4 dark:bg-green-900">
                <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Reasoning
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced logical thinking and problem-solving capabilities
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100 p-4 dark:bg-purple-900">
                <Code className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Code Generation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Write, debug, and optimize code across multiple languages
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100 p-4 dark:bg-orange-900">
                <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                High-speed processing with large context windows
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100 p-4 dark:bg-indigo-900">
                <Settings className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Customization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fine-tune and adapt models to specific enterprise requirements
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-red-100 p-4 dark:bg-red-900">
                <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Security & Compliance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise-grade security with compliance and governance features
              </p>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="mx-auto mt-16 max-w-4xl border-t pt-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Explore AI Prompts by Model
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/p?model=gpt-4o"
              className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="font-semibold text-gray-900 dark:text-white">GPT-4o Prompts</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Browse GPT-4o templates</div>
            </Link>
            <Link
              href="/p?model=claude-4-sonnet"
              className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="font-semibold text-gray-900 dark:text-white">Claude 4 Prompts</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Browse Claude templates</div>
            </Link>
            <Link
              href="/p?model=gemini-2-5-pro"
              className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="font-semibold text-gray-900 dark:text-white">Gemini Prompts</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Browse Gemini templates</div>
            </Link>
            <Link
              href="/p"
              className="rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="font-semibold text-gray-900 dark:text-white">All Prompts</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">View full directory</div>
            </Link>
          </div>
          <div className="mt-6 text-center">
            <Link href="/docs/best-practices" className="text-emerald-600 hover:underline dark:text-emerald-400">
              Learn prompt engineering best practices →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Ready to elevate your prompt engineering?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Create your account and start creating, managing, and running AI prompts for all
            supported models
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/?redirect=/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/p">
              <Button variant="outline" size="lg">
                Browse Public Prompts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
