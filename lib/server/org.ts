import { z } from 'zod';

import { type AuthContext } from './auth';

export const orgIdSchema = z.string().uuid();
export const orgSlugSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/);
export const orgNameSchema = z.string().min(1).max(120);

export async function assertOrgMember(ctx: AuthContext, orgId: string): Promise<void> {
  const { supabase, userId } = ctx;
  const { data, error } = await supabase.rpc('is_org_member', { u: userId, o: orgId });
  if (error || data !== true) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}

export async function assertOrgEditor(ctx: AuthContext, orgId: string): Promise<void> {
  const { supabase, userId } = ctx;
  const { data, error } = await supabase.rpc('is_org_editor', { u: userId, o: orgId });
  if (error || data !== true) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}

export async function assertOrgAdmin(ctx: AuthContext, orgId: string): Promise<void> {
  const { supabase, userId } = ctx;
  const { data, error } = await supabase.rpc('is_org_admin', { u: userId, o: orgId });
  if (error || data !== true) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
}
