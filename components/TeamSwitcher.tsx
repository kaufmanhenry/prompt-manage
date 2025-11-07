'use client'

import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useState } from 'react'

import { CreateTeamDialog } from '@/components/CreateTeamDialog'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTeamContext } from '@/contexts/team-context'
import { useUserTeams } from '@/lib/hooks/use-teams'
import { cn } from '@/lib/utils'

export function TeamSwitcher() {
  const [open, setOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { data: teams, isLoading } = useUserTeams()
  const { currentTeamId, setCurrentTeamId } = useTeamContext()

  const currentTeam = teams?.find((t) => t.team_id === currentTeamId)

  const handleSelectTeam = (teamId: string) => {
    setCurrentTeamId(teamId)
    setOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        <span className="text-xs text-muted-foreground">Loading teams...</span>
      </div>
    )
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Select team"
            className="h-auto w-full justify-between rounded-lg border px-2 py-1 font-normal hover:bg-accent"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                {currentTeam?.teams.name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {currentTeam?.teams.name || 'Select team...'}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <div className="px-2 pt-2">
              <CommandInput placeholder="Search teams..." />
            </div>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandList>
              <CommandGroup heading="Your Teams">
                {teams?.map((team) => (
                  <CommandItem
                    key={team.team_id}
                    onSelect={() => handleSelectTeam(team.team_id)}
                    className="cursor-pointer text-sm"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                      {team.teams.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 truncate">{team.teams.name}</span>
                    {team.is_personal && (
                      <span className="ml-2 text-xs text-muted-foreground">(Personal)</span>
                    )}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        currentTeamId === team.team_id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setCreateDialogOpen(true)
                  }}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateTeamDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  )
}
