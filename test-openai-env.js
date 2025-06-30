// Simple test to verify OpenAI API key is loaded from environment
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read .env.local file
const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const openaiKeyLine = envContent.split('\n').find(line => line.startsWith('OPENAI_API_KEY='))
  
  if (openaiKeyLine) {
    const apiKey = openaiKeyLine.split('=')[1]
    console.log('✅ OpenAI API key found in .env.local')
    console.log('API key starts with sk-:', apiKey.startsWith('sk-'))
    console.log('API key length:', apiKey.length)
  } else {
    console.log('❌ OPENAI_API_KEY not found in .env.local')
  }
} else {
  console.log('❌ .env.local file not found')
} 