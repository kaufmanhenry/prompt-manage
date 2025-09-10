import { z } from 'zod';

import type { createClient } from '@/utils/supabase/server';

export type OrgRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export const orgIdSchema = z.string().uuid();
export const orgSlugSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/);
export const orgNameSchema = z.string().min(1).max(120);

export async function getMembershipRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  orgId: string
): Promise<OrgRole | null> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.role as OrgRole) ?? null;
}

export async function assertOrgMember(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  orgId: string
): Promise<void> {
  const role = await getMembershipRole(supabase, userId, orgId);
  if (!role) throw Object.assign(new Error('Forbidden'), { status: 403 });
}

export async function assertOrgEditor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  orgId: string
): Promise<void> {
  const role = await getMembershipRole(supabase, userId, orgId);
  if (!role || !['OWNER', 'ADMIN', 'EDITOR'].includes(role)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}

export async function assertOrgAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  orgId: string
): Promise<void> {
  const role = await getMembershipRole(supabase, userId, orgId);
  if (!role || !['OWNER', 'ADMIN'].includes(role)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}

export async function assertNotLastOwner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orgId: string,
  excludeUserId?: string
): Promise<void> {
  let query = supabase
    .from('organization_members')
    .select('user_id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('role', 'OWNER');
  if (excludeUserId) {
    // Supabase doesn't support neq in head count directly, workaround by fetching ids then counting
    const { data, error } = await supabase
      .from('organization_members')
      .select('user_id')
      .eq('org_id', orgId)
      .eq('role', 'OWNER');
    if (error) throw error;
    const owners = (data ?? []).filter((m) => m.user_id !== excludeUserId);
    if (owners.length === 0) {
      throw Object.assign(new Error('Cannot remove last OWNER'), { status: 400 });
    }
    return;
  }
  const { count, error } = await query;
  if (error) throw error;
  if ((count ?? 0) <= 1) {
    throw Object.assign(new Error('Cannot remove last OWNER'), { status: 400 });
  }
}
