-- AI Tools Directory System
-- Comprehensive directory for community-submitted AI tools and services

-- Main categories for AI tools (can be extended)
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

-- Sub-categories for better organization
CREATE TABLE IF NOT EXISTS public.tool_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.tool_categories ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Main AI Tools Directory table
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  description TEXT NOT NULL, -- 150-300 characters summary
  full_description TEXT, -- Longer detailed description

  -- Publisher Information
  submitted_by UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  company_name TEXT,
  company_website TEXT,
  contact_email TEXT,

  -- Categorization
  primary_category_id UUID NOT NULL REFERENCES public.tool_categories ON DELETE RESTRICT,
  secondary_category_id UUID REFERENCES public.tool_categories ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.tool_subcategories ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}', -- Array of searchable tags

  -- Media & Assets
  logo_url TEXT,
  banner_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}', -- Array of image URLs
  video_demo_url TEXT, -- YouTube or demo video URL

  -- Pricing Information
  pricing_model TEXT NOT NULL, -- 'free', 'freemium', 'paid', 'free_trial'
  pricing_tier TEXT, -- 'basic', 'pro', 'enterprise', etc.
  monthly_price DECIMAL(10, 2),
  annual_price DECIMAL(10, 2),
  pricing_currency TEXT DEFAULT 'USD',
  pricing_details_url TEXT,
  has_free_trial BOOLEAN DEFAULT false,
  trial_duration_days INTEGER,

  -- Features & Capabilities
  key_features TEXT[] DEFAULT '{}', -- Array of feature strings
  use_cases TEXT[] DEFAULT '{}', -- Array of use case strings
  integrations TEXT[] DEFAULT '{}', -- Array of integrated services (Zapier, Slack, etc.)

  -- Technical Information
  platforms TEXT[] DEFAULT '{}', -- 'web', 'ios', 'android', 'desktop', 'api'
  ai_models_used TEXT[] DEFAULT '{}', -- 'gpt-4', 'claude', 'llama', 'custom', etc.
  api_available BOOLEAN DEFAULT false,

  -- Metadata
  company_size TEXT, -- 'bootstrap', 'small', 'medium', 'large', 'enterprise'
  founded_year INTEGER,
  is_open_source BOOLEAN DEFAULT false,
  github_url TEXT,

  -- Community & Engagement
  rating DECIMAL(3, 2), -- 1.0 to 5.0
  review_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,

  -- Status & Moderation
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'archived'
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false, -- Verified by publisher
  rejection_reason TEXT,

  -- SEO & Discovery
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  featured_at TIMESTAMPTZ
);

-- Tool Reviews table
CREATE TABLE IF NOT EXISTS public.tool_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.ai_tools ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,

  -- Reviewer verification
  verified_user BOOLEAN DEFAULT false,
  reviewer_name TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tool_id, reviewer_id)
);

-- Tool Favorites (bookmarks)
CREATE TABLE IF NOT EXISTS public.tool_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.ai_tools ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, tool_id)
);

-- Tool Collections (user-created lists)
CREATE TABLE IF NOT EXISTS public.tool_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tools in Collections (many-to-many)
CREATE TABLE IF NOT EXISTS public.collection_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.tool_collections ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.ai_tools ON DELETE CASCADE,

  position INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(collection_id, tool_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON public.ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON public.ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_primary_category ON public.ai_tools(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_submitted_by ON public.ai_tools(submitted_by);
CREATE INDEX IF NOT EXISTS idx_ai_tools_created_at ON public.ai_tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_rating ON public.ai_tools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_is_featured ON public.ai_tools(is_featured);

-- Full text search index on tool description and name
CREATE INDEX IF NOT EXISTS idx_ai_tools_search ON public.ai_tools USING GIN (
  to_tsvector('english', name || ' ' || description || ' ' || COALESCE(full_description, ''))
);

CREATE INDEX IF NOT EXISTS idx_tool_reviews_tool_id ON public.tool_reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_reviewer_id ON public.tool_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_created_at ON public.tool_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tool_favorites_user_id ON public.tool_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_favorites_tool_id ON public.tool_favorites(tool_id);

CREATE INDEX IF NOT EXISTS idx_tool_collections_created_by ON public.tool_collections(created_by);
CREATE INDEX IF NOT EXISTS idx_collection_tools_collection_id ON public.collection_tools(collection_id);

-- Enable Row Level Security
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_tools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.tool_categories;
DROP POLICY IF EXISTS "Approved tools are publicly readable" ON public.ai_tools;
DROP POLICY IF EXISTS "Users can insert their own tools" ON public.ai_tools;
DROP POLICY IF EXISTS "Users can update their own tools" ON public.ai_tools;
DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.tool_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.tool_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.tool_reviews;
DROP POLICY IF EXISTS "Users can see their own favorites" ON public.tool_favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.tool_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.tool_favorites;
DROP POLICY IF EXISTS "Users can see public collections" ON public.tool_collections;
DROP POLICY IF EXISTS "Users can create collections" ON public.tool_collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON public.tool_collections;
DROP POLICY IF EXISTS "Users can see collection tools if collection is accessible" ON public.collection_tools;
DROP POLICY IF EXISTS "Users can manage collection tools in their collections" ON public.collection_tools;

-- RLS Policies for tool_categories (public read)
CREATE POLICY "Categories are publicly readable"
  ON public.tool_categories FOR SELECT
  USING (is_active = true);

-- RLS Policies for ai_tools (public read approved, user can create)
CREATE POLICY "Approved tools are publicly readable"
  ON public.ai_tools FOR SELECT
  USING (status = 'approved' OR submitted_by = auth.uid());

CREATE POLICY "Users can insert their own tools"
  ON public.ai_tools FOR INSERT
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Users can update their own tools"
  ON public.ai_tools FOR UPDATE
  USING (submitted_by = auth.uid());

-- RLS Policies for tool_reviews
CREATE POLICY "Reviews are publicly readable"
  ON public.tool_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.tool_reviews FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON public.tool_reviews FOR UPDATE
  USING (reviewer_id = auth.uid());

-- RLS Policies for tool_favorites
CREATE POLICY "Users can see their own favorites"
  ON public.tool_favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own favorites"
  ON public.tool_favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites"
  ON public.tool_favorites FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for tool_collections
CREATE POLICY "Users can see public collections"
  ON public.tool_collections FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create collections"
  ON public.tool_collections FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own collections"
  ON public.tool_collections FOR UPDATE
  USING (created_by = auth.uid());

-- RLS Policies for collection_tools
CREATE POLICY "Users can see collection tools if collection is accessible"
  ON public.collection_tools FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tool_collections
      WHERE id = collection_id
      AND (is_public = true OR created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage collection tools in their collections"
  ON public.collection_tools FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tool_collections
      WHERE id = collection_id
      AND created_by = auth.uid()
    )
  );

-- Seed initial categories based on research
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

-- Seed popular AI tools for demo - 3-5 tools per category (60+ total)
INSERT INTO public.ai_tools (
  name, slug, website_url, description, full_description,
  submitted_by, company_name, company_website, contact_email,
  primary_category_id, logo_url, pricing_model, pricing_tier,
  monthly_price, annual_price, has_free_trial, trial_duration_days,
  key_features, use_cases, platforms, ai_models_used, api_available,
  founded_year, is_open_source, status, is_featured, is_verified,
  rating, review_count, favorite_count, upvote_count
)

-- CONTENT & WRITING (5 tools)
SELECT 'ChatGPT', 'chatgpt', 'https://chat.openai.com', 'Advanced conversational AI assistant powered by GPT-4, capable of answering questions, writing, coding, and creative tasks.', 'ChatGPT is a state-of-the-art language model developed by OpenAI that can engage in detailed conversations, answer complex questions, assist with writing and coding tasks, and help with creative brainstorming.', '00000000-0000-0000-0000-000000000000'::uuid, 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['Conversational AI', 'Code generation', 'Document analysis', 'GPT-4 access', 'Image analysis', 'Web browsing'], ARRAY['Content creation', 'Coding assistance', 'Research', 'Learning', 'Writing', 'Customer support'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['GPT-4', 'GPT-3.5'], true, 2022, false, 'approved', true, true, 4.8, 15230, 8940, 12500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'chatgpt')
UNION ALL
SELECT 'Claude', 'claude-ai', 'https://claude.ai', 'Advanced AI assistant by Anthropic offering nuanced understanding, detailed analysis, and creative capabilities.', 'Claude is a next-generation AI assistant built by Anthropic that excels at detailed analysis, creative writing, coding, mathematics, and general knowledge questions.', '00000000-0000-0000-0000-000000000000'::uuid, 'Anthropic', 'https://www.anthropic.com', 'support@anthropic.com', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://files.readme.io/10d60af-claude-illustration.png', 'freemium', 'Pro', 20.00, 240.00, true, 1, ARRAY['Text generation', 'Code analysis', 'Document review', 'Research assistance', 'PDF analysis', 'API access'], ARRAY['Content writing', 'Code review', 'Analysis', 'Research', 'Customer support', 'Brainstorming'], ARRAY['web', 'api'], ARRAY['Claude 3 Opus'], true, 2023, false, 'approved', true, true, 4.7, 11200, 7890, 10300
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'claude-ai')
UNION ALL
SELECT 'Copy.ai', 'copy-ai', 'https://www.copy.ai', 'AI-powered copywriting tool that generates marketing copy, blog posts, and social media content in seconds.', 'Copy.ai uses advanced AI to help marketers, entrepreneurs, and content creators write compelling copy for any platform or purpose.', '00000000-0000-0000-0000-000000000000'::uuid, 'Copy.ai', 'https://www.copy.ai', 'support@copy.ai', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://www.copy.ai/favicon.ico', 'freemium', 'Pro', 49.00, 0.00, true, 7, ARRAY['AI copywriting', 'Multi-language support', 'Content templates', 'Social media integration', 'SEO optimization'], ARRAY['Marketing copy', 'Blog writing', 'Social media content', 'Email campaigns', 'Ad copy'], ARRAY['web'], ARRAY['GPT-3.5'], true, 2021, false, 'approved', true, true, 4.5, 8200, 5100, 7800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'copy-ai')
UNION ALL
SELECT 'Jasper', 'jasper', 'https://www.jasper.ai', 'Enterprise-grade AI content platform for creating SEO-optimized blog posts, marketing copy, and brand content at scale.', 'Jasper is the leading AI content platform for teams and enterprises, combining GPT-4 with proprietary training to maintain brand voice across all content.', '00000000-0000-0000-0000-000000000000'::uuid, 'Jasper', 'https://www.jasper.ai', 'support@jasper.ai', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://www.jasper.ai/favicon.ico', 'paid', 'Team', 125.00, 1500.00, true, 5, ARRAY['Brand voice preservation', 'Content calendar', 'Team collaboration', 'SEO optimization', 'Plagiarism checker'], ARRAY['Blog posts', 'Marketing campaigns', 'Ad copy', 'Email sequences', 'Social media content'], ARRAY['web', 'api'], ARRAY['GPT-4'], true, 2021, false, 'approved', true, true, 4.6, 6800, 4200, 6100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'jasper')
UNION ALL
SELECT 'Grammarly', 'grammarly', 'https://www.grammarly.com', 'AI-powered writing assistant that checks grammar, tone, clarity, and plagiarism across all your writing.', 'Grammarly uses advanced AI to help you write clearly, confidently, and professionally. It works across emails, documents, social media, and more.', '00000000-0000-0000-0000-000000000000'::uuid, 'Grammarly', 'https://www.grammarly.com', 'support@grammarly.com', (SELECT id FROM public.tool_categories WHERE slug = 'content-writing' LIMIT 1), 'https://www.grammarly.com/favicon.ico', 'freemium', 'Premium', 12.00, 120.00, true, 30, ARRAY['Grammar checking', 'Tone detection', 'Plagiarism detection', 'Style suggestions', 'Tone adjustment'], ARRAY['Email writing', 'Document editing', 'Academic writing', 'Business communication'], ARRAY['web', 'ios', 'android', 'browser-extension'], ARRAY['Proprietary AI'], true, 2009, false, 'approved', true, true, 4.7, 12500, 9200, 11800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'grammarly')

