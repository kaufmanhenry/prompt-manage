import Link from 'next/link'

export default function AccountSettingsHelp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Editing Your Account Settings</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          You can update your display name, email, and other profile details at any time. Here's how:
        </p>
        <ol className="list-decimal pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>Sign in and click your profile icon or go to your <Link href="/settings" className="text-blue-600 dark:text-blue-400 underline">Settings</Link> page.</li>
          <li>Update your display name, email address, or other available fields.</li>
          <li>Click <strong>Save</strong> to apply your changes.</li>
        </ol>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-900 dark:text-white">Troubleshooting & Tips</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>If you change your email, you may need to verify the new address. Check your inbox (and spam folder) for a verification email.</li>
          <li>If you can't access your account, try resetting your password or <a href="mailto:support@promptmanage.com" className="text-blue-600 dark:text-blue-400 underline">contact support</a>.</li>
          <li>Some settings may be restricted for security reasons. If you need help, reach out to our team.</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">Still need help? <a href="mailto:support@promptmanage.com" className="text-blue-600 dark:text-blue-400 underline">Contact our support team</a> and we'll be happy to assist you.</p>
      </div>
    </div>
  )
} 