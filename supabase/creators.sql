-- N°1 Creators — run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run. Needs supabase/schema.sql first (for public.is_admin()).
--
-- Applications from the /creators page. The website writes with the service role key;
-- admins read them and approve or reject them from the Creators tab in /admin.

create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'approved', 'rejected')),
  full_name text not null,
  email text not null,
  instagram text not null default '',
  tiktok text not null default '',
  followers text not null default '',
  niche text not null default '',
  campaign_types text[] not null default '{}',
  rate text not null default '',
  location text not null default '',
  links text not null default '',
  about text not null default '',
  locale text not null default 'en',
  reviewed_by text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists creator_applications_status_idx on public.creator_applications (status, created_at desc);
create index if not exists creator_applications_email_idx on public.creator_applications (lower(email));

alter table public.creator_applications enable row level security;

drop policy if exists "admins read creator applications" on public.creator_applications;
create policy "admins read creator applications" on public.creator_applications
  for select using (public.is_admin());
