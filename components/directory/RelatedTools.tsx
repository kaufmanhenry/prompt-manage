import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/routing'
import { createServerSideClient } from '@/utils/supabase/server'

interface RelatedToolsProps {
  categoryId: string
  currentToolId: string
}

export async function RelatedTools({ categoryId, currentToolId }: RelatedToolsProps) {
  const supabase = createServerSideClient()

  const { data: tools } = await supabase
    .from('ai_tools')
    .select(
      'id, name, slug, description, logo_url, rating, review_count, category:primary_category_id(name)',
    )
    .eq('status', 'approved')
    .eq('primary_category_id', categoryId)
    .neq('id', currentToolId)
    .limit(3)

  if (!tools || tools.length === 0) return null

  return (
    <div className="mt-16 border-t border-gray-200 pt-16 dark:border-gray-800">
      <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Similar Tools</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={`/directory/${tool.slug}`}>
            <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-900">
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  {tool.logo_url ? (
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
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
