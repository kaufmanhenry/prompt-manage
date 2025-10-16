import { BookOpen, CreditCard, Mail, MessageSquare,Search, Shield, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const metadata: Metadata = {
  title: 'Support Center — Prompt Manage',
  description: 'Find answers to common questions, troubleshooting guides, and contact support for Prompt Manage.',
  keywords: ['support', 'help center', 'FAQ', 'troubleshooting', 'documentation', 'contact support'],
  openGraph: {
    title: 'Support Center — Prompt Manage',
    description: 'Get help with Prompt Manage. Browse guides, FAQs, and contact support.',
    type: 'website',
  },
}

export default function SupportPage() {
  const categories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'New to Prompt Manage? Start here.',
      articles: [
        { title: 'How to create your first prompt', href: '/docs/getting-started/first-prompt' },
        { title: 'Understanding prompt templates and variables', href: '/docs/getting-started/templates' },
        { title: 'Setting up your account and profile', href: '/docs/getting-started/account-setup' },
      ],
    },
    {
      icon: Users,
      title: 'Using Prompt Manage Teams',
      description: 'Collaborate with your team effectively.',
      articles: [
        { title: 'Inviting team members and assigning roles', href: '/docs/teams/inviting-members' },
        { title: 'Managing team permissions and workspaces', href: '/docs/teams/permissions' },
        { title: 'Sharing prompts within your team', href: '/docs/teams/sharing-prompts' },
      ],
    },
    {
      icon: Shield,
      title: 'Security & Account Access',
      description: 'Keep your account secure and private.',
      articles: [
        { title: 'Resetting your password', href: '/docs/security/reset-password' },
        { title: 'Enabling two-factor authentication (2FA)', href: '/docs/security/2fa' },
        { title: 'Managing API keys and access tokens', href: '/docs/security/api-keys' },
      ],
    },
    {
      icon: CreditCard,
      title: 'Billing & Data Requests',
      description: 'Manage subscriptions and data.',
      articles: [
        { title: 'Upgrading or downgrading your plan', href: '/docs/billing/plan-changes' },
        { title: 'Exporting your data', href: '/docs/billing/export-data' },
        { title: 'Requesting account deletion', href: '/docs/billing/delete-account' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">How can we help you?</h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Search our knowledge base or browse categories below
            </p>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help articles, guides, or common questions..."
                className="h-14 pl-12 pr-4 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Browse by Category</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Card key={category.title} className="transition-all hover:border-blue-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 w-fit rounded-lg bg-blue-100 p-3 dark:bg-blue-950">
                      <category.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article) => (
                        <li key={article.href}>
                          <Link
                            href={article.href}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/docs/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button variant="link" className="mt-4 h-auto p-0 text-sm">
                        View all articles →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold">Popular Articles</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/docs/prompts/variables" className="hover:text-blue-600">
                      How to use variables in prompt templates
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Learn how to create dynamic prompts using variables like {`{{name}}`} and {`{{context}}`}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/docs/api/authentication" className="hover:text-blue-600">
                      API Authentication Guide
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Set up API keys and authenticate your requests to the Prompt Manage API
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/docs/teams/roles" className="hover:text-blue-600">
                      Understanding team roles and permissions
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Owner, Admin, Editor, Viewer — what each role can do in your team workspace
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/docs/billing/pricing" className="hover:text-blue-600">
                      Comparing Free, Team, and Enterprise plans
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Feature breakdown and pricing for each Prompt Manage subscription tier
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <Mail className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h2 className="mb-4 text-3xl font-bold">Still need help?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Can't find what you're looking for? Our support team is here to help.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Support
                  </CardTitle>
                  <CardDescription>Get a response within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    For account issues, billing questions, or technical support
                  </p>
                  <a
                    href="mailto:support@promptmanage.com"
                    className="text-lg font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    support@promptmanage.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Enterprise Support
                  </CardTitle>
                  <CardDescription>Priority support for Enterprise customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    Dedicated support channel with guaranteed response times
                  </p>
                  <Link href="/pricing">
                    <Button className="w-full">Learn About Enterprise</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bug Report & Feedback */}
      <section className="border-t bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Report a Bug or Share Feedback</CardTitle>
                <CardDescription>
                  Help us improve Prompt Manage by reporting issues or suggesting new features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="feedback-type" className="mb-2 block text-sm font-medium">
                      Type
                    </label>
                    <select
                      id="feedback-type"
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option>Bug Report</option>
                      <option>Feature Request</option>
                      <option>General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="feedback-subject" className="mb-2 block text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="feedback-subject"
                      type="text"
                      placeholder="Brief description of your issue or suggestion"
                    />
                  </div>

                  <div>
                    <label htmlFor="feedback-message" className="mb-2 block text-sm font-medium">
                      Details
                    </label>
                    <Textarea
                      id="feedback-message"
                      rows={6}
                      placeholder="Please provide as much detail as possible. For bugs, include steps to reproduce, expected vs actual behavior, and any error messages."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Feedback
                  </Button>

                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    You can also email us directly at{' '}
                    <a href="mailto:support@promptmanage.com" className="text-blue-600 hover:underline">
                      support@promptmanage.com
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

