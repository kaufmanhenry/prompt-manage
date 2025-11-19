import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Protection Addendum (DPA) — Prompt Manage',
  description:
    'Formal data processing agreement supplement for Prompt Manage customers requiring GDPR-compliant data processing clarity.',
  keywords: ['DPA', 'data protection addendum', 'GDPR', 'data processing agreement', 'compliance'],
  openGraph: {
    title: 'Data Protection Addendum (DPA) — Prompt Manage',
    description: 'GDPR-compliant data processing agreement.',
    type: 'website',
  },
}

export default function DPALayout({ children }: { children: React.ReactNode }) {
  return children
}
