// Teams Types
// Corresponds to database schema from teams_core.sql

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type TeamTier = 'free' | 'pro' | 'enterprise'
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired'

export interface Team {
  id: string
  name: string
  slug: string
  description: string | null
  avatar_url: string | null
  tier: TeamTier
  max_members: number
  max_storage_gb: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string | null
  subscription_period_end: string | null
  is_active: boolean
  is_verified: boolean
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: TeamRole
  invited_by: string | null
  invited_at: string | null
  joined_at: string
  is_active: boolean
  last_active_at: string
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
  user_profiles?: {
    display_name: string | null
    avatar_url: string | null
  }
}

export interface TeamInvitation {
  id: string
  team_id: string
  email: string
  role: TeamRole
  invited_by: string
  token: string
  expires_at: string
  status: InvitationStatus
  accepted_by: string | null
  accepted_at: string | null
  created_at: string
}

export interface TeamWithMembership {
  team_id: string
  teams: Team
  role: TeamRole
  is_personal: boolean
}

export interface CreateTeamInput {
  name: string
  description?: string
}

export interface InviteMemberInput {
  email: string
  role: TeamRole
}

export interface UpdateTeamInput {
  name?: string
  description?: string
  avatar_url?: string
}