UNION ALL

-- IMAGE & VISUAL (5 tools)
SELECT 'Midjourney', 'midjourney', 'https://www.midjourney.com', 'AI image generation tool that creates stunning artwork from text prompts with exceptional quality and artistic style.', 'Midjourney is a leading AI image generation platform that produces high-quality artwork based on text descriptions with various artistic styles, upscaling, and community features.', '00000000-0000-0000-0000-000000000000'::uuid, 'Midjourney, Inc.', 'https://www.midjourney.com', 'support@midjourney.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Midjourney_Emblem.png', 'paid', 'Pro', 30.00, 360.00, true, 1, ARRAY['Text-to-image', 'Upscaling', 'Style transfer', 'Variation generation', 'Inpainting', 'Community features'], ARRAY['Graphic design', 'Illustration', 'Marketing materials', 'Concept art', 'Social media content'], ARRAY['web', 'discord'], ARRAY['Custom diffusion model'], false, 2021, false, 'approved', true, true, 4.7, 9230, 6120, 9800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'midjourney')
UNION ALL
SELECT 'DALL-E 3', 'dalle-3', 'https://openai.com/dall-e-3', 'OpenAI''s latest image generation model with improved accuracy, detail, and adherence to text prompts.', 'DALL-E 3 generates highly accurate images from text descriptions with exceptional detail and prompt understanding. Integrated directly into ChatGPT for seamless creative workflow.', '00000000-0000-0000-0000-000000000000'::uuid, 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://cdn.openai.com/API/rendering/icon.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['High-accuracy image generation', 'Detailed rendering', 'ChatGPT integration', 'Image editing', 'Variation generation'], ARRAY['Marketing materials', 'Product mockups', 'Concept visualization', 'Social media graphics', 'Illustration'], ARRAY['web', 'api'], ARRAY['DALL-E 3'], true, 2022, false, 'approved', true, true, 4.6, 7800, 4900, 6700
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'dalle-3')
UNION ALL
SELECT 'Stable Diffusion', 'stable-diffusion', 'https://stability.ai', 'Open-source image generation model that runs locally or in the cloud, providing high-quality image creation with community contributions.', 'Stable Diffusion is a powerful open-source text-to-image model available through various platforms and APIs. Known for efficiency, customization, and community-driven development.', '00000000-0000-0000-0000-000000000000'::uuid, 'Stability AI', 'https://stability.ai', 'info@stability.ai', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://stability.ai/favicon.ico', 'free', 'Open Source', 0.00, 0.00, true, 0, ARRAY['Open-source', 'Local deployment', 'API access', 'Community models', 'Fine-tuning support'], ARRAY['Image generation', 'Model customization', 'Research', 'Product prototyping', 'Creative projects'], ARRAY['web', 'api', 'cli'], ARRAY['Stable Diffusion'], true, 2022, true, 'approved', true, true, 4.5, 6500, 3800, 5900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'stable-diffusion')
UNION ALL
SELECT 'Adobe Firefly', 'adobe-firefly', 'https://www.adobe.com/products/firefly', 'Generative AI suite integrated into Adobe Creative Cloud for image generation, editing, and design assistance.', 'Adobe Firefly brings generative AI capabilities directly into your favorite creative tools. Create stunning images, remove objects, and generate variations within Photoshop and other Adobe apps.', '00000000-0000-0000-0000-000000000000'::uuid, 'Adobe', 'https://www.adobe.com', 'support@adobe.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://www.adobe.com/favicon.ico', 'freemium', 'Creative Cloud', 60.00, 720.00, true, 7, ARRAY['Generative fill', 'Object removal', 'Style transfer', 'Creative controls', 'Adobe integration'], ARRAY['Photo editing', 'Graphic design', 'Social media graphics', 'Product photography', 'Web design'], ARRAY['web', 'desktop'], ARRAY['Adobe Firefly'], true, 2023, false, 'approved', true, true, 4.5, 5200, 3400, 4800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'adobe-firefly')
UNION ALL
SELECT 'Canva AI', 'canva-ai', 'https://www.canva.com', 'Design platform with integrated AI features for creating graphics, presentations, and marketing materials without design skills.', 'Canva AI makes design accessible to everyone with AI-powered suggestions, magic design, and text-to-image generation integrated into an intuitive design platform.', '00000000-0000-0000-0000-000000000000'::uuid, 'Canva', 'https://www.canva.com', 'support@canva.com', (SELECT id FROM public.tool_categories WHERE slug = 'image-visual' LIMIT 1), 'https://www.canva.com/favicon.ico', 'freemium', 'Pro', 13.00, 156.00, true, 30, ARRAY['Magic design', 'AI image generation', 'Background remover', 'Brand kit', 'Team collaboration'], ARRAY['Social media graphics', 'Presentations', 'Marketing materials', 'Branding', 'Content creation'], ARRAY['web', 'ios', 'android'], ARRAY['Custom AI'], true, 2013, false, 'approved', true, true, 4.8, 14200, 8900, 12400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'canva-ai')

