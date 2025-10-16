import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Server, Database, Zap, Shield, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Subprocessors & Partners — Prompt Manage',
  description: 'Complete list of third-party service providers and subprocessors used by Prompt Manage to deliver our services.',
  keywords: ['subprocessors', 'third-party services', 'data processors', 'partners', 'vendors'],
  openGraph: {
    title: 'Subprocessors & Partners — Prompt Manage',
    description: 'Transparent disclosure of all third-party service providers.',
    type: 'website',
  },
}

interface Subprocessor {
  name: string
  website: string
  location: string
  purpose: string
  dataProcessed: string[]
  certifications: string[]
  icon: React.ComponentType<{ className?: string }>
  category: string
}

export default function SubprocessorsPage() {
  const subprocessors: Subprocessor[] = [
    {
      name: 'Vercel Inc.',
      website: 'https://vercel.com',
      location: 'United States (US-East)',
      purpose: 'Application hosting, content delivery, and edge functions',
      dataProcessed: [
        'Application code and static assets',
        'Server logs and analytics',
        'User session data (temporary)',
        'API request/response data (in transit)',
      ],
      certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant'],
      icon: Zap,
      category: 'Infrastructure',
    },
    {
      name: 'Supabase Inc.',
      website: 'https://supabase.com',
      location: 'United States (Multi-region available)',
      purpose: 'Database hosting, authentication, and real-time data sync',
      dataProcessed: [
        'User account information (email, name)',
        'Prompt content and metadata',
        'User profiles and settings',
        'Authentication tokens',
        'Prompt run history and analytics',
      ],
      certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'HIPAA Ready'],
      icon: Database,
      category: 'Database & Auth',
    },
    {
      name: 'OpenAI LLC',
      website: 'https://openai.com',
      location: 'United States',
      purpose: 'AI model API services for prompt execution and improvement',
      dataProcessed: [
        'Prompt text submitted by users',
        'Model responses and completions',
        'API usage metadata (tokens, latency)',
      ],
      certifications: ['SOC 2 Type II', 'GDPR Compliant', 'Data Processing Agreement Available'],
      icon: Server,
      category: 'AI Services',
    },
    {
      name: 'Google LLC',
      website: 'https://cloud.google.com',
      location: 'United States (Global infrastructure)',
      purpose: 'OAuth authentication and user identity verification',
      dataProcessed: [
        'Email address',
        'Profile name and avatar',
        'OAuth tokens (encrypted)',
      ],
      certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'HIPAA Compliant'],
      icon: Shield,
      category: 'Authentication',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="border-b bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <Link href="/legal-center">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Legal Trust Center
              </Button>
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <Badge>Transparency Report</Badge>
                </div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Subprocessors & Service Providers</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Last Updated: January 16, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
              <h2 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-100">
                Our Commitment to Transparency
              </h2>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                Prompt Manage is committed to full transparency about the third-party service providers
                (&quot;subprocessors&quot;) we use to deliver our services. This page lists all subprocessors that may
                process customer data, their locations, and the purpose for which we use them.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                All subprocessors are bound by data protection agreements that meet or exceed GDPR requirements.
                We will notify customers at least 30 days in advance of adding or replacing any subprocessor.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Current Subprocessors</h2>
              <p className="text-gray-600 dark:text-gray-400">
                As of January 16, 2025, Prompt Manage uses the following subprocessors:
              </p>
            </div>

            {/* Subprocessors List */}
            <div className="space-y-6">
              {subprocessors.map((subprocessor) => (
                <Card key={subprocessor.name} className="border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
                          <subprocessor.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{subprocessor.name}</CardTitle>
                          <CardDescription>
                            <a
                              href={subprocessor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {subprocessor.website}
                            </a>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{subprocessor.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Location
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subprocessor.location}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Purpose
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{subprocessor.purpose}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Data Processed
                      </h4>
                      <ul className="space-y-1">
                        {subprocessor.dataProcessed.map((data, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="mt-0.5 text-blue-600">•</span>
                            <span>{data}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Security Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subprocessor.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Change Notification Policy */}
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">Change Notification Policy</h2>
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>Adding New Subprocessors:</strong> We will notify all customers via email at
                      least 30 days before engaging a new subprocessor that will process customer data. The
                      notification will include the subprocessor&apos;s name, location, purpose, and the types of
                      data they will process.
                    </p>
                    <p>
                      <strong>Right to Object:</strong> Customers may object to the use of a new subprocessor
                      on reasonable data protection grounds by contacting{' '}
                      <a
                        href="mailto:legal@promptmanage.com"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        legal@promptmanage.com
                      </a>{' '}
                      within 30 days of receiving notification.
                    </p>
                    <p>
                      <strong>Current List Maintenance:</strong> This page is the authoritative source for our
                      current list of subprocessors. We update it immediately when changes occur and maintain a
                      changelog below.
                    </p>
                    <p>
                      <strong>Enterprise Customers:</strong> Enterprise customers can request custom data
                      processing agreements (DPAs) that include specific subprocessor restrictions or
                      requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Changelog */}
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">Subprocessor Changelog</h2>
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        January 16, 2025
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Initial publication of subprocessor list. No changes to existing subprocessors.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Residency Options */}
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">Data Residency Options</h2>
              <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                <CardContent className="pt-6">
                  <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    <strong>EU Data Residency:</strong> Enterprise customers can request that their data be
                    processed and stored exclusively within the European Economic Area (EEA). This option
                    requires:
                  </p>
                  <ul className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Supabase EU region for database hosting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Vercel EU edge network for application hosting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>
                        Standard Contractual Clauses (SCCs) for any data transfers outside the EEA
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Contact{' '}
                    <a
                      href="mailto:enterprise@promptmanage.com"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      enterprise@promptmanage.com
                    </a>{' '}
                    to discuss EU data residency options and pricing.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <div className="mt-12">
              <h2 className="mb-4 text-2xl font-bold">Questions About Subprocessors?</h2>
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    For questions about our subprocessors, data processing agreements, or to request
                    additional information for your security or compliance review:
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Legal & Compliance Team
                    </p>
                    <p className="text-lg font-semibold">
                      <a
                        href="mailto:legal@promptmanage.com"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        legal@promptmanage.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer Navigation */}
            <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
              <Link href="/legal-center">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Legal Trust Center
                </Button>
              </Link>
              <Link href="/legal-center/dpa">
                <Button variant="outline">Data Protection Addendum</Button>
              </Link>
              <Link href="/security">
                <Button variant="outline">Security Overview</Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline">Privacy Policy</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

