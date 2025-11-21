import Link from 'next/link'

interface BlackFridayBannerProps {
  source?: string
}

export function BlackFridayBanner({ source = 'banner' }: BlackFridayBannerProps) {
  const utmParams = new URLSearchParams({
    utm_source: 'promptmanage',
    utm_medium: source,
    utm_campaign: 'bfcm_2025',
    utm_content: 'deals_banner',
  })

  return (
    <div className="mb-8 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-4 text-white shadow-lg md:p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="mb-1 text-xl font-bold md:text-2xl">🎉 Black Friday Deals on AI Tools!</h2>
          <p className="text-red-50">
            Save up to 90% on premium AI tools. Suno 40% off, Stable Diffusion 75% off &amp; more.
          </p>
        </div>
        <Link href={`/bfcm-2025-ai-deals?${utmParams.toString()}`} className="whitespace-nowrap">
          <button className="rounded-lg bg-white px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-gray-100">
            View Deals →
          </button>
        </Link>
      </div>
    </div>
  )
}