UNION ALL

-- VIDEO & ANIMATION (4 tools)
SELECT 'Runway ML', 'runway-ml', 'https://www.runwayml.com', 'Generative AI suite for video, image, and audio creation with powerful editing and generation capabilities.', 'Runway is a comprehensive AI creation suite that empowers artists and creators with tools for video generation, image editing, background removal, and motion synthesis.', '00000000-0000-0000-0000-000000000000'::uuid, 'Runway Inc.', 'https://www.runwayml.com', 'hello@runwayml.com', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Runway_ML_logo.png', 'freemium', 'Pro', 35.00, 420.00, true, 3, ARRAY['Video generation', 'Image inpainting', 'Background removal', 'Motion synthesis', 'Real-time collaboration', 'API access'], ARRAY['Video editing', 'Animation', 'VFX', 'Content creation', 'Film production'], ARRAY['web', 'api'], ARRAY['Custom diffusion models'], true, 2018, false, 'approved', true, true, 4.6, 7540, 5230, 8400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'runway-ml')
UNION ALL
SELECT 'Synthesia', 'synthesia', 'https://www.synthesia.io', 'AI video creation platform that generates professional videos from text in minutes, with realistic avatars and multiple languages.', 'Synthesia enables you to create high-quality videos without cameras, actors, or production studios. Use AI avatars and text-to-speech to produce engaging videos in 140+ languages.', '00000000-0000-0000-0000-000000000000'::uuid, 'Synthesia', 'https://www.synthesia.io', 'support@synthesia.io', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://www.synthesia.io/favicon.ico', 'paid', 'Pro', 28.00, 336.00, true, 14, ARRAY['AI avatars', 'Text-to-speech', '140+ languages', 'Video templates', 'API access'], ARRAY['Training videos', 'Product demos', 'Marketing videos', 'Social media content', 'Educational content'], ARRAY['web', 'api'], ARRAY['Synthesia AI'], true, 2017, false, 'approved', true, true, 4.7, 6200, 4100, 5800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'synthesia')
UNION ALL
SELECT 'Descript', 'descript', 'https://www.descript.com', 'Video and audio editing platform powered by AI that works like a document editor for video content.', 'Descript lets you edit video and audio like you edit text. Transcribe, edit, and produce videos and podcasts with AI-powered tools for faster, simpler creation.', '00000000-0000-0000-0000-000000000000'::uuid, 'Descript', 'https://www.descript.com', 'support@descript.com', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://www.descript.com/favicon.ico', 'freemium', 'Pro', 24.00, 288.00, true, 30, ARRAY['Text-based editing', 'Auto-transcription', 'Overdub voice cloning', 'Filler word removal', 'AI repurposing'], ARRAY['Podcast editing', 'Video content', 'Social media clips', 'YouTube videos', 'Interview editing'], ARRAY['web', 'desktop'], ARRAY['Descript AI'], true, 2017, false, 'approved', true, true, 4.7, 5800, 3900, 5400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'descript')
UNION ALL
SELECT 'Opus Clip', 'opus-clip', 'https://www.opusclip.com', 'AI-powered tool that automatically transforms long-form videos into short, viral-ready clips optimized for social media.', 'Opus Clip uses AI to identify the most engaging moments in your videos and creates perfectly framed, captioned short clips ready for TikTok, Instagram, and YouTube Shorts.', '00000000-0000-0000-0000-000000000000'::uuid, 'Opus', 'https://www.opusclip.com', 'support@opusclip.com', (SELECT id FROM public.tool_categories WHERE slug = 'video-animation' LIMIT 1), 'https://www.opusclip.com/favicon.ico', 'freemium', 'Pro', 10.00, 120.00, true, 7, ARRAY['Auto clipping', 'Viral detection', 'Auto-captioning', 'Multi-platform export', 'Brand customization'], ARRAY['Content repurposing', 'Social media marketing', 'Podcast clips', 'YouTube shorts', 'TikTok content'], ARRAY['web'], ARRAY['Opus Clip AI'], true, 2023, false, 'approved', true, true, 4.6, 4100, 2800, 3900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'opus-clip')

UNION ALL

-- AUDIO & MUSIC (4 tools)
SELECT 'Suno', 'suno-ai', 'https://www.suno.ai', 'AI music generation platform that creates original songs with lyrics, vocals, and production from text prompts.', 'Suno AI is a breakthrough music creation platform that uses artificial intelligence to generate original, high-quality music with vocals and instrumentation from simple descriptions.', '00000000-0000-0000-0000-000000000000'::uuid, 'Suno Inc.', 'https://www.suno.ai', 'support@suno.ai', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://pbs.twimg.com/profile_images/1691864037/Suno_Logo_Main.jpg', 'freemium', 'Pro', 16.00, 192.00, true, 3, ARRAY['Music generation', 'Lyric writing', 'Vocal synthesis', 'Multiple genres', 'API access', 'Commercial license'], ARRAY['Music production', 'Content creation', 'Podcast intro', 'Background music', 'Game development'], ARRAY['web', 'api'], ARRAY['Custom audio diffusion'], true, 2023, false, 'approved', true, true, 4.5, 6890, 4560, 7600
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'suno-ai')
UNION ALL
SELECT 'ElevenLabs', 'eleven-labs', 'https://elevenlabs.io', 'AI text-to-speech and voice generation platform with the most realistic natural-sounding voices available.', 'ElevenLabs provides the most natural-sounding AI-generated speech with support for 29+ languages, voice cloning, and audio optimization perfect for content creators and developers.', '00000000-0000-0000-0000-000000000000'::uuid, 'ElevenLabs', 'https://elevenlabs.io', 'support@elevenlabs.io', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://elevenlabs.io/favicon.ico', 'freemium', 'Pro', 11.00, 132.00, true, 7, ARRAY['Text-to-speech', 'Voice cloning', '29+ languages', 'Emotionality', 'API access', 'Dubbing'], ARRAY['Podcast production', 'Video narration', 'Audiobook creation', 'Gaming', 'Accessibility'], ARRAY['web', 'api'], ARRAY['Proprietary neural network'], true, 2022, false, 'approved', true, true, 4.8, 8900, 5700, 8100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'eleven-labs')
UNION ALL
SELECT 'Udio', 'udio-ai', 'https://www.udio.com', 'AI music platform for generating, editing, and personalizing music with advanced musical AI capabilities.', 'Udio is an advanced AI music platform offering sophisticated music generation, editing, and composition tools for musicians, producers, and creators.', '00000000-0000-0000-0000-000000000000'::uuid, 'Udio', 'https://www.udio.com', 'support@udio.com', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://www.udio.com/favicon.ico', 'freemium', 'Pro', 0.00, 0.00, true, 0, ARRAY['Music generation', 'Advanced editing', 'Musical composition', 'Multiple styles', 'Collaboration'], ARRAY['Music production', 'Podcast music', 'Game soundtracks', 'Background scores', 'Audio content'], ARRAY['web'], ARRAY['Udio AI'], true, 2023, false, 'approved', true, true, 4.4, 3200, 1800, 2900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'udio-ai')
UNION ALL
SELECT 'Mubert', 'mubert', 'https://www.mubert.com', 'AI music generation platform that creates royalty-free background music for content creators, videos, and projects.', 'Mubert generates unique, royalty-free music powered by AI. Perfect for content creators, streaming platforms, and media production with unlimited music generation.', '00000000-0000-0000-0000-000000000000'::uuid, 'Mubert', 'https://www.mubert.com', 'support@mubert.com', (SELECT id FROM public.tool_categories WHERE slug = 'audio-music' LIMIT 1), 'https://www.mubert.com/favicon.ico', 'freemium', 'Pro', 15.00, 180.00, true, 7, ARRAY['Royalty-free music', 'Unlimited generation', 'Style customization', 'Mood-based selection', 'Commercial license'], ARRAY['Video content', 'Streaming platforms', 'Game soundtracks', 'Social media', 'Podcast music'], ARRAY['web', 'api'], ARRAY['Mubert AI'], true, 2014, false, 'approved', true, true, 4.4, 2900, 1600, 2700
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'mubert')

