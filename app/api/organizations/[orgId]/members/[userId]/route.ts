import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/server/auth'
import { assertOrgAdmin, orgIdSchema } from '@/lib/server/org'
import { assertNotLastOwner } from '@/lib/authz'

type RouteContext = { params: { orgId: string; userId: string } }

const updateSchema = z.object({ role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']) })

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth()
    const parse = orgIdSchema.safeParse(context.params.orgId)
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 })
    const orgId = parse.data
    await assertOrgAdmin({ supabase, userId }, orgId)

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request', details: parsed.error.issues }, { status: 400 })

    // Prevent downgrading the last OWNER
    if (parsed.data.role !== 'OWNER') {
      await assertNotLastOwner(supabase as any, orgId, context.params.userId)
    }

    const { error } = await supabase
      .from('organization_members')
      .update({ role: parsed.data.role })
      .eq('org_id', orgId)
      .eq('user_id', context.params.userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error?.status ?? 500
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth()
    const parse = orgIdSchema.safeParse(context.params.orgId)
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 })
    const orgId = parse.data

    // Allow self-leave or admin removal; block removing last OWNER
    if (userId !== context.params.userId) {
      await assertOrgAdmin({ supabase, userId }, orgId)
      await assertNotLastOwner(supabase as any, orgId, context.params.userId)
    } else {
      // self-leave guard: ensure not last owner
      await assertNotLastOwner(supabase as any, orgId, context.params.userId)
    }

    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('org_id', orgId)
      .eq('user_id', context.params.userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error?.status ?? 500
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status })
  }
}


