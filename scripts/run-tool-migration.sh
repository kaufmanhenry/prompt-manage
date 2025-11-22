#!/bin/bash
# Run the missing columns migration

echo "Running migration to add missing columns to ai_tools table..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  echo "Please set it in your .env.local file"
  exit 1
fi

# Run the migration
psql "$DATABASE_URL" -f supabase/migrations/20251121000000_add_missing_tool_columns.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo "The following columns have been added to ai_tools table:"
  echo "  - secondary_category_id"
  echo "  - integrations"
  echo "  - github_url"
else
  echo "❌ Migration failed. Please check the error above."
  exit 1
fi