UNION ALL

-- CODE & DEVELOPMENT (5 tools)
SELECT 'GitHub Copilot', 'github-copilot', 'https://github.com/features/copilot', 'AI-powered code assistant that generates code suggestions and helps with software development in real-time.', 'GitHub Copilot uses machine learning trained on billions of lines of public code to suggest code completions and entire functions based on your comments and code context.', '00000000-0000-0000-0000-000000000000'::uuid, 'GitHub', 'https://github.com', 'support@github.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://github.githubassets.com/favicons/favicon.svg', 'paid', 'Individual', 10.00, 120.00, true, 30, ARRAY['Code completion', 'Function generation', 'Test writing', 'Documentation', 'Multi-language support'], ARRAY['Code writing', 'Bug fixing', 'Refactoring', 'Learning programming', 'Development acceleration'], ARRAY['vscode', 'visual-studio', 'neovim', 'jetbrains'], ARRAY['Codex'], true, 2021, false, 'approved', true, true, 4.7, 9800, 6400, 8900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'github-copilot')
UNION ALL
SELECT 'Tabnine', 'tabnine', 'https://www.tabnine.com', 'AI code completion tool that predicts your next line of code with machine learning, supporting all programming languages.', 'Tabnine provides AI-assisted code completion across all major programming languages and IDEs. Trained on open-source code for intelligent, context-aware suggestions.', '00000000-0000-0000-0000-000000000000'::uuid, 'Tabnine', 'https://www.tabnine.com', 'support@tabnine.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://www.tabnine.com/favicon.ico', 'freemium', 'Pro', 12.00, 144.00, true, 30, ARRAY['AI code completion', 'Language support', 'Privacy mode', 'IDE integration', 'Context awareness'], ARRAY['Code writing', 'Development speed', 'Code quality', 'Learning programming'], ARRAY['vscode', 'jetbrains', 'vim', 'sublime'], ARRAY['Tabnine AI'], true, 2018, false, 'approved', true, true, 4.6, 5600, 3400, 5100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'tabnine')
UNION ALL
SELECT 'Amazon CodeWhisperer', 'codewhisperer', 'https://aws.amazon.com/codewhisperer', 'AWS-powered AI code generation service that provides real-time code suggestions and security scanning.', 'CodeWhisperer is an AWS AI service that provides intelligent code suggestions in your IDE, integrating with AWS services and providing built-in security reference detector.', '00000000-0000-0000-0000-000000000000'::uuid, 'Amazon Web Services', 'https://aws.amazon.com', 'support@aws.amazon.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png', 'freemium', 'Pro', 0.00, 0.00, true, 0, ARRAY['Code generation', 'Security scanning', 'Reference detector', 'AWS integration', 'IDE support'], ARRAY['AWS development', 'Secure coding', 'Code acceleration', 'Learning AWS services'], ARRAY['vscode', 'jetbrains', 'visual-studio', 'aws-lambda'], ARRAY['CodeWhisperer AI'], true, 2022, false, 'approved', true, true, 4.5, 4200, 2800, 3900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'codewhisperer')
UNION ALL
SELECT 'Replit Ghostwriter', 'replit-ghostwriter', 'https://replit.com/ghostwriter', 'AI coding assistant built into Replit IDE for real-time code suggestions, generation, and debugging assistance.', 'Ghostwriter is an AI coding assistant in Replit that helps with code completion, generation, debugging, and explanation of code across multiple programming languages.', '00000000-0000-0000-0000-000000000000'::uuid, 'Replit', 'https://replit.com', 'support@replit.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://replit.com/favicon.ico', 'freemium', 'Pro', 7.00, 84.00, true, 14, ARRAY['Code completion', 'Code generation', 'Debugging', 'Code explanation', 'Collaborative IDE'], ARRAY['Web development', 'Learning programming', 'Rapid prototyping', 'Coding practice'], ARRAY['web'], ARRAY['Replit AI'], true, 2021, false, 'approved', true, true, 4.5, 3800, 2200, 3400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'replit-ghostwriter')
UNION ALL
SELECT 'OpenAI Codex', 'openai-codex', 'https://openai.com/blog/openai-codex', 'OpenAI''s general-purpose AI system trained on code that can understand and generate code in dozens of programming languages.', 'OpenAI Codex powers GitHub Copilot and other applications. It understands intent and can write complex code from simple comments.', '00000000-0000-0000-0000-000000000000'::uuid, 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'code-development' LIMIT 1), 'https://cdn.openai.com/API/rendering/icon.png', 'paid', 'API', 0.00, 0.00, true, 0, ARRAY['Code generation', '40+ languages', 'Complex logic', 'Context understanding', 'API access'], ARRAY['Code writing', 'Application development', 'Integration', 'API design'], ARRAY['api'], ARRAY['Codex'], true, 2021, false, 'approved', true, true, 4.7, 5200, 3800, 4900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'openai-codex')

UNION ALL

