#!/bin/bash
set -e  # Exit on any error

echo "🚀 Setting up Prompt Manage workspace..."

# Check for required tools
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version (requires 18+)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment file
echo "🔧 Setting up environment variables..."
if [ ! -f "$CONDUCTOR_ROOT_PATH/.env.local" ]; then
    echo "⚠️  Warning: .env.local not found in repository root."
    echo "   Please create $CONDUCTOR_ROOT_PATH/.env.local with:"
    echo "   - OPENAI_API_KEY"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    exit 1
fi

# Create symlink to .env.local from root
ln -sf "$CONDUCTOR_ROOT_PATH/.env.local" .env.local
echo "✅ Environment variables linked"

# Run type check to ensure setup is correct
echo "🔍 Running type check..."
npm run type-check

echo "✅ Workspace setup complete!"
echo "💡 Run 'npm run dev' to start the development server"
