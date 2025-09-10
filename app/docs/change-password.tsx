import Link from 'next/link';

export default function ChangePasswordHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Changing Your Password
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Keeping your account secure is important. Here&rsquo;s how to change your password:
        </p>
        <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            Go to your{' '}
            <Link href="/settings" className="text-blue-600 dark:text-blue-400 underline">
              Settings
            </Link>{' '}
            page after signing in.
          </li>
          <li>
            Find the <strong>Password</strong> section.
          </li>
          <li>Enter your current password, then your new password twice to confirm.</li>
          <li>
            Click <strong>Change Password</strong> to update your password.
          </li>
        </ol>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-900 dark:text-white">
          Forgot Your Password?
        </h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            Go to the{' '}
            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 underline">
              Sign In
            </Link>{' '}
            page and click <strong>Forgot Password?</strong>
          </li>
          <li>Enter your email address and follow the instructions in the email you receive.</li>
          <li>If you don&rsquo;t see the email, check your spam or junk folder.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-900 dark:text-white">
          Need More Help?
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you&rsquo;re having trouble changing your password or accessing your account,{' '}
          <a
            href="mailto:support@promptmanage.com"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            contact our support team
          </a>{' '}
          for assistance.
        </p>
      </div>
    </div>
  );
}
