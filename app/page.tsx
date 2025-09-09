import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Users, Rocket, Megaphone, ShieldCheck, Folder, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'

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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - split layout */}
        <section className="py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Copy */}
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.05] tracking-tight">
              Prompt Libraries
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">for Marketing Teams</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-xl">
              Store and systemize prompts for ads, emails, landing pages, and socials. Keep brand voice consistent, share with your team, and ship campaigns faster.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><Folder className="w-4 h-4" /> Campaign libraries</span>
              <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><ShieldCheck className="w-4 h-4" /> Brand voice guardrails</span>
              <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><Users className="w-4 h-4" /> Team sharing</span>
            </div>
            {session ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="text-base px-7 py-6">Open your Library</Button>
                </Link>
                <Link href="/p">
                  <Button variant="outline" size="lg" className="text-base px-7 py-6"><Search className="mr-2 h-5 w-5" /> Browse Templates</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/auth/signup">
                  <Button size="lg" className="text-base px-7 py-6">Start Free</Button>
                </Link>
                <Link href="/p">
                  <Button variant="outline" size="lg" className="text-base px-7 py-6"><Search className="mr-2 h-5 w-5" /> Browse Templates</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right: Abstract UI preview - Prompt Workspace */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-200/40 to-transparent dark:from-emerald-500/10 blur-3xl rounded-3xl" />
            <div className="mx-auto max-w-md rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 bg-white dark:bg-gray-900 p-5 shadow-sm ring-1 ring-emerald-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Prompt Workspace</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Acme Marketing</span>
              </div>
              <Tabs defaultValue="editor">
                <TabsList className="mb-3">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3">
                    <pre className="text-[11px] leading-5 text-gray-800 dark:text-gray-200 overflow-x-auto">
{`Goal: Generate 10 Google Ads headlines (≤ 30 chars)
Audience: {audience}
Product: {product}
Benefit: {benefit}
Tone: {tone}

Instructions:
- Use direct response style
- Include one curiosity angle
- Avoid clickbait`}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="variables">
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    {[
                      ['{product}', 'Prompt Manage'],
                      ['{audience}', 'Ecommerce marketers'],
                      ['{benefit}', 'Higher ROAS from better copy'],
                      ['{tone}', 'Confident, helpful'],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-950">
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{k}</div>
                        <div className="text-xs text-gray-900 dark:text-gray-100">{v}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="results">
                  <div className="space-y-2">
                    {[
                      'Ship campaigns 2x faster with consistent copy',
                      'Turn prompts into on-brand ads in minutes',
                      'Keep ROAS growing with reusable ad angles',
                      'Stop hunting docs—use a single prompt library',
                    ].map((line) => (
                      <div key={line} className="flex items-start gap-2 text-[12px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                        <span className="text-gray-800 dark:text-gray-200">{line}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Built for marketers and advertisers */}
        <section className="mt-12 md:mt-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">Built for marketers and advertisers</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Megaphone className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Campaign-ready libraries</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Group prompts by channel and campaign so the team can reuse what works.</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Brand voice guardrails</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Lock key instructions and share best-practice templates across the org.</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Test variations, ship faster</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Save variants, compare outcomes, and roll forward what performs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcome metrics strip */}
        <section className="mt-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['2x', 'faster campaign turnaround'],
              ['30%', 'lift in CTR from testing'],
              ['100%', 'brand voice consistency'],
              ['0', 'time lost hunting prompts'],
            ].map(([k, v]) => (
              <div key={k} className="text-center border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-900">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{k}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 md:mt-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Create libraries', desc: 'Set up collections for Ads, Email, Social, and more.' },
                { title: 'Save prompts & variants', desc: 'Keep winning prompts and test new angles safely.' },
                { title: 'Share & ship', desc: 'Invite teammates, share links, and ship campaigns faster.' },
              ].map((s, i) => (
                <div key={s.title} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                  <div className="h-7 w-7 rounded-md bg-emerald-600 text-white flex items-center justify-center text-sm font-bold mb-3">{i + 1}</div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/pricing"><Button size="lg">See Pricing</Button></Link>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <Separator className="my-12 max-w-xs mx-auto" />
        <div className="max-w-3xl mx-auto text-center pb-16">
          <blockquote className="text-xl md:text-2xl text-gray-900 dark:text-white leading-relaxed">
            “Prompt Manage turned our scattered prompt docs into a single source of truth. Our team ships campaigns noticeably faster with more consistent copy.”
          </blockquote>
          <div className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-300">Mike M., Co-Founder of MCA</div>
        </div>
      </div>
    </div>
  )
}
