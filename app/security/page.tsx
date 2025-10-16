import { Eye, FileCheck, Key, Lock, Mail,Server, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Security & Privacy — Prompt Manage',
  description: 'Learn how Prompt Manage protects your data, prompts, and intellectual property with enterprise-grade security, encryption, and compliance.',
  keywords: ['security', 'privacy', 'data protection', 'encryption', 'GDPR', 'SOC 2', 'compliance'],
  openGraph: {
    title: 'Security & Privacy — Prompt Manage',
    description: 'Enterprise-grade security and privacy protection for your AI prompts and data.',
    type: 'website',
  },
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4">Security & Privacy</Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Your Data. Your Prompts.
              <span className="block text-blue-600 dark:text-blue-400">Protected.</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              At Prompt Manage, security and privacy are foundational to everything we build. We protect
              your data, your intellectual property, and your trust with enterprise-grade security measures.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/legal-center">
                <Button size="lg" variant="outline">
                  Legal Trust Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security Principles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Security Principles</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Built on industry best practices and enterprise-grade infrastructure
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-blue-600" />
                  <CardTitle>Zero Trust</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Every request is authenticated and authorized. No implicit trust.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="mb-2 h-8 w-8 text-blue-600" />
                  <CardTitle>End-to-End Encryption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Data encrypted in transit (TLS 1.3) and at rest (AES-256).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Eye className="mb-2 h-8 w-8 text-blue-600" />
                  <CardTitle>Full Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We never sell, share, or use your data for anything beyond providing our service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Data Encryption */}
      <section className="bg-blue-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <Lock className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold">Data Encryption</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your prompts and sensitive data are protected with military-grade encryption at every stage.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 text-xl font-semibold">Encryption in Transit</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✓</span>
                    <span>
                      <strong>TLS 1.3</strong> for all connections between your browser and our servers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✓</span>
                    <span>
                      <strong>HTTPS-only</strong> enforcement with HSTS (HTTP Strict Transport Security)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✓</span>
                    <span>
                      <strong>Certificate pinning</strong> to prevent man-in-the-middle attacks
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 text-xl font-semibold">Encryption at Rest</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✓</span>
                    <span>
                      <strong>AES-256</strong> encryption for all stored data (prompts, user info, metadata)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✓</span>
                    <span>
                      <strong>Encrypted database backups</strong> with secure key management
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">✓</span>
                    <span>
                      <strong>Row-level encryption</strong> for sensitive fields (API keys, credentials)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure & Backups */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <Server className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold">Infrastructure & Reliability</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Built on world-class infrastructure designed for security, performance, and availability.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Hosting & Infrastructure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Tier 1 Cloud Providers:</strong> Hosted on Vercel and Supabase with SOC 2 and
                      ISO 27001 certifications
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Multi-region deployment:</strong> Data centers in US and EU for compliance and
                      performance
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>DDoS protection:</strong> Enterprise-grade protection against attacks
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>99.9% uptime SLA</strong> for Enterprise plans
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backups & Disaster Recovery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Continuous backups:</strong> Automatic hourly backups of all data
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>30-day retention:</strong> Point-in-time recovery for the past 30 days
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Geo-redundant storage:</strong> Backups replicated across multiple regions
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Tested recovery procedures:</strong> Regular disaster recovery drills
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Access Controls */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <Key className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold">Access Controls & Permissions</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Granular control over who can access, view, edit, and share your prompts.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication & Authorization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Secure authentication:</strong> OAuth 2.0 via Google, GitHub, or email
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>SSO support:</strong> SAML 2.0 for Enterprise customers
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>2FA/MFA:</strong> Two-factor authentication for added security (coming soon)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Session management:</strong> Automatic logout after inactivity, device tracking
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Granular permissions:</strong> Owner, Admin, Editor, Viewer roles for teams
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Prompt-level sharing:</strong> Control who can view, edit, or run each prompt
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Public/private controls:</strong> Choose whether prompts are shared publicly or
                      kept private
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Audit logs:</strong> Track all access and modifications (Enterprise)
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Version History & Data Recovery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Automatic versioning:</strong> Every edit creates a new version
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Restore previous versions:</strong> Rollback to any past version
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Deletion protection:</strong> Soft deletes with 30-day recovery window
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <div>
                      <strong>Change tracking:</strong> See who made what changes and when
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <FileCheck className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold">Compliance & Certifications</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Meeting global standards for data protection, privacy, and security.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <Badge className="mb-2 w-fit">Active</Badge>
                  <CardTitle>GDPR Compliant</CardTitle>
                  <CardDescription>General Data Protection Regulation (EU)</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">
                    We comply with GDPR requirements for EU users, including:
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Data processing agreements (DPA)</li>
                    <li>• Right to access, export, and delete your data</li>
                    <li>• Data minimization and purpose limitation</li>
                    <li>• Breach notification within 72 hours</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <Badge className="mb-2 w-fit" variant="outline">
                    In Progress
                  </Badge>
                  <CardTitle>SOC 2 Type II</CardTitle>
                  <CardDescription>Security, Availability, Confidentiality</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">Currently undergoing SOC 2 Type II audit. Expected completion Q2 2025.</p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Independent third-party audit</li>
                    <li>• Security, availability, processing integrity</li>
                    <li>• Confidentiality and privacy controls</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Badge className="mb-2 w-fit" variant="outline">
                    Architecture Ready
                  </Badge>
                  <CardTitle>HIPAA Ready</CardTitle>
                  <CardDescription>Healthcare Data Protection</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">
                    Our infrastructure supports HIPAA compliance. BAAs available for Enterprise healthcare
                    customers.
                  </p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Encrypted data storage and transmission</li>
                    <li>• Access controls and audit logs</li>
                    <li>• Business Associate Agreements (BAA)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Badge className="mb-2 w-fit">Active</Badge>
                  <CardTitle>CCPA Compliant</CardTitle>
                  <CardDescription>California Consumer Privacy Act</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-3">California residents have additional privacy rights:</p>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Right to know what data we collect</li>
                    <li>• Right to delete personal information</li>
                    <li>• Right to opt-out of data sales (we never sell data)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Data Transparency */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">Our Data Transparency Commitment</h2>
            <div className="space-y-4 text-lg">
              <p className="leading-relaxed">
                <strong>We never sell your data.</strong> Your prompts, usage patterns, and personal
                information are never shared with third parties for marketing or advertising purposes.
              </p>
              <p className="leading-relaxed">
                <strong>We never train AI models on your prompts.</strong> Your intellectual property remains
                yours. We don't use your private prompts to train or improve AI models.
              </p>
              <p className="leading-relaxed">
                <strong>You own your data.</strong> You can export or delete all your data at any time. No
                lock-in. No hidden fees.
              </p>
              <p className="leading-relaxed">
                <strong>We're transparent about subprocessors.</strong> We only work with vetted,
                security-certified service providers. Full list available in our{' '}
                <Link href="/legal-center" className="underline">
                  Legal Trust Center
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <CardHeader>
                <div className="mb-4 flex items-center gap-3">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>Security Questions?</CardTitle>
                    <CardDescription>We're here to help</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  For security-related questions, vulnerability disclosures, or compliance inquiries, please
                  contact our security team:
                </p>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Security & Legal Inquiries
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
                <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                  <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Vulnerability Disclosure
                  </p>
                  <p className="text-lg font-semibold">
                    <a
                      href="mailto:security@promptmanage.com"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      security@promptmanage.com
                    </a>
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    We take security seriously. If you discover a vulnerability, please report it
                    responsibly.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Link href="/legal-center">
                    <Button variant="outline">Legal Trust Center</Button>
                  </Link>
                  <Link href="/privacy">
                    <Button variant="outline">Privacy Policy</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

