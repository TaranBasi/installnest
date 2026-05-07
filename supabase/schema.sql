-- InstallNest leads table
-- Run this in the Supabase dashboard → SQL Editor

create table public.leads (
  id            uuid        default gen_random_uuid() primary key,
  type          text        not null check (type in ('customer', 'installer')),
  email         text        not null,
  postcode      text,
  nationwide    boolean     default false,
  business_name text,
  created_at    timestamptz default now()
);

-- Prevent duplicate registrations (case-insensitive email match)
create unique index leads_email_idx on public.leads (lower(email));

-- Enable Row Level Security
-- (the Edge Function uses the service role key which bypasses RLS,
--  so no policies are needed — public access is blocked by default)
alter table public.leads enable row level security;