-- BUSINESS OPERATIONS (3 tools)
SELECT 'HubSpot', 'hubspot', 'https://www.hubspot.com', 'Comprehensive CRM and business operations platform with AI-powered insights for sales, marketing, and customer service.', 'HubSpot is an all-in-one platform with AI-driven tools for managing customers, automating workflows, and scaling your business operations.', '00000000-0000-0000-0000-000000000000'::uuid, 'HubSpot', 'https://www.hubspot.com', 'support@hubspot.com', (SELECT id FROM public.tool_categories WHERE slug = 'business-operations' LIMIT 1), 'https://www.hubspot.com/favicon.ico', 'freemium', 'Professional', 50.00, 600.00, true, 14, ARRAY['CRM platform', 'AI email writing', 'Workflow automation', 'Sales forecasting', 'Customer insights'], ARRAY['Sales management', 'Marketing automation', 'Customer support', 'Business scaling'], ARRAY['web', 'api', 'mobile'], ARRAY['HubSpot AI'], true, 2006, false, 'approved', true, true, 4.6, 7200, 4800, 6500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'hubspot')
UNION ALL
SELECT 'Zapier', 'zapier', 'https://zapier.com', 'Automation platform that connects apps and uses AI to create automated workflows without coding.', 'Zapier connects 7000+ apps and uses AI to help you build automated workflows. Automate repetitive tasks and integrate your favorite tools.', '00000000-0000-0000-0000-000000000000'::uuid, 'Zapier', 'https://zapier.com', 'support@zapier.com', (SELECT id FROM public.tool_categories WHERE slug = 'business-operations' LIMIT 1), 'https://zapier.com/favicon.ico', 'freemium', 'Pro', 25.00, 300.00, true, 14, ARRAY['App integration', 'Workflow automation', 'AI-powered suggestions', 'Multi-step zaps', 'API connections'], ARRAY['Business automation', 'Data transfer', 'Process optimization', 'Integration management'], ARRAY['web', 'api'], ARRAY['Zapier AI'], true, 2012, false, 'approved', true, true, 4.7, 8900, 5600, 8100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'zapier')
UNION ALL
SELECT 'Make', 'make-formerly-integromat', 'https://www.make.com', 'Visual automation platform with AI assistance for connecting apps and automating complex business workflows.', 'Make provides visual workflow automation with AI-powered scenarios connecting 1000+ apps. Automate business processes without coding.', '00000000-0000-0000-0000-000000000000'::uuid, 'Make', 'https://www.make.com', 'support@make.com', (SELECT id FROM public.tool_categories WHERE slug = 'business-operations' LIMIT 1), 'https://www.make.com/favicon.ico', 'freemium', 'Pro', 15.00, 180.00, true, 30, ARRAY['Visual workflow builder', 'AI scenario creation', 'App integration', 'Complex logic', 'Execution management'], ARRAY['Business automation', 'Data processing', 'System integration', 'Workflow optimization'], ARRAY['web', 'api'], ARRAY['Make AI'], true, 2013, false, 'approved', true, true, 4.6, 6500, 4200, 5800
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'make-formerly-integromat')

UNION ALL

-- MARKETING & SALES (3 tools)
SELECT 'HubSpot Marketing Hub', 'hubspot-marketing', 'https://www.hubspot.com/products/marketing', 'AI-powered marketing automation platform for email campaigns, social media, and lead generation.', 'HubSpot Marketing Hub combines CRM, email marketing, and social media management with AI insights to grow your business.', '00000000-0000-0000-0000-000000000000'::uuid, 'HubSpot', 'https://www.hubspot.com', 'support@hubspot.com', (SELECT id FROM public.tool_categories WHERE slug = 'marketing-sales' LIMIT 1), 'https://www.hubspot.com/favicon.ico', 'freemium', 'Professional', 50.00, 600.00, true, 14, ARRAY['Email marketing', 'Lead scoring', 'Social media management', 'Campaign automation', 'Analytics'], ARRAY['Campaign management', 'Lead generation', 'Email campaigns', 'Social marketing', 'Customer acquisition'], ARRAY['web', 'mobile', 'api'], ARRAY['HubSpot AI'], true, 2006, false, 'approved', true, true, 4.6, 7200, 4800, 6500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'hubspot-marketing')
UNION ALL
SELECT 'Seamless AI', 'seamless-ai', 'https://www.seamless.ai', 'AI-powered B2B sales platform that finds decision makers and generates leads automatically.', 'Seamless AI uses artificial intelligence to find verified email addresses and phone numbers for real decision makers, automating your prospecting process.', '00000000-0000-0000-0000-000000000000'::uuid, 'Seamless.ai', 'https://www.seamless.ai', 'support@seamless.ai', (SELECT id FROM public.tool_categories WHERE slug = 'marketing-sales' LIMIT 1), 'https://www.seamless.ai/favicon.ico', 'paid', 'Professional', 99.00, 1188.00, true, 7, ARRAY['Decision maker identification', 'Email finder', 'Phone verification', 'Real-time data', 'Lead enrichment'], ARRAY['B2B sales', 'Lead prospecting', 'Sales acceleration', 'Email outreach'], ARRAY['web', 'api'], ARRAY['Seamless AI'], true, 2017, false, 'approved', true, true, 4.5, 3400, 2100, 3100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'seamless-ai')
UNION ALL
SELECT 'ChatGPT for Marketing', 'chatgpt-marketing', 'https://openai.com/chatgpt', 'Use ChatGPT for marketing copy, campaign ideas, social media content, and audience analysis.', 'ChatGPT assists with marketing by helping create compelling copy, brainstorm campaigns, analyze audience data, and generate marketing strategies.', '00000000-0000-0000-0000-000000000000'::uuid, 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'marketing-sales' LIMIT 1), 'https://cdn.openai.com/API/rendering/icon.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['Copywriting', 'Strategy brainstorming', 'Content generation', 'Audience analysis', 'Campaign planning'], ARRAY['Marketing campaigns', 'Social media content', 'Email campaigns', 'Landing pages', 'Ad copy'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['GPT-4'], true, 2022, false, 'approved', true, true, 4.8, 15230, 8940, 12500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'chatgpt-marketing')

UNION ALL

-- RESEARCH & ANALYTICS (3 tools)
SELECT 'ChatGPT Research', 'chatgpt-research', 'https://openai.com/chatgpt', 'Use ChatGPT for data analysis, research synthesis, trend analysis, and insight generation.', 'ChatGPT assists with research by synthesizing information, analyzing trends, generating insights, and helping write research papers and reports.', '00000000-0000-0000-0000-000000000000'::uuid, 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'research-analytics' LIMIT 1), 'https://cdn.openai.com/API/rendering/icon.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['Data synthesis', 'Trend analysis', 'Insight generation', 'Report writing', 'Research assistance'], ARRAY['Market research', 'Data analysis', 'Literature review', 'Report writing', 'Competitive analysis'], ARRAY['web', 'api'], ARRAY['GPT-4'], true, 2022, false, 'approved', true, true, 4.8, 15230, 8940, 12500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'chatgpt-research')
UNION ALL
SELECT 'Google Analytics 4 with AI', 'google-analytics-ai', 'https://analytics.google.com', 'AI-powered analytics platform for web and app analytics with predictive insights and anomaly detection.', 'Google Analytics 4 uses AI to provide predictive analytics, anomaly detection, and automated insights about user behavior and conversion paths.', '00000000-0000-0000-0000-000000000000'::uuid, 'Google', 'https://www.google.com', 'support@google.com', (SELECT id FROM public.tool_categories WHERE slug = 'research-analytics' LIMIT 1), 'https://www.google.com/favicon.ico', 'free', 'Standard', 0.00, 0.00, true, 0, ARRAY['Web analytics', 'Predictive analytics', 'Anomaly detection', 'User insights', 'Conversion tracking'], ARRAY['Web analytics', 'User behavior analysis', 'Conversion optimization', 'Performance monitoring'], ARRAY['web'], ARRAY['Google AI'], true, 2005, false, 'approved', true, true, 4.7, 12300, 7800, 11200
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'google-analytics-ai')
UNION ALL
SELECT 'Tableau with Einstein AI', 'tableau-einstein', 'https://www.tableau.com/en-us/products/add-ons/einstein-analytics', 'Business intelligence and data visualization platform with AI-powered insights and natural language queries.', 'Tableau Einstein provides AI-powered analytics, automated insights, and natural language queries for deeper data exploration and visualization.', '00000000-0000-0000-0000-000000000000'::uuid, 'Salesforce Tableau', 'https://www.tableau.com', 'support@tableau.com', (SELECT id FROM public.tool_categories WHERE slug = 'research-analytics' LIMIT 1), 'https://www.tableau.com/favicon.ico', 'paid', 'Pro', 70.00, 840.00, true, 14, ARRAY['Data visualization', 'AI insights', 'Natural language queries', 'Predictive analytics', 'Embedded analytics'], ARRAY['Business intelligence', 'Data analysis', 'Executive dashboards', 'Performance reporting'], ARRAY['web', 'desktop'], ARRAY['Salesforce Einstein'], true, 2003, false, 'approved', true, true, 4.6, 5600, 3800, 5100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'tableau-einstein')

