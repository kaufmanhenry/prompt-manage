import Link from 'next/link'

export default function BestPractices() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Prompt Management Best Practices
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Follow these best practices to keep your prompt library organized,
          discoverable, and easy to use for yourself and your team.
        </p>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Naming Your Prompts
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Use clear, descriptive names that indicate the prompt&rsquo;s
            purpose (e.g., <strong>Summarize Meeting Notes</strong> or{' '}
            <strong>Generate Blog Outline</strong>).
          </li>
          <li>
            Include the target model or use case in the name if relevant (e.g.,{' '}
            <strong>GPT-4: Email Draft</strong>).
          </li>
          <li>
            Keep names concise but specific—avoid generic titles like
            &ldquo;Prompt 1.&rdquo;
          </li>
        </ul>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Using Tags Effectively
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Create a consistent tagging system for your team (e.g.,{' '}
            <strong>marketing</strong>, <strong>qa</strong>,{' '}
            <strong>customer-support</strong>).
          </li>
          <li>
            Use tags for model types, use cases, difficulty levels, and any
            other categories that help you organize your prompts.
          </li>
          <li>
            Review and update tags regularly to keep your library organized as
            it grows.
          </li>
        </ul>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Organizing Your Library
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>Group related prompts together using tags or collections.</li>
          <li>Archive or delete outdated prompts to reduce clutter.</li>
          <li>
            Encourage your team to add descriptions and usage notes for each
            prompt.
          </li>
        </ul>
        <h2 className="mb-2 mt-8 text-xl font-semibold text-gray-900 dark:text-white">
          Tips for Teams
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            Share best practices with new team members and encourage consistent
            naming/tagging.
          </li>
          <li>
            Use the{' '}
            <Link
              href="/docs/account-settings"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Account Settings
            </Link>{' '}
            page to update your profile and help others recognize your
            contributions.
          </li>
          <li>
            If you&rsquo;re unsure how to organize a new prompt, ask your team
            or check existing examples in your library.
          </li>
        </ul>
        <p className="mt-8 text-gray-700 dark:text-gray-300">
          Have your own best practices to share?{' '}
          <a
            href="mailto:support@promptmanage.com"
            className="text-blue-600 underline dark:text-blue-400"
          >
            Let us know
          </a>{' '}
          and help improve the Prompt Manage community!
        </p>
      </div>
    </div>
  )
}
