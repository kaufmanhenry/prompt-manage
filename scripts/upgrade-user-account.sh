#!/bin/bash
# Update user to Pro account with infinite team member invites

echo "Updating mikemoloney.business@gmail.com to Pro account..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  echo "Please set it in your .env.local file"
  exit 1
fi

# SQL to update user subscription
SQL="
UPDATE user_profiles
SET
  subscription_tier = 'team',
  subscription_status = 'active',
  subscription_period_end = NOW() + INTERVAL '1 year'
WHERE email = 'mikemoloney.business@gmail.com';

-- Verify the update
SELECT
  email,
  subscription_tier,
  subscription_status,
  subscription_period_end
FROM user_profiles
WHERE email = 'mikemoloney.business@gmail.com';
"

# Run the SQL
echo "$SQL" | psql "$DATABASE_URL"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Account upgraded successfully!"
  echo "User: mikemoloney.business@gmail.com"
  echo "Tier: Team (infinite team member invites)"
  echo "Status: Active"
  echo "Valid until: 1 year from now"
else
  echo "❌ Update failed. Please check the error above."
  exit 1
fi
