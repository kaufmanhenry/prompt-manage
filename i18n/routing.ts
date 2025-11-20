import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    'en', // English
    'zh', // Chinese
    'es', // Spanish
    'ar', // Arabic
    'pt', // Portuguese
    'id', // Indonesian
    'fr', // French
    'ja', // Japanese
    'ru', // Russian
    'de', // German
    'ko', // Korean
    'tr', // Turkish
    'it', // Italian
    'vi', // Vietnamese
    'th', // Thai
    'pl', // Polish
    'nl', // Dutch
    'hi', // Hindi
    'bn', // Bengali
    'fa', // Persian
  ],

  // Used when no locale matches
  defaultLocale: 'en',
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
