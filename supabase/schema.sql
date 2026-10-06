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

-- One certificate per student, issued by issue_certificate_if_ready() once every
-- certification module is passed AND the capstone is approved. id is the public
-- verification code.
create table if not exists public.certificates (
  id text primary key,
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  full_name text not null,
  issued_at timestamptz not null default now()
);
alter table public.certificates enable row level security;

drop policy if exists "certificates_select" on public.certificates;
create policy "certificates_select" on public.certificates
  for select using (user_id = auth.uid() or public.is_admin());

-- Public lookup for the verification page: returns only name and date for one code.
create or replace function public.verify_certificate(p_code text)
returns table (id text, full_name text, issued_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select c.id, c.full_name, c.issued_at from certificates c where c.id = upper(trim(p_code));
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Public count for the Academy landing page.
create or replace function public.certificates_issued()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int from certificates;
$$;

grant execute on function public.certificates_issued() to anon, authenticated;

-- One capstone per student: a link to their document or deck, reviewed by an admin.
-- Written only through submit_capstone() and review_capstone() below.
create table if not exists public.capstone_submissions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  link text not null,
  note text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes_requested')),
  feedback text not null default '',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null
);
alter table public.capstone_submissions enable row level security;

drop policy if exists "capstone_select" on public.capstone_submissions;
create policy "capstone_select" on public.capstone_submissions
  for select using (user_id = auth.uid() or public.is_admin());

-- Issues the certificate when modules 01-06 are passed and the capstone is approved.
-- Called by submit_quiz() and review_capstone(); not callable from the browser.
create or replace function public.issue_certificate_if_ready(p_user uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from certificates where user_id = p_user) then
    return true;
  end if;

  if (
    select count(distinct module_number) from module_progress
    where user_id = p_user and module_number in ('01', '02', '03', '04', '05', '06')
  ) < 6 or not exists (
    select 1 from capstone_submissions where user_id = p_user and status = 'approved'
  ) then
    return false;
  end if;

  insert into certificates (id, user_id, full_name)
  select
    'N1-' || upper(substr(md5(gen_random_uuid()::text), 1, 4)) || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4)),
    p.id,
    coalesce(nullif(trim(p.full_name), ''), split_part(p.email, '@', 1))
  from profiles p where p.id = p_user
  on conflict (user_id) do nothing;
  return true;
end;
$$;

revoke all on function public.issue_certificate_if_ready(uuid) from public, anon, authenticated;

-- After a failed attempt a student waits before retrying: 1 hour for the final
-- assessment, 30 minutes for every other quiz. Returns null when they can retry now.
create or replace function public.quiz_retry_at(p_module text)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last quiz_attempts;
  v_at timestamptz;
begin
  if auth.uid() is null or public.is_admin() then
    return null;
  end if;
  select * into v_last from quiz_attempts
  where user_id = auth.uid() and module_number = p_module
  order by created_at desc limit 1;
  if v_last.id is null or v_last.passed then
    return null;
  end if;
  v_at := v_last.created_at + case when p_module = '06' then interval '1 hour' else interval '30 minutes' end;
  return case when v_at > now() then v_at else null end;
end;
$$;

revoke all on function public.quiz_retry_at(text) from public, anon;
grant execute on function public.quiz_retry_at(text) to authenticated;

-- Grades a quiz for the signed-in user and records progress on a pass (>= 80%).
-- A failed attempt returns only the score, so answers can't be found by elimination;
-- which questions were right is shown only once the quiz is passed.
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
  v_retry timestamptz;
  v_certificate boolean := false;
  r record;
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;

  -- Modules unlock in order (admins can take any quiz to review it).
  if p_module <> '01' and not public.is_admin() then
    v_prev := lpad(((p_module)::int - 1)::text, 2, '0');
    if not exists (
      select 1 from module_progress where user_id = v_user and module_number = v_prev
    ) then
      raise exception 'module % is locked', p_module;
    end if;
  end if;

  v_retry := public.quiz_retry_at(p_module);
  if v_retry is not null then
    return json_build_object('retry_at', v_retry);
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

  if not v_passed then
    return json_build_object(
      'score', v_score, 'total', v_total, 'passed', false,
      'retry_at', public.quiz_retry_at(p_module)
    );
  end if;

  insert into module_progress (user_id, module_number)
  values (v_user, p_module)
  on conflict do nothing;

  if p_module = '06' then
    v_certificate := public.issue_certificate_if_ready(v_user);
  end if;

  return json_build_object(
    'score', v_score, 'total', v_total, 'passed', true, 'results', v_results,
    'certificate', v_certificate
  );
end;
$$;

revoke all on function public.submit_quiz(text, int[]) from public, anon;
grant execute on function public.submit_quiz(text, int[]) to authenticated;

-- Student submits (or resubmits) their capstone once Module 06 is unlocked.
create or replace function public.submit_capstone(p_link text, p_note text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_link text := trim(coalesce(p_link, ''));
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;
  if not public.is_admin() and not exists (
    select 1 from module_progress where user_id = v_user and module_number = '05'
  ) then
    raise exception 'module 06 is locked';
  end if;
  if v_link !~* '^https?://\S+$' or length(v_link) > 500 then
    raise exception 'invalid link';
  end if;
  if exists (select 1 from capstone_submissions where user_id = v_user and status = 'approved') then
    raise exception 'capstone already approved';
  end if;

  insert into capstone_submissions (user_id, link, note, status, feedback, submitted_at, reviewed_at, reviewed_by)
  values (v_user, v_link, left(trim(coalesce(p_note, '')), 2000), 'pending', '', now(), null, null)
  on conflict (user_id) do update set
    link = excluded.link, note = excluded.note, status = 'pending', feedback = '',
    submitted_at = now(), reviewed_at = null, reviewed_by = null;

  return json_build_object('status', 'pending');
end;
$$;

revoke all on function public.submit_capstone(text, text) from public, anon;
grant execute on function public.submit_capstone(text, text) to authenticated;

-- Admin approves a capstone (issuing the certificate if the final is passed) or
-- sends it back with feedback.
create or replace function public.review_capstone(p_user uuid, p_approve boolean, p_feedback text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text := case when p_approve then 'approved' else 'changes_requested' end;
  v_certificate boolean := false;
begin
  if not public.is_admin() then
    raise exception 'admins only';
  end if;
  update capstone_submissions set
    status = v_status, feedback = left(trim(coalesce(p_feedback, '')), 2000),
    reviewed_at = now(), reviewed_by = auth.uid()
  where user_id = p_user;
  if not found then
    raise exception 'no capstone for that student';
  end if;
  if p_approve then
    v_certificate := public.issue_certificate_if_ready(p_user);
  end if;
  return json_build_object('status', v_status, 'certificate', v_certificate);
end;
$$;

revoke all on function public.review_capstone(uuid, boolean, text) from public, anon;
grant execute on function public.review_capstone(uuid, boolean, text) to authenticated;

-- Per-student extras that don't affect grading: checklist ticks per module and
-- glossary flashcards marked as known. Students read and write only their own row.
create table if not exists public.academy_user_state (
  user_id uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  checklists jsonb not null default '{}'::jsonb,
  known_terms text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.academy_user_state enable row level security;

drop policy if exists "user_state_select" on public.academy_user_state;
create policy "user_state_select" on public.academy_user_state
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "user_state_insert" on public.academy_user_state;
create policy "user_state_insert" on public.academy_user_state
  for insert with check (user_id = auth.uid());
drop policy if exists "user_state_update" on public.academy_user_state;
create policy "user_state_update" on public.academy_user_state
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- After you create your own account on the site, make it the admin:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
