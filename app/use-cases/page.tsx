import type { Metadata } from 'next'

import UseCasesClient from './UseCasesClient'

export const metadata: Metadata = {
  title: 'AI Prompt Use Cases — Real-World Examples for Every Role',
  description: 'Discover how marketing managers, content creators, developers, and business owners use AI prompts to save time and increase productivity. Browse 24+ ready-to-use prompt templates.',
  keywords: ['AI use cases', 'prompt examples', 'marketing prompts', 'content creation', 'business automation', 'AI templates'],
  openGraph: {
    title: 'AI Prompt Use Cases — Real-World Examples for Every Role',
    description: 'Browse 24+ AI prompt templates for marketing, content, sales, support, and development. Save hours every week.',
    type: 'website',
  },
}

export default function UseCasesPage() {
  return <UseCasesClient />
}
