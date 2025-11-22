'use client'

import { Plus, Search, Star, TrendingUp } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

interface AITool {
  id: string
  name: string
  slug: string
  website_url: string
  description: string
  logo_url: string | null
  primary_category_id: string
  category_name: string
  pricing_model: string
  rating: number | null
  review_count: number
  favorite_count: number
  view_count: number
  upvote_count: number
  key_features: string[]
}

interface Category {
  id: string
  name: string
  slug: string
  icon_emoji: string
}

export default function DirectoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tools, setTools] = useState<AITool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'highest_rated'>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (searchParams.get('sort') as any) || 'newest',
  )
  const [pricingFilter, setPricingFilter] = useState(searchParams.get('pricing') || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTools, setTotalTools] = useState(0)
  const TOOLS_PER_PAGE = 20

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/directory/categories')
        const data = await response.json()
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories([])
      }
    }
    void fetchCategories()
  }, [])

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (debouncedSearch) params.set('search', debouncedSearch)
        if (selectedCategory !== 'all') params.set('category', selectedCategory)
        if (pricingFilter !== 'all') params.set('pricing', pricingFilter)
        params.set('sort', sortBy)
        params.set('page', currentPage.toString())
        params.set('limit', TOOLS_PER_PAGE.toString())

        const response = await fetch(`/api/directory/tools?${params.toString()}`)
        const data = await response.json()
        setTools(data.tools || [])
        setTotalTools(data.total || 0)
      } catch (error) {
        console.error('Failed to fetch tools:', error)
      } finally {
        setLoading(false)
      }
    }
    void fetchTools()
  }, [debouncedSearch, selectedCategory, sortBy, pricingFilter, currentPage, TOOLS_PER_PAGE])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedCategory, sortBy, pricingFilter])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    if (pricingFilter !== 'all') params.set('pricing', pricingFilter)
    if (currentPage > 1) params.set('page', currentPage.toString())

    const queryString = params.toString()
    router.push(queryString ? `/directory?${queryString}` : '/directory')
  }, [search, selectedCategory, sortBy, pricingFilter, currentPage, router])

  const totalPages = Math.ceil(totalTools / TOOLS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              AI Tools Directory
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              Discover the best AI tools and services. Curated by the community, for everyone.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Link href="/directory/submit">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Submit a Tool
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-12 space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search tools by name, feature, or use case..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pricing Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pricing
              </label>
              <Select value={pricingFilter} onValueChange={setPricingFilter}>
                <SelectTrigger>
                  <SelectValue />
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
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <Select
                value={sortBy}
                onValueChange={(value: 'newest' | 'popular' | 'highest_rated') => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue />
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

        {/* Prompts Promotion Banner */}
        <div className="mb-8 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-900 dark:from-emerald-950 dark:to-teal-950">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Want to master these tools?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse our curated prompt collections with ready-to-use examples for every tool.
              </p>
            </div>
            <Link href="/tools">
              <Button
                variant="outline"
                className="whitespace-nowrap border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                View Prompt Collections
              </Button>
            </Link>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${tools.length} tool${tools.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <FullPageLoading />
        ) : tools.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">
              No tools found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/directory/${tool.slug}`}>
                <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-emerald-200 hover:shadow-lg dark:hover:border-emerald-900">
                  <div className="flex h-full flex-col p-6">
                    {/* Logo & Category */}
                    <div className="mb-4 flex items-start justify-between">
                      {tool.logo_url && (
                        <img
                          src={tool.logo_url}
                          alt={tool.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
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
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{tool.upvote_count} upvotes</span>
                        </div>
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
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant={currentPage === 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(1)}
                    className="h-10 w-10"
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
                    className="h-10 w-10"
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
                    className="h-10 w-10"
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
            >
              Next
            </Button>

            <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} ({totalTools} tools)
            </span>
          </div>
        )}

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
                  <Link href="/tools">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    >
                      View Prompt Collections
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
