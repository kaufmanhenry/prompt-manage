import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, Lock, Search, Users } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Prompt Manage
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                About
              </Link>
              <Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Docs
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/public">
                <Button variant="outline" className="hidden sm:inline-flex">
                  <Globe className="mr-2 h-4 w-4" />
                  Browse Public Prompts
                </Button>
              </Link>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Organize, Share, and Discover AI Prompts
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Create and manage your AI prompts privately, or share them with the community. 
            Discover powerful prompts from other users in our public directory.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
            <Link href="/public">
              <Button variant="outline" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Explore Prompts
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Private by Default
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All your prompts are private until you choose to share them. 
                You have complete control over what's public.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Notion-like Sharing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share individual prompts with unique URLs, just like Notion. 
                Each prompt gets its own public page when shared.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Community Directory
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and use prompts shared by the community. 
                Search, filter, and find the perfect prompt for your needs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of users managing their AI prompts
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
