'use client'

import { Check, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/routing'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'pt', label: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ru', label: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'tr', label: 'Türkçe (Turkish)', flag: '🇹🇷' },
  { code: 'it', label: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'pl', label: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'nl', label: 'Nederlands (Dutch)', flag: '🇳🇱' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
  { code: 'fa', label: 'فارسی (Persian)', flag: '🇮🇷' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSelect = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0"
          disabled={isPending}
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className="flex cursor-pointer items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
            {locale === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
