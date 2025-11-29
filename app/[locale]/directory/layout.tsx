import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tools Directory - Prompt Manage',
  description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
  keywords: [
    'AI tools',
    'AI directory',
    'ChatGPT tools',
    'AI services',
    'machine learning tools',
    'AI software directory',
  ],
  openGraph: {
    title: 'AI Tools Directory - Prompt Manage',
    description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
    type: 'website',
    images: [
      {
        url: 'https://promptmanage.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Tools Directory - Discover the best AI tools and services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Directory - Prompt Manage',
    description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
    images: ['https://promptmanage.com/og-image.png'],
  },
}

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tools Directory',
    description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
    url: 'https://promptmanage.com/directory',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
