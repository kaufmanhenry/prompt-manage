// Admin access control utilities
const ADMIN_EMAILS = [
  'mikemoloney.business@gmail.com',
  'hkaufman19@gmail.com',
  'mike@filtergrade.com'
]

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS]
}
