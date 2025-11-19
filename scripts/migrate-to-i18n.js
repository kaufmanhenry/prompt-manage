const fs = require('fs')
const path = require('path')

const APP_DIR = path.join(process.cwd(), 'app')
const LOCALE_DIR = path.join(APP_DIR, '[locale]')

// Items to KEEP in app/ (do not move)
const EXCLUDE = [
  'api',
  '[locale]',
  'favicon.ico',
  'globals.css',
  'icon.svg',
  'opengraph-image.tsx',
  'sitemap.ts',
  'robots.ts', // just in case
  'not-found.tsx',
  'global-error.tsx',
]

if (!fs.existsSync(LOCALE_DIR)) {
  fs.mkdirSync(LOCALE_DIR)
  console.log(`Created ${LOCALE_DIR}`)
}

const items = fs.readdirSync(APP_DIR)

items.forEach((item) => {
  if (EXCLUDE.includes(item)) return

  const srcPath = path.join(APP_DIR, item)
  const destPath = path.join(LOCALE_DIR, item)

  // Move item
  try {
    fs.renameSync(srcPath, destPath)
    console.log(`Moved ${item} to [locale]/`)
  } catch (err) {
    console.error(`Failed to move ${item}:`, err)
  }
})

console.log('Migration complete.')
