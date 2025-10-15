-- Autonomous Agent System Migration
-- Creates tables and functions for AI agents that generate prompts

-- Agent configurations table
create table public.agents (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  strategy    text not null, -- 'trending', 'niche', 'seasonal', 'educational'
  department  text default 'general', -- 'marketing', 'support', 'legal', 'design', 'engineering', 'sales', 'content', 'product', 'operations', 'general'
  is_active   boolean default true,
  config      jsonb default '{}', -- Strategy-specific configuration
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  constraint agents_department_check check (department in ('marketing', 'support', 'legal', 'design', 'engineering', 'sales', 'content', 'product', 'operations', 'general'))
);

-- Agent generation history
create table public.agent_generations (
  id          uuid primary key default gen_random_uuid(),
  agent_id    uuid references public.agents(id) on delete cascade,
  prompt_id   uuid references public.prompts(id) on delete cascade,
  strategy_context text, -- What triggered this generation
  quality_score numeric(3,2), -- 0.00 to 1.00
  generation_cost_usd numeric(10,6), -- Cost to generate this prompt
  created_at  timestamptz default now()
);

-- Agent performance metrics
create table public.agent_metrics (
  id          uuid primary key default gen_random_uuid(),
  agent_id    uuid references public.agents(id) on delete cascade,
  date        date not null,
  prompts_generated integer default 0,
  total_cost_usd numeric(10,6) default 0,
  avg_quality_score numeric(3,2),
  prompts_published integer default 0,
  total_views integer default 0,
  created_at  timestamptz default now(),
  unique(agent_id, date)
);

-- Create indexes
create index agent_generations_agent_id_idx on public.agent_generations(agent_id);
create index agent_generations_prompt_id_idx on public.agent_generations(prompt_id);
create index agent_metrics_agent_date_idx on public.agent_metrics(agent_id, date);

-- Enable RLS
alter table public.agents enable row level security;
alter table public.agent_generations enable row level security;
alter table public.agent_metrics enable row level security;

-- RLS policies for agents (admin only for now)
create policy "Service role can manage agents"
  on public.agents for all
  using (auth.role() = 'service_role');

create policy "Service role can manage agent generations"
  on public.agent_generations for all
  using (auth.role() = 'service_role');

create policy "Service role can manage agent metrics"
  on public.agent_metrics for all
  using (auth.role() = 'service_role');

-- Function to create agent-generated prompts
create or replace function create_agent_prompt(
  p_name text,
  p_description text,
  p_prompt_text text,
  p_model text,
  p_tags text[],
  p_agent_id uuid,
  p_strategy_context text default null,
  p_quality_score numeric default null,
  p_user_id uuid default null
)
returns uuid as $$
declare
  prompt_uuid uuid;
  agent_user_id uuid;
begin
  -- Get or use the agent user ID
  if p_user_id is not null then
    agent_user_id := p_user_id;
  else
    -- Try to find agent user by email
    select id into agent_user_id from auth.users where email = 'agent@promptmanage.com' limit 1;

    -- If no agent user exists, raise an error with helpful message
    if agent_user_id is null then
      raise exception 'Agent user not found. Please create a user with email agent@promptmanage.com first.';
    end if;
  end if;

  -- Insert the prompt (will be public by default)
  insert into public.prompts (
    name, description, prompt_text, model, tags, is_public, user_id
  ) values (
    p_name, p_description, p_prompt_text, p_model, p_tags, true, agent_user_id
  ) returning id into prompt_uuid;

  -- Log the generation
  insert into public.agent_generations (
    agent_id, prompt_id, strategy_context, quality_score
  ) values (
    p_agent_id, prompt_uuid, p_strategy_context, p_quality_score
  );

  return prompt_uuid;
end;
$$ language plpgsql security definer;

