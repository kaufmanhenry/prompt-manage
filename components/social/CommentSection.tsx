'use client'

import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/utils/supabase/client'

interface Comment {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    display_name: string | null
    avatar_url: string | null
    username: string | null
  }
}

interface CommentSectionProps {
  toolId: string
}

export function CommentSection({ toolId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{
    id: string
    email?: string
    user_metadata?: { avatar_url?: string }
  } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchComments() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(
            `
            id,
            content,
            created_at,
            user:user_profiles(id, display_name, avatar_url, username)
          `,
          )
          .eq('tool_id', toolId)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform data to match interface (handling array/single object return from join)
        const formattedComments = (data || []).map(
          (item: {
            id: string
            content: string
            created_at: string
            user: Comment['user'] | Comment['user'][]
          }) => ({
            id: item.id,
            content: item.content,
            created_at: item.created_at,
            user: Array.isArray(item.user) ? item.user[0] : item.user,
          }),
        )

        setComments(formattedComments)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    void fetchComments()
    void getUser()
  }, [toolId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    if (!user) {
      toast.error('Please sign in to comment')
      return
    }

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          tool_id: toolId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select(
          `
          id,
          content,
          created_at,
          user:user_profiles(id, display_name, avatar_url, username)
        `,
        )
        .single()

      if (error) throw error

      const addedComment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user: Array.isArray(data.user) ? data.user[0] : data.user,
      }

      setComments([addedComment, ...comments])
      setNewComment('')
      toast.success('Comment posted!')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading comments...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>{user?.email?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <Textarea
            placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || isSubmitting}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!user || isSubmitting || !newComment.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Link href={comment.user?.username ? `/u/${comment.user.username}` : '#'}>
                <Avatar className="h-10 w-10 cursor-pointer transition-opacity hover:opacity-80">
                  <AvatarImage src={comment.user?.avatar_url || undefined} />
                  <AvatarFallback>{comment.user?.display_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={comment.user?.username ? `/u/${comment.user.username}` : '#'}
                    className="font-semibold hover:underline"
                  >
                    {comment.user?.display_name || 'Unknown User'}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
