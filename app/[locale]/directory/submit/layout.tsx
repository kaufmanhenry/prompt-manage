import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Submit a Tool - AI Tools Directory',
    description: 'Submit your AI tool to our directory and reach thousands of potential users.',
    openGraph: {
        title: 'Submit a Tool - AI Tools Directory',
        description: 'Submit your AI tool to our directory and reach thousands of potential users.',
    },
}

export default function SubmitLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
