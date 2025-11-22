import Link from 'next/link'

export default function SignupHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Signing Up for Prompt Manage
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Creating an account is quick and easy. Prompt Manage offers two password-free sign-up
          methods:
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Method 1: Sign In with Google
        </h2>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Go to the{' '}
            <Link
              href="/?redirect=/dashboard"
              className="text-blue-600 underline dark:text-blue-400"
            >
              homepage
            </Link>{' '}
            and click <strong>Sign in with Google</strong>.
          </li>
          <li>Select your Google account (or sign in to Google if needed).</li>
          <li>Authorize Prompt Manage to access your basic profile information.</li>
          <li>You&rsquo;ll be automatically redirected to your dashboard - account created!</li>
        </ol>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Method 2: Sign In with Email (Magic Link)
        </h2>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Go to the{' '}
            <Link
              href="/?redirect=/dashboard"
              className="text-blue-600 underline dark:text-blue-400"
            >
              homepage
            </Link>{' '}
            and click <strong>Sign in with Email</strong>.
          </li>
          <li>Enter your email address.</li>
          <li>Check your email for a 6-digit verification code (it arrives within seconds).</li>
          <li>Enter the verification code on the sign-in page.</li>
          <li>You&rsquo;ll be automatically redirected to your dashboard - account created!</li>
        </ol>

        <div className="my-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>No passwords needed!</strong> Both methods provide secure, password-free
            authentication. Your account is created automatically on your first sign-in - no forms
            to fill out.
          </p>
        </div>

        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Troubleshooting & Tips
        </h2>

        <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Google Sign-In Issues:
        </h3>
        <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>If popups are blocked, enable them for promptmanage.com in your browser settings.</li>
          <li>Try disabling browser extensions temporarily if sign-in fails.</li>
          <li>Clear your browser cache and cookies, then try again.</li>
          <li>Try incognito/private mode or a different browser.</li>
        </ul>

        <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Email Magic Link Issues:
        </h3>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Don&rsquo;t see the email?</strong> Check your spam or junk folder and whitelist
            noreply@promptmanage.com.
          </li>
          <li>
            <strong>Code expired?</strong> Codes expire after 60 minutes. Request a new one by
            entering your email again.
          </li>
          <li>
            <strong>Using corporate/university email?</strong> Some organizations block automated
            emails. Try a personal email instead.
          </li>
          <li>Make sure your email address is entered correctly.</li>
          <li>Wait 1-2 minutes - emails can be delayed during high traffic.</li>
        </ul>

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
          If you&rsquo;re still having trouble signing up,{' '}
          <a
            href="mailto:support@promptmanage.com"
            className="text-blue-600 underline dark:text-blue-400"
          >
            contact our support team
          </a>{' '}
          and we&rsquo;ll help you get started.
        </p>
      </div>
    </div>
  )
}