UNION ALL

-- DESIGN & CREATIVITY (3 tools)
SELECT 'Adobe Creative Cloud with AI', 'adobe-creative-ai', 'https://www.adobe.com/creativecloud.html', 'Suite of AI-powered design tools including Photoshop, Illustrator, and Premiere Pro with generative features.', 'Adobe Creative Cloud integrates AI-powered features like Generative Fill, Smart Objects, and AI-assisted design across all creative applications.', '00000000-0000-0000-0000-000000000000'::uuid, 'Adobe', 'https://www.adobe.com', 'support@adobe.com', (SELECT id FROM public.tool_categories WHERE slug = 'design-creativity' LIMIT 1), 'https://www.adobe.com/favicon.ico', 'paid', 'All Apps', 60.00, 720.00, true, 7, ARRAY['Generative fill', 'AI content creation', 'Photo editing', 'Video editing', 'Graphic design'], ARRAY['Photo editing', 'Graphic design', 'Video production', 'Animation', 'Web design'], ARRAY['desktop', 'web'], ARRAY['Adobe Firefly'], true, 1990, false, 'approved', true, true, 4.7, 6800, 4500, 6200
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'adobe-creative-ai')
UNION ALL
SELECT 'Figma AI', 'figma-ai', 'https://www.figma.com', 'UI/UX design platform with AI features for component generation, design suggestions, and prototyping.', 'Figma uses AI to help with design generation, smart components, and collaborative design workflows for product teams.', '00000000-0000-0000-0000-000000000000'::uuid, 'Figma', 'https://www.figma.com', 'support@figma.com', (SELECT id FROM public.tool_categories WHERE slug = 'design-creativity' LIMIT 1), 'https://www.figma.com/favicon.ico', 'paid', 'Professional', 12.00, 144.00, true, 30, ARRAY['Collaborative design', 'Component library', 'AI suggestions', 'Prototyping', 'Design systems'], ARRAY['UI/UX design', 'Product design', 'Prototyping', 'Design collaboration'], ARRAY['web'], ARRAY['Figma AI'], true, 2016, false, 'approved', true, true, 4.8, 7900, 5200, 7100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'figma-ai')
UNION ALL
SELECT 'Krita', 'krita', 'https://krita.org', 'Open-source digital painting and animation software with AI-powered features for artists and illustrators.', 'Krita is a free and open-source digital painting application with AI-assisted features for concept art, digital painting, and animation.', '00000000-0000-0000-0000-000000000000'::uuid, 'Krita Foundation', 'https://krita.org', 'info@krita.org', (SELECT id FROM public.tool_categories WHERE slug = 'design-creativity' LIMIT 1), 'https://krita.org/favicon.ico', 'free', 'Open Source', 0.00, 0.00, true, 0, ARRAY['Digital painting', 'AI-assisted features', 'Animation tools', 'Brush engine', 'Open source'], ARRAY['Concept art', 'Digital illustration', 'Animation', 'Game design', 'Comic creation'], ARRAY['desktop'], ARRAY['Krita AI'], true, 2004, true, 'approved', true, true, 4.5, 3200, 2100, 3000
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'krita')

UNION ALL

-- PRODUCTIVITY & AUTOMATION (4 tools)
SELECT 'Notion AI', 'notion-ai', 'https://www.notion.so', 'All-in-one workspace with AI features for note-taking, project management, and task automation.', 'Notion combines workspace organization with AI to help write better content, summarize documents, translate text, and automate workflows.', '00000000-0000-0000-0000-000000000000'::uuid, 'Notion', 'https://www.notion.so', 'support@notion.so', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://www.notion.so/favicon.ico', 'freemium', 'Plus', 10.00, 120.00, true, 30, ARRAY['AI writing', 'Document summarization', 'Task automation', 'Database management', 'Collaboration'], ARRAY['Project management', 'Note-taking', 'Knowledge management', 'Team coordination'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['Notion AI'], true, 2016, false, 'approved', true, true, 4.8, 12100, 7800, 10900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'notion-ai')
UNION ALL
SELECT 'Microsoft Copilot', 'microsoft-copilot', 'https://copilot.microsoft.com', 'AI assistant integrated into Microsoft 365 for Office, Teams, and Windows applications.', 'Microsoft Copilot uses AI to assist with writing in Word, data analysis in Excel, presentations in PowerPoint, and meetings in Teams.', '00000000-0000-0000-0000-000000000000'::uuid, 'Microsoft', 'https://www.microsoft.com', 'support@microsoft.com', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://www.microsoft.com/favicon.ico', 'paid', 'Copilot Pro', 20.00, 240.00, true, 1, ARRAY['Office integration', 'Writing assistance', 'Data analysis', 'Meeting support', 'Code generation'], ARRAY['Document writing', 'Data analysis', 'Presentation creation', 'Meeting notes'], ARRAY['web', 'desktop', 'mobile'], ARRAY['Copilot LLM'], true, 2023, false, 'approved', true, true, 4.6, 5800, 3900, 5300
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'microsoft-copilot')
UNION ALL
SELECT 'Google Workspace AI', 'google-workspace-ai', 'https://workspace.google.com/solutions/ai', 'AI-powered features in Gmail, Docs, Sheets, and Slides for content generation and task automation.', 'Google Workspace AI helps with email drafting in Gmail, document writing in Docs, data analysis in Sheets, and presentation creation in Slides.', '00000000-0000-0000-0000-000000000000'::uuid, 'Google', 'https://www.google.com', 'support@google.com', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://www.google.com/favicon.ico', 'paid', 'Workspace Labs', 0.00, 0.00, true, 0, ARRAY['Email drafting', 'Document writing', 'Data analysis', 'Presentation creation', 'Collaboration'], ARRAY['Email writing', 'Document creation', 'Data management', 'Presentations'], ARRAY['web', 'mobile'], ARRAY['Google AI'], true, 2006, false, 'approved', true, true, 4.7, 8900, 5600, 8100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'google-workspace-ai')
UNION ALL
SELECT 'Asana with AI', 'asana-ai', 'https://asana.com', 'Project management platform with AI features for task prioritization, automation, and team coordination.', 'Asana uses AI to help teams organize work, automate repetitive tasks, and maintain project momentum with intelligent insights.', '00000000-0000-0000-0000-000000000000'::uuid, 'Asana', 'https://asana.com', 'support@asana.com', (SELECT id FROM public.tool_categories WHERE slug = 'productivity-automation' LIMIT 1), 'https://asana.com/favicon.ico', 'freemium', 'Premium', 30.49, 365.88, true, 30, ARRAY['Task automation', 'AI prioritization', 'Workflow templates', 'Team collaboration', 'Portfolio management'], ARRAY['Project management', 'Team coordination', 'Agile workflows', 'Work organization'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['Asana AI'], true, 2011, false, 'approved', true, true, 4.7, 7200, 4800, 6500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'asana-ai')

UNION ALL

