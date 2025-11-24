import { Star } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { createServerSideClient } from '@/utils/supabase/server'

export async function FeaturedTools() {
  const supabase = createServerSideClient()

  // Fetch 3 random featured tools
  // Note: Supabase doesn't support random() natively in simple queries easily without RPC,
  // so we'll fetch a few more and shuffle in JS for now, or just take the latest featured.
  // For performance on a small set, taking latest featured is fine.
  const { data: tools } = await supabase
    .from('ai_tools')
    .select(
      'id, name, slug, description, logo_url, rating, review_count, category:primary_category_id(name)',
    )
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!tools || tools.length === 0) return null

  return (
    <div className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Tools</h2>
        <Link
          href="/directory?sort=popular"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View All Featured &rarr;
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={`/directory/${tool.slug}`}>
            <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-900">
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  {tool.logo_url ? (
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={tool.logo_url}
                        alt={tool.name}
                        fill
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-500 dark:bg-gray-800">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                  <Badge variant="secondary" className="ml-2">
                    {/* @ts-expect-error - Supabase join */}
                    {tool.category?.name || 'Tool'}
                  </Badge>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  {tool.name}
                </h3>
                <p className="mb-4 line-clamp-2 flex-grow text-sm text-gray-600 dark:text-gray-400">
                  {tool.description}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{tool.rating?.toFixed(1) || 'New'}</span>
                  <span className="text-gray-500">({tool.review_count})</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
