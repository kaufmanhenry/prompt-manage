import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Megaphone, TrendingUp, Users, CheckCircle, BarChart3, Share2, Download } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketing Teams - A/B Test AI Prompts & Scale Campaign Copy | Prompt Manage',
  description: 'Marketing teams use Prompt Manage to A/B test AI prompts, reuse best campaign copy, collaborate across departments, and scale content creation with proven templates.',
  keywords: 'marketing teams, AI prompts, campaign copy, A/B testing, content creation, social media, SEO',
}

export default function MarketingTeamsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <Megaphone className="w-4 h-4 mr-2" />
              For Marketing Teams
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Scale Your Content Creation<br />
            <span className="text-green-600 dark:text-green-400">Without the Chaos</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            A/B test AI prompts, reuse your best campaign copy, and collaborate across departments to create high-converting content at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Free Prompt Pack
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Prompt Pack Download */}
        <div className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8">
              <Download className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Download Our Free Marketing Prompt Pack
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                20 ready-to-use prompts for social media, email campaigns, SEO content, and product descriptions
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Social Media</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 prompts for engaging posts, captions, and hashtag strategies</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Campaigns</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 prompts for subject lines, body copy, and CTAs</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">SEO Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 prompts for blog posts, meta descriptions, and landing pages</p>
              </div>
            </div>
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Download Free Prompt Pack
              </Button>
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 bg-white dark:bg-gray-800 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Leading Marketing Teams
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  &ldquo;Prompt Manage transformed how we create content. We can now A/B test different approaches, 
                  track what works, and scale our best-performing prompts across all campaigns.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">Jessica Davis</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Director, GrowthCo</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  &ldquo;Our content team is 3x more productive. We have a library of proven prompts that we can 
                  customize for different campaigns, and the collaboration features keep everyone aligned.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    MC
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">Mike Chen</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Head of Content, BrandFlow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Built for Marketing Teams Using AI
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                A/B Test Your Prompts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test different prompt variations to see which generates the highest-converting content for your campaigns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Split test prompt variations
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Track performance metrics
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Identify winning strategies
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Reuse & Refine Best Prompts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Build a library of your most successful prompts and continuously improve them based on performance data.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Version control for all prompts
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance tracking
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Continuous optimization
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Cross-Department Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Share prompts with product, sales, and support teams to ensure consistent messaging across all touchpoints.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Team prompt libraries
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Comment and review system
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Approval workflows
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Scale Content Creation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create consistent, high-quality content across multiple channels without sacrificing creativity or speed.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Template libraries
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Bulk content generation
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multi-channel publishing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Perfect for Every Marketing Use Case
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Social Media</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts, captions, hashtags, and engagement content</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Campaigns</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Subject lines, body copy, and call-to-actions</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">SEO Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Blog posts, meta descriptions, and landing pages</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product Copy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Descriptions, features, and benefit statements</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to scale your content creation?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join marketing teams who&rsquo;ve already increased their content output by 3x
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Get Free Prompt Pack
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
} 