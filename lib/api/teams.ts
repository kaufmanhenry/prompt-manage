// Teams API Functions
import type { CreateTeamInput, InviteMemberInput, TeamWithMembership } from '@/lib/types/teams'
import { createClient } from '@/utils/supabase/client'

/**
 * Get all teams for the current user
 */
export async function getUserTeams(): Promise<TeamWithMembership[]> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_user_teams')

  if (error) throw error
  return data || []
}

/**
 * Get user's default (personal) team ID
 */
export async function getUserDefaultTeamId(): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_user_default_team')

  if (error) throw error
  return data
}

/**
 * Create a new team
 */
export async function createTeam(input: CreateTeamInput) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Use RPC function to create team and add user as owner
  // This bypasses RLS using security definer
  const { data: team, error } = await supabase.rpc('create_team_with_owner', {
    p_name: input.name,
    p_description: input.description || null,
  })

  if (error) throw error

  return { team }
}

/**
 * Get team by slug
 */
export async function getTeamBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data
}

/**
 * Get team members
 */
export async function getTeamMembers(teamId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('team_members')
    .select(
      `
      *,
      user_profiles(display_name, avatar_url)
    `,
    )
    .eq('team_id', teamId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Invite member to team
 */
export async function inviteTeamMember(teamId: string, input: InviteMemberInput) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if team has reached member limit
  const { data: team } = await supabase
    .from('teams')
    .select('max_members')
    .eq('id', teamId)
    .single()

  if (!team) throw new Error('Team not found')

  const { count } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .eq('is_active', true)

  if (count && count >= team.max_members) {
    throw new Error('Seat limit reached. Upgrade your plan to add more members.')
  }

  // Create invitation
  const { data, error } = await supabase
    .from('team_invitations')
    .insert({
      team_id: teamId,
      email: input.email,
      role: input.role,
      invited_by: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update team
 */
export async function updateTeam(teamId: string, updates: Partial<CreateTeamInput>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', teamId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete team (only owner can do this)
 */
export async function deleteTeam(teamId: string) {
  const supabase = createClient()

  const { error } = await supabase.from('teams').update({ is_active: false }).eq('id', teamId)

  if (error) throw error
}
