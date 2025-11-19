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
  ('Content & Writing', 'content-writing', 'AI writing tools, copywriting, and content creation', '✍️', 1),
  ('Image & Visual', 'image-visual', 'Image generation, editing, and visual design tools', '🎨', 2),
  ('Video & Animation', 'video-animation', 'Video generation, editing, and animation tools', '🎬', 3),
  ('Audio & Music', 'audio-music', 'Music generation, voice synthesis, and audio tools', '🎵', 4),
  ('Code & Development', 'code-development', 'Code assistants, debugging, and development tools', '💻', 5),
  ('Business Operations', 'business-operations', 'Business automation, CRM, and operations tools', '📊', 6),
  ('Marketing & Sales', 'marketing-sales', 'Marketing automation, analytics, and sales tools', '📈', 7),
  ('Research & Analytics', 'research-analytics', 'Data analysis, research, and business intelligence', '🔬', 8),
  ('Design & Creativity', 'design-creativity', 'Design tools, mockups, and creative assets', '🖌️', 9),
  ('Productivity & Automation', 'productivity-automation', 'Task management, automation, and productivity tools', '⚡', 10),
  ('Education & Learning', 'education-learning', 'Educational tools, tutoring, and learning platforms', '📚', 11),
  ('Healthcare & Science', 'healthcare-science', 'Healthcare, medical research, and science tools', '⚕️', 12),
  ('Legal & Compliance', 'legal-compliance', 'Legal document generation, contracts, and compliance', '⚖️', 13),
  ('Human Resources', 'human-resources', 'Recruitment, HR management, and employee tools', '👥', 14),
  ('E-commerce & Retail', 'ecommerce-retail', 'E-commerce, retail, and customer service tools', '🛍️', 15)
ON CONFLICT (slug) DO NOTHING;
