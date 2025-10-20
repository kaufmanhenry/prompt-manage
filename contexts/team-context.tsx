'use client'

import { createContext, type ReactNode,useContext, useEffect, useState } from 'react'

import { useDefaultTeamId } from '@/lib/hooks/use-teams'

interface TeamContextType {
  currentTeamId: string | null
  setCurrentTeamId: (id: string | null) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

const TEAM_STORAGE_KEY = 'prompt-manage-current-team'

export function TeamProvider({ children }: { children: ReactNode }) {
  const [currentTeamId, setCurrentTeamIdState] = useState<string | null>(null)
  const { data: defaultTeamId, isLoading } = useDefaultTeamId()

  // Load team from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY)
    if (stored) {
      setCurrentTeamIdState(stored)
    }
  }, [])

  // Set default team if no team is selected
  useEffect(() => {
    if (!isLoading && defaultTeamId && !currentTeamId) {
      setCurrentTeamIdState(defaultTeamId)
    }
  }, [defaultTeamId, currentTeamId, isLoading])

  const setCurrentTeamId = (id: string | null) => {
    setCurrentTeamIdState(id)
    if (id) {
      localStorage.setItem(TEAM_STORAGE_KEY, id)
    } else {
      localStorage.removeItem(TEAM_STORAGE_KEY)
    }
  }

  return (
    <TeamContext.Provider value={{ currentTeamId, setCurrentTeamId }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeamContext() {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error('useTeamContext must be used within TeamProvider')
  }
  return context
}
