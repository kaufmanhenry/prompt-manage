import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

export function DirectoryHero() {
  return (
    <div className="mb-12 text-center">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
        The Ultimate <span className="text-emerald-600">AI Tools Directory</span>
      </h1>
      <div className="mx-auto max-w-3xl space-y-4 text-lg text-gray-600 dark:text-gray-400">
        <p>
          Discover, compare, and master the best AI tools for every use case. From{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-200">generative AI art</span>{' '}
          to{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-200">coding assistants</span>,
          our curated directory helps you find the perfect software to supercharge your workflow.
        </p>
        <p className="text-base">
          Browse thousands of verified AI applications, read community reviews, and find
          ready-to-use prompts to get started immediately. Whether you're a developer, marketer, or
          creative, we have the tools you need to stay ahead in the age of artificial intelligence.
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/directory/submit">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Submit a Tool
          </Button>
        </Link>
        <Link href="/p">
          <Button size="lg" variant="outline">
            Browse Prompts
          </Button>
        </Link>
      </div>
    </div>
  )
}
