import { Folder, Megaphone, Rocket, Search, ShieldCheck, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import InteractivePromptLab from '@/components/InteractivePromptLab'
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section - split layout */}
        <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          {/* Left: Copy */}
          <div className="text-left">
            <h1 className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Prompt Libraries
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">for Marketing Teams</span>
            </h1>
            <p className="mb-6 max-w-xl text-lg text-gray-700 dark:text-gray-300 md:text-xl">
              Store and systemize prompts for ads, emails, landing pages, and socials. Keep brand
              voice consistent, share with your team, and ship campaigns faster.
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Folder className="h-4 w-4" /> Campaign libraries
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" /> Brand voice guardrails
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Users className="h-4 w-4" /> Team sharing
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
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-emerald-200/40 to-transparent blur-3xl dark:from-emerald-500/10" />
            <InteractivePromptLab />
          </div>
        </section>

        {/* Built for marketers and advertisers */}
        <section className="mt-12 md:mt-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Built for marketers and advertisers
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-100 p-4 dark:bg-emerald-900/40">
                  <Megaphone className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Campaign-ready libraries
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Group prompts by channel and campaign so the team can reuse what works.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-100 p-4 dark:bg-emerald-900/40">
                  <ShieldCheck className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Brand voice guardrails
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lock key instructions and share best-practice templates across the org.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-100 p-4 dark:bg-emerald-900/40">
                  <Rocket className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Test variations, ship faster
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Save variants, compare outcomes, and roll forward what performs.
                </p>
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
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{k}</div>
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
            Mike M., Co-Founder of MCA
          </div>
        </div>
      </div>
    </div>
  )
}
