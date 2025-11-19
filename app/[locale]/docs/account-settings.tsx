import Link from 'next/link'

export default function AccountSettingsHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Editing Your Account Settings
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          You can update your display name, email, and other profile details at any time.
          Here&rsquo;s how:
        </p>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Sign in and click your profile icon or go to your{' '}
            <Link href="/settings" className="text-blue-600 underline dark:text-blue-400">
              Settings
            </Link>{' '}
            page.
          </li>
          <li>Update your display name, email address, or other available fields.</li>
          <li>
            Click <strong>Save</strong> to apply your changes.
          </li>
        </ol>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Troubleshooting & Tips
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            If you change your email, you may need to verify the new address. Check your inbox (and
            spam folder) for a verification email.
          </li>
          <li>
            If you can&rsquo;t access your account, try resetting your password or{' '}
            <a
              href="mailto:support@promptmanage.com"
              className="text-blue-600 underline dark:text-blue-400"
            >
              contact support
            </a>
            .
          </li>
          <li>
            Some settings may be restricted for security reasons. If you need help, reach out to our
            team.
          </li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          Still need help?{' '}
          <a
            href="mailto:support@promptmanage.com"
            className="text-blue-600 underline dark:text-blue-400"
          >
            Contact our support team
          </a>{' '}
          and we&rsquo;ll be happy to assist you.
        </p>
      </div>
    </div>
  )
}
