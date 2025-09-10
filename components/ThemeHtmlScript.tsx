'use client';
import { useEffect } from 'react';

export function ThemeHtmlScript() {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const html = document.documentElement;
    html.classList.toggle('dark', prefersDark);
    html.classList.toggle('light', !prefersDark);
    html.style.colorScheme = prefersDark ? 'dark' : 'light';
  }, []);
  return null;
}
