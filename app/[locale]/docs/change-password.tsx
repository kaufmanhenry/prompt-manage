import Link from 'next/link'

export default function ChangePasswordHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Account Security & Password-Free Sign-In
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Prompt Manage uses password-free authentication for enhanced security. How you manage your
          account security depends on your sign-in method:
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          If You Signed Up with Google
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Your account security is managed through Google. You don&rsquo;t have a separate password
          for Prompt Manage.
        </p>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Go to{' '}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Google Account Security
            </a>
          </li>
          <li>
            Click on <strong>Password</strong> to change your Google password
          </li>
          <li>Follow Google&rsquo;s prompts to update your password</li>
          <li>
            Your new password will automatically apply to Prompt Manage and all other Google
            services
          </li>
        </ol>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          If You Signed Up with Email (Magic Link)
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You don&rsquo;t have a password at all! Instead, you receive a fresh verification code
          every time you sign in.
        </p>
        <div className="mb-6 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <h3 className="mb-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            How Email Sign-In Works:
          </h3>
          <ul className="list-disc space-y-1 pl-6 text-sm text-emerald-900 dark:text-emerald-200">
            <li>
              <strong>No password to change:</strong> Email sign-in uses one-time codes sent to your
              inbox
            </li>
            <li>
              <strong>Each code is unique:</strong> Codes expire after 60 minutes and can only be
              used once
            </li>
            <li>
              <strong>More secure:</strong> Since there&rsquo;s no password to steal or forget, your
              account is protected by your email provider&rsquo;s security
            </li>
            <li>
              <strong>To secure your account:</strong> Enable 2-factor authentication on your email
              provider (Gmail, Outlook, etc.)
            </li>
          </ul>
        </div>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Security Best Practices
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enable 2-factor authentication:</strong> On your Google account or email
            provider for maximum security
          </li>
          <li>
            <strong>Keep recovery options updated:</strong> Ensure your account recovery email and
            phone number are current
          </li>
          <li>
            <strong>Never share codes:</strong> Don&rsquo;t share verification codes with anyone -
            Prompt Manage will never ask for them
          </li>
          <li>
            <strong>Sign out on shared devices:</strong> Always sign out when using public or shared
            computers
          </li>
        </ul>

        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Want to switch sign-in methods?</strong> You can add multiple sign-in methods to
            your account. Just sign in using a different method (Google or Email) with the same
            email address, and they&rsquo;ll be linked automatically.
          </p>
        </div>

        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Need More Help?
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          For comprehensive authentication guidance, see our{' '}
          <Link href="/docs/authentication" className="text-blue-600 underline dark:text-blue-400">
            Complete Authentication Guide
          </Link>
          .
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          If you&rsquo;re having trouble accessing your account,{' '}
          <a
            href="mailto:support@promptmanage.com"
            className="text-blue-600 underline dark:text-blue-400"
          >
            contact our support team
          </a>{' '}
          for assistance.
        </p>
      </div>
    </div>
  )
}
