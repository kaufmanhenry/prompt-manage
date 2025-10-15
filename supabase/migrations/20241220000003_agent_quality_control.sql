-- Add quality control and brand guidelines to agents table
alter table public.agents add column if not exists brand_guidelines jsonb default '{}';
alter table public.agents add column if not exists quality_standards jsonb default '{}';
alter table public.agents add column if not exists required_elements jsonb default '{}';
alter table public.agents add column if not exists forbidden_phrases text[] default '{}';
alter table public.agents add column if not exists key_phrases text[] default '{}';
alter table public.agents add column if not exists style_guide text;
alter table public.agents add column if not exists examples jsonb default '{}';
alter table public.agents add column if not exists review_required boolean default false;
alter table public.agents add column if not exists min_quality_score decimal default 0.7;

-- Create quality review status for generations
alter table public.agent_generations add column if not exists review_status text default 'pending';
alter table public.agent_generations add column if not exists review_notes text;
alter table public.agent_generations add column if not exists revised_content text;

alter table public.agent_generations 
  drop constraint if exists agent_generations_review_status_check;
  
alter table public.agent_generations 
  add constraint agent_generations_review_status_check 
  check (review_status in ('pending', 'approved', 'rejected', 'needs_revision', 'auto_approved'));

-- Create index for review filtering
create index if not exists agent_generations_review_status_idx on public.agent_generations(review_status);

-- Example quality-controlled agents
update public.agents 
set 
  brand_guidelines = '{
    "brand_voice": "Professional yet approachable, innovative, data-driven",
    "brand_values": ["transparency", "innovation", "customer-first", "quality"],
    "do_use": ["actionable insights", "proven strategies", "data-backed", "practical solutions"],
    "dont_use": ["revolutionary", "game-changing", "disruptive", "synergy"]
  }'::jsonb,
  quality_standards = '{
    "min_word_count": 500,
    "max_word_count": 1500,
    "readability_level": "8th grade",
    "must_include_examples": true,
    "must_include_actionable_steps": true,
    "citations_required": false
  }'::jsonb,
  required_elements = '{
    "introduction": "Hook + context + value proposition",
    "body": "3-5 main points with examples",
    "conclusion": "Summary + call-to-action",
    "metadata": "SEO title, meta description, keywords"
  }'::jsonb,
  key_phrases = ARRAY['AI-powered', 'prompt engineering', 'productivity boost', 'proven results'],
  forbidden_phrases = ARRAY['buy now', 'limited time only', 'act fast', 'revolutionary breakthrough'],
  style_guide = 'Use active voice. Write in second person when addressing readers. Keep paragraphs under 4 sentences. Include practical examples. End with clear next steps.',
  min_quality_score = 0.8,
  review_required = false
where name = 'Blog Post Writer Agent';

-- Insert example high-quality controlled agent
insert into public.agents (
  name, 
  description, 
  strategy, 
  department, 
  output_type, 
  target_audience, 
  tone, 
  length_preference,
  brand_guidelines,
  quality_standards,
  required_elements,
  key_phrases,
  forbidden_phrases,
  style_guide,
  examples,
  review_required,
  min_quality_score,
  config
) values (
  'Premium Blog Writer Agent',
  'Creates high-quality, brand-compliant blog posts with strict quality controls',
  'niche',
  'content',
  'blog_post',
  'marketing professionals and business owners',
  'professional but conversational',
  'detailed',
  '{
    "brand_voice": "Expert, trustworthy, actionable",
    "brand_values": ["quality", "expertise", "results-driven"],
    "do_use": ["proven strategies", "data-backed", "actionable insights", "real-world examples"],
    "dont_use": ["cheap", "easy money", "guaranteed results", "secrets"]
  }'::jsonb,
  '{
    "min_word_count": 800,
    "max_word_count": 1200,
    "readability_level": "8th-9th grade",
    "must_include_examples": true,
    "must_include_actionable_steps": true,
    "must_include_statistics": true,
    "formatting_required": true
  }'::jsonb,
  '{
    "headline": "Number or power word + benefit + keyword",
    "introduction": "Hook question + problem statement + solution preview",
    "body": "Minimum 3 sections with H2 subheadings, each with examples",
    "actionable_tips": "Minimum 3 specific, implementable steps",
    "conclusion": "Summary + next step + CTA",
    "metadata": "SEO title (60 chars), meta description (155 chars), 5-7 keywords"
  }'::jsonb,
  ARRAY[
    'proven strategies',
    'actionable insights',
    'data-backed results',
    'practical approach',
    'step-by-step guide',
    'real-world examples'
  ],
  ARRAY[
    'click here',
    'buy now',
    'limited time',
    'secret trick',
    'revolutionary',
    'guaranteed',
    'make money fast'
  ],
  'STYLE GUIDE:
  - Use active voice (not passive)
  - Address reader directly with "you"
  - One main idea per paragraph
  - Paragraphs: 2-4 sentences max
  - Include transition words between sections
  - Use bullet points for lists (3+ items)
  - Bold key takeaways
  - Include at least 1 relevant statistic per section
  - End sections with actionable insight
  - No jargon without explanation
  - Conversational but professional tone
  - Include "Why this matters" for each point',
  '{
    "good_example": "Discover 5 proven email marketing strategies that increased open rates by 34% for over 1,000 businesses. Learn the exact frameworks top marketers use to craft compelling subject lines and drive conversions.",
    "bad_example": "This revolutionary email marketing secret will change everything! Click now to discover the one weird trick that guarantees unlimited opens!",
    "good_headline": "7 Data-Backed Email Strategies That Boosted Our Open Rate by 45%",
    "bad_headline": "Revolutionary Email Secrets The Gurus Don''t Want You To Know!"
  }'::jsonb,
  true,
  0.85,
  '{
    "industries": ["marketing", "saas", "ecommerce"],
    "topics": ["email marketing", "content strategy", "SEO", "conversion optimization"],
    "frequency": "daily",
    "quality_focus": true
  }'::jsonb
);
