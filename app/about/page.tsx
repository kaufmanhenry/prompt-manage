import { ArrowRight,Building2, CheckCircle, Shield, Sparkles, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Us — Prompt Manage',
  description: 'Learn about Prompt Manage\'s mission to make AI prompt management secure, collaborative, and reliable for teams and enterprises.',
  keywords: ['about', 'company', 'mission', 'values', 'team', 'prompt management'],
  openGraph: {
    title: 'About Us — Prompt Manage',
    description: 'Making AI prompt management secure, collaborative, and reliable.',
    type: 'website',
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description:
        'We believe in open, honest communication. Our policies, pricing, and practices are clear and accessible. No hidden fees, no data tricks.',
    },
    {
      icon: CheckCircle,
      title: 'Security',
      description:
        'Your data and intellectual property are sacred. We build with security first — from encryption to compliance to infrastructure design.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description:
        'Great ideas happen when teams work together. We design for teamwork, shared knowledge, and collective progress.',
    },
    {
      icon: Sparkles,
      title: 'Simplicity',
      description:
        'AI is complex. Your tools shouldn\'t be. We prioritize intuitive design, clear workflows, and reducing cognitive load.',
    },
  ]

  const contacts = [
    {
      title: 'Legal & Compliance',
      email: 'legal@promptmanage.com',
      description: 'For contracts, DPAs, and compliance inquiries',
    },
    {
      title: 'General Support',
      email: 'support@promptmanage.com',
      description: 'For product questions and technical help',
    },
    {
      title: 'Enterprise Sales',
      email: 'enterprise@promptmanage.com',
      description: 'For custom plans and partnership opportunities',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-white text-blue-600">About Prompt Manage</Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              Making AI prompt management secure, collaborative, and reliable.
            </h1>
            <p className="text-xl leading-relaxed md:text-2xl">
              We&apos;re building the infrastructure for teams and enterprises to manage their most valuable AI
              assets — prompts — with confidence and control.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">Why We Built Prompt Manage</h2>

            <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                In early 2024, we saw a pattern emerging across organizations adopting AI: teams were
                struggling to manage their prompts.
              </p>

              <p>
                Engineers stored prompts in scattered Slack threads. Marketing teams copy-pasted from Google
                Docs. Product managers lost track of which prompt version worked best. There was no version
                control, no collaboration, no security — just chaos.
              </p>

              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Prompts were becoming critical business assets, but there was no reliable way to manage
                them.
              </p>

              <p>
                We built Prompt Manage to solve this. A platform designed specifically for storing,
                versioning, sharing, and collaborating on AI prompts — with the security and reliability
                enterprises demand.
              </p>

              <p>
                Today, Prompt Manage helps teams across marketing, engineering, product, and operations
                organize their AI workflows, protect their intellectual property, and scale their use of AI
                with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <blockquote className="text-2xl font-medium italic leading-relaxed md:text-3xl">
              &quot;Prompts are the new code. They deserve the same level of version control, collaboration, and
              security that we give to our software. That&apos;s what we&apos;re building.&quot;
            </blockquote>
            <p className="mt-6 text-lg">
              — <strong>Mike Moloney</strong>, Founder & CEO, Prompt Manage
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Core Values</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The principles that guide everything we build
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="border-blue-200 transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-900"
                >
                  <CardHeader>
                    <div className="mb-4 w-fit rounded-lg bg-blue-100 p-3 dark:bg-blue-950">
                      <value.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-center gap-3">
              <Building2 className="h-10 w-10 text-blue-600" />
              <h2 className="text-3xl font-bold">Company Information</h2>
            </div>

            <Card className="mx-auto max-w-2xl">
              <CardContent className="space-y-6 pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Prompt Manage LLC
                  </p>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Boston, Massachusetts</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-4 text-center text-lg font-semibold">Leadership</h3>
                  <div className="text-center">
                    <p className="font-medium">Mike Moloney</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Founder & CEO</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-4 text-center text-lg font-semibold">Get in Touch</h3>
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div key={contact.email} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <p className="mb-1 font-semibold">{contact.title}</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {contact.email}
                        </a>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {contact.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Security & Compliance</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">GDPR Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Full compliance with EU data protection regulations
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-2">
                    In Progress
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Third-party security audit expected Q2 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">CCPA Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    California privacy rights fully supported
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Link href="/security">
                <Button variant="outline">
                  View Full Security Overview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Explore how Prompt Manage can power your AI workflows.
            </h2>
            <p className="mb-8 text-xl">
              Join teams and enterprises using Prompt Manage to organize, secure, and scale their AI
              operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/product">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
