import dynamic from 'next/dynamic'

import { DirectoryContent } from '@/components/directory/DirectoryContent'
import { DirectoryHero } from '@/components/directory/DirectoryHero'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

// Lazy load below-fold components
const FeaturedTools = dynamic(
  () =>
    import('@/components/directory/FeaturedTools').then((mod) => ({ default: mod.FeaturedTools })),
  {
    loading: () => (
      <div className="mb-16 h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
    ),
  },
)

const NewArrivals = dynamic(
  () => import('@/components/directory/NewArrivals').then((mod) => ({ default: mod.NewArrivals })),
  {
    loading: () => (
      <div className="mb-16 h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
    ),
  },
)

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    pricing?: string
    sort?: string
    page?: string
  }>
}

export default async function DirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const showFeatured =
    !params.search &&
    (!params.category || params.category === 'all') &&
    (!params.pricing || params.pricing === 'all') &&
    (!params.page || params.page === '1')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <DirectoryHero />

        {/* Featured & New Arrivals (Only show on first page with no filters) */}
        {showFeatured && (
          <>
            <FeaturedTools />
            <NewArrivals />
          </>
        )}

        <DirectoryContent />

        {/* Footer CTA Section */}
        <div className="mt-20 border-t border-gray-200 pt-16 dark:border-gray-800">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 dark:border-blue-900 dark:from-blue-950 dark:to-cyan-950">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Not finding what you need?
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Submit your own AI tool to the directory and get exposure to thousands of
                  potential customers. It's free and takes just 5 minutes.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/directory/submit">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Submit Your Tool
                    </Button>
                  </Link>
                  <Link href="/p">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    >
                      Browse Prompts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
