import { Database, FileText, Globe, Lock, Mail,Scale, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Legal Trust Center — Prompt Manage',
  description: 'Access all legal and compliance documentation for Prompt Manage. Transparent policies for data protection, privacy, security, and terms of service.',
  keywords: ['legal', 'compliance', 'GDPR', 'privacy policy', 'terms of service', 'data protection'],
  openGraph: {
    title: 'Legal Trust Center — Prompt Manage',
    description: 'Transparent legal and compliance documentation.',
    type: 'website',
  },
}

export default function LegalCenterPage() {
  const legalDocuments = [
    {
      title: 'Terms of Service',
      description: 'Understand your rights and responsibilities when using Prompt Manage.',
      icon: Scale,
      href: '/terms',
      badge: 'Updated Jan 2025',
      protection: 'Defines the agreement between you and Prompt Manage, including account responsibilities, acceptable use, intellectual property rights, and service limitations.',
    },
    {
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information.',
      icon: Lock,
      href: '/privacy',
      badge: 'Updated Jan 2025',
      protection: 'Explains what data we collect, why we collect it, how we use it, and your rights to access, modify, or delete your personal information.',
    },
    {
      title: 'GDPR & Data Protection',
      description: 'EU data protection compliance and your privacy rights.',
      icon: Shield,
      href: '/legal-center/dpa',
      badge: 'GDPR Compliant',
      protection: 'Details our compliance with GDPR requirements, including data processing agreements, lawful bases for processing, and your rights under EU data protection law.',
    },
    {
      title: 'Data Erasure Policy',
      description: 'How to request deletion of your data and what happens next.',
      icon: Database,
      href: '/legal-center/data-erasure',
      badge: 'Right to Delete',
      protection: 'Outlines the process for requesting complete deletion of your account and data, including timelines, data retention requirements, and exceptions.',
    },
    {
      title: 'Security Overview',
      description: 'Enterprise-grade security measures protecting your prompts.',
      icon: Shield,
      href: '/security',
      badge: 'SOC 2 In Progress',
      protection: 'Comprehensive overview of encryption, infrastructure security, access controls, compliance certifications, and our commitment to data protection.',
    },
    {
      title: 'Subprocessors & Partners',
      description: 'Third-party services we use to deliver Prompt Manage.',
      icon: Globe,
      href: '/legal-center/subprocessors',
      badge: 'Transparency',
      protection: 'Full disclosure of all third-party service providers with access to customer data, including their roles, locations, and security certifications.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4">Legal & Compliance</Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Legal Trust Center
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              At Prompt Manage, <strong>trust starts with transparency</strong>. Access all our legal
              documentation, compliance certifications, and data protection policies in one place.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're committed to protecting your data, respecting your privacy, and maintaining the highest
              standards of security and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Documents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="mb-4 text-3xl font-bold">Legal Documentation</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Comprehensive policies and agreements governing your use of Prompt Manage
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {legalDocuments.map((doc) => (
                <Card key={doc.href} className="transition-all hover:border-blue-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <doc.icon className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">{doc.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{doc.title}</CardTitle>
                    <CardDescription className="text-base">{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{doc.protection}</p>
                    <Link href={doc.href}>
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Read Document
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Each Policy Protects You */}
      <section className="bg-blue-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">How We Protect You</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-blue-600" />
                    Terms of Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Clear boundaries:</strong> Defines what you can and can't do, preventing
                      ambiguity
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>IP protection:</strong> You retain ownership of all your prompts and content
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Fair use:</strong> No hidden fees, no surprise limitations, no lock-in
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Data minimization:</strong> We only collect what's necessary to provide our
                      service
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>No selling or sharing:</strong> Your data is never sold to third parties
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Full transparency:</strong> Clear explanation of every data practice
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    GDPR & Data Protection Addendum
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>EU compliance:</strong> Full GDPR compliance for European users
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Data processing agreements:</strong> Formal DPAs available for Enterprise
                      customers
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Your rights:</strong> Access, rectification, erasure, portability, and
                      objection
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Data Erasure Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Complete deletion:</strong> Request full account and data deletion at any time
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>30-day processing:</strong> All data permanently deleted within 30 days
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      <strong>Export first:</strong> Download all your data before deletion
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Compliance & Certifications</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <Badge className="mx-auto mb-2 w-fit">Active</Badge>
                  <CardTitle>GDPR</CardTitle>
                  <CardDescription>EU Data Protection</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Badge className="mx-auto mb-2 w-fit">Active</Badge>
                  <CardTitle>CCPA</CardTitle>
                  <CardDescription>California Privacy Rights</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Badge className="mx-auto mb-2 w-fit" variant="outline">
                    Q2 2025
                  </Badge>
                  <CardTitle>SOC 2 Type II</CardTitle>
                  <CardDescription>Security Audit</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-blue-600" />
            <h2 className="mb-4 text-3xl font-bold">Questions About Legal or Compliance?</h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Our legal and compliance team is here to help with contracts, data processing agreements, or
              any policy questions.
            </p>

            <Card className="mx-auto max-w-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Legal & Compliance Inquiries
                    </p>
                    <a
                      href="mailto:legal@promptmanage.com"
                      className="text-xl font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      legal@promptmanage.com
                    </a>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For data protection officers, DPA requests, or enterprise compliance questions, please
                      use the above email.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/security">
                <Button variant="outline">Security Overview</Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline">Privacy Policy</Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline">Terms of Service</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

