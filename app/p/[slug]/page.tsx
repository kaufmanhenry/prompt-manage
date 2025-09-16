import { PublicPromptPageClient } from './PublicPromptPageClient'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicPromptPage({ params }: PageProps) {
  const resolvedParams = await params
  return <PublicPromptPageClient params={resolvedParams} />
}
