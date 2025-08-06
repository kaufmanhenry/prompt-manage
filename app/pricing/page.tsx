"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, X, Star, Users, Crown } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: 0,
      annualPrice: 0,
      description: 'Perfect for individuals getting started with AI prompts',
      features: [
        '1 seat',
        '1 prompt library',
        'Basic prompt testing',
        'Community support',
        'Up to 100 prompt runs/month',
        'Basic analytics',
      ],
      notIncluded: [
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom integrations',
        'Enterprise SSO',
      ],
      cta: 'Get Started Free',
      popular: false,
      icon: Star,
    },
    {
      name: 'Team',
      price: 39,
      annualPrice: 29,
      description: 'For teams that need to collaborate and scale their AI operations',
      features: [
        'Unlimited seats',
        'Unlimited prompt libraries',
        'Advanced prompt testing & A/B testing',
        'Team collaboration tools',
        'Unlimited prompt runs',
        'Advanced analytics & reporting',
        'API access',
        'Priority support',
        'Custom integrations',
        'Version control & history',
        'Role-based permissions',
        'Export capabilities',
      ],
      notIncluded: [
        'Enterprise SSO',
        'Custom compliance features',
        'Dedicated account manager',
        'Custom SLA',
      ],
      cta: 'Start Free Trial',
      popular: true,
      icon: Users,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      annualPrice: 'Custom',
      description: 'For large organizations with advanced security and compliance needs',
      features: [
        'Everything in Team',
        'Enterprise SSO (SAML, OIDC)',
        'Advanced security & compliance',
        'Dedicated account manager',
        'Custom SLA & uptime guarantees',
        'Custom integrations & APIs',
        'Advanced audit trails',
        'Custom data retention policies',
        'On-premise deployment options',
        'Custom training & onboarding',
        '24/7 phone support',
        'Custom contract terms',
      ],
      notIncluded: [],
      cta: 'Talk to Sales',
      popular: false,
      icon: Crown,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the plan that&rsquo;s right for your team. All plans include a 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Save 25%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 ${
                plan.popular
                  ? 'border-blue-500 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700'
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    plan.name === 'Free' ? 'bg-gray-100 dark:bg-gray-700' :
                    plan.name === 'Team' ? 'bg-blue-100 dark:bg-blue-900' :
                    'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    <plan.icon className={`h-6 w-6 ${
                      plan.name === 'Free' ? 'text-gray-600 dark:text-gray-400' :
                      plan.name === 'Team' ? 'text-blue-600 dark:text-blue-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  {typeof plan.price === 'number' ? (
                    <div>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${isAnnual ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.price === 0 ? '' : isAnnual ? '/seat/month' : '/seat/month'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What&rsquo;s included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Not Included */}
              {plan.notIncluded.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Not included:</h4>
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <div className="text-center">
                {plan.name === 'Enterprise' ? (
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className={`w-full text-lg py-3 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className={`w-full text-lg py-3 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What&rsquo;s included in the free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The free trial includes all Team plan features for 14 days. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No setup fees for any plan. Enterprise plans may have custom onboarding costs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-4">
                Contact Sales
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 