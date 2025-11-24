-- Add video embed support to AI Tools Directory
-- Allows tools to showcase YouTube demos, tutorials, or promotional content

ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN public.ai_tools.video_url IS 'YouTube or Vimeo video URL for tool demo/tutorial';

-- Add banner_image_url if not exists (for hero sections)
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

COMMENT ON COLUMN public.ai_tools.banner_image_url IS 'Banner image URL for tool hero section';

-- Add integrations and pricing_details_url if not exists
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS integrations TEXT[] DEFAULT '{}';

ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS pricing_details_url TEXT;

ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS github_url TEXT;

ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

COMMENT ON COLUMN public.ai_tools.integrations IS 'List of integrations/compatible platforms';
COMMENT ON COLUMN public.ai_tools.pricing_details_url IS 'Link to detailed pricing page';
COMMENT ON COLUMN public.ai_tools.github_url IS 'GitHub repository URL for open source tools';
COMMENT ON COLUMN public.ai_tools.click_count IS 'Number of times website link was clicked';
