import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/server/auth'
import { assertOrgAdmin, orgIdSchema } from '@/lib/server/org'

type RouteContext = { params: { orgId: string; inviteId: string } }

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth()
    const parse = orgIdSchema.safeParse(context.params.orgId)
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 })
    const orgId = parse.data
    await assertOrgAdmin({ supabase, userId }, orgId)

    // Mark invitation as revoked
    const { error } = await supabase
      .from('organization_invitations')
      .update({ status: 'revoked' })
      .eq('id', context.params.inviteId)
      .eq('org_id', orgId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error?.status ?? 500
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status })
  }
}


