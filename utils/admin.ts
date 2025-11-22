export const ADMIN_EMAILS = ['mike@filtergrade.com', 'mikemoloney.business@gmail.com']

export function isAdmin(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}
