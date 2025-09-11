import { ArrowLeft, Brain, Code, Eye, Globe, Settings, Shield, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { supportedModels } from '@/lib/models';

export const metadata: Metadata = {
  title: 'Supported AI Models - Prompt Manage',
  description:
    'Explore the comprehensive list of AI models supported on Prompt Manage, including GPT-5, GPT-4o, Claude 4 Opus, Gemini 2.5 Pro, and more.',
  keywords:
    'AI models, GPT-5, GPT-4o, Claude 4, Gemini 2.5, Llama 4, DeepSeek, Mistral, prompt management',
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
      'Explore the comprehensive list of AI models supported on Prompt Manage, including GPT-5, GPT-4o, Claude 4 Opus, Gemini 2.5 Pro, and more.',
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
};

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supported AI Models
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the comprehensive range of AI models supported on Prompt Manage. From
            cutting-edge proprietary models to powerful open-source alternatives, we integrate with
            the most important LLMs to streamline your prompt management needs and prompt
            engineering workflows.
          </p>
        </div>

        {/* Model Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Model Categories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Proprietary Models
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                High-performance models from leading AI companies with advanced capabilities,
                extensive training, and enterprise-grade reliability.
              </p>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Key Benefits for Enterprise:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Advanced multimodal capabilities</li>
                <li>• Extensive safety measures</li>
                <li>• Enterprise-grade support</li>
                <li>• Regular updates and improvements</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Open Source Models
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Community-driven models offering transparency, customizability, and the freedom to
                modify and deploy according to your specific needs.
              </p>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Key Benefits for Enterprise:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Integrated AI Models
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedModels.map((model, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
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
                    className={`text-xs px-2 py-1 rounded-full ${
                      model.type === 'Proprietary'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {model.type}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{model.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Key Capabilities:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.map((capability, capIndex) => (
                      <span
                        key={capIndex}
                        className={`text-xs px-2 py-1 rounded-full ${model.color} ${model.textColor}`}
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Key Use Cases:
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {model.useCases.map((useCase, useCaseIndex) => (
                      <li key={useCaseIndex} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
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
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Model Capabilities Overview
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Multimodal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Process text, images, audio, and video inputs seamlessly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reasoning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Advanced logical thinking and problem-solving capabilities
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Code Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Write, debug, and optimize code across multiple languages
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                High-speed processing with large context windows
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Customization
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Fine-tune and adapt models to specific enterprise requirements
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Security & Compliance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enterprise-grade security with compliance and governance features
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to elevate your prompt engineering?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your account and start creating, managing, and running AI prompts for all
            supported models
          </p>
          <div className="flex items-center justify-center gap-4">
            <GoogleSignInButton label="Get Started" size="lg" />
            <Link href="/p">
              <Button variant="outline" size="lg">
                Browse Public Prompts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
