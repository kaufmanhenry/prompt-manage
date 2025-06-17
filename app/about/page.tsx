import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Shield, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Prompt Manage
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            The modern way to organize, share, and discover AI prompts
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Prompt Manage was built to solve a simple problem: AI prompts are powerful tools, but they're scattered across conversations, notes, and documents. We believe everyone should have a central place to organize, refine, and share their best prompts.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Whether you're a developer, writer, researcher, or creative professional, Prompt Manage helps you build a personal library of AI prompts that grows more valuable over time.
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            What We Do
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2 mr-4">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Private Organization
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Store all your prompts in one secure place. Organize them with tags, categories, and search. Your prompts are private by default - you control what gets shared.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2 mr-4">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notion-like Sharing
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Share individual prompts with unique URLs. Each prompt gets its own public page when shared, making it easy to collaborate and discover great prompts.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Community Discovery
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Browse a curated directory of prompts shared by the community. Find inspiration, learn new techniques, and discover prompts for any use case.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-2 mr-4">
                  <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Built for Productivity
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Fast, responsive, and designed for daily use. Copy prompts with one click, organize with smart filters, and access your library from anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Built for Everyone
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developers</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Store coding prompts, debugging helpers, and system prompts
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Writers</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Organize writing prompts, editing helpers, and creative inspiration
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Researchers</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Catalog research prompts, analysis templates, and data processing
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join thousands of users organizing their AI prompts
          </p>
          <Link href="/login">
            <Button size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 