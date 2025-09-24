import Link from 'next/link'

export default function SignupHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Signing Up for Prompt Manage
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Creating an account is quick and easy. Here&rsquo;s how to get
          started:
        </p>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Go to the{' '}
            <Link
              href="/?redirect=/dashboard"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Start Free
            </Link>{' '}
            from the homepage.
          </li>
          <li>
            Enter your email address, create a password, and fill in any
            required fields.
          </li>
          <li>
            Click <strong>Sign Up</strong> to create your account.
          </li>
          <li>
            Check your email for a verification link and follow the instructions
            to verify your account.
          </li>
        </ol>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Troubleshooting & Tips
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            If you don&rsquo;t receive a verification email, check your spam or
            junk folder.
          </li>
          <li>Make sure your email address is entered correctly.</li>
          <li>
            If you see an error message, try using a different browser or
            device.
          </li>
        </ul>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Need More Help?
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you&rsquo;re having trouble signing up,{' '}
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
