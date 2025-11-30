'use client'

import { ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

interface UpvoteButtonProps {
  itemId: string
  itemType: 'tool' | 'prompt'
  initialUpvoteCount: number
  initialIsUpvoted?: boolean
}

export function UpvoteButton({
  itemId,
  itemType,
  initialUpvoteCount,
  initialIsUpvoted = false,
}: UpvoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [count, setCount] = useState(initialUpvoteCount)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const tableName = itemType === 'tool' ? 'tool_upvotes' : 'prompt_upvotes'
  const idColumn = itemType === 'tool' ? 'tool_id' : 'prompt_id'

  // Check initial status if not provided (optional, if we want to fetch on mount)
  useEffect(() => {
    async function checkStatus() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from(tableName)
        .select(idColumn)
        .eq(idColumn, itemId)
        .eq('user_id', session.user.id)
        .single()

      if (data) {
        setIsUpvoted(true)
      }
    }

    if (initialIsUpvoted === undefined) {
      void checkStatus()
    }
  }, [itemId, initialIsUpvoted, supabase, tableName, idColumn])

  const handleToggleUpvote = async () => {
    setIsLoading(true)

    // Optimistic update
    const newIsUpvoted = !isUpvoted
    const newCount = newIsUpvoted ? count + 1 : count - 1

    setIsUpvoted(newIsUpvoted)
    setCount(newCount)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast.error(`Please sign in to upvote ${itemType}s`)
        // Revert
        setIsUpvoted(isUpvoted)
        setCount(count)
        return
      }

      if (newIsUpvoted) {
        const { error } = await supabase
          .from(tableName)
          .insert({ [idColumn]: itemId, user_id: session.user.id })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(idColumn, itemId)
          .eq('user_id', session.user.id)

        if (error) throw error
      }
    } catch (error) {
      console.error('Error toggling upvote:', error)
      toast.error('Failed to update upvote')
      // Revert on error
      setIsUpvoted(isUpvoted)
      setCount(count)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleUpvote}
      disabled={isLoading}
      className={cn(
        'gap-2 transition-colors',
        isUpvoted &&
          'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400',
      )}
    >
      <ArrowBigUp className={cn('h-5 w-5', isUpvoted && 'fill-current')} />
      <span>{count}</span>
      <span className="sr-only">Upvotes</span>
    </Button>
  )
}
