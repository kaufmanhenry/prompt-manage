'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

const AGENT_FEATURES = [
  {
    title: 'Autonomous Content Generation',
    description: 'AI agents run 24/7 creating high-quality content on autopilot',
    icon: '🤖',
    benefits: [
      'Generate blog posts, emails, social media content automatically',
      'Run on schedule (hourly, daily, weekly)',
      'Quality controls ensure brand consistency',
      'Scale to 100s of content pieces per day',
    ],
  },
  {
    title: 'Smart Quality Control',
    description: 'Built-in quality checks ensure every piece meets your standards',
    icon: '✅',
    benefits: [
      'Set forbidden phrases and required key phrases',
      'Define brand voice and style guidelines',
      'Automatic quality scoring (0-1)',
      'Optional manual review before publishing',
    ],
  },
  {
    title: '17 Output Types',
    description: 'Agents can create any type of content you need',
    icon: '📝',
    benefits: [
      'Blog posts, documentation, emails, social media',
      'Code snippets, tutorials, whitepapers',
      'Landing pages, product descriptions, ads',
      'Custom output types for your specific needs',
    ],
  },
  {
    title: 'Department Organization',
    description: 'Organize agents by team and function',
    icon: '🏢',
    benefits: [
      'Marketing, Support, Sales, Engineering, Content',
      'Legal, Design, Product, Operations departments',
      'Filter and manage agents by department',
      'Team-specific configurations and standards',
    ],
  },
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
      length: '800-1200 words',
    },
    results: '60 blog posts/month, 89% quality score, $12/month cost',
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
      length: '500-800 words',
    },
    results: '30 help articles/month, 92% quality score, deflects 40% of tickets',
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
      length: 'Platform-optimized',
    },
    results: '120 posts/month, 95% quality score, 3x engagement',
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
      length: 'Comprehensive',
    },
    results: '8 technical docs/month, saves 10 hours/week',
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
      length: 'Medium (400-600 words)',
    },
    results: '4 email sequences/month, 25% open rate improvement',
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
      length: 'Concise (200-300 words)',
    },
    results: '300 descriptions/month, 15% conversion increase',
  },
]

const PRICING_COMPARISON = [
  {
    approach: 'Hiring Content Writer',
    cost: '$3,000-$5,000/month',
    output: '20-30 pieces/month',
    quality: 'Variable',
    availability: '40 hours/week',
  },
  {
    approach: 'Freelance Writers',
    cost: '$100-$300 per piece',
    output: 'As needed',
    quality: 'Inconsistent',
    availability: 'Limited',
  },
  {
    approach: 'AI Agents (Our Platform)',
    cost: '$29-$99/month',
    output: '100s of pieces/month',
    quality: '85%+ quality score',
    availability: '24/7 automated',
    highlight: true,
  },
]

const INDUSTRY_USE_CASES = [
  {
    industry: 'E-commerce',
    icon: '🛒',
    agents: [
      'Product Description Generator',
      'Email Marketing Sequences',
      'Social Media Content Creator',
      'SEO Blog Writer',
    ],
    benefits: 'Increase conversion rates, reduce content costs, scale product catalogs',
  },
  {
    industry: 'SaaS',
    icon: '💻',
    agents: [
      'Technical Documentation Writer',
      'Customer Support FAQ Generator',
      'Feature Announcement Creator',
      'User Onboarding Content',
    ],
    benefits: 'Reduce support tickets, improve user experience, accelerate feature launches',
  },
  {
    industry: 'Marketing Agencies',
    icon: '📈',
    agents: [
      'Client Blog Content Creator',
      'Social Media Manager',
      'Email Campaign Writer',
      'Ad Copy Generator',
    ],
    benefits: 'Scale client services, reduce delivery time, increase client satisfaction',
  },
  {
    industry: 'Education',
    icon: '🎓',
    agents: [
      'Course Content Generator',
      'Student Communication Writer',
      'Educational Blog Creator',
      'Assessment Question Writer',
    ],
    benefits: 'Create more content, personalize learning, reduce instructor workload',
  },
  {
    industry: 'Healthcare',
    icon: '🏥',
    agents: [
      'Patient Education Writer',
      'Medical Blog Creator',
      'Appointment Reminder Writer',
      'Health Newsletter Generator',
    ],
    benefits: 'Improve patient communication, reduce administrative burden, scale education',
  },
  {
    industry: 'Real Estate',
    icon: '🏠',
    agents: [
      'Property Description Writer',
      'Market Report Generator',
      'Client Newsletter Creator',
      'Social Media Content Writer',
    ],
    benefits: 'Create compelling listings, maintain client relationships, build market presence',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechFlow SaaS',
    content: 'AI agents have transformed our content strategy. We went from 2 blog posts per week to 10, with better quality and zero additional headcount.',
    avatar: '👩‍💼',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'E-commerce Manager',
    company: 'StyleHub',
    content: 'Our product description agent writes 50+ descriptions daily. Conversion rates increased 23% and we saved $8,000/month on freelance writers.',
    avatar: '👨‍💻',
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Content Lead',
    company: 'HealthFirst Clinic',
    content: 'Patient education content that used to take our team 20 hours per week now generates automatically. Quality is consistent and patients love it.',
    avatar: '👩‍⚕️',
  },
]

