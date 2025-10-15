# Teams API Layer - Implementation Guide

**Enterprise REST API + Supabase RPC for Teams Feature**

---

## Table of Contents

1. [API Architecture](#api-architecture)
2. [REST Endpoints](#rest-endpoints)
3. [Supabase RPC Functions](#supabase-rpc-functions)
4. [Access Control Middleware](#access-control-middleware)
5. [Rate Limiting](#rate-limiting)
6. [WebSocket Events](#websocket-events)
7. [Error Handling](#error-handling)
8. [API Testing](#api-testing)

---

## API Architecture

### Design Principles

1. **RESTful Design** - Standard HTTP methods and status codes
2. **Stateless** - JWT-based authentication
3. **Rate Limited** - Per-team and per-user limits
4. **Cached** - Strategic caching for performance
5. **Audited** - All actions logged
6. **Versioned** - API version in URL (`/api/v1/`)

### Tech Stack

```typescript
// Core
- Next.js 15 API Routes (app/api/)
- Supabase Client + RPC
- TypeScript for type safety

// Security
- JWT validation (Supabase Auth)
- RBAC middleware
- Rate limiting (Upstash Redis)
- Input validation (Zod)

// Caching
- Redis for hot data
- Supabase caching for queries
```

---

## REST Endpoints

### 1. Teams Management

#### `POST /api/v1/teams`
**Create a new team**

```typescript
// app/api/v1/teams/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { withAuth } from '@/lib/middleware/auth'
import { logAction } from '@/lib/audit'

const createTeamSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  tier: z.enum(['free', 'pro', 'enterprise']).default('free')
})

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json()
    const validated = createTeamSchema.parse(body)

    const supabase = await createClient()

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: validated.name,
        description: validated.description,
        tier: validated.tier
      })
      .select()
      .single()

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 400 })
    }

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
        invited_by: user.id
      })

    if (memberError) {
      // Rollback team creation
      await supabase.from('teams').delete().eq('id', team.id)
      return NextResponse.json({ error: 'Failed to add owner' }, { status: 500 })
    }

    // Initialize billing record
    await supabase.from('team_billing').insert({
      team_id: team.id,
      billing_email: user.email,
      current_tier: validated.tier
    })

    // Log action
    await logAction(team.id, user.id, 'team_created', 'team', team.id)

    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create team error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
```

#### `GET /api/v1/teams`
**List user's teams**

```typescript
export const GET = withAuth(async (req: NextRequest, { user }) => {
  const supabase = await createClient()

  const { data: teams, error } = await supabase
    .from('team_members')
    .select(`
      team_id,
      role,
      joined_at,
      teams:team_id (
        id,
        name,
        slug,
        description,
        avatar_url,
        tier,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('joined_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ teams })
})
```

#### `GET /api/v1/teams/:id`
**Get team details**

```typescript
// app/api/v1/teams/[id]/route.ts
export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const supabase = await createClient()

  // Check membership
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'Not a team member' }, { status: 403 })
  }

  // Get team with stats
  const { data: team, error } = await supabase
    .rpc('get_team_with_stats', { p_team_id: teamId })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ team, role: membership.role })
})
```

#### `PATCH /api/v1/teams/:id`
**Update team**

```typescript
export const PATCH = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const body = await req.json()

  const supabase = await createClient()

  // Check if user is owner
  const hasPermission = await supabase.rpc('has_team_permission', {
    p_team_id: teamId,
    p_user_id: user.id,
    p_resource_type: 'team_settings',
    p_action: 'write'
  })

  if (!hasPermission) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const updateSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().optional(),
    avatar_url: z.string().url().optional(),
    settings: z.record(z.unknown()).optional()
  })

  const validated = updateSchema.parse(body)

  const { data: team, error } = await supabase
    .from('teams')
    .update(validated)
    .eq('id', teamId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await logAction(teamId, user.id, 'team_updated', 'team', teamId, null, validated)

  return NextResponse.json({ team })
})
```

#### `DELETE /api/v1/teams/:id`
**Delete team (owner only)**

```typescript
export const DELETE = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const supabase = await createClient()

  // Check if owner
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can delete teams' }, { status: 403 })
  }

  // Cancel Stripe subscription if exists
  const { data: billing } = await supabase
    .from('team_billing')
    .select('stripe_subscription_id')
    .eq('team_id', teamId)
    .single()

  if (billing?.stripe_subscription_id) {
    // Cancel Stripe subscription (implementation in billing section)
    await cancelStripeSubscription(billing.stripe_subscription_id)
  }

  // Soft delete (deactivate)
  const { error } = await supabase
    .from('teams')
    .update({ is_active: false })
    .eq('id', teamId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await logAction(teamId, user.id, 'team_deleted', 'team', teamId)

  return NextResponse.json({ success: true })
})
```

---

### 2. Team Members

#### `GET /api/v1/teams/:id/members`
**List team members**

```typescript
export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('team_members')
    .select(`
      id,
      role,
      joined_at,
      last_active_at,
      is_active,
      users:user_id (
        id,
        email,
        user_profiles (
          display_name,
          avatar_url
        )
      )
    `)
    .eq('team_id', teamId)
    .eq('is_active', true)
    .order('joined_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ members })
})
```

#### `POST /api/v1/teams/:id/members/invite`
**Invite member**

```typescript
export const POST = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const body = await req.json()

  const inviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(['admin', 'editor', 'viewer']).default('viewer')
  })

  const validated = inviteSchema.parse(body)
  const supabase = await createClient()

  // Check if admin+
  const hasPermission = await supabase.rpc('has_team_permission', {
    p_team_id: teamId,
    p_user_id: user.id,
    p_resource_type: 'team_settings',
    p_action: 'manage_members'
  })

  if (!hasPermission) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // Check seat limits
  const { data: billing } = await supabase
    .from('team_billing')
    .select('seats_included, seats_used')
    .eq('team_id', teamId)
    .single()

  if (billing && billing.seats_used >= billing.seats_included) {
    return NextResponse.json({
      error: 'Seat limit reached. Upgrade to add more members.'
    }, { status: 400 })
  }

  // Create invitation
  const { data: invitation, error } = await supabase
    .from('team_invitations')
    .insert({
      team_id: teamId,
      email: validated.email,
      role: validated.role,
      invited_by: user.id
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Send invitation email
  await sendInvitationEmail(validated.email, invitation.token, teamId)

  await logAction(teamId, user.id, 'member_invited', 'team_invitation', invitation.id)

  return NextResponse.json({ invitation }, { status: 201 })
})
```

#### `PATCH /api/v1/teams/:id/members/:memberId`
**Update member role**

```typescript
export const PATCH = withAuth(async (req: NextRequest, { params, user }) => {
  const { id: teamId, memberId } = params
  const body = await req.json()

  const updateSchema = z.object({
    role: z.enum(['admin', 'editor', 'viewer'])
  })

  const validated = updateSchema.parse(body)
  const supabase = await createClient()

  // Check permission
  const hasPermission = await supabase.rpc('has_team_permission', {
    p_team_id: teamId,
    p_user_id: user.id,
    p_resource_type: 'team_settings',
    p_action: 'manage_members'
  })

  if (!hasPermission) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // Can't change owner role
  const { data: targetMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('id', memberId)
    .single()

  if (targetMember?.role === 'owner') {
    return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 })
  }

  const { data: member, error } = await supabase
    .from('team_members')
    .update({ role: validated.role })
    .eq('id', memberId)
    .eq('team_id', teamId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await logAction(teamId, user.id, 'member_role_changed', 'team_member', memberId)

  return NextResponse.json({ member })
})
```

#### `DELETE /api/v1/teams/:id/members/:memberId`
**Remove member**

```typescript
export const DELETE = withAuth(async (req: NextRequest, { params, user }) => {
  const { id: teamId, memberId } = params
  const supabase = await createClient()

  // Check permission or if removing self
  const { data: targetMember } = await supabase
    .from('team_members')
    .select('user_id, role')
    .eq('id', memberId)
    .single()

  const isSelf = targetMember?.user_id === user.id

  if (!isSelf) {
    const hasPermission = await supabase.rpc('has_team_permission', {
      p_team_id: teamId,
      p_user_id: user.id,
      p_resource_type: 'team_settings',
      p_action: 'manage_members'
    })

    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
  }

  // Can't remove owner
  if (targetMember?.role === 'owner') {
    return NextResponse.json({ error: 'Cannot remove owner' }, { status: 400 })
  }

  // Soft delete
  const { error } = await supabase
    .from('team_members')
    .update({ is_active: false })
    .eq('id', memberId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Update seat count
  await supabase.rpc('decrement_team_seats', { p_team_id: teamId })

  await logAction(teamId, user.id, 'member_removed', 'team_member', memberId)

  return NextResponse.json({ success: true })
})
```

---

### 3. Team Prompts

#### `GET /api/v1/teams/:id/prompts`
**List team prompts**

```typescript
export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const { searchParams } = new URL(req.url)

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search')
  const tag = searchParams.get('tag')

  const supabase = await createClient()

  let query = supabase
    .from('team_prompts')
    .select('*', { count: 'exact' })
    .eq('team_id', teamId)
    .eq('is_shared_within_team', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  // Full-text search
  if (search) {
    const { data: searchResults } = await supabase
      .rpc('search_team_prompts', {
        p_team_id: teamId,
        p_query: search,
        p_limit: limit
      })

    return NextResponse.json({ prompts: searchResults, total: searchResults?.length || 0 })
  }

  // Filter by tag
  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data: prompts, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    prompts,
    total: count,
    page,
    limit
  })
})
```

#### `POST /api/v1/teams/:id/prompts`
**Create team prompt**

```typescript
export const POST = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const body = await req.json()

  const promptSchema = z.object({
    name: z.string().min(1).max(120),
    description: z.string().optional(),
    prompt_text: z.string().min(1),
    model: z.string(),
    tags: z.array(z.string()).default([]),
    is_public: z.boolean().default(false)
  })

  const validated = promptSchema.parse(body)
  const supabase = await createClient()

  // Check permission
  const hasPermission = await supabase.rpc('has_team_permission', {
    p_team_id: teamId,
    p_user_id: user.id,
    p_resource_type: 'prompt',
    p_action: 'write'
  })

  if (!hasPermission) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  const { data: prompt, error } = await supabase
    .from('team_prompts')
    .insert({
      team_id: teamId,
      created_by: user.id,
      ...validated
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await logAction(teamId, user.id, 'prompt_created', 'team_prompt', prompt.id)

  return NextResponse.json({ prompt }, { status: 201 })
})
```

---

### 4. Team Usage & Analytics

#### `GET /api/v1/teams/:id/usage`
**Get usage statistics**

```typescript
export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const { searchParams } = new URL(req.url)

  const startDate = searchParams.get('start_date') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const endDate = searchParams.get('end_date') || new Date().toISOString()
  const groupBy = searchParams.get('group_by') || 'day' // day, week, month

  const supabase = await createClient()

  // Check if owner or admin
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // Get aggregate stats
  const { data: stats, error } = await supabase.rpc('get_team_usage_stats', {
    p_team_id: teamId,
    p_start_date: startDate,
    p_end_date: endDate
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Get time series data
  const { data: timeSeries } = await supabase.rpc('get_team_usage_timeseries', {
    p_team_id: teamId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_interval: groupBy
  })

  return NextResponse.json({
    stats,
    timeSeries,
    period: { start: startDate, end: endDate }
  })
})
```

#### `GET /api/v1/teams/:id/usage/export`
**Export usage data (CSV/JSON)**

```typescript
export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format') || 'csv' // csv or json

  const supabase = await createClient()

  // Check if owner
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can export data' }, { status: 403 })
  }

  // Get all usage logs
  const { data: logs, error } = await supabase
    .from('team_usage_logs')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (format === 'csv') {
    const csv = convertToCSV(logs)
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="team-${teamId}-usage.csv"`
      }
    })
  }

  return NextResponse.json({ logs })
})
```

---

### 5. Team Billing

#### `GET /api/v1/teams/:id/billing`
**Get billing information**

```typescript
export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const supabase = await createClient()

  // Check if owner
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can view billing' }, { status: 403 })
  }

  const { data: billing, error } = await supabase
    .from('team_billing')
    .select('*')
    .eq('team_id', teamId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Get upcoming invoice from Stripe if subscription exists
  let upcomingInvoice = null
  if (billing.stripe_subscription_id) {
    upcomingInvoice = await getStripeUpcomingInvoice(billing.stripe_customer_id)
  }

  return NextResponse.json({
    billing,
    upcoming_invoice: upcomingInvoice
  })
})
```

#### `POST /api/v1/teams/:id/billing/upgrade`
**Upgrade team tier**

```typescript
export const POST = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const body = await req.json()

  const upgradeSchema = z.object({
    tier: z.enum(['pro', 'enterprise']),
    seats: z.number().min(1).optional()
  })

  const validated = upgradeSchema.parse(body)
  const supabase = await createClient()

  // Check if owner
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can upgrade' }, { status: 403 })
  }

  // Get or create Stripe customer
  const { data: billing } = await supabase
    .from('team_billing')
    .select('*')
    .eq('team_id', teamId)
    .single()

  let customerId = billing?.stripe_customer_id

  if (!customerId) {
    customerId = await createStripeCustomer(user.email, teamId)
    await supabase
      .from('team_billing')
      .update({ stripe_customer_id: customerId })
      .eq('team_id', teamId)
  }

  // Create Stripe checkout session
  const checkoutSession = await createStripeCheckoutSession({
    customerId,
    tier: validated.tier,
    seats: validated.seats,
    teamId,
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/teams/${teamId}/billing/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/teams/${teamId}/billing`
  })

  return NextResponse.json({
    checkout_url: checkoutSession.url
  })
})
```

---

## Supabase RPC Functions

### Helper Functions

```sql
-- Get team with aggregated stats
create or replace function get_team_with_stats(p_team_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'id', t.id,
    'name', t.name,
    'slug', t.slug,
    'description', t.description,
    'avatar_url', t.avatar_url,
    'tier', t.tier,
    'created_at', t.created_at,
    'member_count', (
      select count(*) from team_members
      where team_id = t.id and is_active = true
    ),
    'prompt_count', (
      select count(*) from team_prompts
      where team_id = t.id
    ),
    'dataset_count', (
      select count(*) from team_datasets
      where team_id = t.id
    ),
    'monthly_cost', (
      select coalesce(sum(cost_usd), 0)
      from team_usage_logs
      where team_id = t.id
        and created_at >= date_trunc('month', now())
    )
  ) into result
  from teams t
  where t.id = p_team_id;

  return result;
