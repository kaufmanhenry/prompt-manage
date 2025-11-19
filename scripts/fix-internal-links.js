const fs = require('fs')
const path = require('path')

const TARGET_DIRS = ['app', 'components']
const SEARCH_PATTERN = /https:\/\/promptmanage\.com\//g
const REPLACEMENT = '/'

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    if (isDirectory) {
      walkDir(dirPath, callback)
    } else {
      callback(path.join(dir, f))
    }
  })
}

let count = 0

TARGET_DIRS.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) return

  walkDir(fullPath, (filePath) => {
    if (!filePath.match(/\.(tsx|ts|js|jsx)$/)) return

    // Read file
    const content = fs.readFileSync(filePath, 'utf8')

    // Check for matches
    if (content.match(SEARCH_PATTERN)) {
      const newContent = content.replace(SEARCH_PATTERN, REPLACEMENT)
      fs.writeFileSync(filePath, newContent, 'utf8')
      console.log(`Updated: ${filePath}`)
      count++
    }
  })
})

console.log(`\nTotal files updated: ${count}`)
