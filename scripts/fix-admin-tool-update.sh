#!/bin/bash

# Auto-fix script for admin tool update RLS issue
# This script patches app/api/directory/tools/route.ts to use admin client

set -e

FILE="app/api/directory/tools/route.ts"
BACKUP="${FILE}.backup"

echo "🔧 Fixing admin tool update RLS issue..."
echo ""

# Create backup
echo "📦 Creating backup..."
cp "$FILE" "$BACKUP"
echo "✓ Backup created: $BACKUP"
echo ""

# Apply the fix using sed
echo "🔨 Applying fix..."

# The fix: Replace the supabase client usage with admin client
sed -i '' '/^    \/\/ Update the tool$/,/^    const { data: tool, error } = await supabase$/c\
    // Use admin client to bypass RLS for admin users\
    const { createAdminClient } = await import('\''@/utils/supabase/server'\'')\
    const adminClient = createAdminClient()\
\
    // Update the tool using admin client\
    const { data: tool, error } = await adminClient
' "$FILE"

echo "✓ Fix applied successfully!"
echo ""

# Show the changes
echo "📝 Changes made:"
echo "---"
diff -u "$BACKUP" "$FILE" || true
echo "---"
echo ""

echo "✅ Done!"
echo ""
echo "Next steps:"
echo "1. Review the changes above"
echo "2. Test by updating a tool in the directory"
echo "3. If it works, commit the changes"
echo "4. If not, restore from backup: cp $BACKUP $FILE"
