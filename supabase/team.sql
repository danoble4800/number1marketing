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

-- Then move each rep off admin, using the email they sign in with:
--   update public.profiles set role = 'rep', rep_name = 'Laquan Hazard' where email = '<laquan's email>';
--   update public.profiles set role = 'rep', rep_name = 'Sergi, Sergy'  where email = '<sergi's email>';
-- A rep with no account yet signs up at /en/academy/login first.
