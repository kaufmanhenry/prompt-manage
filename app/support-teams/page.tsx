import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageSquare, Shield, TrendingDown, Users, Zap, CheckCircle } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support Teams - Manage AI Chatbot Prompts & Reduce Ticket Escalations | Prompt Manage',
  description: 'Enterprise support teams use Prompt Manage to manage chatbot prompts, ensure compliance, improve response quality, and reduce ticket escalations by 40%.',
  keywords: 'support teams, chatbot prompts, AI support, ticket reduction, compliance, customer service',
}

export default function SupportTeamsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <MessageSquare className="w-4 h-4 mr-2" />
              For Enterprise Support Teams
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Stop Losing Customers to<br />
            <span className="text-blue-600 dark:text-blue-400">Poor AI Responses</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Manage chatbot prompts, ensure compliance, and reduce ticket escalations by 40% with centralized AI prompt management for support teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Request Demo
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>

        {/* Mini Case Study */}
        <div className="py-16 bg-white dark:bg-gray-800 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                How TechCorp Reduced Support Tickets by 40%
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                A leading SaaS company transformed their AI support experience
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">40%</h3>
                <p className="text-gray-600 dark:text-gray-400">Reduction in ticket escalations</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">60%</h3>
                <p className="text-gray-600 dark:text-gray-400">Faster response time</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">95%</h3>
                <p className="text-gray-600 dark:text-gray-400">Customer satisfaction</p>
              </div>
            </div>
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-gray-700 dark:text-gray-300 italic">
                &ldquo;Prompt Manage helped us centralize our chatbot prompts across 15 different support channels. 
                We can now update responses instantly, ensure compliance, and track performance. 
                Our support team is more efficient than ever.&rdquo;
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  SM
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Martinez</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Head of Customer Support, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Built for Support Teams Using AI
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Centralized Chatbot Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage prompts across all your support channels - website chat, mobile app, email, and social media - from one central location.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant updates across all channels
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Version control for all changes
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  A/B testing for response optimization
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Compliance & Quality Assurance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ensure all AI responses meet your compliance requirements and maintain consistent quality standards.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Built-in compliance templates
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automated quality checks
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Audit trails for all changes
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Reduce Ticket Escalations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Improve AI response quality to handle more customer inquiries without human intervention.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Performance analytics dashboard
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Identify common failure points
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Continuous improvement workflows
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enable your support team to collaborate on prompt improvements and share best practices.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Comment and review system
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Role-based access controls
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Knowledge sharing workflows
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to transform your support experience?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join leading support teams who&rsquo;ve already reduced escalations and improved customer satisfaction
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 14-day free trial • Enterprise SSO support
          </p>
        </div>
      </div>
    </div>
  )
} 