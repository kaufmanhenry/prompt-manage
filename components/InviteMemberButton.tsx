'use client'

import { UserPlus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

import { SeatLimitModal } from './SeatLimitModal'

interface InviteMemberButtonProps {
  teamId: string
  teamName?: string
  currentTier?: 'team' | 'pro' | 'enterprise'
  onInviteSent?: () => void
}

export function InviteMemberButton({
  teamId,
  teamName = 'your team',
  currentTier = 'team',
  onInviteSent,
}: InviteMemberButtonProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('editor')
  const [loading, setLoading] = useState(false)

  // Seat limit modal state
  const [showSeatLimitModal, setShowSeatLimitModal] = useState(false)
  const [seatLimitDetails, setSeatLimitDetails] = useState<{
    currentSeats: number
    maxSeats: number
    pendingEmail: string
  } | null>(null)

  const handleInvite = async () => {
    if (!email?.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/teams/${teamId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Check if it's a seat limit error
        if (data.code === 'SEAT_LIMIT_REACHED') {
          setSeatLimitDetails({
            currentSeats: data.details.currentSeats,
            maxSeats: data.details.maxSeats,
            pendingEmail: email,
          })
          setShowSeatLimitModal(true)
          setOpen(false) // Close invite dialog
          return
        }

        throw new Error(data.error || 'Failed to send invitation')
      }

      toast({
        title: 'Invitation sent!',
        description: `An invitation has been sent to ${email}`,
      })

      // Reset form
      setEmail('')
      setRole('editor')
      setOpen(false)

      // Callback
      onInviteSent?.()
    } catch (error) {
      console.error('Invite error:', error)
      toast({
        title: 'Failed to send invitation',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join {teamName}. They'll receive an email with a link to accept.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleInvite()
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  <SelectItem value="editor">Editor - Create and edit prompts</SelectItem>
                  <SelectItem value="admin">Admin - Manage team and members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              💡 The invitation will expire in 7 days
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={loading}>
                {loading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Seat Limit Modal */}
      {seatLimitDetails && (
        <SeatLimitModal
          open={showSeatLimitModal}
          onClose={() => setShowSeatLimitModal(false)}
          currentPlan={currentTier === 'enterprise' ? 'pro' : currentTier}
          currentSeats={seatLimitDetails.currentSeats}
          maxSeats={seatLimitDetails.maxSeats}
          pendingEmail={seatLimitDetails.pendingEmail}
          teamId={teamId}
        />
      )}
    </>
  )
}
