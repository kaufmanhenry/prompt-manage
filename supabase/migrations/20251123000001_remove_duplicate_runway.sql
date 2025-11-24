-- Remove duplicate Runway entries
-- Keep the 'runway-ml' slug and remove any 'runway' duplicates

-- First, check if there are any tools with slug 'runway' (without -ml)
-- If so, migrate any references to 'runway-ml' and delete the duplicate

-- Update any tool_favorites that reference the duplicate
UPDATE public.tool_favorites
SET tool_id = (SELECT id FROM public.ai_tools WHERE slug = 'runway-ml' LIMIT 1)
WHERE tool_id IN (SELECT id FROM public.ai_tools WHERE slug = 'runway' AND slug != 'runway-ml');

-- Update any tool_clicks that reference the duplicate
UPDATE public.tool_clicks
SET tool_id = (SELECT id FROM public.ai_tools WHERE slug = 'runway-ml' LIMIT 1)
WHERE tool_id IN (SELECT id FROM public.ai_tools WHERE slug = 'runway' AND slug != 'runway-ml');

-- Delete the duplicate Runway entry (keep runway-ml)
DELETE FROM public.ai_tools
WHERE slug = 'runway' AND slug != 'runway-ml';

-- Optional: Update runway-ml display name to just 'Runway' for cleaner branding
UPDATE public.ai_tools
SET name = 'Runway'
WHERE slug = 'runway-ml';

-- Add comment
COMMENT ON COLUMN public.ai_tools.name IS 'Display name of the AI tool (can differ from slug)';
