-- Add output_type and advanced configuration fields to agents table
alter table public.agents add column if not exists output_type text default 'prompt';
alter table public.agents add column if not exists output_format jsonb default '{}';
alter table public.agents add column if not exists target_audience text;
alter table public.agents add column if not exists tone text;
alter table public.agents add column if not exists length_preference text;

-- Create output_type constraint
alter table public.agents 
  drop constraint if exists agents_output_type_check;
  
alter table public.agents 
  add constraint agents_output_type_check 
  check (output_type in (
    'prompt',           -- AI prompts
    'blog_post',        -- Blog articles
    'documentation',    -- Technical docs
    'email',            -- Email templates
    'social_media',     -- Social posts
    'code',             -- Code snippets
    'presentation',     -- Slide decks
    'script',           -- Video/podcast scripts
    'whitepaper',       -- Long-form content
    'case_study',       -- Case studies
    'tutorial',         -- How-to guides
    'newsletter',       -- Email newsletters
    'landing_page',     -- Marketing copy
    'product_description', -- Product copy
    'ads',              -- Ad copy
    'report',           -- Reports/analytics
    'other'             -- Custom types
  ));

-- Create index for output_type filtering
create index if not exists agents_output_type_idx on public.agents(output_type);

-- Update existing agents with appropriate output types
update public.agents set output_type = 'prompt' where name like '%Agent';

-- Add some example agents with different output types
insert into public.agents (name, description, strategy, department, output_type, output_format, target_audience, tone, config) values
('Blog Post Writer Agent', 'Creates SEO-optimized blog posts for marketing', 'niche', 'content', 'blog_post', 
  '{"word_count": "800-1200", "include_seo": true, "include_images": true, "sections": ["intro", "body", "conclusion", "cta"]}',
  'marketing professionals', 'professional but conversational', 
  '{"industries": ["marketing", "saas", "ecommerce"], "topics": ["growth", "conversion", "retention"], "frequency": "daily"}'),

('Technical Documentation Agent', 'Generates API documentation and technical guides', 'educational', 'engineering', 'documentation',
  '{"format": "markdown", "include_code_examples": true, "include_diagrams": false, "depth": "comprehensive"}',
  'developers and technical users', 'clear and technical',
  '{"subjects": ["API", "architecture", "deployment", "configuration"], "frequency": "weekly"}'),

('Social Media Manager Agent', 'Creates engaging social media posts for multiple platforms', 'trending', 'marketing', 'social_media',
  '{"platforms": ["twitter", "linkedin", "instagram"], "include_hashtags": true, "character_limits": true, "post_types": ["educational", "promotional", "engagement"]}',
  'social media followers', 'engaging and authentic',
  '{"topics": ["product updates", "industry news", "tips and tricks"], "frequency": "daily"}'),

('Email Campaign Agent', 'Writes compelling email campaigns and newsletters', 'niche', 'marketing', 'email',
  '{"format": "html_template", "include_subject_lines": true, "include_preview_text": true, "sections": ["header", "body", "cta", "footer"]}',
  'email subscribers', 'friendly and persuasive',
  '{"industries": ["ecommerce", "saas", "b2b"], "topics": ["product launches", "promotions", "updates"], "frequency": "weekly"}'),

('Code Snippet Agent', 'Generates reusable code examples and utilities', 'educational', 'engineering', 'code',
  '{"languages": ["javascript", "python", "typescript"], "include_tests": true, "include_documentation": true, "style": "production-ready"}',
  'software developers', 'clear and concise',
  '{"subjects": ["utilities", "helpers", "hooks", "components"], "frequency": "weekly"}');