-- EDUCATION & LEARNING (3 tools)
SELECT 'ChatGPT for Learning', 'chatgpt-education', 'https://openai.com/chatgpt', 'Use ChatGPT as a personal tutor for explaining concepts, answering questions, and learning new subjects.', 'ChatGPT helps students learn by explaining complex topics, providing study materials, answering questions, and helping with homework.', '00000000-0000-0000-0000-000000000000'::uuid, 'OpenAI', 'https://openai.com', 'support@openai.com', (SELECT id FROM public.tool_categories WHERE slug = 'education-learning' LIMIT 1), 'https://cdn.openai.com/API/rendering/icon.png', 'freemium', 'Plus', 20.00, 200.00, true, 3, ARRAY['Tutoring', 'Concept explanation', 'Question answering', 'Study material generation', 'Multiple subjects'], ARRAY['Student learning', 'Exam prep', 'Homework assistance', 'Skill development'], ARRAY['web', 'ios', 'android', 'api'], ARRAY['GPT-4'], true, 2022, false, 'approved', true, true, 4.8, 15230, 8940, 12500
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'chatgpt-education')
UNION ALL
SELECT 'Khan Academy with AI', 'khan-academy-ai', 'https://www.khanacademy.org', 'Free educational platform with AI-powered personalized learning recommendations and adaptive lessons.', 'Khan Academy uses AI to personalize learning paths, provide targeted exercise recommendations, and help students master subjects at their own pace.', '00000000-0000-0000-0000-000000000000'::uuid, 'Khan Academy', 'https://www.khanacademy.org', 'support@khanacademy.org', (SELECT id FROM public.tool_categories WHERE slug = 'education-learning' LIMIT 1), 'https://www.khanacademy.org/favicon.ico', 'free', 'Subscription', 0.00, 0.00, true, 0, ARRAY['Personalized learning', 'Adaptive lessons', 'Exercise recommendations', 'Progress tracking', 'Video lessons'], ARRAY['K-12 education', 'College prep', 'STEM learning', 'Self-paced learning'], ARRAY['web', 'ios', 'android'], ARRAY['Khan AI'], true, 2008, false, 'approved', true, true, 4.8, 9800, 6200, 8900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'khan-academy-ai')
UNION ALL
SELECT 'Duolingo with AI', 'duolingo-ai', 'https://www.duolingo.com', 'Language learning app powered by AI for personalized lessons and adaptive difficulty progression.', 'Duolingo uses AI to personalize language lessons, adjust difficulty based on performance, and maintain engagement through gamification.', '00000000-0000-0000-0000-000000000000'::uuid, 'Duolingo', 'https://www.duolingo.com', 'support@duolingo.com', (SELECT id FROM public.tool_categories WHERE slug = 'education-learning' LIMIT 1), 'https://www.duolingo.com/favicon.ico', 'freemium', 'Plus', 6.99, 83.88, true, 7, ARRAY['Personalized lessons', 'Adaptive difficulty', 'Gamification', 'Speech recognition', 'AI conversation'], ARRAY['Language learning', 'Bilingual development', 'Travel preparation', 'Cultural learning'], ARRAY['web', 'ios', 'android'], ARRAY['Duolingo AI'], true, 2011, false, 'approved', true, true, 4.7, 11200, 7300, 10100
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'duolingo-ai')

UNION ALL

-- HEALTHCARE & SCIENCE (3 tools)
SELECT 'Babylon Health', 'babylon-health', 'https://www.babylonhealth.com', 'AI-powered healthcare platform for symptom checking, medical consultations, and health monitoring.', 'Babylon Health uses AI to provide symptom assessment, medical guidance, prescription management, and health tracking for patient wellness.', '00000000-0000-0000-0000-000000000000'::uuid, 'Babylon Health', 'https://www.babylonhealth.com', 'support@babylonhealth.com', (SELECT id FROM public.tool_categories WHERE slug = 'healthcare-science' LIMIT 1), 'https://www.babylonhealth.com/favicon.ico', 'freemium', 'Premium', 19.99, 0.00, true, 7, ARRAY['Symptom checking', 'Doctor consultations', 'Prescription management', 'Health monitoring', 'AI diagnosis'], ARRAY['Personal health', 'Medical guidance', 'Healthcare access', 'Wellness tracking'], ARRAY['web', 'ios', 'android'], ARRAY['Babylon AI'], true, 2013, false, 'approved', true, true, 4.3, 2800, 1600, 2400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'babylon-health')
UNION ALL
SELECT 'IBM Watson Health', 'ibm-watson-health', 'https://www.ibm.com/cloud/watson-health', 'AI platform for healthcare providers and researchers with tools for data analysis, diagnosis support, and drug discovery.', 'IBM Watson Health provides AI solutions for healthcare institutions including clinical decision support, medical imaging analysis, and health records management.', '00000000-0000-0000-0000-000000000000'::uuid, 'IBM', 'https://www.ibm.com', 'support@ibm.com', (SELECT id FROM public.tool_categories WHERE slug = 'healthcare-science' LIMIT 1), 'https://www.ibm.com/favicon.ico', 'paid', 'Enterprise', 0.00, 0.00, true, 0, ARRAY['Clinical decision support', 'Medical imaging', 'Data analysis', 'Drug discovery', 'Health records'], ARRAY['Healthcare institutions', 'Medical research', 'Drug development', 'Clinical diagnostics'], ARRAY['web', 'api'], ARRAY['Watson AI'], true, 2011, false, 'approved', true, true, 4.5, 1900, 1100, 1700
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'ibm-watson-health')
UNION ALL
SELECT 'AlphaFold', 'alphafold', 'https://alphafold.ebi.ac.uk', 'AI-powered tool for predicting 3D protein structures, revolutionizing biomedical research and drug discovery.', 'AlphaFold uses deep learning to predict protein structures from amino acid sequences, accelerating research in biology and medicine.', '00000000-0000-0000-0000-000000000000'::uuid, 'DeepMind', 'https://www.deepmind.com', 'support@deepmind.com', (SELECT id FROM public.tool_categories WHERE slug = 'healthcare-science' LIMIT 1), 'https://www.deepmind.com/favicon.ico', 'free', 'Academic', 0.00, 0.00, true, 0, ARRAY['Protein structure prediction', 'Drug discovery', 'Research acceleration', 'Open source', 'High accuracy'], ARRAY['Biomedical research', 'Drug discovery', 'Protein science', 'Academic research'], ARRAY['web', 'api'], ARRAY['AlphaFold'], true, 2020, true, 'approved', true, true, 4.9, 3100, 2200, 2900
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'alphafold')

UNION ALL

-- LEGAL & COMPLIANCE (3 tools)
SELECT 'LexisNexis AI', 'lexisnexis-ai', 'https://www.lexisnexis.com', 'AI-powered legal research and document analysis platform for law firms and legal departments.', 'LexisNexis uses AI to accelerate legal research, automate document review, and provide intelligent contract analysis for legal professionals.', '00000000-0000-0000-0000-000000000000'::uuid, 'LexisNexis', 'https://www.lexisnexis.com', 'support@lexisnexis.com', (SELECT id FROM public.tool_categories WHERE slug = 'legal-compliance' LIMIT 1), 'https://www.lexisnexis.com/favicon.ico', 'paid', 'Enterprise', 0.00, 0.00, true, 0, ARRAY['Legal research', 'Document review', 'Contract analysis', 'Case prediction', 'Due diligence'], ARRAY['Law firms', 'Legal research', 'Contract management', 'Due diligence'], ARRAY['web', 'api'], ARRAY['LexisNexis AI'], true, 1973, false, 'approved', true, true, 4.5, 1400, 800, 1200
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'lexisnexis-ai')
UNION ALL
SELECT 'Westlaw AI-Assisted Research', 'westlaw-ai', 'https://www.westlaw.com', 'AI-powered legal research platform for faster case law discovery and document analysis.', 'Westlaw''s AI-assisted research helps legal professionals find relevant cases, analyze documents, and draft legal arguments more efficiently.', '00000000-0000-0000-0000-000000000000'::uuid, 'Thomson Reuters', 'https://www.thomsonreuters.com', 'support@westlaw.com', (SELECT id FROM public.tool_categories WHERE slug = 'legal-compliance' LIMIT 1), 'https://www.westlaw.com/favicon.ico', 'paid', 'Professional', 0.00, 0.00, true, 0, ARRAY['Case law research', 'AI-assisted drafting', 'Document analysis', 'Legal precedent', 'Citation management'], ARRAY['Legal research', 'Document drafting', 'Case analysis', 'Trial preparation'], ARRAY['web', 'api'], ARRAY['Westlaw AI'], true, 1975, false, 'approved', true, true, 4.6, 1600, 900, 1400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'westlaw-ai')
UNION ALL
SELECT 'Compliance.ai', 'compliance-ai', 'https://www.compliance.ai', 'AI platform for monitoring regulatory changes and managing compliance requirements across industries.', 'Compliance.ai uses AI to track regulatory updates, automate compliance monitoring, and help organizations stay compliant with changing regulations.', '00000000-0000-0000-0000-000000000000'::uuid, 'Compliance.ai', 'https://www.compliance.ai', 'support@compliance.ai', (SELECT id FROM public.tool_categories WHERE slug = 'legal-compliance' LIMIT 1), 'https://www.compliance.ai/favicon.ico', 'paid', 'Professional', 0.00, 0.00, true, 0, ARRAY['Regulatory monitoring', 'Compliance tracking', 'Automated alerts', 'Risk assessment', 'Audit trails'], ARRAY['Compliance management', 'Risk management', 'Regulatory tracking', 'Audit readiness'], ARRAY['web', 'api'], ARRAY['Compliance AI'], true, 2018, false, 'approved', true, true, 4.4, 800, 500, 700
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'compliance-ai')

