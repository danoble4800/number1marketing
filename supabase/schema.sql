-- N°1 Academy — run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run.

-- One row per student/admin, created automatically when someone signs up.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

-- A row per completed module (lessons will write to this once content exists).
create table if not exists public.module_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_number text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_number)
);

-- security definer so the policies below can check the caller's role
-- without recursively applying the profiles policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;

-- Students see only themselves; admins see everyone. Nobody can change
-- their own role from the browser — promote admins in the SQL editor.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "progress_select" on public.module_progress;
create policy "progress_select" on public.module_progress
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "progress_insert_own" on public.module_progress;
create policy "progress_insert_own" on public.module_progress
  for insert with check (user_id = auth.uid());

-- After you create your own account on the site, make it the admin:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
