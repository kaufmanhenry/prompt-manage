import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public Prompts Directory - Discover AI Prompts | Prompt Manage',
  description: 'Browse and discover hundreds of AI prompts shared by the community. Find prompts for ChatGPT, Claude, Gemini, and more. Search by model, tags, and popularity.',
  keywords: 'AI prompts directory, ChatGPT prompts, Claude prompts, Gemini prompts, prompt discovery, AI tools, prompt sharing',
  authors: [{ name: 'Prompt Manage' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://promptmanage.com'),
  alternates: {
    canonical: '/p',
  },
      openGraph: {
      title: 'Public Prompts Directory - Discover AI Prompts',
      description: 'Browse and discover hundreds of AI prompts shared by the community. Find prompts for ChatGPT, Claude, Gemini, and more.',
    url: 'https://promptmanage.com/p',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Public Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
      twitter: {
      card: 'summary_large_image',
      title: 'Public Prompts Directory - Discover AI Prompts',
      description: 'Browse and discover hundreds of AI prompts shared by the community.',
    images: ['https://promptmanage.com/og-image.svg'],
    creator: '@promptmanage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return children;
} 