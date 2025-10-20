// Teams React Hooks
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as api from '@/lib/api/teams'
import type { CreateTeamInput, InviteMemberInput } from '@/lib/types/teams'

export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters: string) => [...teamKeys.lists(), { filters }] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
  members: (teamId: string) => [...teamKeys.all, 'members', teamId] as const,
  defaultTeam: () => [...teamKeys.all, 'default'] as const,
}

/**
 * Get all teams for current user
 */
export function useUserTeams() {
  return useQuery({
    queryKey: teamKeys.lists(),
    queryFn: api.getUserTeams,
  })
}

/**
 * Get user's default (personal) team
 */
export function useDefaultTeamId() {
  return useQuery({
    queryKey: teamKeys.defaultTeam(),
    queryFn: api.getUserDefaultTeamId,
  })
}

/**
 * Get team by slug
 */
export function useTeamBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: teamKeys.detail(slug || ''),
    queryFn: () => api.getTeamBySlug(slug!),
    enabled: !!slug,
  })
}

/**
 * Get team members
 */
export function useTeamMembers(teamId: string | undefined) {
  return useQuery({
    queryKey: teamKeys.members(teamId || ''),
    queryFn: () => api.getTeamMembers(teamId!),
    enabled: !!teamId,
  })
}

/**
 * Create team mutation
 */
export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTeamInput) => api.createTeam(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
    },
  })
}

/**
 * Invite team member mutation
 */
export function useInviteTeamMember(teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: InviteMemberInput) => api.inviteTeamMember(teamId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: teamKeys.members(teamId) })
    },
  })
}

/**
 * Update team mutation
 */
export function useUpdateTeam(teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<CreateTeamInput>) => api.updateTeam(teamId, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) })
      void queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
    },
  })
}

/**
 * Delete team mutation
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teamId: string) => api.deleteTeam(teamId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: teamKeys.lists() })
    },
  })
}