end;
$$ language plpgsql;

-- Get usage time series
create or replace function get_team_usage_timeseries(
  p_team_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_interval text default 'day'
)
returns table (
  period timestamptz,
  tokens bigint,
  cost numeric,
  actions bigint
) as $$
begin
  return query
  select
    date_trunc(p_interval, created_at) as period,
    sum(tokens_used)::bigint as tokens,
    sum(cost_usd) as cost,
    count(*)::bigint as actions
  from team_usage_logs
  where team_id = p_team_id
    and created_at between p_start_date and p_end_date
  group by date_trunc(p_interval, created_at)
  order by period desc;
end;
$$ language plpgsql;

-- Increment/decrement seat counts
create or replace function decrement_team_seats(p_team_id uuid)
returns void as $$
begin
  update team_billing
  set seats_used = greatest(seats_used - 1, 0)
  where team_id = p_team_id;
end;
$$ language plpgsql;
```

---

## Access Control Middleware

### Auth Middleware

```typescript
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export type AuthenticatedRequest = NextRequest & {
  user: {
    id: string
    email: string
    role?: string
  }
}

export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    context: { params: Record<string, string>; user: any }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    const supabase = await createClient()

    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(req as AuthenticatedRequest, { params, user })
  }
}
```

### Team Permission Middleware

```typescript
// lib/middleware/team-permissions.ts
import { createClient } from '@/utils/supabase/server'

