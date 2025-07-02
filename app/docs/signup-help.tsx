import Link from 'next/link'

export default function SignupHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Signing Up for Prompt Manage</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Creating an account is quick and easy. Here's how to get started:
        </p>
        <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>Go to the <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 underline">Sign Up</Link> page.</li>
          <li>Enter your email address, create a password, and fill in any required fields.</li>
          <li>Click <strong>Sign Up</strong> to create your account.</li>
          <li>Check your email for a verification link and follow the instructions to verify your account.</li>
        </ol>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-900 dark:text-white">Troubleshooting & Tips</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>If you don't receive a verification email, check your spam or junk folder.</li>
          <li>Make sure your email address is entered correctly.</li>
          <li>If you see an error message, try using a different browser or device.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-900 dark:text-white">Need More Help?</h2>
        <p className="text-gray-700 dark:text-gray-300">If you're having trouble signing up, <a href="mailto:support@promptmanage.com" className="text-blue-600 dark:text-blue-400 underline">contact our support team</a> and we'll help you get started.</p>
      </div>
    </div>
  )
} 