UNION ALL

-- HUMAN RESOURCES (3 tools)
SELECT 'HubSpot Recruiting', 'hubspot-recruiting', 'https://www.hubspot.com/products/recruit', 'HR platform with AI features for job posting, candidate sourcing, and interview scheduling.', 'HubSpot Recruiting helps companies attract and hire top talent with AI-assisted screening, job posting, and applicant tracking features.', '00000000-0000-0000-0000-000000000000'::uuid, 'HubSpot', 'https://www.hubspot.com', 'support@hubspot.com', (SELECT id FROM public.tool_categories WHERE slug = 'human-resources' LIMIT 1), 'https://www.hubspot.com/favicon.ico', 'paid', 'Professional', 75.00, 900.00, true, 14, ARRAY['AI candidate screening', 'Job posting', 'Interview scheduling', 'Collaboration', 'Analytics'], ARRAY['Recruitment', 'Hiring', 'Candidate management', 'Team building'], ARRAY['web', 'api', 'mobile'], ARRAY['HubSpot AI'], true, 2006, false, 'approved', true, true, 4.5, 1800, 1100, 1600
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'hubspot-recruiting')
UNION ALL
SELECT 'Workday', 'workday', 'https://www.workday.com', 'Enterprise HR and financial management platform with AI for talent management, planning, and analytics.', 'Workday uses AI to help with talent planning, skills matching, performance management, and predictive HR analytics.', '00000000-0000-0000-0000-000000000000'::uuid, 'Workday', 'https://www.workday.com', 'support@workday.com', (SELECT id FROM public.tool_categories WHERE slug = 'human-resources' LIMIT 1), 'https://www.workday.com/favicon.ico', 'paid', 'Enterprise', 0.00, 0.00, true, 0, ARRAY['Talent management', 'Skills matching', 'Performance analytics', 'Workforce planning', 'Learning management'], ARRAY['HR management', 'Talent development', 'Workforce planning', 'Employee analytics'], ARRAY['web', 'mobile', 'api'], ARRAY['Workday AI'], true, 2005, false, 'approved', true, true, 4.6, 2400, 1500, 2200
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'workday')
UNION ALL
SELECT 'Paradox', 'paradox', 'https://www.paradox.ai', 'AI-powered recruiting assistant that automates candidate screening, scheduling, and initial interviews.', 'Paradox''s AI chatbot conducts initial candidate interviews, screens applications, and schedules follow-up meetings automatically.', '00000000-0000-0000-0000-000000000000'::uuid, 'Paradox', 'https://www.paradox.ai', 'support@paradox.ai', (SELECT id FROM public.tool_categories WHERE slug = 'human-resources' LIMIT 1), 'https://www.paradox.ai/favicon.ico', 'paid', 'Professional', 0.00, 0.00, true, 0, ARRAY['AI interviews', 'Candidate screening', 'Schedule automation', 'Multi-language support', 'Integration'], ARRAY['Recruitment', 'Hiring automation', 'Candidate experience', 'Screening efficiency'], ARRAY['web', 'api', 'sms'], ARRAY['Paradox AI'], true, 2019, false, 'approved', true, true, 4.6, 1200, 700, 1000
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'paradox')

UNION ALL

-- E-COMMERCE & RETAIL (3 tools)
SELECT 'Shopify with AI', 'shopify-ai', 'https://www.shopify.com', 'E-commerce platform with AI features for product recommendations, inventory management, and marketing automation.', 'Shopify uses AI to recommend products to customers, optimize inventory, automate marketing, and provide business insights.', '00000000-0000-0000-0000-000000000000'::uuid, 'Shopify', 'https://www.shopify.com', 'support@shopify.com', (SELECT id FROM public.tool_categories WHERE slug = 'ecommerce-retail' LIMIT 1), 'https://www.shopify.com/favicon.ico', 'freemium', 'Premium', 299.00, 3588.00, true, 30, ARRAY['Product recommendations', 'Inventory AI', 'Marketing automation', 'Customer insights', 'Fraud detection'], ARRAY['E-commerce', 'Retail', 'Online sales', 'Inventory management'], ARRAY['web', 'mobile', 'api'], ARRAY['Shopify AI'], true, 2006, false, 'approved', true, true, 4.7, 8200, 5100, 7400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'shopify-ai')
UNION ALL
SELECT 'Amazon Personalize', 'amazon-personalize', 'https://aws.amazon.com/personalize', 'AWS service that uses ML to deliver personalized product recommendations and customer experiences.', 'Amazon Personalize provides real-time personalization engine powered by machine learning for e-commerce and retail applications.', '00000000-0000-0000-0000-000000000000'::uuid, 'Amazon Web Services', 'https://aws.amazon.com', 'support@aws.amazon.com', (SELECT id FROM public.tool_categories WHERE slug = 'ecommerce-retail' LIMIT 1), 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png', 'paid', 'Pro', 0.00, 0.00, true, 0, ARRAY['Personalization', 'Recommendations', 'Real-time analytics', 'A/B testing', 'Customer insights'], ARRAY['E-commerce', 'Retail', 'Streaming', 'Media personalization'], ARRAY['web', 'api', 'aws'], ARRAY['Amazon ML'], true, 2019, false, 'approved', true, true, 4.6, 1600, 1000, 1400
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'amazon-personalize')
UNION ALL
SELECT 'Insider', 'insider', 'https://useinsider.com', 'Customer data and engagement platform with AI for omnichannel personalization and customer journey optimization.', 'Insider provides AI-powered customer insights and personalization for e-commerce and retail brands across all channels.', '00000000-0000-0000-0000-000000000000'::uuid, 'Insider', 'https://useinsider.com', 'support@insider.com', (SELECT id FROM public.tool_categories WHERE slug = 'ecommerce-retail' LIMIT 1), 'https://useinsider.com/favicon.ico', 'paid', 'Professional', 0.00, 0.00, true, 0, ARRAY['Customer personalization', 'Omnichannel engagement', 'Predictive analytics', 'Journey automation', 'Customer insights'], ARRAY['E-commerce', 'Retail', 'Customer engagement', 'Marketing automation'], ARRAY['web', 'api', 'mobile'], ARRAY['Insider AI'], true, 2012, false, 'approved', true, true, 4.5, 1200, 700, 1000
WHERE NOT EXISTS (SELECT 1 FROM public.ai_tools WHERE slug = 'insider');
