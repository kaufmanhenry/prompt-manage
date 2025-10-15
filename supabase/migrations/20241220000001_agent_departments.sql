-- Add department field to agents table
alter table public.agents add column if not exists department text;

-- Create department enum constraint
alter table public.agents 
  add constraint agents_department_check 
  check (department in ('marketing', 'support', 'legal', 'design', 'engineering', 'sales', 'content', 'product', 'operations', 'general'));

-- Create index for department filtering
create index if not exists agents_department_idx on public.agents(department);

-- Update existing agents with departments
update public.agents set department = 'marketing' where name = 'Marketing Manager Agent';
update public.agents set department = 'content' where name = 'Content Creator Agent';
update public.agents set department = 'operations' where name = 'Small Business Owner Agent';
update public.agents set department = 'general' where name = 'Trending Topics Agent';
update public.agents set department = 'general' where name = 'Niche Expert Agent';
update public.agents set department = 'general' where name = 'Educational Agent';
update public.agents set department = 'general' where name = 'Seasonal Agent';
