import { ArrowRight, Building2, CheckCircle, Shield, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us — Prompt Manage',
  description:
    "Learn about Prompt Manage's mission to make AI prompt management secure, collaborative, and reliable for teams and enterprises.",
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
      icon: CheckCircle,
      title: 'Simplicity',
      description:
        "AI is complex. Your tools shouldn't be. We prioritize intuitive design, clear workflows, and reducing cognitive load.",
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              About Prompt Manage
            </h1>
            <p className="text-lg leading-7 text-muted-foreground md:text-xl">
              We&apos;re building the infrastructure for teams and enterprises to manage their most
              valuable AI assets — prompts — with confidence and control.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Why We Built Prompt Manage
          </h2>

          <div className="space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              In early 2024, we saw a pattern emerging across organizations adopting AI: teams were
              struggling to manage their prompts.
            </p>

            <p>
              Engineers stored prompts in scattered Slack threads. Marketing teams copy-pasted from
              Google Docs. Product managers lost track of which prompt version worked best. There
              was no version control, no collaboration, no security — just chaos.
            </p>

            <p className="font-semibold text-foreground">
              Prompts were becoming critical business assets, but there was no reliable way to
              manage them.
            </p>

            <p>
              We built Prompt Manage to solve this. A platform designed specifically for storing,
              versioning, sharing, and collaborating on AI prompts — with the security and
              reliability enterprises demand.
            </p>

            <p>
              Today, Prompt Manage helps teams across marketing, engineering, product, and
              operations organize their AI workflows, protect their intellectual property, and scale
              their use of AI with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/henry-mike-boston-lunch.jpg"
                alt="Henry and Mike working on Prompt Manage in Boston"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 672px, 768px"
              />
            </div>
            <div className="border-t border-border bg-muted px-6 py-4 text-center">
              <p className="text-sm italic text-muted-foreground">
                Henry and Mike working on Prompt Manage in Boston while munching some Trader
                Joe&apos;s for lunch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <blockquote className="text-2xl font-medium italic leading-relaxed sm:text-3xl">
              &quot;We&apos;re building the CMS for your prompts. The first native prompt management
              tool for teams, large and small, who need a better way to safely and securely share AI
              prompts across their org.&quot;
            </blockquote>
            <p className="mt-6 text-base text-muted-foreground">
              — <strong className="font-semibold">Mike Moloney</strong>, Founder & CEO, Prompt
              Manage
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Core Values</h2>
            <p className="text-base text-muted-foreground">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="relative overflow-hidden rounded-lg border border-border bg-card p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center">
                    <div className="rounded-lg border-2 border-border bg-muted p-3">
                      <value.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center justify-center gap-3">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Company Information
              </h2>
            </div>

            <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-2xl font-semibold">Prompt Manage LLC</p>
                  <p className="mt-2 text-base text-muted-foreground">Boston, Massachusetts</p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-center text-lg font-semibold">Leadership</h3>
                  <div className="grid gap-6 text-center sm:grid-cols-2">
                    <div>
                      {/* Photo will be added once uploaded */}
                      <p className="font-medium">Mike Moloney</p>
                      <p className="text-sm text-muted-foreground">Co-Founder & CEO</p>
                    </div>
                    <div>
                      {/* Photo will be added once uploaded */}
                      <p className="font-medium">Henry Kaufman</p>
                      <p className="text-sm text-muted-foreground">Co-Founder & CPO</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-center text-lg font-semibold">Get in Touch</h3>
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div
                        key={contact.email}
                        className="rounded-lg border border-border bg-muted p-4"
                      >
                        <p className="mb-1 font-semibold">{contact.title}</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          {contact.email}
                        </a>
                        <p className="mt-1 text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Security & Compliance
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Full compliance with EU data protection regulations
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">CCPA Compliant</h3>
              <p className="text-sm text-muted-foreground">
                California privacy rights fully supported
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">Enterprise Infrastructure</h3>
              <p className="text-sm text-muted-foreground">
                Built on certified platforms (Vercel, Supabase, Stripe)
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/security">
              <Button variant="outline" className="gap-2">
                View Full Security Overview
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore how Prompt Manage can power your AI workflows
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join teams and enterprises using Prompt Manage to organize, secure, and scale their AI
              operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/product">
                <Button size="lg" variant="outline" className="gap-2">
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
