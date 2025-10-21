'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { useCreateTeam } from '@/lib/hooks/use-teams'

interface CreateTeamDialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateTeamDialog({
  children,
  open: externalOpen,
  onOpenChange,
}: CreateTeamDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  // Use external control if provided, otherwise use internal state
  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const { toast } = useToast()
  const createTeam = useCreateTeam()
  const { setCurrentTeamId } = useTeamContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamName.trim()) {
      toast({
        title: 'Error',
        description: 'Team name is required',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await createTeam.mutateAsync({
        name: teamName.trim(),
        description: teamDescription.trim() || undefined,
      })

      toast({
        title: 'Success',
        description: `Team "${teamName}" created successfully!`,
      })

      // Switch to the newly created team
      if (result.team) {
        setCurrentTeamId(result.team.id)
      }

      // Reset form and close dialog
      setTeamName('')
      setTeamDescription('')
      setOpen(false)
    } catch (error) {
      console.error('Error creating team:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create team',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a new team to collaborate with others. You can invite members after creating
              the team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Marketing Team"
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teamDescription">Description</Label>
              <Textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Describe your team's purpose... (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setTeamName('')
                setTeamDescription('')
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
