# Migration Instructions for Model Categorization

## Summary of Changes

I've added support for image generation tools (Midjourney, DALL-E 3, Stable Diffusion) to your AI tools page and created the necessary infrastructure.

## What's Been Done

### 1. Updated `/app/tools/page.tsx`
- Added Midjourney, DALL-E 3, and Stable Diffusion to the tools list
- Updated to support querying prompts by `model_id` and fallback to tags
- Organized tools by category (Music, Video, Image, Audio)

### 2. Created New Tool Pages
- `/app/tools/midjourney/page.tsx` - Complete Midjourney prompt library page
- `/app/tools/dall-e/page.tsx` - Placeholder (needs content customization)
- `/app/tools/stable-diffusion/page.tsx` - Placeholder (needs content customization)

### 3. Created Migration File
- Location: `supabase/migrations/20250124000000_finalize_model_categorization.sql`
- This migration will normalize all model names and categorize them properly

## How to Run the Migration

### Option 1: Using Supabase CLI (Recommended)
```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 2: Using Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20250124000000_finalize_model_categorization.sql`
5. Click "Run"

## What the Migration Does

1. **Adds Columns** (if they don't exist):
   - `model_category` - Text field for categories: LLM, Music, Video, Image, Voice, Code
   - `model_id` - Text field for specific model identifiers

2. **Creates Indexes**:
   - Indexes on `model_category` and `model_id` for fast filtering
   - Composite index for public prompts by category and model

3. **Normalizes Existing Data**:
   - Maps various model name formats to consistent IDs
   - Examples:
     - "midjourney", "mj", "mid-journey" → "midjourney"
     - "dall-e", "dall-e 3", "dalle3" → "dall-e-3"
     - "stable diffusion", "sd" → "stable-diffusion"
     - "suno v4", "suno-v4" → "suno-v4"

4. **Infers Categories**:
   - Automatically categorizes models:
     - Music: suno-v4, udio
     - Video: runway-gen-3, pika-2, google-veo
     - Image: midjourney, dall-e-3, stable-diffusion
     - Everything else: LLM

5. **Backfills All Prompts**:
   - Updates existing prompts with normalized `model_id` and `model_category`
   - Only updates records where these fields are NULL (safe to run multiple times)

## Verification

After running the migration, you can verify it worked by running this query in the SQL Editor:

```sql
SELECT 
  model_category,
  COUNT(*) as count
FROM prompts
GROUP BY model_category
ORDER BY count DESC;
```

You should see results like:
```
model_category | count
---------------|------
LLM            | 150
Image          | 45
Music          | 30
Video          | 25
```

## Important Notes

- The migration is **idempotent** - safe to run multiple times
- It only updates records where `model_id` or `model_category` is NULL
- Existing data is preserved
- No data will be deleted or overwritten if fields already have values

## Next Steps

1. **Run the migration** using one of the options above
2. **Test the pages**:
   - Visit http://localhost:3000/tools
   - Visit http://localhost:3000/tools/midjourney
   - Visit http://localhost:3000/tools/dall-e
   - Visit http://localhost:3000/tools/stable-diffusion

3. **Customize the pages**:
   - Update the DALL-E and Stable Diffusion pages with specific content
   - Add more tools if needed

4. **Add sample prompts**:
   - Use the dashboard to create sample prompts for Midjourney, DALL-E 3, and Stable Diffusion
   - Tag them with the appropriate `model_id` or use the tags field

## Troubleshooting

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify the migration ran successfully: `SELECT * FROM prompts WHERE model_category IS NULL LIMIT 10;`
3. If you see NULL values, run the migration again

The migration is designed to be safe and non-destructive. It won't break anything.

