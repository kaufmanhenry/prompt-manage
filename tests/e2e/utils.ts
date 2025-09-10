import type { APIRequestContext, Page } from '@playwright/test';
import { request as apiRequest } from '@playwright/test';

export type AdminClient = APIRequestContext;

export async function createAdminClient(): Promise<AdminClient> {
  const baseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseURL || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin setup'
    );
  }
  return await apiRequest.newContext({
    baseURL: `${baseURL}/auth/v1`,
    extraHTTPHeaders: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
}

export async function adminCreateUser(
  admin: AdminClient,
  email: string,
  password: string
): Promise<string> {
  const res = await admin.post('/admin/users', { data: { email, password, email_confirm: true } });
  if (!res.ok()) throw new Error(`Failed to create user: ${await res.text()}`);
  const json = await res.json();
  return json.id as string;
}

export async function adminDeleteUser(admin: AdminClient, userId: string): Promise<void> {
  const res = await admin.delete(`/admin/users/${userId}`);
  if (!res.ok()) throw new Error(`Failed to delete user: ${await res.text()}`);
}

export async function loginInBrowser(page: Page, email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  await page.addInitScript(
    ({ url, anon, email, password }) => {
      // @ts-ignore
      import('https://esm.sh/@supabase/ssr').then(async (m) => {
        const supabase = m.createBrowserClient(url, anon);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) console.error('signIn error', error);
      });
    },
    { url, anon, email, password }
  );
}

export function randomEmail(prefix: string): string {
  const n = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${n}@example.com`;
}

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
