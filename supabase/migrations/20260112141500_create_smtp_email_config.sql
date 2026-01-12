create table public.smtp_email_config (
  id uuid primary key default gen_random_uuid(),

  host text not null,
  port integer not null,

  username text not null,
  password text not null,

  encryption text check (encryption in ('tls', 'ssl', 'none')) default 'tls',

  from_name text not null,
  from_email text not null,
  reply_to text,

  enabled boolean default true,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
