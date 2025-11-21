import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

export default getRequestConfig(
  async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale

    // Ensure that a valid locale is used
    if (
      !locale ||
      !routing.locales.includes(
        locale as
          | 'en'
          | 'zh'
          | 'es'
          | 'ar'
          | 'pt'
          | 'id'
          | 'fr'
          | 'ja'
          | 'ru'
          | 'de'
          | 'ko'
          | 'tr'
          | 'it'
          | 'vi'
          | 'th'
          | 'pl'
          | 'nl'
          | 'hi'
          | 'bn'
          | 'fa',
      )
    ) {
      locale = routing.defaultLocale
    }

    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
    }
  },
)
