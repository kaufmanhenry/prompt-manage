import { Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Teams Guide — Prompt Manage',
  description:
    'Learn how to use Teams on Prompt Manage. Collaborate with team members, share prompts, manage permissions, and work together on AI workflows.',
  keywords: [
    'teams',
    'collaboration',
    'team management',
    'shared prompts',
    'team permissions',
    'enterprise features',
  ],
  openGraph: {
    title: 'Teams Guide — Prompt Manage',
    description: 'Learn how to collaborate with teams on Prompt Manage.',
    type: 'website',
  },
}

export default function TeamsGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/docs"
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Documentation
          </Link>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Teams</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Collaborate with your team on prompts, collections, and AI workflows. Teams enable secure,
            scalable collaboration for organizations.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 31, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Overview</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Teams allow multiple users to collaborate on prompts, collections, and AI workflows
              within a shared workspace. This feature is designed for organizations that need to share
              AI prompts securely across team members.
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Note:</strong> Teams is available
                on Team ($20/month) and Pro ($99/month) plans. The Free plan does not include team
                collaboration features.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Key Features</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Shared Workspaces
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create team workspaces where members can access shared prompts and collections. Each
                  team has its own dashboard and resources.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Role-Based Permissions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Control access with granular permissions. Roles include Owner, Admin, Editor, and
                  Viewer, each with different levels of access.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Team Collections
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create and share collections with team members. Collections can be private to the
                  team or published publicly on behalf of the team.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Usage Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor team usage, view analytics per team member, and track costs across team
                  activities.
                </p>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Getting Started
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Creating a Team
                </h3>
                <ol className="list-decimal space-y-2 pl-6 text-gray-600 dark:text-gray-400">
                  <li>Upgrade to Team or Pro plan from the{' '}
                    <Link href="/pricing" className="text-emerald-600 hover:underline dark:text-emerald-400">
                      Pricing page
                    </Link>
                  </li>
                  <li>Navigate to Dashboard → Teams</li>
                  <li>Click &quot;Create Team&quot;</li>
                  <li>Enter team name and description</li>
                  <li>Set initial settings and permissions</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Inviting Members
                </h3>
                <ol className="list-decimal space-y-2 pl-6 text-gray-600 dark:text-gray-400">
                  <li>Go to your team settings</li>
                  <li>Click &quot;Invite Members&quot;</li>
                  <li>Enter email addresses of team members</li>
                  <li>Assign roles (Admin, Editor, or Viewer)</li>
                  <li>Send invitations</li>
                </ol>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Note:</strong> Invited members
                  must accept the invitation and have a Prompt Manage account. Team plan supports up to
                  5 members; Pro plan supports up to 25 members.
                </p>
              </div>
            </div>
          </section>

          {/* Roles and Permissions */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Roles and Permissions
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Owner</h3>
                <ul className="list-disc space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-400">
                  <li>Full access to all team features</li>
                  <li>Manage billing and subscription</li>
                  <li>Delete the team</li>
                  <li>Change team settings</li>
                  <li>Manage all members and permissions</li>
                </ul>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Admin</h3>
                <ul className="list-disc space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-400">
                  <li>Manage team members (except Owner)</li>
                  <li>Edit team settings</li>
                  <li>Create, edit, and delete prompts and collections</li>
                  <li>View usage analytics</li>
                </ul>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Editor</h3>
                <ul className="list-disc space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-400">
                  <li>Create, edit, and delete prompts</li>
                  <li>Create and edit collections</li>
                  <li>View team resources</li>
                  <li>Cannot manage team members or settings</li>
                </ul>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Viewer</h3>
                <ul className="list-disc space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-400">
                  <li>View team prompts and collections</li>
                  <li>Copy prompts to personal library</li>
                  <li>Cannot create, edit, or delete resources</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Team Resources */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Team Resources
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Shared Prompts
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Prompts created within a team workspace are accessible to all team members (based on
                  permissions). Team prompts can be organized into collections and shared publicly on
                  behalf of the team.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Team Collections
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create collections that belong to the team. Team collections can be private (team
                  members only) or public (visible to everyone). All team members with Editor or
                  Admin roles can manage team collections.
                </p>
              </div>
            </div>
          </section>

          {/* Billing */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Billing</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Team billing is managed by the team Owner:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Team Plan:</strong> $20/month, up
                to 5 members
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Pro Plan:</strong> $99/month, up to
                25 members
              </li>
              <li>Billing is charged to the Owner&apos;s account</li>
              <li>All team members have access to premium features included in the plan</li>
              <li>Usage is tracked per team, not per member</li>
            </ul>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Best Practices
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <p className="text-sm text-emerald-900 dark:text-emerald-200">
                  <strong>Organize with Collections:</strong> Use collections to group related
                  prompts by project, use case, or department.
                </p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Use Appropriate Roles:</strong> Grant Editor access only to members who
                  need to create content. Use Viewer role for read-only access.
                </p>
              </div>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                <p className="text-sm text-purple-900 dark:text-purple-200">
                  <strong>Monitor Usage:</strong> Regularly review team usage analytics to understand
                  how prompts are being used and optimize costs.
                </p>
              </div>
            </div>
          </section>

          {/* API Access */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">API Access</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Teams on Pro plan have access to the Prompt Manage API for programmatic access:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>Create, read, update, and delete prompts via API</li>
              <li>Manage collections programmatically</li>
              <li>Access team resources with API keys</li>
              <li>Integrate Prompt Manage into your workflows</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              API documentation is available in your team settings when API access is enabled.
            </p>
          </section>

          {/* Need Help */}
          <section className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Need More Help?
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Check out our other guides or contact support
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs/collections">
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  Collections Guide
                </button>
              </Link>
              <Link href="/docs/payments-subscriptions">
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  Payments Guide
                </button>
              </Link>
              <Link href="/support">
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                  Contact Support
                </button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

