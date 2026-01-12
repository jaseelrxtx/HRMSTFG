create table public.email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  category text not null,
  status text check (status in ('active', 'draft')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
