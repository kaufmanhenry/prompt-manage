"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Users, GitBranch, BarChart3, Download, ArrowRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Create Prompt Libraries',
      description: 'Organize your prompts into searchable, categorized libraries',
      icon: Users,
      content: [
        'Create unlimited prompt libraries for different teams and use cases',
        'Add tags, descriptions, and metadata to make prompts easy to find',
        'Import existing prompts from Google Docs, Notion, or spreadsheets',
        'Set up templates for consistent prompt structure across your team'
      ],
      demo: 'Watch how Sarah creates a marketing prompt library in under 2 minutes'
    },
    {
      title: 'Test Prompt Variants',
      description: 'A/B test different prompt approaches to find what works best',
      icon: BarChart3,
      content: [
        'Create multiple versions of the same prompt with different approaches',
        'Run side-by-side tests with real data to compare performance',
        'Track metrics like response quality, completion rate, and user satisfaction',
        'Automatically identify which variants perform best for your use case'
      ],
      demo: 'See how Mike tests 5 different email subject line prompts and finds the winner'
    },
    {
      title: 'Collaborate Across Teams',
      description: 'Enable seamless collaboration with commenting, reviews, and approvals',
      icon: Users,
      content: [
        'Comment on prompts to suggest improvements and share feedback',
        'Request reviews from team members before deploying changes',
        'Set up approval workflows for sensitive or high-impact prompts',
        'Track who made what changes and when for full accountability'
      ],
      demo: 'Watch the marketing and support teams collaborate on customer service prompts'
    },
    {
      title: 'Export to Tools & Agents',
      description: 'Seamlessly integrate prompts with your existing AI tools and workflows',
      icon: Download,
      content: [
        'Export prompts directly to ChatGPT, Claude, or other AI platforms',
        'Integrate with your existing tools via our REST API',
        'Set up webhooks to automatically sync prompt changes',
        'Deploy prompts to production with one-click publishing'
      ],
      demo: 'See how the engineering team deploys prompts to their chatbot in real-time'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            See Prompt Manage in Action
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Watch how teams use Prompt Manage to organize, test, collaborate, and deploy AI prompts at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Schedule Live Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {React.createElement(step.icon, { className: "w-4 h-4" })}
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
                  {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {steps[currentStep].content.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Demo Preview</span>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {steps[currentStep].demo}
                </p>
              </div>
            </div>

            {/* Demo Video Placeholder */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Interactive Demo Video
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  {steps[currentStep].title}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Previous
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentStep === index
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Benefits Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Teams Choose Prompt Manage
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Save 40% Time
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stop searching for prompts and start building on each other&rsquo;s work
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Improve Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                A/B test prompts and optimize based on real performance data
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Scale Confidently
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Version control and collaboration tools for enterprise teams
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to see it in action?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join thousands of teams who&rsquo;ve already streamlined their AI prompt management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Schedule Live Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
} 