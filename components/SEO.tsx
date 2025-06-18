'use client'

import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  organization?: {
    name: string
    url: string
    logo: string
  }
}

export function SEO({
  title,
  description,
  url,
  image = 'https://promptmanage.com/og-image.svg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  organization = {
    name: 'Prompt Manage',
    url: 'https://promptmanage.com',
    logo: 'https://promptmanage.com/logo.svg',
  },
}: SEOProps) {
  const fullUrl = url.startsWith('http') ? url : `https://promptmanage.com${url}`

  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    const baseStructuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@graph': [
        // Organization
        {
          '@type': 'Organization',
          '@id': `${organization.url}/#organization`,
          name: organization.name,
          url: organization.url,
          logo: {
            '@type': 'ImageObject',
            url: organization.logo,
          },
          sameAs: [
            'https://twitter.com/promptmanage',
            'https://linkedin.com/company/promptmanage',
          ],
        },
        // Website
        {
          '@type': 'WebSite',
          '@id': `${organization.url}/#website`,
          url: organization.url,
          name: organization.name,
          description: 'Organize, share, and discover AI prompts',
          publisher: {
            '@id': `${organization.url}/#organization`,
          },
        },
        // WebPage
        {
          '@type': 'WebPage',
          '@id': `${fullUrl}#webpage`,
          url: fullUrl,
          name: title,
          description: description,
          isPartOf: {
            '@id': `${organization.url}/#website`,
          },
          about: {
            '@id': `${organization.url}/#organization`,
          },
        },
      ],
    }

    // Add Article schema for prompt pages
    if (type === 'article' && publishedTime) {
      (baseStructuredData['@graph'] as object[]).push({
        '@type': 'Article',
        '@id': `${fullUrl}#article`,
        isPartOf: {
          '@id': `${fullUrl}#webpage`,
        },
        author: {
          '@type': 'Person',
          name: author || 'Prompt Manage User',
        },
        headline: title,
        description: description,
        image: image,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        publisher: {
          '@id': `${organization.url}/#organization`,
        },
        mainEntityOfPage: {
          '@id': `${fullUrl}#webpage`,
        },
        keywords: tags.join(', '),
      })
    }

    // Add Person schema for profile pages
    if (type === 'profile' && author) {
      (baseStructuredData['@graph'] as object[]).push({
        '@type': 'Person',
        '@id': `${fullUrl}#person`,
        name: author,
        url: fullUrl,
        sameAs: [],
      })
    }

    return baseStructuredData
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={organization.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@promptmanage" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={author || organization.name} />
      {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />
    </Head>
  )
} 