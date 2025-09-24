'use client'
import {
  CheckCircle,
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export default function PromptPackPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'prompt-pack' }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setIsSubmitted(true)
    } catch (err) {
      console.error('Lead submit error:', err)
      alert(
        'There was an error. Please email support@promptmanage.com and we will send the pack manually.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const promptPreviews = [
    {
      title: 'Social Media Post Generator',
      description:
        'Create engaging social media posts that drive engagement and clicks',
      category: 'Marketing',
      icon: TrendingUp,
      preview:
        'Create a compelling social media post for [platform] about [topic] that will engage our audience of [target audience]. The post should be [tone] and include a clear call-to-action.',
    },
    {
      title: 'Customer Support Response',
      description:
        'Generate professional, empathetic responses to customer inquiries',
      category: 'Support',
      icon: MessageSquare,
      preview:
        'Write a professional and empathetic response to a customer who is [emotion] about [issue]. The response should acknowledge their concern, provide a clear solution, and maintain our brand voice.',
    },
    {
      title: 'Product Description Writer',
      description:
        'Create compelling product descriptions that convert browsers to buyers',
      category: 'Sales',
      icon: FileText,
      preview:
        'Write a compelling product description for [product name] that highlights its key features: [features]. Target audience is [audience]. Focus on benefits and include persuasive language.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
              <Download className="mr-2 h-4 w-4" />
              Free Download
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Get 20 Ready-to-Use
            <br />
            <span className="text-green-600 dark:text-green-400">
              AI Prompts
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl">
            Download our curated collection of proven prompts for marketing,
            support, and product teams. Start using AI more effectively today.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Lead Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {!isSubmitted ? (
              <>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Download Your Free Prompt Pack
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Get instant access to 20 proven prompts that teams are using
                  to scale their AI operations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 py-3 text-lg hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      'Downloading...'
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download Free Prompt Pack
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>✓ No credit card required</p>
                  <p>✓ Instant download</p>
                  <p>✓ Unsubscribe anytime</p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Download Complete!
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Check your email for the download link. You&rsquo;ll also
                  receive tips on how to use these prompts effectively.
                </p>
                <Link href="/?redirect=/dashboard">
                  <Button className="py-3 text-lg">Start Free Trial</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Prompt Previews */}
          <div className="space-y-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              What&rsquo;s Inside the Pack
            </h2>

            {promptPreviews.map((prompt, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                    <prompt.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {prompt.title}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        {prompt.category}
                      </span>
                    </div>
                    <p className="mb-3 text-gray-600 dark:text-gray-400">
                      {prompt.description}
                    </p>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                      <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                        {prompt.preview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 rounded-2xl bg-white p-8 dark:bg-gray-800">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Why Teams Love These Prompts
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 p-4 dark:bg-green-900">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Proven Results
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                These prompts have been tested and refined by hundreds of teams
                across different industries.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Save Time
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stop starting from scratch. Use these templates and customize
                them for your specific needs.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100 p-4 dark:bg-purple-900">
                <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Better Outputs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get higher quality AI responses with prompts that are optimized
                for specific use cases.
              </p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            What&rsquo;s Included in Your Free Pack
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Marketing (5 prompts)
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Social media posts</li>
                <li>• Email subject lines</li>
                <li>• Ad copy</li>
                <li>• Blog outlines</li>
                <li>• Product descriptions</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Support (5 prompts)
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Customer responses</li>
                <li>• FAQ generation</li>
                <li>• Troubleshooting guides</li>
                <li>• Apology templates</li>
                <li>• Escalation scripts</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Product (5 prompts)
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• User stories</li>
                <li>• Feature descriptions</li>
                <li>• Release notes</li>
                <li>• Bug reports</li>
                <li>• Documentation</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                General (5 prompts)
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Meeting agendas</li>
                <li>• Project plans</li>
                <li>• Code comments</li>
                <li>• Data analysis</li>
                <li>• Research summaries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-12 text-center dark:from-green-900/20 dark:to-blue-900/20">
          <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to scale your AI operations?
          </h3>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Join thousands of teams using Prompt Manage to organize, test, and
            optimize their AI prompts
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/?redirect=/dashboard">
              <Button size="lg" className="px-8 py-4 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                See Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}
