import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Star } from 'lucide-react'
import { Metadata } from 'next'
import { PricingToggle } from '@/components/PricingToggle'

export const metadata: Metadata = {
  title: 'Pricing - Prompt Manage | Simple, Transparent Plans',
  description: 'Choose the plan that\'s right for you. Start free with 50 prompts, or upgrade to Pro for unlimited prompts and advanced features. 30-day money-back guarantee.',
  keywords: 'prompt management pricing, AI prompts cost, ChatGPT prompts pricing, prompt tools pricing',
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
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing - Prompt Manage | Simple, Transparent Plans',
    description: 'Choose the plan that\'s right for you. Start free with 50 prompts, or upgrade to Pro for unlimited prompts and advanced features.',
    url: 'https://promptmanage.com/pricing',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Pricing Plans',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - Prompt Manage | Simple, Transparent Plans',
    description: 'Choose the plan that\'s right for you. Start free with 50 prompts, or upgrade to Pro for unlimited prompts and advanced features.',
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

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with prompt management',
      features: [
        'Up to 50 prompts',
        'Basic organization with tags',
        'Public prompt sharing',
        'Community prompt discovery',
        'Dark mode support',
        'Email support'
      ],
      cta: 'Get Started Free',
      href: '/login',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 9, annual: 90 },
      description: 'For power users who need unlimited prompts and advanced features',
      features: [
        'Unlimited prompts',
        'Advanced organization & folders',
        'Prompt version history',
        'Bulk import/export',
        'Priority support',
        'API access',
        'Custom branding',
        'Team collaboration (coming soon)'
      ],
      cta: 'Start Pro Trial',
      href: '/login',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Choose the plan that's right for you. Start free, upgrade when you need more.
          </p>

          {/* Billing Toggle - Client Component */}
          <PricingToggle onToggle={() => {}} />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border-2 ${
                plan.popular 
                  ? 'border-blue-500 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  )}
                </div>
                <Link href={plan.href}>
                  <Button 
                    size="lg" 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  What's included:
                </h4>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade to Pro anytime, and downgrade back to Free at the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What happens to my prompts if I downgrade?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your prompts are always safe. If you exceed the Free plan limit, you'll need to upgrade to Pro to add more.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're here to help you choose the right plan
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 