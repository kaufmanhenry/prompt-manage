'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AGENT_FEATURES = [
  {
    title: 'Autonomous Content Generation',
    description: 'Agents run 24/7 creating high-quality content on autopilot',
    icon: '🤖',
    benefits: [
      'Generate blog posts, emails, social media content automatically',
      'Run on schedule (hourly, daily, weekly)',
      'Quality controls ensure brand consistency',
      'Scale to 100s of content pieces per day'
    ]
  },
  {
    title: 'Smart Quality Control',
    description: 'Built-in quality checks ensure every piece meets your standards',
    icon: '✅',
    benefits: [
      'Set forbidden phrases and required key phrases',
      'Define brand voice and style guidelines',
      'Automatic quality scoring (0-1)',
      'Optional manual review before publishing'
    ]
  },
  {
    title: '17 Output Types',
    description: 'Agents can create any type of content you need',
    icon: '📝',
    benefits: [
      'Blog posts, documentation, emails, social media',
      'Code snippets, tutorials, whitepapers',
      'Landing pages, product descriptions, ads',
      'Custom output types for your specific needs'
    ]
  },
  {
    title: 'Department Organization',
    description: 'Organize agents by team and function',
    icon: '🏢',
    benefits: [
      'Marketing, Support, Sales, Engineering, Content',
      'Legal, Design, Product, Operations departments',
      'Filter and manage agents by department',
      'Team-specific configurations and standards'
    ]
  }
]

const AGENT_EXAMPLES = [
  {
    name: 'Marketing Blog Writer',
    department: 'Marketing',
    icon: '📊',
    description: 'Generates 2 SEO-optimized blog posts per day',
    config: {
      outputType: 'Blog Post',
      frequency: 'Daily (2x)',
      tone: 'Professional but conversational',
      length: '800-1200 words'
    },
    results: '60 blog posts/month, 89% quality score, $12/month cost'
  },
  {
    name: 'Customer Support FAQ Agent',
    department: 'Support',
    icon: '💬',
    description: 'Creates help articles from support tickets',
    config: {
      outputType: 'Documentation',
      frequency: 'Daily',
      tone: 'Friendly and helpful',
      length: '500-800 words'
    },
    results: '30 help articles/month, 92% quality score, deflects 40% of tickets'
  },
  {
    name: 'Social Media Manager',
    department: 'Marketing',
    icon: '📱',
    description: 'Posts 4x daily across Twitter, LinkedIn, Instagram',
    config: {
      outputType: 'Social Media',
      frequency: 'Daily (4x)',
      tone: 'Engaging and authentic',
      length: 'Platform-optimized'
    },
    results: '120 posts/month, 95% quality score, 3x engagement'
  },
  {
    name: 'Code Documentation Agent',
    department: 'Engineering',
    icon: '💻',
    description: 'Auto-documents APIs and generates technical guides',
    config: {
      outputType: 'Documentation',
      frequency: 'Weekly',
      tone: 'Clear and technical',
      length: 'Comprehensive'
    },
    results: '8 technical docs/month, saves 10 hours/week'
  },
  {
    name: 'Email Campaign Agent',
    department: 'Marketing',
    icon: '📧',
    description: 'Creates email nurture sequences and campaigns',
    config: {
      outputType: 'Email',
      frequency: 'Weekly',
      tone: 'Persuasive and friendly',
      length: 'Medium (400-600 words)'
    },
    results: '4 email sequences/month, 25% open rate improvement'
  },
  {
    name: 'Product Description Writer',
    department: 'Sales',
    icon: '🏷️',
    description: 'Writes compelling product descriptions for ecommerce',
    config: {
      outputType: 'Product Description',
      frequency: 'Daily (10x)',
      tone: 'Benefit-driven',
      length: 'Concise (200-300 words)'
    },
    results: '300 descriptions/month, 15% conversion increase'
  }
]

const PRICING_COMPARISON = [
  {
    approach: 'Hiring Content Writer',
    cost: '$3,000-$5,000/month',
    output: '20-30 pieces/month',
    quality: 'Variable',
    availability: '40 hours/week'
  },
  {
    approach: 'Freelance Writers',
    cost: '$100-$300 per piece',
    output: 'As needed',
    quality: 'Inconsistent',
    availability: 'Limited'
  },
  {
    approach: 'AI Agents (Our Platform)',
    cost: '$29-$99/month',
    output: '100s of pieces/month',
    quality: '85%+ quality score',
    availability: '24/7 automated',
    highlight: true
  }
]

export default function AIAgentsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-16 dark:from-gray-900 dark:to-gray-800 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4">Autonomous AI Agents</Badge>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                Your 24/7 Content Creation
                <span className="text-purple-600 dark:text-purple-400"> Team</span>
              </h1>
              <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                Build AI agents that automatically create blog posts, emails, social media,
                documentation, and more — while you sleep. With quality controls, brand guidelines,
                and department organization.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard/agents">
                  <Button size="lg">
                    Build Your First Agent
                  </Button>
                </Link>
                <Link href="/use-cases">
                  <Button size="lg" variant="outline">
                    See Use Cases
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                ✨ No credit card required • 🚀 Get started in 2 minutes
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Powerful Agent Capabilities</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Everything you need to build a content factory that runs itself
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
              {AGENT_FEATURES.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-2 text-4xl">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-green-500">✓</span>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Agent Examples */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Real Agent Examples</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See what you can build (and the results you can expect)
              </p>
            </div>
            <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {AGENT_EXAMPLES.map((agent, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-3xl">{agent.icon}</div>
                      <Badge variant="secondary">{agent.department}</Badge>
                    </div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <div className="mb-4 space-y-2 text-sm">
                      <div><strong>Output:</strong> {agent.config.outputType}</div>
                      <div><strong>Frequency:</strong> {agent.config.frequency}</div>
                      <div><strong>Tone:</strong> {agent.config.tone}</div>
                      <div><strong>Length:</strong> {agent.config.length}</div>
                    </div>
                    <div className="mt-auto border-t pt-4">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        📊 {agent.results}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">ROI That Makes Sense</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Compare AI agents to traditional content creation approaches
              </p>
            </div>
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-6 md:grid-cols-3">
                {PRICING_COMPARISON.map((option, index) => (
                  <Card 
                    key={index}
                    className={option.highlight ? 'border-2 border-purple-500 shadow-lg' : ''}
                  >
                    <CardHeader>
                      {option.highlight && (
                        <Badge className="mb-2 w-fit">Recommended</Badge>
                      )}
                      <CardTitle className="text-lg">{option.approach}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Cost</div>
                        <div className={`text-xl font-bold ${option.highlight ? 'text-purple-600' : ''}`}>
                          {option.cost}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Output Volume</div>
                        <div className="font-semibold">{option.output}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Quality</div>
                        <div className="font-semibold">{option.quality}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Availability</div>
                        <div className="font-semibold">{option.availability}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Set up your first agent in under 5 minutes
              </p>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Configure Agent</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose department, output type, tone, and quality standards
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Set Schedule</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Hourly, daily, weekly — or trigger manually
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Watch It Work</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Agent creates content 24/7. You review, edit, and publish
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Build Your Content Factory?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl">
              Join hundreds of teams using AI agents to create more content,
              faster, while maintaining quality and brand consistency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard/agents">
                <Button size="lg" variant="secondary">
                  Create Your First Agent
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-purple-600">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm opacity-90">
              Start free • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
    </>
  )
}

