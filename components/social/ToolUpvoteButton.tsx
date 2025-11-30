'use client'

import { UpvoteButton } from './UpvoteButton'

interface ToolUpvoteButtonProps {
  toolId: string
  initialUpvoteCount: number
  initialIsUpvoted?: boolean
}

export function ToolUpvoteButton({
  toolId,
  initialUpvoteCount,
  initialIsUpvoted = false,
}: ToolUpvoteButtonProps) {
  return (
    <UpvoteButton
      itemId={toolId}
      itemType="tool"
      initialUpvoteCount={initialUpvoteCount}
      initialIsUpvoted={initialIsUpvoted}
    />
  )
}
