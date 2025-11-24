'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  icon_emoji: string
}

interface CategorySidebarProps {
  categories: Category[]
  selectedCategory: string
  className?: string
}

export function CategorySidebar({ categories, selectedCategory, className }: CategorySidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    params.set('page', '1') // Reset to page 1
    router.push(`/directory?${params.toString()}`)
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="mb-2 px-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Categories
        </h3>
        <div className="space-y-1">
          <Button
            variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleCategoryClick('all')}
          >
            <span className="mr-2">🔍</span>
            All Tools
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-1 pr-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
              className="w-full justify-start text-sm font-normal"
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="mr-2">{category.icon_emoji || '🔧'}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
