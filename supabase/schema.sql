create extension if not exists pgcrypto;

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text not null,
  session_id text,
  event_name text not null,
  feature_key text,
  page_path text,
  metadata jsonb default '{}'::jsonb,
  duration_ms integer,
  created_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  name text,
  age integer,
  phone text,
  line_id text,
  instagram_id text,
  preferred_contact text,
  job text,
  message text,
  adult_confirmed boolean default false,
  privacy_consent boolean default false,
  created_at timestamptz default now()
);

alter table analytics_events enable row level security;
alter table applications enable row level security;

create policy "anon insert analytics" on analytics_events for insert to anon with check (true);

create policy "anon insert applications" on applications for insert to anon with check (
  adult_confirmed = true
  and privacy_consent = true
  and (coalesce(phone,'') <> '' or coalesce(line_id,'') <> '' or coalesce(instagram_id,'') <> '')
);

-- 不要替 anon 建立 SELECT policy。
-- 後續管理者讀取請用 Supabase Auth + admin role + RLS。
