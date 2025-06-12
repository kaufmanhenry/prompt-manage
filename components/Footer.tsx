'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center h-16">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Prompt Manage. All rights reserved.
          </div>
          <nav className="flex items-center gap-6 mt-4 md:mt-0">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <a
              href="https://x.com/promptmanage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              @promptmanage
            </a>
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </footer>
  )
} 