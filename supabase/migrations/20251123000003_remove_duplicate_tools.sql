-- Remove duplicate tools that were already in the database
-- Keep original entries and remove the newly added ones

-- Remove duplicate Jasper (slug: jasper-ai, keep: jasper)
DELETE FROM public.ai_tools
WHERE slug = 'jasper-ai';

-- Note: Other tools from the recent migration are not duplicates:
-- - Cursor (new)
-- - Windsurf (new)
-- - Codeium (new)
-- - Replit AI (new)
-- - Perplexity (new)
-- - Claude (new, different from Claude Code)
-- - Notion AI (new)
-- - Gamma (new)
-- - Figma AI (new)
-- - Uizard (new)
-- - Julius AI (new)
-- - DataCamp AI (new)
-- - HubSpot AI (new)

-- GitHub Copilot and ChatGPT were also already in database but with same slugs,
-- so the INSERT with WHERE NOT EXISTS would have prevented duplicates automatically.