-- Function to update agent metrics
create or replace function update_agent_metrics(
  p_agent_id uuid,
  p_date date,
  p_prompts_generated integer default 0,
  p_cost_usd numeric default 0,
  p_quality_score numeric default null,
  p_prompts_published integer default 0,
  p_views integer default 0
)
returns void as $$
begin
  insert into public.agent_metrics (
    agent_id, date, prompts_generated, total_cost_usd,
    avg_quality_score, prompts_published, total_views
  ) values (
    p_agent_id, p_date, p_prompts_generated, p_cost_usd,
    p_quality_score, p_prompts_published, p_views
  )
  on conflict (agent_id, date) do update set
    prompts_generated = agent_metrics.prompts_generated + p_prompts_generated,
    total_cost_usd = agent_metrics.total_cost_usd + p_cost_usd,
    avg_quality_score = case
      when p_quality_score is not null then
        coalesce((agent_metrics.avg_quality_score + p_quality_score) / 2, p_quality_score)
      else agent_metrics.avg_quality_score
    end,
    prompts_published = agent_metrics.prompts_published + p_prompts_published,
    total_views = agent_metrics.total_views + p_views;
end;
$$ language plpgsql security definer;

-- Create default agents for specific personas and departments
insert into public.agents (name, description, strategy, department, config) values
('Marketing Manager Agent', 'Generates prompts for marketing managers focused on campaigns, analytics, and growth strategies', 'niche', 'marketing', '{"industries": ["marketing", "advertising", "growth"], "persona": "marketing_manager", "frequency": "daily", "topics": ["campaigns", "analytics", "growth", "conversion", "branding"]}'),
('Content Creator Agent', 'Creates prompts for content creators, bloggers, and social media managers', 'trending', 'content', '{"topics": ["content", "social_media", "blogging", "video", "engagement"], "persona": "content_creator", "frequency": "daily", "platforms": ["instagram", "tiktok", "youtube", "linkedin"]}'),
('Small Business Owner Agent', 'Generates prompts for small business owners focused on operations, sales, and customer service', 'educational', 'operations', '{"subjects": ["business_operations", "customer_service", "sales", "productivity"], "persona": "small_business_owner", "frequency": "daily", "industries": ["retail", "service", "ecommerce", "consulting"]}'),
('Customer Support Agent', 'Creates prompts for customer support teams handling inquiries and tickets', 'niche', 'support', '{"industries": ["customer_service", "support", "help_desk"], "persona": "support_agent", "frequency": "daily", "topics": ["ticket_resolution", "customer_satisfaction", "empathy", "troubleshooting"]}'),
('Sales Team Agent', 'Generates prompts for sales professionals focused on prospecting and closing deals', 'niche', 'sales', '{"industries": ["sales", "business_development"], "persona": "sales_professional", "frequency": "daily", "topics": ["prospecting", "objection_handling", "closing", "follow_up"]}'),
('Product Manager Agent', 'Creates prompts for product managers working on roadmaps and user research', 'educational', 'product', '{"subjects": ["product_strategy", "user_research", "roadmap_planning"], "persona": "product_manager", "frequency": "daily"}'),
('Engineering Team Agent', 'Generates prompts for software engineers and technical teams', 'niche', 'engineering', '{"industries": ["software", "development"], "persona": "engineer", "frequency": "daily", "topics": ["code_review", "architecture", "debugging", "documentation"]}'),
('Trending Topics Agent', 'Generates prompts for trending topics and current events', 'trending', 'general', '{"topics": ["AI", "productivity", "marketing", "coding"], "frequency": "daily"}'),
('Niche Expert Agent', 'Creates specialized prompts for specific industries and use cases', 'niche', 'general', '{"industries": ["healthcare", "finance", "education", "ecommerce"], "frequency": "weekly"}'),
('Educational Agent', 'Generates learning-focused prompts and tutorials', 'educational', 'general', '{"subjects": ["prompt engineering", "AI tools", "workflow optimization"], "frequency": "biweekly"}'),
('Seasonal Agent', 'Creates prompts based on seasons, holidays, and calendar events', 'seasonal', 'general', '{"events": ["holidays", "seasons", "business cycles"], "frequency": "monthly"}');

-- Note: Create the agent user account manually through Supabase Dashboard or Auth API
-- Email: agent@promptmanage.com
-- This user will be used to attribute AI-generated prompts
