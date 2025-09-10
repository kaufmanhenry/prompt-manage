import { describe, expect, it } from 'vitest';

import { assertOrgAdmin, assertOrgEditor, assertOrgMember } from '@/lib/authz';

function mockSupabase(roles: Record<string, string[]>) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: roles.member ? { role: roles.member[0] } : null }),
        }),
      }),
    }),
  } as any;
}

describe('authz helpers', () => {
  it('assertOrgMember passes when role exists', async () => {
    const supa = mockSupabase({ member: ['VIEWER'] });
    await expect(assertOrgMember(supa, 'u', 'o')).resolves.toBeUndefined();
  });

  it('assertOrgEditor fails for viewer', async () => {
    const supa = mockSupabase({ member: ['VIEWER'] });
    await expect(assertOrgEditor(supa, 'u', 'o')).rejects.toBeTruthy();
  });

  it('assertOrgAdmin fails for editor', async () => {
    const supa = mockSupabase({ member: ['EDITOR'] });
    await expect(assertOrgAdmin(supa, 'u', 'o')).rejects.toBeTruthy();
  });
});