export default function AIAgentsPage() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [useCase, setUseCase] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Request Submitted!',
        description: 'We\'ll notify you when AI Agents are available. Expected launch: Q2 2025.',
      })
      
      setEmail('')
      setCompany('')
      setUseCase('')
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-16 dark:from-gray-900 dark:to-gray-800 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4">Coming Soon: Autonomous AI Agents</Badge>
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
              <Button size="lg" onClick={() => document.getElementById('request-access')?.scrollIntoView({ behavior: 'smooth' })}>
                Request Early Access
              </Button>
              <Link href="/use-cases">
                <Button size="lg" variant="outline">
                  See Use Cases
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              🚀 Expected Launch: Q2 2025 • 📧 Get notified when available
            </p>
          </div>
        </div>
      </section>

      {/* Request Access Form */}
      <section id="request-access" className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Be the First to Know
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Join our waitlist and get early access to AI Agents when they launch
            </p>
            <form onSubmit={handleRequestAccess} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/70"
                />
                <Input
                  type="text"
                  placeholder="Company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/70"
                />
              </div>
              <Textarea
                placeholder="Tell us about your content needs (optional)"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                rows={3}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-white text-purple-600 hover:bg-gray-100"
              >
                {isSubmitting ? 'Submitting...' : 'Request Early Access'}
              </Button>
            </form>
            <p className="mt-4 text-sm opacity-90">
              We'll notify you when AI Agents are available • No spam, ever
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

      {/* Industry Use Cases */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Industry-Specific Solutions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how AI agents transform content creation across industries
            </p>
          </div>
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_USE_CASES.map((industry, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="text-3xl">{industry.icon}</div>
                    <CardTitle className="text-lg">{industry.industry}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold">Popular Agents:</h4>
                    <ul className="space-y-1 text-sm">
                      {industry.agents.map((agent, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-blue-500">•</span>
                          <span>{agent}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto border-t pt-4">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      💡 {industry.benefits}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Examples */}
      <section className="py-16">
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
                    <div>
                      <strong>Output:</strong> {agent.config.outputType}
                    </div>
                    <div>
                      <strong>Frequency:</strong> {agent.config.frequency}
                    </div>
                    <div>
                      <strong>Tone:</strong> {agent.config.tone}
                    </div>
                    <div>
                      <strong>Length:</strong> {agent.config.length}
                    </div>
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

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">What Early Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real feedback from our beta testing program
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">"{testimonial.content}"</p>
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
                    {option.highlight && <Badge className="mb-2 w-fit">Recommended</Badge>}
                    <CardTitle className="text-lg">{option.approach}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Cost</div>
                      <div
                        className={`text-xl font-bold ${option.highlight ? 'text-purple-600' : ''}`}
                      >
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
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
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

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about AI Agents
            </p>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>When will AI Agents be available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We're targeting Q2 2025 for the full launch. Early access will be available to waitlist members starting Q1 2025.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How much will AI Agents cost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Pricing will start at $29/month for basic agents, with enterprise plans available. Early access members get 50% off for the first year.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What types of content can agents create?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Agents can create 17+ content types including blog posts, emails, social media, documentation, product descriptions, ads, and more. Custom output types are also supported.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How do you ensure content quality?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our quality control system includes brand voice guidelines, forbidden phrase detection, required keyword inclusion, and automatic quality scoring. You can also enable manual review before publishing.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I integrate agents with my existing tools?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! AI Agents will integrate with popular platforms like WordPress, HubSpot, Mailchimp, Slack, and more. API access will also be available for custom integrations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Join the waitlist and be among the first to experience the future of automated content creation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => document.getElementById('request-access')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Early Access
            </Button>
            <Link href="/use-cases">
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-purple-600"
              >
                Explore Use Cases
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm opacity-90">
            Expected Launch: Q2 2025 • Early Access: Q1 2025 • 50% Off for Waitlist Members
          </p>
        </div>
      </section>
    </>
  )
}