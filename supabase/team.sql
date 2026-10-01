-- Sales team dashboard (/team). Run once in Supabase: SQL Editor → New query → paste → Run.
-- Needs supabase/schema.sql and supabase/cards.sql first. Safe to re-run.

-- A third role for sales reps: they sign in to /team and see only their own leads,
-- not /admin. rep_name is how they're written in the "Sales Rep Name" column of the
-- in-person tracker; list other spellings after commas ("Sergi, Sergy").
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('student', 'admin', 'rep'));
alter table public.profiles add column if not exists rep_name text not null default '';

-- Same as in cards.sql: team accounts (admins and now reps) can't claim a customer's
-- card, or a rep signed in on their own phone would claim it to themselves.
create or replace function public.claim_card(p_card text, p_page uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  c record;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'rep')) then
    return json_build_object('ok', false, 'reason', 'team');
  end if;
  if not exists (select 1 from card_pages where id = p_page and owner_id = auth.uid()) then
    raise exception 'not your page';
  end if;
  select * into c from cards where id = upper(p_card) for update;
  if not found then return json_build_object('ok', false, 'reason', 'missing'); end if;
  if c.status = 'disabled' then return json_build_object('ok', false, 'reason', 'disabled'); end if;
  if c.page_id is not null then
    if exists (select 1 from card_pages where id = c.page_id and owner_id = auth.uid()) then
      update cards set page_id = p_page where id = c.id;
      return json_build_object('ok', true);
    end if;
    return json_build_object('ok', false, 'reason', 'taken');
  end if;
  update cards set page_id = p_page, claimed_at = now(), redirect_url = null where id = c.id;
  return json_build_object('ok', true);
end;
$$;
grant execute on function public.claim_card(text, uuid) to authenticated;

-- Team sign-up (/team → Create account) is invite-only: an email listed here becomes a
-- rep account when it signs up, and never an Academy student. Add a rep with:
--   insert into public.team_invites (email, rep_name) values ('rep@example.com', 'First Last');
create table if not exists public.team_invites (
  email text primary key check (email = lower(email)),
  rep_name text not null,
  created_at timestamptz not null default now()
);
alter table public.team_invites enable row level security;
drop policy if exists "admins read team invites" on public.team_invites;
create policy "admins read team invites" on public.team_invites for select using (public.is_admin());

-- Lets the sign-up form say "not on the team list" before creating an account.
create or replace function public.team_invite_open(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from team_invites where email = lower(trim(p_email)));
$$;
grant execute on function public.team_invite_open(text) to anon, authenticated;

-- New accounts: invited emails become reps, everyone else an Academy student.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invite record;
begin
  select * into invite from team_invites where email = lower(new.email);
  insert into public.profiles (id, email, full_name, role, rep_name)
  values (
    new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when invite.email is not null then 'rep' else 'student' end,
    coalesce(invite.rep_name, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Accounts that already existed before their invite: switch them over (this also takes
-- away admin access).
update public.profiles p
set role = 'rep', rep_name = i.rep_name
from public.team_invites i
where lower(p.email) = i.email and p.role <> 'rep';