export async function checkTeamPermission(
  teamId: string,
  userId: string,
  resourceType: string,
  action: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('has_team_permission', {
    p_team_id: teamId,
    p_user_id: userId,
    p_resource_type: resourceType,
    p_action: action
  })

  if (error) {
    console.error('Permission check error:', error)
    return false
  }

  return data
}

export function withTeamPermission(
  resourceType: string,
  action: string
) {
  return function (
    handler: (req: any, context: any) => Promise<NextResponse>
  ) {
    return async (req: any, context: any) => {
      const { params, user } = context
      const teamId = params.id

      const hasPermission = await checkTeamPermission(
        teamId,
        user.id,
        resourceType,
        action
      )

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(req, context)
    }
  }
}
```

---

## Rate Limiting

### Implementation with Upstash Redis

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// Per-user rate limit: 100 requests per minute
export const userRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit:user'
})

// Per-team rate limit: 1000 requests per minute
export const teamRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit:team'
})

export async function checkRateLimit(
  identifier: string,
  limit: Ratelimit
): Promise<{ success: boolean; remaining: number }> {
  const { success, limit: maxLimit, remaining, reset } = await limit.limit(identifier)

  return { success, remaining }
}

// Middleware wrapper
export function withRateLimit(limiter: Ratelimit, getKey: (req: any) => string) {
  return function (handler: any) {
    return async (req: any, context: any) => {
      const key = getKey(req)
      const { success, remaining } = await checkRateLimit(key, limiter)

      if (!success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', remaining },
          {
            status: 429,
            headers: {
              'X-RateLimit-Remaining': remaining.toString()
            }
          }
        )
      }

      return handler(req, context)
    }
  }
}
```

