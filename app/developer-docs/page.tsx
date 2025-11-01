import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'API Documentation — Prompt Manage',
  description:
    'Developer documentation for the Prompt Manage API. Integrate prompt management into your applications.',
  keywords: ['API', 'developer', 'documentation', 'REST API', 'integration'],
  openGraph: {
    title: 'API Documentation — Prompt Manage',
    description: 'Developer documentation for the Prompt Manage API.',
    type: 'website',
  },
}

export default function DeveloperDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            API Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Integrate Prompt Manage into your applications.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Coming Soon Banner */}
          <section>
            <div className="mb-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
              <h2 className="mb-2 text-xl font-semibold text-amber-900 dark:text-amber-100">
                🚧 Coming Soon
              </h2>
              <p className="text-amber-800 dark:text-amber-200">
                The Prompt Manage API is currently in development. Full API access with API keys will be available for Pro plan subscribers soon.
              </p>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                Interested in early access? Contact us at{' '}
                <a
                  href="mailto:support@promptmanage.com"
                  className="underline hover:text-amber-900 dark:hover:text-amber-100"
                >
                  support@promptmanage.com
                </a>
              </p>
            </div>
          </section>

          {/* Introduction */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Introduction</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              The Prompt Manage API will allow you to programmatically manage prompts, collections,
              and integrate prompt management into your workflows.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              API requests will be made to{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-900">
                https://promptmanage.com/api
              </code>{' '}
              and will require API key authentication (Pro plan only).
            </p>
          </section>

          {/* Authentication */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Authentication (Coming Soon)</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              API requests will require an API key. Pro plan subscribers will be able to generate API keys in their team settings.
            </p>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <p className="mb-2 font-mono text-sm">Authorization: Bearer YOUR_API_KEY</p>
            </div>
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> API access is a Pro plan feature. Upgrade to Pro to enable API access when it becomes available.
              </p>
            </div>
          </section>

          {/* Example Request */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Example Request</h2>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <pre className="text-sm">
                <code>{`curl https://promptmanage.com/api/prompts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>
          </section>

          {/* Planned Endpoints */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Planned Endpoints</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The following endpoints are planned for the API (subject to change):
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">Prompts</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    • <code>GET /api/prompts</code> - List all prompts
                  </li>
                  <li>
                    • <code>POST /api/prompts</code> - Create a prompt
                  </li>
                  <li>
                    • <code>GET /api/prompts/:id</code> - Get a prompt
                  </li>
                  <li>
                    • <code>PUT /api/prompts/:id</code> - Update a prompt
                  </li>
                  <li>
                    • <code>DELETE /api/prompts/:id</code> - Delete a prompt
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Teams</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    • <code>GET /api/teams</code> - List teams
                  </li>
                  <li>
                    • <code>GET /api/teams/:id/members</code> - List team members
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Audit Logs</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    • <code>GET /api/audit-logs</code> - List audit logs (Enterprise only)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Planned Rate Limits */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Planned Rate Limits</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Pro: API access included (rate limits TBD)</li>
              <li>• Team: API access not included</li>
              <li>• Free: API access not included</li>
            </ul>
          </section>

          {/* Support */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Support</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              For API questions or technical support, contact our team.
            </p>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Developer Support</p>
              <a
                href="mailto:support@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                support@promptmanage.com
              </a>
            </div>
            <div className="mt-8">
              <Link
                href="/docs"
                className="text-sm underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                View Full Documentation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
