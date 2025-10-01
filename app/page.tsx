import { Folder, Megaphone, Rocket, Search, ShieldCheck, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import InteractivePromptLab from '@/components/InteractivePromptLab'
import RotatingAudience from '@/components/RotatingAudience'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Prompt Manage — Prompt Libraries for Marketing Teams',
  description:
    'Ship campaigns faster with organized prompt libraries tailored for marketing teams. Create, test, and collaborate on prompts for ads, emails, landing pages, and social content.',
  keywords:
    'AI prompts, prompt management, ChatGPT prompts, Claude prompts, AI tools, prompt sharing, team collaboration, prompt testing, version control',
  authors: [{ name: 'Prompt Manage' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://promptmanage.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Prompt Manage — Prompt Libraries for Marketing Teams',
    description:
      'Ship campaigns faster with organized prompt libraries tailored for marketing teams. Create, test, and collaborate on prompts for ads, emails, landing pages, and social content.',
    url: 'https://promptmanage.com',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage - AI Prompt Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Manage — Prompt Libraries for Marketing Teams',
    description:
      'Ship campaigns faster with organized prompt libraries tailored for marketing teams. Create, test, and collaborate on prompts for ads, emails, landing pages, and social content.',
    images: ['https://promptmanage.com/og-image.svg'],
    creator: '@promptmanage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Allow logged-in users to view the homepage; no redirect to dashboard

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        {/* Hero Section - split layout */}
        <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          {/* Left: Copy */}
          <div className="text-left">
            <h1 className="mb-6 text-[clamp(1.75rem,5vw,3.1rem)] font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white md:text-[clamp(2rem,4.4vw,3.4rem)] xl:text-[clamp(2.125rem,3.6vw,3.5rem)]">
              <span className="block">Prompt Management</span>
              <span className="block">for </span>
              <RotatingAudience
                className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-500 bg-clip-text text-transparent"
                intervalMs={3000}
                items={[
                  'Marketing Teams',
                  'Creative Studios',
                  'Advertising Agencies',
                  'Editorial Teams',
                  'Customer Support',
                ]}
              />
            </h1>
            <p className="mb-3 max-w-xl text-lg leading-7 text-gray-700 dark:text-gray-300 md:text-xl">
              Create, manage, and run AI prompts. All in one place. With the Prompt Lab you can
              generate incredible and efficient prompts for emails, ads, landing pages, social
              media, blogs, and much more.
            </p>
            <p className="mb-6 max-w-xl text-lg leading-7 text-gray-700 dark:text-gray-300 md:text-xl">
              Keep brand voice consistent and ship campaigns faster using Prompt Manage.
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800/50 dark:text-gray-200">
                <Folder className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> Campaign
                libraries
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800/50 dark:text-gray-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> Brand
                voice guardrails
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800/50 dark:text-gray-200">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> Team sharing
              </span>
            </div>
            {session ? (
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="px-7 py-6 text-base">
                    Open your Library
                  </Button>
                </Link>
                <Link href="/p">
                  <Button variant="outline" size="lg" className="px-7 py-6 text-base">
                    <Search className="mr-2 h-5 w-5" /> Browse Templates
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <GoogleSignInButton
                  redirectPath="/dashboard"
                  size="lg"
                  className="px-7 py-6 text-base"
                >
                  Start Free
                </GoogleSignInButton>
                <Link href="/p">
                  <Button variant="outline" size="lg" className="px-7 py-6 text-base">
                    <Search className="mr-2 h-5 w-5" /> Browse Templates
                  </Button>
                </Link>
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Popular models:</span>
              {[
                'gpt-4',
                'gpt-4o',
                'Claude 4 Opus',
                'Gemini 2.5 Pro',
                'Llama 4 Series',
                'Mistral Large',
              ].map((m) => (
                <Badge key={m} variant="outline" className="px-2 py-0.5 text-[10px]">
                  {m}
                </Badge>
              ))}
              <Link
                href="/models"
                className="ml-1 text-xs text-emerald-700 hover:underline dark:text-emerald-300"
              >
                Models →
              </Link>
            </div>
          </div>

          {/* Right: Team Prompt Workspace (broader across personas) */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-gray-200/50 via-gray-100/40 to-transparent blur-3xl dark:from-gray-700/20 dark:via-gray-800/10" />
            <InteractivePromptLab />
          </div>
        </section>

        {/* Use Case Workflows */}
        <section className="mt-12 md:mt-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              How teams ship campaigns faster
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Campaign Manager Workflow */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <Megaphone className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Campaign Manager
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sets up libraries</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Creates "Q4 Holiday Campaign" library</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Adds proven email subject templates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Shares with team → 2x faster setup</span>
                  </div>
                </div>
              </div>

              {/* Content Creator Workflow */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <Rocket className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Content Creator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uses templates</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Opens "Social Media" library</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Runs Instagram caption prompt</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Gets 5 variations → picks best</span>
                  </div>
                </div>
              </div>

              {/* Team Lead Workflow */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Team Lead</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Scales best practices
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Reviews winning prompts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Adds to "Proven Templates"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Team ships 30% faster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Outcome metrics strip */}
        <section className="mt-12">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ['2x', 'faster campaign turnaround'],
              ['30%', 'lift in CTR from testing'],
              ['100%', 'brand voice consistency'],
              ['100s', 'of hours saved'],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{k}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 md:mt-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
              How it works
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Create libraries',
                  desc: 'Set up collections for Ads, Email, Social, and more.',
                },
                {
                  title: 'Save prompts & variants',
                  desc: 'Keep winning prompts and test new angles safely.',
                },
                {
                  title: 'Share & ship',
                  desc: 'Invite teammates, share links, and ship campaigns faster.',
                },
              ].map((s, i) => (
                <div
                  key={s.title}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/pricing">
                <Button size="lg">See Pricing</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <Separator className="mx-auto my-12 max-w-xs" />
        <div className="mx-auto max-w-3xl pb-16 text-center">
          <blockquote className="text-xl leading-relaxed text-gray-900 dark:text-white md:text-2xl">
            “Prompt Manage turned our scattered prompt docs into a single source of truth. Our team
            ships campaigns noticeably faster with more consistent copy.”
          </blockquote>
          <div className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Michael Moloney, Co-Founder of{' '}
            <a
              href="https://moloneycreativeagency.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-emerald-300/50 underline-offset-2 hover:decoration-emerald-400"
            >
              MCA
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