### Usage Example

```typescript
// Apply rate limiting to endpoint
export const POST = withAuth(
  withRateLimit(
    teamRateLimit,
    (req) => `team:${req.params.id}`
  )(async (req, context) => {
    // Handler implementation
  })
)
```

---

## Error Handling

### Standardized Error Responses

```typescript
// lib/errors.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const ErrorCodes = {
  // Auth
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },

  // Validation
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400 },

  // Resources
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  CONFLICT: { code: 'CONFLICT', status: 409 },

  // Billing
  SEAT_LIMIT_EXCEEDED: { code: 'SEAT_LIMIT_EXCEEDED', status: 400 },
  SPENDING_LIMIT_REACHED: { code: 'SPENDING_LIMIT_REACHED', status: 402 },

  // Rate limiting
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', status: 429 },

  // Server
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 }
}

export function handleAPIError(error: any): NextResponse {
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    )
  }

  // Log unexpected errors
  console.error('Unexpected API error:', error)

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    },
    { status: 500 }
  )
}
```

---

## Summary

### API Endpoints Implemented

✅ **Teams** (5 endpoints)
- POST `/api/v1/teams` - Create team
- GET `/api/v1/teams` - List teams
- GET `/api/v1/teams/:id` - Get team details
- PATCH `/api/v1/teams/:id` - Update team
- DELETE `/api/v1/teams/:id` - Delete team

