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

-- Progress is only written by submit_quiz() below, so students can't mark
-- modules complete without passing.
drop policy if exists "progress_insert_own" on public.module_progress;

-- Correct answers. RLS on with no policies = unreadable from the browser.
-- Rows come from supabase/quiz_answer_key.private.sql (generated, gitignored).
create table if not exists public.quiz_answer_key (
  module_number text not null,
  question_index int not null,
  correct_option int not null,
  primary key (module_number, question_index)
);
alter table public.quiz_answer_key enable row level security;

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_number text not null,
  score int not null,
  total int not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);
alter table public.quiz_attempts enable row level security;

drop policy if exists "attempts_select" on public.quiz_attempts;
create policy "attempts_select" on public.quiz_attempts
  for select using (user_id = auth.uid() or public.is_admin());

-- Grades a quiz for the signed-in user. Returns which answers were right
-- (not what the right answers are), and records progress on a pass (>= 80%).
create or replace function public.submit_quiz(p_module text, p_answers int[])
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_total int;
  v_score int := 0;
  v_results boolean[] := '{}';
  v_passed boolean;
  v_prev text;
  r record;
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;

  -- Modules unlock in order.
  if p_module <> '01' then
    v_prev := lpad(((p_module)::int - 1)::text, 2, '0');
    if not exists (
      select 1 from module_progress where user_id = v_user and module_number = v_prev
    ) then
      raise exception 'module % is locked', p_module;
    end if;
  end if;

  select count(*) into v_total from quiz_answer_key where module_number = p_module;
  if v_total = 0 then
    raise exception 'no quiz for module %', p_module;
  end if;

  for r in
    select question_index, correct_option from quiz_answer_key
    where module_number = p_module order by question_index
  loop
    if coalesce(p_answers[r.question_index + 1], -1) = r.correct_option then
      v_score := v_score + 1;
      v_results := v_results || true;
    else
      v_results := v_results || false;
    end if;
  end loop;

  v_passed := v_score * 100 >= v_total * 80;

  insert into quiz_attempts (user_id, module_number, score, total, passed)
  values (v_user, p_module, v_score, v_total, v_passed);

  if v_passed then
    insert into module_progress (user_id, module_number)
    values (v_user, p_module)
    on conflict do nothing;
  end if;

  return json_build_object('score', v_score, 'total', v_total, 'passed', v_passed, 'results', v_results);
end;
$$;

revoke all on function public.submit_quiz(text, int[]) from public, anon;
grant execute on function public.submit_quiz(text, int[]) to authenticated;

-- After you create your own account on the site, make it the admin:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
