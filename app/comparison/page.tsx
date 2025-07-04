import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, X, GitBranch, Users, BarChart3, Shield, Zap, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Manage vs Notion & Spreadsheets - Why Teams Need Dedicated Prompt Management | Prompt Manage',
  description: 'See why Notion and spreadsheets fall short for AI prompt management. Learn how Prompt Manage provides version control, testing, collaboration, and analytics that teams need to scale.',
  keywords: 'prompt management, Notion, spreadsheets, version control, A/B testing, collaboration, AI tools comparison',
}

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Why Notion & Spreadsheets<br />
            <span className="text-blue-600 dark:text-blue-400">Aren't Enough</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            See why teams are moving from DIY solutions to dedicated prompt management platforms to scale their AI operations effectively.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Notion</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Spreadsheets</th>
                    <th className="text-center py-4 px-6 font-semibold text-blue-600 dark:text-blue-400">Prompt Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Version Control</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">A/B Testing</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Performance Analytics</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Team Collaboration</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">API Integration</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Change History</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Search & Discovery</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Export to AI Tools</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-World Examples */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Real-World Examples: Why DIY Solutions Fail
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                The Notion Nightmare
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sarah's marketing team stored their prompts in Notion. When they needed to A/B test different approaches, they had to manually copy prompts, run tests in separate tools, and manually track results. The process took hours and results were inconsistent.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Result:</strong> 3x longer testing cycles, inconsistent data, and frustrated team members.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                The Spreadsheet Chaos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Mike's support team used a shared Google Sheet for prompts. When someone updated a prompt, others didn't know. When they needed to find the best performing prompt, they had to manually search through hundreds of rows with no performance data.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Result:</strong> Inconsistent customer responses, hours wasted searching, and poor prompt performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why These Features Matter */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why These Features Are Critical for Scaling AI Teams
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Version Control
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track every change, rollback when needed, and maintain a clear history of what works and what doesn't.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                A/B Testing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Systematically test different approaches and optimize based on real performance data, not guesswork.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enable multiple team members to contribute, review, and improve prompts while maintaining quality control.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Performance Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Make data-driven decisions about which prompts to use, optimize, or retire based on actual results.
              </p>
            </div>
          </div>
        </div>

        {/* Success Story */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              How TechCorp Solved Their Prompt Chaos
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Before Prompt Manage
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Prompts scattered across 8 different Notion pages
                  </li>
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    No way to track which prompts performed best
                  </li>
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Team members constantly recreating the same work
                  </li>
                  <li className="flex items-start">
                    <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    6 hours per week spent searching for prompts
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  After Prompt Manage
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    All prompts in one searchable, organized library
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    A/B testing identified 40% better performing prompts
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Team collaboration improved prompt quality by 60%
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Reduced prompt search time to 10 minutes per week
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to move beyond DIY solutions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join teams who've already solved their prompt chaos with Prompt Manage
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <ArrowRight className="mr-2 h-5 w-5" />
                See It In Action
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