import { AlertCircle, ArrowLeft, Download, Shield,Trash2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Data Erasure Policy — Prompt Manage',
  description: 'How to request deletion of your account and data from Prompt Manage. Complete erasure process, timelines, and your data protection rights.',
  keywords: ['data erasure', 'account deletion', 'GDPR', 'right to be forgotten', 'delete account'],
  openGraph: {
    title: 'Data Erasure Policy — Prompt Manage',
    description: 'Your right to delete your data and account.',
    type: 'website',
  },
}

export default function DataErasurePage() {
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
                  <Trash2 className="h-8 w-8 text-blue-600" />
                  <Badge>Data Protection Rights</Badge>
                </div>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Data Erasure Policy</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Effective Date: January 1, 2025 | Last Updated: January 16, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Introduction */}
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
              <h2 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-100">
                Your Right to Data Erasure
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Under GDPR, CCPA, and other data protection laws, you have the right to request deletion of
                your personal data and account. Prompt Manage respects this right and provides a clear,
                straightforward process for account and data deletion.
              </p>
            </div>

            {/* Quick Overview */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">How Account Deletion Works</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-950">
                      1
                    </div>
                    <CardTitle className="text-lg">Request Deletion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Submit a deletion request via account settings or email
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-950">
                      2
                    </div>
                    <CardTitle className="text-lg">Export Your Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download all your prompts and data within 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-950">
                      3
                    </div>
                    <CardTitle className="text-lg">Complete Erasure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All data permanently deleted within 30 days
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Detailed Process */}
            <div className="mb-12 space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold">Complete Deletion Process</h2>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-blue-600" />
                        Step 1: Export Your Data (Optional but Recommended)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        Before requesting deletion, we recommend exporting all your data:
                      </p>
                      <ol className="list-decimal space-y-2 pl-5 text-gray-600 dark:text-gray-400">
                        <li>Go to Settings → Account → Data Export</li>
                        <li>
                          Click &quot;Export All Data&quot; to download a complete archive containing:
                          <ul className="ml-5 mt-2 list-disc space-y-1">
                            <li>All your prompts (public and private)</li>
                            <li>Prompt run history and results</li>
                            <li>Account settings and preferences</li>
                            <li>Team memberships and collaborations</li>
                          </ul>
                        </li>
                        <li>
                          Your export will be available as a downloadable ZIP file in JSON and CSV formats
                        </li>
                      </ol>
                      <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950">
                        <p className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span>
                            <strong>Important:</strong> Once your account is deleted, this data cannot be
                            recovered. Make sure to export anything you want to keep.
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-blue-600" />
                        Step 2: Request Account Deletion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        You can request account deletion in two ways:
                      </p>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                            Option A: Via Account Settings (Recommended)
                          </h4>
                          <ol className="list-decimal space-y-1 pl-5 text-gray-600 dark:text-gray-400">
                            <li>Log in to your Prompt Manage account</li>
                            <li>Navigate to Settings → Account → Delete Account</li>
                            <li>Review the deletion warning and confirm your decision</li>
                            <li>Enter your password to verify your identity</li>
                            <li>
                              Click &quot;Permanently Delete My Account&quot; to submit your deletion request
                            </li>
                          </ol>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                            Option B: Via Email
                          </h4>
                          <p className="mb-2 text-gray-600 dark:text-gray-400">
                            Send an email to{' '}
                            <a
                              href="mailto:legal@promptmanage.com"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              legal@promptmanage.com
                            </a>{' '}
                            with:
                          </p>
                          <ul className="list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
                            <li>Subject line: &quot;Account Deletion Request&quot;</li>
                            <li>Your registered email address</li>
                            <li>Account username or ID (if known)</li>
                            <li>Confirmation that you want to permanently delete your account and all data</li>
                          </ul>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            We will verify your identity and process your request within 5 business days.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Step 3: Verification & Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <p>After you submit your deletion request:</p>
                      <ol className="list-decimal space-y-2 pl-5">
                        <li>
                          You will receive a confirmation email acknowledging your request within 24 hours
                        </li>
                        <li>
                          We may ask you to verify your identity (e.g., confirm via email or re-enter
                          password)
                        </li>
                        <li>Your account will be immediately deactivated and inaccessible</li>
                        <li>
                          You have 30 days to change your mind and cancel the deletion request by contacting{' '}
                          <a
                            href="mailto:legal@promptmanage.com"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            legal@promptmanage.com
                          </a>
                        </li>
                        <li>
                          After 30 days, all your data will be permanently deleted from our systems and
                          backups
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* What Gets Deleted */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">What Data Gets Deleted</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    When you request account deletion, the following data is permanently erased:
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Account Information
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Email address</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Profile name and avatar</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Account settings and preferences</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Authentication tokens</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Prompt Data
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>All prompts (public and private)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Prompt run history</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Saved responses and outputs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Version history</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Team & Collaboration Data
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Team memberships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Shared prompts (your copies)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Collaboration history</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Usage & Analytics
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Usage statistics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Token consumption data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Activity logs</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Retention Exceptions */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Data Retention Exceptions</h2>
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                    <AlertCircle className="h-5 w-5" />
                    Limited Data Retention for Legal Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-yellow-900 dark:text-yellow-100">
                  <p>
                    In certain cases, we may retain minimal data even after account deletion to comply with
                    legal obligations:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <strong>Financial Records:</strong> Transaction history for tax and accounting purposes
                      (7 years, as required by law)
                    </li>
                    <li>
                      <strong>Fraud Prevention:</strong> Hashed identifiers to prevent abuse and fraud (90
                      days)
                    </li>
                    <li>
                      <strong>Legal Holds:</strong> Data subject to legal holds, court orders, or ongoing
                      investigations
                    </li>
                    <li>
                      <strong>Backups:</strong> Your data may persist in encrypted backups for up to 90 days
                      before automatic purging
                    </li>
                  </ul>
                  <p className="font-semibold">
                    Any retained data is anonymized where possible and secured with the same protections as
                    active data.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Deletion Timeline</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-950">
                        0
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">Deletion Request Submitted</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Account immediately deactivated. No further access.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-950">
                        1
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">Day 1</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Confirmation email sent. 30-day grace period begins.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-950">
                        30
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">Day 30</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          All data permanently deleted from production systems.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-950">
                        90
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">Day 90</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Data purged from all backups. Complete erasure confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Questions About Data Deletion?</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                    If you have questions about the deletion process, need help exporting your data, or want
                    to verify that your data has been deleted:
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
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      We respond to all data erasure inquiries within 5 business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-wrap gap-3 border-t pt-8">
              <Link href="/legal-center">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Legal Trust Center
                </Button>
              </Link>
              <Link href="/legal-center/dpa">
                <Button variant="outline">Data Protection Addendum</Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline">Privacy Policy</Button>
              </Link>
              <Link href="/settings">
                <Button>Go to Account Settings</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

