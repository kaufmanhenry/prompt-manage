/**
 * Prompts realtime subscription utilities
 *
 * Channel scoping:
 * - Personal: filter by user_id=eq.<userId>
 * - Org: filter by org_id=eq.<orgId>
 *
 * Always unsubscribe the previous channel when workspace changes to avoid leaks.
 */

import { createClient } from '@/utils/supabase/client';

export type Workspace = { type: 'personal'; userId: string } | { type: 'org'; orgId: string };

export type PromptsChangeEvent = {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  record: any;
  old_record?: any;
};

export function subscribeToPromptsChanges(
  workspace: Workspace,
  onChange: (evt: PromptsChangeEvent) => void
): () => void {
  const supabase = createClient();
  const channelName =
    workspace.type === 'org'
      ? `prompts:org:${workspace.orgId}`
      : `prompts:user:${workspace.userId}`;
  const filter =
    workspace.type === 'org' ? `org_id=eq.${workspace.orgId}` : `user_id=eq.${workspace.userId}`;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'prompts', filter },
      (payload: any) => {
        const evt: PromptsChangeEvent = {
          type: payload.eventType,
          record: payload.new,
          old_record: payload.old,
        };
        onChange(evt);
      }
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch {}
  };
}
