-- Add missing columns to ai_tools table
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS secondary_category_id UUID REFERENCES public.tool_categories(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS integrations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Add comment
COMMENT ON COLUMN public.ai_tools.secondary_category_id IS 'Secondary category for the tool';
COMMENT ON COLUMN public.ai_tools.integrations IS 'List of integrations supported by the tool';
COMMENT ON COLUMN public.ai_tools.github_url IS 'URL to the GitHub repository if open source';
