'use client'

import { Search, Star } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { NoResultsFound } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { FullPageLoading } from '@/components/ui/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link, useRouter } from '@/i18n/routing'
import { createClient } from '@/utils/supabase/client'

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  category_name: string
  pricing_model: string
  rating: number | null
  review_count: number
  favorite_count: number
  view_count: number
  key_features: string[] | null
}

interface Category {
  id: string
  name: string
  slug: string
  icon_emoji: string
}

const TOOLS_PER_PAGE = 12

export function DirectoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalTools, setTotalTools] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [pricingFilter, setPricingFilter] = useState(searchParams.get('pricing') || 'all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'highest_rated'>(
    (searchParams.get('sort') as 'newest' | 'popular' | 'highest_rated') || 'newest',
  )

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('ai_tool_categories')
        .select('id, name, slug, icon_emoji')
        .order('name')

      if (data) {
        setCategories(data)
      }
    }

    void fetchCategories()
  }, [])

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true)
      const supabase = createClient()

      let query = supabase
        .from('ai_tools')
        .select(
          `
          id,
          name,
          slug,
          description,
          logo_url,
          pricing_model,
          rating,
          review_count,
          favorite_count,
          view_count,
          key_features,
          primary_category_id,
          category:primary_category_id(name)
        `,
          { count: 'exact' },
        )
        .eq('status', 'approved')

      // Apply filters
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      if (selectedCategory !== 'all') {
        query = query.eq('primary_category_id', selectedCategory)
      }

      if (pricingFilter !== 'all') {
        query = query.eq('pricing_model', pricingFilter)
      }

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'popular') {
        query = query.order('view_count', { ascending: false })
      } else if (sortBy === 'highest_rated') {
        query = query.order('rating', { ascending: false, nullsFirst: false })
      }

      // Pagination
      const from = (currentPage - 1) * TOOLS_PER_PAGE
      const to = from + TOOLS_PER_PAGE - 1
      query = query.range(from, to)

      const { data, count } = await query

      if (data) {
        const transformedTools = data.map((tool) => ({
          ...tool,
          category_name:
            Array.isArray(tool.category) && tool.category.length > 0
              ? (tool.category[0] as { name: string }).name
              : 'Uncategorized',
        }))
        setTools(transformedTools as Tool[])
        setTotalTools(count || 0)
      }

      setLoading(false)
    }

    void fetchTools()
  }, [search, selectedCategory, pricingFilter, sortBy, currentPage])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (pricingFilter !== 'all') params.set('pricing', pricingFilter)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', currentPage.toString())

    router.push(`/directory?${params.toString()}`, { scroll: false })
  }, [search, selectedCategory, pricingFilter, sortBy, currentPage, router])

  const totalPages = Math.ceil(totalTools / TOOLS_PER_PAGE)

  return (
    <div className="flex-1">
      {/* Search & Filters */}
      <div className="mb-8 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            aria-label="Search AI tools"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Category Filter */}
          <div className="w-full sm:flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon_emoji || '🔧'} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing Filter */}
          <div className="w-full sm:flex-1">
            <Select value={pricingFilter} onValueChange={setPricingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="free_trial">Free Trial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-full sm:flex-1">
            <Select
              value={sortBy}
              onValueChange={(value: 'newest' | 'popular' | 'highest_rated') => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="highest_rated">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {selectedCategory !== 'all'
            ? categories.find((c) => c.id === selectedCategory)?.name || 'Tools'
            : 'All Tools'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading
            ? 'Loading...'
            : `Showing ${tools.length} of ${totalTools} AI tool${totalTools !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Tools Grid */}
      {loading ? (
        <FullPageLoading />
      ) : tools.length === 0 ? (
        <NoResultsFound
          onClearFilters={() => {
            setSearch('')
            setSelectedCategory('all')
            setPricingFilter('all')
            setSortBy('newest')
          }}
          onShowPopular={() => {
            setSearch('')
            setSelectedCategory('all')
            setPricingFilter('all')
            setSortBy('popular')
          }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.id} href={`/directory/${tool.slug}`}>
              <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-900">
                <div className="flex h-full flex-col p-6">
                  {/* Logo & Category */}
                  <div className="mb-4 flex items-start justify-between">
                    {tool.logo_url ? (
                      <div className="relative h-14 w-14 flex-shrink-0">
                        <Image
                          src={tool.logo_url}
                          alt={tool.name}
                          fill
                          className="rounded-lg object-cover"
                          sizes="56px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `<div class="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900"><span class="text-xl font-bold text-emerald-700 dark:text-emerald-300">${tool.name.charAt(0)}</span></div>`
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900">
                        <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                          {tool.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <Badge variant="secondary" className="ml-2">
                      {tool.category_name}
                    </Badge>
                  </div>

                  {/* Tool Info */}
                  <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {tool.name}
                  </h3>
                  <p className="mb-4 flex-grow text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>

                  {/* Features */}
                  {tool.key_features && tool.key_features.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {tool.key_features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Pricing & Stats */}
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {tool.pricing_model === 'free'
                          ? 'Free'
                          : tool.pricing_model === 'freemium'
                            ? 'Freemium'
                            : tool.pricing_model === 'free_trial'
                              ? 'Free Trial'
                              : 'Paid'}
                      </span>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      {tool.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{tool.rating.toFixed(1)}</span>
                          <span className="text-gray-500">({tool.review_count})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && tools.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="min-w-[80px] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Previous
          </Button>

          {/* Mobile: Show only current page info */}
          <span className="block px-3 py-2 text-sm md:hidden">
            Page {currentPage} of {totalPages}
          </span>

          {/* Desktop: Show page numbers */}
          <div className="hidden items-center gap-1 md:flex">
            {/* First page */}
            {currentPage > 3 && (
              <>
                <Button
                  variant={currentPage === 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(1)}
                  className="h-11 w-11 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:h-10 sm:w-10"
                >
                  1
                </Button>
                {currentPage > 4 && <span className="px-2">...</span>}
              </>
            )}

            {/* Pages around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1 ||
                  page === currentPage - 2 ||
                  page === currentPage + 2
                )
              })
              .map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className="h-11 w-11 sm:h-10 sm:w-10"
                >
                  {page}
                </Button>
              ))}

            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                <Button
                  variant={currentPage === totalPages ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(totalPages)}
                  className="h-11 w-11 sm:h-10 sm:w-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="min-w-[80px] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Next
          </Button>

          <span className="hidden w-full text-center text-sm text-gray-600 dark:text-gray-400 sm:ml-4 sm:inline sm:w-auto">
            ({totalTools} tools)
          </span>
        </div>
      )}
    </div>
  )
}
