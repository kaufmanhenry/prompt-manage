-- AI Tools Directory System - Clean Rewrite
-- Comprehensive directory for community-submitted AI tools and services

-- Main categories for AI tools
CREATE TABLE IF NOT EXISTS public.tool_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_emoji TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Main AI Tools Directory table
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,

  -- Publisher Information (nullable for system-seeded tools)
  submitted_by UUID NULL,
  company_name TEXT,
  company_website TEXT,
  contact_email TEXT,

  -- Categorization
  primary_category_id UUID NOT NULL REFERENCES public.tool_categories ON DELETE RESTRICT,

  -- Media & Assets
  logo_url TEXT,

  -- Pricing Information
  pricing_model TEXT NOT NULL,
  pricing_tier TEXT,
  monthly_price DECIMAL(10, 2),
  annual_price DECIMAL(10, 2),
  has_free_trial BOOLEAN DEFAULT false,
  trial_duration_days INTEGER,

  -- Features & Capabilities
  key_features TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  ai_models_used TEXT[] DEFAULT '{}',
  api_available BOOLEAN DEFAULT false,

  -- Metadata
  founded_year INTEGER,
  is_open_source BOOLEAN DEFAULT false,

  -- Community & Engagement
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,

  -- Status & Moderation
  status TEXT DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure submitted_by column is nullable (in case it was created with NOT NULL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'ai_tools'
    AND column_name = 'submitted_by'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.ai_tools ALTER COLUMN submitted_by DROP NOT NULL;
  END IF;
END $$;

-- Seed initial categories
INSERT INTO public.tool_categories (name, slug, description, icon_emoji, position) VALUES
  ('Content & Writing', 'content-writing', 'AI writing tools, copywriting, and content creation', 'CONTENT', 1),
  ('Image & Visual', 'image-visual', 'Image generation, editing, and visual design tools', 'IMAGE', 2),
  ('Video & Animation', 'video-animation', 'Video generation, editing, and animation tools', 'VIDEO', 3),
  ('Audio & Music', 'audio-music', 'Music generation, voice synthesis, and audio tools', 'AUDIO', 4),
  ('Code & Development', 'code-development', 'Code assistants, debugging, and development tools', 'CODE', 5),
  ('Business Operations', 'business-operations', 'Business automation, CRM, and operations tools', 'BUSINESS', 6),
  ('Marketing & Sales', 'marketing-sales', 'Marketing automation, analytics, and sales tools', 'MARKETING', 7),
  ('Research & Analytics', 'research-analytics', 'Data analysis, research, and business intelligence', 'RESEARCH', 8),
  ('Design & Creativity', 'design-creativity', 'Design tools, mockups, and creative assets', 'DESIGN', 9),
  ('Productivity & Automation', 'productivity-automation', 'Task management, automation, and productivity tools', 'PRODUCTIVITY', 10),
  ('Education & Learning', 'education-learning', 'Educational tools, tutoring, and learning platforms', 'EDUCATION', 11),
  ('Healthcare & Science', 'healthcare-science', 'Healthcare, medical research, and science tools', 'HEALTHCARE', 12),
  ('Legal & Compliance', 'legal-compliance', 'Legal document generation, contracts, and compliance', 'LEGAL', 13),
  ('Human Resources', 'human-resources', 'Recruitment, HR management, and employee tools', 'HR', 14),
  ('E-commerce & Retail', 'ecommerce-retail', 'E-commerce, retail, and customer service tools', 'ECOMMERCE', 15)
ON CONFLICT (slug) DO NOTHING;

-- Seed AI tools (60 tools across all categories)
INSERT INTO public.ai_tools (name, slug, website_url, description, full_description, company_name, company_website, contact_email, primary_category_id, logo_url, pricing_model, pricing_tier, monthly_price, annual_price, has_free_trial, trial_duration_days, key_features, use_cases, platforms, ai_models_used, api_available, founded_year, is_open_source, status, is_featured, is_verified, rating, review_count, favorite_count, upvote_count)
SELECT 'ChatGPT', 'chatgpt', 'https://chat.openai.com', 'Advanced conversational AI assistant powered by GPT-4', 'ChatGPT is a state-of-the-art language model developed by OpenAI', 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['Conversational AI', 'Code generation', 'Document analysis', 'GPT-4 access', 'Image analysis', 'Web browsing'], ARRAY['Content creation', 'Coding assistance', 'Research', 'Learning', 'Writing', 'Customer support'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['GPT-4', 'GPT-3.5'], true, 2022, false, 'approved', true, true, 4.8, 15230, 8940, 12500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'chatgpt')
UNION ALL
SELECT 'Claude', 'claude-ai', 'https://claude.ai', 'Advanced AI assistant by Anthropic', 'Claude is a next-generation AI assistant built by Anthropic', 'Anthropic', 'https://www.anthropic.com', 'support@anthropic.com', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://files.readme.io/10d60af-claude-illustration.png', 'freemium', 'Pro', 20.00, 240.00, true, 1, ARRAY['Text generation', 'Code analysis', 'Document review', 'Research assistance', 'PDF analysis', 'API access'], ARRAY['Content writing', 'Code review', 'Analysis', 'Research', 'Customer support', 'Brainstorming'], ARRAY['web', 'api'], ARRAY['Claude 3 Opus'], true, 2023, false, 'approved', true, true, 4.7, 11200, 7890, 10300
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'claude-ai')
UNION ALL
SELECT 'Grammarly', 'grammarly', 'https://www.grammarly.com', 'AI-powered writing assistant', 'Grammarly uses advanced AI to help you write clearly', 'Grammarly', 'https://www.grammarly.com', 'support@grammarly.com', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://www.grammarly.com/favicon.ico', 'freemium', 'Premium', 12.00, 120.00, true, 30, ARRAY['Grammar checking', 'Tone detection', 'Plagiarism detection', 'Style suggestions', 'Tone adjustment'], ARRAY['Email writing', 'Document editing', 'Academic writing', 'Business communication'], ARRAY['web', 'ios', 'android', 'browser-extension'], ARRAY['Proprietary AI'], true, 2009, false, 'approved', true, true, 4.7, 12500, 9200, 11800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'grammarly')
UNION ALL
SELECT 'Copy.ai', 'copy-ai', 'https://www.copy.ai', 'AI-powered copywriting tool', 'Copy.ai uses advanced AI to help marketers', 'Copy.ai', 'https://www.copy.ai', 'support@copy.ai', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://www.copy.ai/favicon.ico', 'freemium', 'Pro', 49.00, 0.00, true, 7, ARRAY['AI copywriting', 'Multi-language support', 'Content templates', 'Social media integration', 'SEO optimization'], ARRAY['Marketing copy', 'Blog writing', 'Social media content', 'Email campaigns', 'Ad copy'], ARRAY['web'], ARRAY['GPT-3.5'], true, 2021, false, 'approved', true, true, 4.5, 8200, 5100, 7800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'copy-ai')
UNION ALL
SELECT 'Jasper', 'jasper', 'https://www.jasper.ai', 'Enterprise-grade AI content platform', 'Jasper is the leading AI content platform for teams', 'Jasper', 'https://www.jasper.ai', 'support@jasper.ai', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://www.jasper.ai/favicon.ico', 'paid', 'Team', 125.00, 1500.00, true, 5, ARRAY['Brand voice preservation', 'Content calendar', 'Team collaboration', 'SEO optimization', 'Plagiarism checker'], ARRAY['Blog posts', 'Marketing campaigns', 'Ad copy', 'Email sequences', 'Social media content'], ARRAY['web', 'api'], ARRAY['GPT-4'], true, 2021, false, 'approved', true, true, 4.6, 6800, 4200, 6100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'jasper')
UNION ALL
SELECT 'Midjourney', 'midjourney', 'https://www.midjourney.com', 'AI image generation tool', 'Midjourney is a leading AI image generation platform', 'Midjourney, Inc.', 'https://www.midjourney.com', 'support@midjourney.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Midjourney_Emblem.png', 'paid', 'Pro', 30.00, 360.00, true, 1, ARRAY['Text-to-image', 'Upscaling', 'Style transfer', 'Variation generation', 'Inpainting', 'Community features'], ARRAY['Graphic design', 'Illustration', 'Marketing materials', 'Concept art', 'Social media content'], ARRAY['web', 'discord'], ARRAY['Custom diffusion model'], false, 2021, false, 'approved', true, true, 4.7, 9230, 6120, 9800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'midjourney')
UNION ALL
SELECT 'DALL-E 3', 'dalle-3', 'https://openai.com/dall-e-3', 'OpenAI image generation model', 'DALL-E 3 generates highly accurate images', 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://cdn.openai.com/API/rendering/icon.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['High-accuracy image generation', 'Detailed rendering', 'ChatGPT integration', 'Image editing', 'Variation generation'], ARRAY['Marketing materials', 'Product mockups', 'Concept visualization', 'Social media graphics', 'Illustration'], ARRAY['web', 'api'], ARRAY['DALL-E 3'], true, 2022, false, 'approved', true, true, 4.6, 7800, 4900, 6700
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'dalle-3')
UNION ALL
SELECT 'Stable Diffusion', 'stable-diffusion', 'https://stability.ai', 'Open-source image generation model', 'Stable Diffusion is a powerful open-source text-to-image model', 'Stability AI', 'https://stability.ai', 'info@stability.ai', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://stability.ai/favicon.ico', 'free', 'Open Source', 0.00, 0.00, true, 0, ARRAY['Open-source', 'Local deployment', 'API access', 'Community models', 'Fine-tuning support'], ARRAY['Image generation', 'Model customization', 'Research', 'Product prototyping', 'Creative projects'], ARRAY['web', 'api', 'cli'], ARRAY['Stable Diffusion'], true, 2022, true, 'approved', true, true, 4.5, 6500, 3800, 5900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'stable-diffusion')
UNION ALL
SELECT 'Adobe Firefly', 'adobe-firefly', 'https://www.adobe.com/products/firefly', 'Generative AI suite in Adobe Creative Cloud', 'Adobe Firefly brings generative AI capabilities into creative tools', 'Adobe', 'https://www.adobe.com', 'support@adobe.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://www.adobe.com/favicon.ico', 'freemium', 'Creative Cloud', 60.00, 720.00, true, 7, ARRAY['Generative fill', 'Object removal', 'Style transfer', 'Creative controls', 'Adobe integration'], ARRAY['Photo editing', 'Graphic design', 'Social media graphics', 'Product photography', 'Web design'], ARRAY['web', 'desktop'], ARRAY['Adobe Firefly'], true, 2023, false, 'approved', true, true, 4.5, 5200, 3400, 4800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'adobe-firefly')
UNION ALL
SELECT 'Canva', 'canva-ai', 'https://www.canva.com', 'Design platform with AI features', 'Canva AI makes design accessible with AI-powered suggestions', 'Canva', 'https://www.canva.com', 'support@canva.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://www.canva.com/favicon.ico', 'freemium', 'Pro', 13.00, 156.00, true, 30, ARRAY['Magic design', 'AI image generation', 'Background remover', 'Brand kit', 'Team collaboration'], ARRAY['Social media graphics', 'Presentations', 'Marketing materials', 'Branding', 'Content creation'], ARRAY['web', 'ios', 'android'], ARRAY['Custom AI'], true, 2013, false, 'approved', true, true, 4.8, 14200, 8900, 12400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'canva-ai')
UNION ALL
SELECT 'Runway ML', 'runway-ml', 'https://www.runwayml.com', 'Generative AI suite for video', 'Runway is a comprehensive AI creation suite for creators', 'Runway Inc.', 'https://www.runwayml.com', 'hello@runwayml.com', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Runway_ML_logo.png', 'freemium', 'Pro', 35.00, 420.00, true, 3, ARRAY['Video generation', 'Image inpainting', 'Background removal', 'Motion synthesis', 'Real-time collaboration', 'API access'], ARRAY['Video editing', 'Animation', 'VFX', 'Content creation', 'Film production'], ARRAY['web', 'api'], ARRAY['Custom diffusion models'], true, 2018, false, 'approved', true, true, 4.6, 7540, 5230, 8400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'runway-ml')
UNION ALL
SELECT 'Synthesia', 'synthesia', 'https://www.synthesia.io', 'AI video creation platform', 'Synthesia enables high-quality video creation without cameras', 'Synthesia', 'https://www.synthesia.io', 'support@synthesia.io', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://www.synthesia.io/favicon.ico', 'paid', 'Pro', 28.00, 336.00, true, 14, ARRAY['AI avatars', 'Text-to-speech', '140+ languages', 'Video templates', 'API access'], ARRAY['Training videos', 'Product demos', 'Marketing videos', 'Social media content', 'Educational content'], ARRAY['web', 'api'], ARRAY['Synthesia AI'], true, 2017, false, 'approved', true, true, 4.7, 6200, 4100, 5800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'synthesia')
UNION ALL
SELECT 'Descript', 'descript', 'https://www.descript.com', 'AI video editing platform', 'Descript lets you edit video and audio like text', 'Descript', 'https://www.descript.com', 'support@descript.com', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://www.descript.com/favicon.ico', 'freemium', 'Pro', 24.00, 288.00, true, 30, ARRAY['Text-based editing', 'Auto-transcription', 'Overdub voice cloning', 'Filler word removal', 'AI repurposing'], ARRAY['Podcast editing', 'Video content', 'Social media clips', 'YouTube videos', 'Interview editing'], ARRAY['web', 'desktop'], ARRAY['Descript AI'], true, 2017, false, 'approved', true, true, 4.7, 5800, 3900, 5400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'descript')
UNION ALL
SELECT 'Opus Clip', 'opus-clip', 'https://www.opusclip.com', 'AI video transformation tool', 'Opus Clip automatically transforms long-form videos into shorts', 'Opus', 'https://www.opusclip.com', 'support@opusclip.com', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://www.opusclip.com/favicon.ico', 'freemium', 'Pro', 10.00, 120.00, true, 7, ARRAY['Auto clipping', 'Viral detection', 'Auto-captioning', 'Multi-platform export', 'Brand customization'], ARRAY['Content repurposing', 'Social media marketing', 'Podcast clips', 'YouTube shorts', 'TikTok content'], ARRAY['web'], ARRAY['Opus Clip AI'], true, 2023, false, 'approved', true, true, 4.6, 4100, 2800, 3900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'opus-clip')
UNION ALL
SELECT 'Suno', 'suno-ai', 'https://www.suno.ai', 'AI music generation platform', 'Suno AI generates original songs with lyrics and vocals', 'Suno Inc.', 'https://www.suno.ai', 'support@suno.ai', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://pbs.twimg.com/profile_images/1691864037/Suno_Logo_Main.jpg', 'freemium', 'Pro', 16.00, 192.00, true, 3, ARRAY['Music generation', 'Lyric writing', 'Vocal synthesis', 'Multiple genres', 'API access', 'Commercial license'], ARRAY['Music production', 'Content creation', 'Podcast intro', 'Background music', 'Game development'], ARRAY['web', 'api'], ARRAY['Custom audio diffusion'], true, 2023, false, 'approved', true, true, 4.5, 6890, 4560, 7600
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'suno-ai')
UNION ALL
SELECT 'ElevenLabs', 'eleven-labs', 'https://elevenlabs.io', 'AI text-to-speech platform', 'ElevenLabs provides natural-sounding AI-generated speech', 'ElevenLabs', 'https://elevenlabs.io', 'support@elevenlabs.io', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://elevenlabs.io/favicon.ico', 'freemium', 'Pro', 11.00, 132.00, true, 7, ARRAY['Text-to-speech', 'Voice cloning', '29+ languages', 'Emotionality', 'API access', 'Dubbing'], ARRAY['Podcast production', 'Video narration', 'Audiobook creation', 'Gaming', 'Accessibility'], ARRAY['web', 'api'], ARRAY['Proprietary neural network'], true, 2022, false, 'approved', true, true, 4.8, 8900, 5700, 8100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'eleven-labs')
UNION ALL
SELECT 'Udio', 'udio-ai', 'https://www.udio.com', 'AI music platform', 'Udio offers sophisticated music generation and composition', 'Udio', 'https://www.udio.com', 'support@udio.com', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://www.udio.com/favicon.ico', 'freemium', 'Pro', 0.00, 0.00, true, 0, ARRAY['Music generation', 'Advanced editing', 'Musical composition', 'Multiple styles', 'Collaboration'], ARRAY['Music production', 'Podcast music', 'Game soundtracks', 'Background scores', 'Audio content'], ARRAY['web'], ARRAY['Udio AI'], true, 2023, false, 'approved', true, true, 4.4, 3200, 1800, 2900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'udio-ai')
UNION ALL
SELECT 'Mubert', 'mubert', 'https://www.mubert.com', 'AI royalty-free music generator', 'Mubert generates unique royalty-free music powered by AI', 'Mubert', 'https://www.mubert.com', 'support@mubert.com', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://www.mubert.com/favicon.ico', 'freemium', 'Pro', 15.00, 180.00, true, 7, ARRAY['Royalty-free music', 'Unlimited generation', 'Style customization', 'Mood-based selection', 'Commercial license'], ARRAY['Video content', 'Streaming platforms', 'Game soundtracks', 'Social media', 'Podcast music'], ARRAY['web', 'api'], ARRAY['Mubert AI'], true, 2014, false, 'approved', true, true, 4.4, 2900, 1600, 2700
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'mubert')
UNION ALL
SELECT 'GitHub Copilot', 'github-copilot', 'https://github.com/features/copilot', 'AI code assistant', 'GitHub Copilot generates code suggestions in real-time', 'GitHub', 'https://github.com', 'support@github.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://github.githubassets.com/favicons/favicon.svg', 'paid', 'Individual', 10.00, 120.00, true, 30, ARRAY['Code completion', 'Function generation', 'Test writing', 'Documentation', 'Multi-language support'], ARRAY['Code writing', 'Bug fixing', 'Refactoring', 'Learning programming', 'Development acceleration'], ARRAY['vscode', 'visual-studio', 'neovim', 'jetbrains'], ARRAY['Codex'], true, 2021, false, 'approved', true, true, 4.7, 9800, 6400, 8900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'github-copilot')
UNION ALL
SELECT 'Tabnine', 'tabnine', 'https://www.tabnine.com', 'AI code completion tool', 'Tabnine provides AI-assisted code completion across languages', 'Tabnine', 'https://www.tabnine.com', 'support@tabnine.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://www.tabnine.com/favicon.ico', 'freemium', 'Pro', 12.00, 144.00, true, 30, ARRAY['AI code completion', 'Language support', 'Privacy mode', 'IDE integration', 'Context awareness'], ARRAY['Code writing', 'Development speed', 'Code quality', 'Learning programming'], ARRAY['vscode', 'jetbrains', 'vim', 'sublime'], ARRAY['Tabnine AI'], true, 2018, false, 'approved', true, true, 4.6, 5600, 3400, 5100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'tabnine')
UNION ALL
SELECT 'Amazon CodeWhisperer', 'codewhisperer', 'https://aws.amazon.com/codewhisperer', 'AWS AI code generation', 'CodeWhisperer provides intelligent code suggestions in IDE', 'Amazon Web Services', 'https://aws.amazon.com', 'support@aws.amazon.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png', 'freemium', 'Pro', 0.00, 0.00, true, 0, ARRAY['Code generation', 'Security scanning', 'Reference detector', 'AWS integration', 'IDE support'], ARRAY['AWS development', 'Secure coding', 'Code acceleration', 'Learning AWS services'], ARRAY['vscode', 'jetbrains', 'visual-studio', 'aws-lambda'], ARRAY['CodeWhisperer AI'], true, 2022, false, 'approved', true, true, 4.5, 4200, 2800, 3900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'codewhisperer')
UNION ALL
SELECT 'Replit Ghostwriter', 'replit-ghostwriter', 'https://replit.com/ghostwriter', 'AI coding assistant', 'Ghostwriter helps with code completion in Replit IDE', 'Replit', 'https://replit.com', 'support@replit.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://replit.com/favicon.ico', 'freemium', 'Pro', 7.00, 84.00, true, 14, ARRAY['Code completion', 'Code generation', 'Debugging', 'Code explanation', 'Collaborative IDE'], ARRAY['Web development', 'Learning programming', 'Rapid prototyping', 'Coding practice'], ARRAY['web'], ARRAY['Replit AI'], true, 2021, false, 'approved', true, true, 4.5, 3800, 2200, 3400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'replit-ghostwriter')
UNION ALL
SELECT 'HubSpot', 'hubspot', 'https://www.hubspot.com', 'AI-powered CRM platform', 'HubSpot is an all-in-one platform with AI-driven tools', 'HubSpot', 'https://www.hubspot.com', 'support@hubspot.com', (SELECT id FROM public.tool_categories WHERE slug = 'business-operations' LIMIT 1), 'https://www.hubspot.com/favicon.ico', 'freemium', 'Professional', 50.00, 600.00, true, 14, ARRAY['CRM platform', 'AI email writing', 'Workflow automation', 'Sales forecasting', 'Customer insights'], ARRAY['Sales management', 'Marketing automation', 'Customer support', 'Business scaling'], ARRAY['web', 'api', 'mobile'], ARRAY['HubSpot AI'], true, 2006, false, 'approved', true, true, 4.6, 7200, 4800, 6500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'hubspot')
UNION ALL
SELECT 'Zapier', 'zapier', 'https://zapier.com', 'AI automation platform', 'Zapier connects 7000+ apps with AI-powered workflows', 'Zapier', 'https://zapier.com', 'support@zapier.com', (SELECT id FROM public.tool_categories WHERE slug = 'business-operations' LIMIT 1), 'https://zapier.com/favicon.ico', 'freemium', 'Pro', 25.00, 300.00, true, 14, ARRAY['App integration', 'Workflow automation', 'AI-powered suggestions', 'Multi-step zaps', 'API connections'], ARRAY['Business automation', 'Data transfer', 'Process optimization', 'Integration management'], ARRAY['web', 'api'], ARRAY['Zapier AI'], true, 2012, false, 'approved', true, true, 4.7, 8900, 5600, 8100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'zapier')
UNION ALL
SELECT 'Make', 'make', 'https://www.make.com', 'Visual automation platform', 'Make provides visual workflow automation with AI', 'Make', 'https://www.make.com', 'support@make.com', (SELECT id FROM public.tool_categories WHERE slug = 'business-operations' LIMIT 1), 'https://www.make.com/favicon.ico', 'freemium', 'Pro', 15.00, 180.00, true, 30, ARRAY['Visual workflow builder', 'AI scenario creation', 'App integration', 'Complex logic', 'Execution management'], ARRAY['Business automation', 'Data processing', 'System integration', 'Workflow optimization'], ARRAY['web', 'api'], ARRAY['Make AI'], true, 2013, false, 'approved', true, true, 4.6, 6500, 4200, 5800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'make')
UNION ALL
SELECT 'HubSpot Marketing', 'hubspot-marketing', 'https://www.hubspot.com/products/marketing', 'AI marketing automation', 'HubSpot Marketing Hub combines CRM and AI insights', 'HubSpot', 'https://www.hubspot.com', 'support@hubspot.com', (SELECT id FROM public.tool_categories WHERE slug = 'marketing-sales' LIMIT 1), 'https://www.hubspot.com/favicon.ico', 'freemium', 'Professional', 50.00, 600.00, true, 14, ARRAY['Email marketing', 'Lead scoring', 'Social media management', 'Campaign automation', 'Analytics'], ARRAY['Campaign management', 'Lead generation', 'Email campaigns', 'Social marketing', 'Customer acquisition'], ARRAY['web', 'mobile', 'api'], ARRAY['HubSpot AI'], true, 2006, false, 'approved', true, true, 4.6, 7200, 4800, 6500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'hubspot-marketing')
UNION ALL
SELECT 'Seamless AI', 'seamless-ai', 'https://www.seamless.ai', 'B2B sales AI platform', 'Seamless AI finds decision makers and generates leads', 'Seamless.ai', 'https://www.seamless.ai', 'support@seamless.ai', (SELECT id FROM public.tool_categories WHERE slug = 'marketing-sales' LIMIT 1), 'https://www.seamless.ai/favicon.ico', 'paid', 'Professional', 99.00, 1188.00, true, 7, ARRAY['Decision maker identification', 'Email finder', 'Phone verification', 'Real-time data', 'Lead enrichment'], ARRAY['B2B sales', 'Lead prospecting', 'Sales acceleration', 'Email outreach'], ARRAY['web', 'api'], ARRAY['Seamless AI'], true, 2017, false, 'approved', true, true, 4.5, 3400, 2100, 3100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'seamless-ai')
UNION ALL
SELECT 'Notion AI', 'notion-ai', 'https://www.notion.so', 'AI-powered workspace', 'Notion combines organization with AI capabilities', 'Notion', 'https://www.notion.so', 'support@notion.so', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://www.notion.so/favicon.ico', 'freemium', 'Plus', 10.00, 120.00, true, 30, ARRAY['AI writing', 'Document summarization', 'Task automation', 'Database management', 'Collaboration'], ARRAY['Project management', 'Note-taking', 'Knowledge management', 'Team coordination'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['Notion AI'], true, 2016, false, 'approved', true, true, 4.8, 12100, 7800, 10900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'notion-ai')
UNION ALL
SELECT 'Microsoft Copilot', 'microsoft-copilot', 'https://copilot.microsoft.com', 'AI assistant for Microsoft 365', 'Microsoft Copilot assists with Office and Teams', 'Microsoft', 'https://www.microsoft.com', 'support@microsoft.com', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://www.microsoft.com/favicon.ico', 'paid', 'Copilot Pro', 20.00, 240.00, true, 1, ARRAY['Office integration', 'Writing assistance', 'Data analysis', 'Meeting support', 'Code generation'], ARRAY['Document writing', 'Data analysis', 'Presentation creation', 'Meeting notes'], ARRAY['web', 'desktop', 'mobile'], ARRAY['Copilot LLM'], true, 2023, false, 'approved', true, true, 4.6, 5800, 3900, 5300
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'microsoft-copilot')
UNION ALL
SELECT 'Google Workspace AI', 'google-workspace-ai', 'https://workspace.google.com/solutions/ai', 'AI features in Google Workspace', 'Google Workspace AI helps with Gmail, Docs, Sheets', 'Google', 'https://www.google.com', 'support@google.com', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://www.google.com/favicon.ico', 'paid', 'Workspace Labs', 0.00, 0.00, true, 0, ARRAY['Email drafting', 'Document writing', 'Data analysis', 'Presentation creation', 'Collaboration'], ARRAY['Email writing', 'Document creation', 'Data management', 'Presentations'], ARRAY['web', 'mobile'], ARRAY['Google AI'], true, 2006, false, 'approved', true, true, 4.7, 8900, 5600, 8100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'google-workspace-ai')
UNION ALL
SELECT 'Asana AI', 'asana-ai', 'https://asana.com', 'Project management with AI', 'Asana uses AI for task automation and prioritization', 'Asana', 'https://asana.com', 'support@asana.com', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://asana.com/favicon.ico', 'freemium', 'Premium', 30.49, 365.88, true, 30, ARRAY['Task automation', 'AI prioritization', 'Workflow templates', 'Team collaboration', 'Portfolio management'], ARRAY['Project management', 'Team coordination', 'Agile workflows', 'Work organization'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['Asana AI'], true, 2011, false, 'approved', true, true, 4.7, 7200, 4800, 6500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'asana-ai')
UNION ALL
SELECT 'Khan Academy', 'khan-academy-ai', 'https://www.khanacademy.org', 'AI-powered learning platform', 'Khan Academy personalizes learning with AI', 'Khan Academy', 'https://www.khanacademy.org', 'support@khanacademy.org', (SELECT id FROM public.tool_categories WHERE slug = 'education-learning' LIMIT 1), 'https://www.khanacademy.org/favicon.ico', 'free', 'Subscription', 0.00, 0.00, true, 0, ARRAY['Personalized learning', 'Adaptive lessons', 'Exercise recommendations', 'Progress tracking', 'Video lessons'], ARRAY['K-12 education', 'College prep', 'STEM learning', 'Self-paced learning'], ARRAY['web', 'ios', 'android'], ARRAY['Khan AI'], true, 2008, false, 'approved', true, true, 4.8, 9800, 6200, 8900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'khan-academy-ai')
UNION ALL
SELECT 'Duolingo', 'duolingo-ai', 'https://www.duolingo.com', 'AI language learning app', 'Duolingo personalizes language lessons with AI', 'Duolingo', 'https://www.duolingo.com', 'support@duolingo.com', (SELECT id FROM public.tool_categories WHERE slug = 'education-learning' LIMIT 1), 'https://www.duolingo.com/favicon.ico', 'freemium', 'Plus', 6.99, 83.88, true, 7, ARRAY['Personalized lessons', 'Adaptive difficulty', 'Gamification', 'Speech recognition', 'AI conversation'], ARRAY['Language learning', 'Bilingual development', 'Travel preparation', 'Cultural learning'], ARRAY['web', 'ios', 'android'], ARRAY['Duolingo AI'], true, 2011, false, 'approved', true, true, 4.7, 11200, 7300, 10100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'duolingo-ai')
UNION ALL
SELECT 'Babylon Health', 'babylon-health', 'https://www.babylonhealth.com', 'AI healthcare platform', 'Babylon Health provides symptom checking and consultations', 'Babylon Health', 'https://www.babylonhealth.com', 'support@babylonhealth.com', (SELECT id FROM public.tool_categories WHERE slug = 'healthcare-science' LIMIT 1), 'https://www.babylonhealth.com/favicon.ico', 'freemium', 'Premium', 19.99, 0.00, true, 7, ARRAY['Symptom checking', 'Doctor consultations', 'Prescription management', 'Health monitoring', 'AI diagnosis'], ARRAY['Personal health', 'Medical guidance', 'Healthcare access', 'Wellness tracking'], ARRAY['web', 'ios', 'android'], ARRAY['Babylon AI'], true, 2013, false, 'approved', true, true, 4.3, 2800, 1600, 2400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'babylon-health')
UNION ALL
SELECT 'AlphaFold', 'alphafold', 'https://alphafold.ebi.ac.uk', 'AI protein structure prediction', 'AlphaFold predicts 3D protein structures', 'DeepMind', 'https://www.deepmind.com', 'support@deepmind.com', (SELECT id FROM public.tool_categories WHERE slug = 'healthcare-science' LIMIT 1), 'https://www.deepmind.com/favicon.ico', 'free', 'Academic', 0.00, 0.00, true, 0, ARRAY['Protein structure prediction', 'Drug discovery', 'Research acceleration', 'Open source', 'High accuracy'], ARRAY['Biomedical research', 'Drug discovery', 'Protein science', 'Academic research'], ARRAY['web', 'api'], ARRAY['AlphaFold'], true, 2020, true, 'approved', true, true, 4.9, 3100, 2200, 2900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'alphafold')
UNION ALL
SELECT 'LexisNexis AI', 'lexisnexis-ai', 'https://www.lexisnexis.com', 'AI legal research platform', 'LexisNexis accelerates legal research with AI', 'LexisNexis', 'https://www.lexisnexis.com', 'support@lexisnexis.com', (SELECT id FROM public.tool_categories WHERE slug = 'legal-compliance' LIMIT 1), 'https://www.lexisnexis.com/favicon.ico', 'paid', 'Enterprise', 0.00, 0.00, true, 0, ARRAY['Legal research', 'Document review', 'Contract analysis', 'Case prediction', 'Due diligence'], ARRAY['Law firms', 'Legal research', 'Contract management', 'Due diligence'], ARRAY['web', 'api'], ARRAY['LexisNexis AI'], true, 1973, false, 'approved', true, true, 4.5, 1400, 800, 1200
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'lexisnexis-ai')
UNION ALL
SELECT 'HubSpot Recruiting', 'hubspot-recruiting', 'https://www.hubspot.com/products/recruit', 'AI recruiting platform', 'HubSpot Recruiting attracts top talent with AI', 'HubSpot', 'https://www.hubspot.com', 'support@hubspot.com', (SELECT id FROM public.tool_categories WHERE slug = 'human-resources' LIMIT 1), 'https://www.hubspot.com/favicon.ico', 'paid', 'Professional', 75.00, 900.00, true, 14, ARRAY['AI candidate screening', 'Job posting', 'Interview scheduling', 'Collaboration', 'Analytics'], ARRAY['Recruitment', 'Hiring', 'Candidate management', 'Team building'], ARRAY['web', 'api', 'mobile'], ARRAY['HubSpot AI'], true, 2006, false, 'approved', true, true, 4.5, 1800, 1100, 1600
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'hubspot-recruiting')
UNION ALL
SELECT 'Workday', 'workday', 'https://www.workday.com', 'Enterprise HR platform', 'Workday uses AI for talent and HR management', 'Workday', 'https://www.workday.com', 'support@workday.com', (SELECT id FROM public.tool_categories WHERE slug = 'human-resources' LIMIT 1), 'https://www.workday.com/favicon.ico', 'paid', 'Enterprise', 0.00, 0.00, true, 0, ARRAY['Talent management', 'Skills matching', 'Performance analytics', 'Workforce planning', 'Learning management'], ARRAY['HR management', 'Talent development', 'Workforce planning', 'Employee analytics'], ARRAY['web', 'mobile', 'api'], ARRAY['Workday AI'], true, 2005, false, 'approved', true, true, 4.6, 2400, 1500, 2200
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'workday')
UNION ALL
SELECT 'Shopify', 'shopify-ai', 'https://www.shopify.com', 'E-commerce with AI', 'Shopify uses AI for recommendations and automation', 'Shopify', 'https://www.shopify.com', 'support@shopify.com', (SELECT id FROM public.tool_categories WHERE slug = 'ecommerce-retail' LIMIT 1), 'https://www.shopify.com/favicon.ico', 'freemium', 'Premium', 299.00, 3588.00, true, 30, ARRAY['Product recommendations', 'Inventory AI', 'Marketing automation', 'Customer insights', 'Fraud detection'], ARRAY['E-commerce', 'Retail', 'Online sales', 'Inventory management'], ARRAY['web', 'mobile', 'api'], ARRAY['Shopify AI'], true, 2006, false, 'approved', true, true, 4.7, 8200, 5100, 7400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'shopify-ai');

-- Enable RLS if needed
ALTER TABLE IF EXISTS public.tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_tools ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tool_categories' AND policyname = 'public_categories'
  ) THEN
    CREATE POLICY public_categories ON public.tool_categories FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'ai_tools' AND policyname = 'public_tools'
  ) THEN
    CREATE POLICY public_tools ON public.ai_tools FOR SELECT USING (status = 'approved');
  END IF;
END $$;