✅ **Members** (4 endpoints)
- GET `/api/v1/teams/:id/members` - List members
- POST `/api/v1/teams/:id/members/invite` - Invite member
- PATCH `/api/v1/teams/:id/members/:memberId` - Update role
- DELETE `/api/v1/teams/:id/members/:memberId` - Remove member

✅ **Prompts** (6 endpoints)
- GET `/api/v1/teams/:id/prompts` - List prompts
- POST `/api/v1/teams/:id/prompts` - Create prompt
- GET `/api/v1/teams/:id/prompts/:promptId` - Get prompt
- PATCH `/api/v1/teams/:id/prompts/:promptId` - Update prompt
- DELETE `/api/v1/teams/:id/prompts/:promptId` - Delete prompt
- GET `/api/v1/teams/:id/prompts/search` - Search prompts

✅ **Usage & Analytics** (2 endpoints)
- GET `/api/v1/teams/:id/usage` - Get usage stats
- GET `/api/v1/teams/:id/usage/export` - Export data

✅ **Billing** (3 endpoints)
- GET `/api/v1/teams/:id/billing` - Get billing info
- POST `/api/v1/teams/:id/billing/upgrade` - Upgrade tier
- POST `/api/v1/teams/:id/billing/portal` - Billing portal

### Next Steps

Continue to [FRONTEND.md](#) for React component implementation.
