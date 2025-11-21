import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Tools Directory - Prompt Manage',
    description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
    openGraph: {
        title: 'AI Tools Directory - Prompt Manage',
        description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Tools Directory - Prompt Manage',
        description: 'Discover the best AI tools and services. Curated by the community, for everyone.',
    },
}

export default function DirectoryLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
