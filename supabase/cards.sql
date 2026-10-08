-- N°1 Tap Cards — run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Requires supabase/schema.sql (profiles + is_admin()). Safe to re-run.

-- One landing page per customer (a business can own several, e.g. one per employee).
create table if not exists public.card_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  published boolean not null default true,
  display_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  avatar_url text,
  cover_url text,
  contact jsonb not null default '{}'::jsonb,   -- phone, email, website, company, title, address
  links jsonb not null default '[]'::jsonb,     -- [{id, type, label, url, enabled}]
  theme jsonb not null default '{}'::jsonb,     -- {preset, accent, shape, font}
  review jsonb not null default '{}'::jsonb,    -- {url, funnel}
  special jsonb not null default '{}'::jsonb,   -- {enabled, title, body, code, expires}
  lead_capture boolean not null default false,
  lead_notify_email text,
  hide_badge boolean not null default false,
  lang text not null default 'en' check (lang in ('en', 'es', 'pt')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists card_pages_owner_idx on public.card_pages (owner_id);

-- Stats email: how often the owner gets their numbers (weekly on Mondays, monthly on the 1st).
-- report_token signs the one-click unsubscribe link, so it works without signing in.
alter table public.card_pages add column if not exists report_frequency text not null default 'monthly';
alter table public.card_pages drop constraint if exists card_pages_report_frequency_check;
alter table public.card_pages add constraint card_pages_report_frequency_check
  check (report_frequency in ('weekly', 'monthly', 'off'));
alter table public.card_pages add column if not exists report_token uuid not null default gen_random_uuid();
alter table public.card_pages add column if not exists report_sent_at timestamptz;

-- The physical cards. id is what's written to the chip: /t/<id>.
create table if not exists public.cards (
  id text primary key,
  page_id uuid references public.card_pages (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'disabled')),
  redirect_url text,          -- where an unclaimed card goes instead of the claim screen (e.g. /en/audit)
  label text not null default '',
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists cards_page_idx on public.cards (page_id);
-- The sales rep the card was given to; their /team Tap Cards tab shows it.
alter table public.cards add column if not exists rep_id uuid references public.profiles (id) on delete set null;
create index if not exists cards_rep_idx on public.cards (rep_id);

-- Taps, views, clicks, contact saves, review taps.
create table if not exists public.card_events (
  id bigint generated always as identity primary key,
  page_id uuid not null references public.card_pages (id) on delete cascade,
  kind text not null check (kind in ('tap', 'view', 'click', 'save_contact', 'review', 'lead')),
  card_id text,
  link_id text,
  source text,
  rating int,
  created_at timestamptz not null default now()
);
create index if not exists card_events_page_idx on public.card_events (page_id, created_at);

-- Contact exchange ("share your info") and private feedback from the review flow.
create table if not exists public.card_leads (
  id bigint generated always as identity primary key,
  page_id uuid not null references public.card_pages (id) on delete cascade,
  kind text not null default 'lead' check (kind in ('lead', 'feedback')),
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  note text not null default '',
  rating int,
  created_at timestamptz not null default now()
);
create index if not exists card_leads_page_idx on public.card_leads (page_id, created_at);

alter table public.card_pages enable row level security;
alter table public.cards enable row level security;
alter table public.card_events enable row level security;
alter table public.card_leads enable row level security;

-- Owners can't pay themselves up a plan: plan and billing ids only change via an admin,
-- the Stripe webhook (service_role) or the SQL editor. Not security definer on purpose,
-- so current_user is the caller's role (anon / authenticated / service_role / postgres).
create or replace function public.card_pages_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('anon', 'authenticated') and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.plan := 'free';
      new.stripe_customer_id := null;
      new.stripe_subscription_id := null;
    else
      new.plan := old.plan;
      new.owner_id := old.owner_id;
      new.stripe_customer_id := old.stripe_customer_id;
      new.stripe_subscription_id := old.stripe_subscription_id;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists card_pages_guard on public.card_pages;
create trigger card_pages_guard
  before insert or update on public.card_pages
  for each row execute function public.card_pages_guard();

drop function if exists public.is_service_role();

-- Pages: owners and admins only. The public reads through get_public_page(), which
-- leaves out billing ids and the lead notification email.
drop policy if exists "card_pages_select" on public.card_pages;
create policy "card_pages_select" on public.card_pages
  for select using (owner_id = auth.uid() or public.is_admin());
drop policy if exists "card_pages_insert" on public.card_pages;
create policy "card_pages_insert" on public.card_pages
  for insert with check (owner_id = auth.uid());
drop policy if exists "card_pages_update" on public.card_pages;
create policy "card_pages_update" on public.card_pages
  for update using (owner_id = auth.uid() or public.is_admin());
drop policy if exists "card_pages_delete" on public.card_pages;
create policy "card_pages_delete" on public.card_pages
  for delete using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "cards_select" on public.cards;
create policy "cards_select" on public.cards
  for select using (
    public.is_admin()
    or exists (select 1 from card_pages p where p.id = page_id and p.owner_id = auth.uid())
  );
drop policy if exists "cards_admin_write" on public.cards;
create policy "cards_admin_write" on public.cards
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "card_events_select" on public.card_events;
create policy "card_events_select" on public.card_events
  for select using (
    public.is_admin()
    or exists (select 1 from card_pages p where p.id = page_id and p.owner_id = auth.uid())
  );

drop policy if exists "card_leads_select" on public.card_leads;
create policy "card_leads_select" on public.card_leads
  for select using (
    public.is_admin()
    or exists (select 1 from card_pages p where p.id = page_id and p.owner_id = auth.uid())
  );
drop policy if exists "card_leads_delete" on public.card_leads;
create policy "card_leads_delete" on public.card_leads
  for delete using (
    public.is_admin()
    or exists (select 1 from card_pages p where p.id = page_id and p.owner_id = auth.uid())
  );

-- Public page data (safe columns only).
create or replace function public.get_public_page(p_slug text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'id', id, 'slug', slug, 'plan', plan, 'display_name', display_name,
    'headline', headline, 'bio', bio, 'avatar_url', avatar_url, 'cover_url', cover_url,
    'contact', contact, 'links', links, 'theme', theme, 'review', review, 'special', special,
    'lead_capture', lead_capture, 'hide_badge', hide_badge, 'lang', lang
  )
  from card_pages
  where slug = lower(p_slug) and published;
$$;
grant execute on function public.get_public_page(text) to anon, authenticated;

create or replace function public.slug_available(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(p_slug) ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'
     and lower(p_slug) not like 'demo-%'
     and not exists (select 1 from card_pages where slug = lower(p_slug));
$$;
grant execute on function public.slug_available(text) to anon, authenticated;

-- Called on every tap of /t/<id>: logs the tap and says where to send the visitor.
create or replace function public.resolve_card(p_card text, p_source text default 'nfc')
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  c record;
  v_slug text;
begin
  select * into c from cards where id = upper(p_card);
  if not found then
    return json_build_object('status', 'missing');
  end if;
  if c.status = 'disabled' then
    return json_build_object('status', 'disabled');
  end if;
  if c.page_id is null then
    return json_build_object('status', 'unclaimed', 'redirect_url', c.redirect_url);
  end if;
  select slug into v_slug from card_pages where id = c.page_id and published;
  if v_slug is null then
    return json_build_object('status', 'unpublished');
  end if;
  insert into card_events (page_id, kind, card_id, source)
  values (c.page_id, 'tap', c.id, left(coalesce(p_source, 'nfc'), 20));
  return json_build_object('status', 'active', 'slug', v_slug);
end;
$$;
grant execute on function public.resolve_card(text, text) to anon, authenticated;

-- Views, link clicks and review taps from the public page.
create or replace function public.record_card_event(
  p_page uuid, p_kind text, p_link text default null, p_source text default null, p_rating int default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind not in ('view', 'click', 'save_contact', 'review') then
    raise exception 'bad event kind';
  end if;
  if not exists (select 1 from card_pages where id = p_page and published) then
    return;
  end if;
  insert into card_events (page_id, kind, link_id, source, rating)
  values (p_page, p_kind, left(p_link, 40), left(p_source, 20),
          case when p_rating between 1 and 5 then p_rating end);
end;
$$;
grant execute on function public.record_card_event(uuid, text, text, text, int) to anon, authenticated;

-- Contact exchange (Pro/Business with lead capture on) and private review feedback (Business).
create or replace function public.submit_card_lead(
  p_page uuid, p_kind text, p_name text, p_email text, p_phone text, p_note text, p_rating int default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  pg record;
begin
  select plan, lead_capture, review into pg from card_pages where id = p_page and published;
  if not found then return false; end if;
  if p_kind = 'lead' and not (pg.plan in ('pro', 'business') and pg.lead_capture) then return false; end if;
  if p_kind = 'feedback' and not (pg.plan = 'business' and coalesce((pg.review ->> 'funnel')::boolean, false)) then
    return false;
  end if;
  if p_kind not in ('lead', 'feedback') then return false; end if;
  if coalesce(trim(p_name), '') = '' and coalesce(trim(p_email), '') = '' and coalesce(trim(p_phone), '') = ''
     and coalesce(trim(p_note), '') = '' then
    return false;
  end if;
  insert into card_leads (page_id, kind, name, email, phone, note, rating)
  values (p_page, p_kind, left(coalesce(p_name, ''), 120), left(coalesce(p_email, ''), 200),
          left(coalesce(p_phone, ''), 40), left(coalesce(p_note, ''), 2000),
          case when p_rating between 1 and 5 then p_rating end);
  if p_kind = 'lead' then
    insert into card_events (page_id, kind) values (p_page, 'lead');
  end if;
  return true;
end;
$$;
grant execute on function public.submit_card_lead(uuid, text, text, text, text, text, int) to anon, authenticated;

-- Links a fresh card to one of the caller's pages.
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
  -- Team accounts (admins and reps) can't own a customer's card: a rep signed in on
  -- their own phone would otherwise claim it to themselves.
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

-- Lets a card's current state be shown on the claim screen without exposing other data.
create or replace function public.card_claim_status(p_card text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when c.id is null then 'missing'
    when c.status = 'disabled' then 'disabled'
    when c.page_id is null then 'unclaimed'
    when p.owner_id = auth.uid() then 'mine'
    else 'taken'
  end
  from (select upper(p_card) as id) q
  left join cards c on c.id = q.id
  left join card_pages p on p.id = c.page_id;
$$;
grant execute on function public.card_claim_status(text) to anon, authenticated;

-- Owners can switch off a lost card (and back on).
create or replace function public.set_card_status(p_card text, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('active', 'disabled') then raise exception 'bad status'; end if;
  update cards c set status = p_status
  where c.id = upper(p_card)
    and (public.is_admin() or exists (
      select 1 from card_pages p where p.id = c.page_id and p.owner_id = auth.uid()));
end;
$$;
grant execute on function public.set_card_status(text, text) to authenticated;

-- Admin: mint a batch of card ids to write to chips, optionally given to a sales rep.
drop function if exists public.create_cards(int, text, text);
create or replace function public.create_cards(p_count int, p_label text default '', p_redirect text default null, p_rep uuid default null)
returns setof text
language plpgsql
security definer
set search_path = public
as $$
declare
  alphabet text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_id text;
  i int;
  j int;
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  if p_count < 1 or p_count > 500 then raise exception 'count must be 1-500'; end if;
  for i in 1..p_count loop
    loop
      v_id := '';
      for j in 1..7 loop
        v_id := v_id || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
      end loop;
      exit when not exists (select 1 from cards where id = v_id);
    end loop;
    insert into cards (id, label, redirect_url, rep_id) values (v_id, coalesce(p_label, ''), nullif(trim(p_redirect), ''), p_rep);
    return next v_id;
  end loop;
end;
$$;
grant execute on function public.create_cards(int, text, text, uuid) to authenticated;

-- Stats for the owner's dashboard, and for the rep who sold a card on the page.
create or replace function public.card_page_stats(p_page uuid, p_days int default 30)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := now() - make_interval(days => greatest(1, least(p_days, 365)));
begin
  if not (public.is_admin()
    or exists (select 1 from card_pages where id = p_page and owner_id = auth.uid())
    or exists (select 1 from cards where page_id = p_page and rep_id = auth.uid())) then
    raise exception 'not your page';
  end if;
  return json_build_object(
    'totals', (select coalesce(json_object_agg(kind, n), '{}'::json) from (
      select kind, count(*) n from card_events where page_id = p_page and created_at >= v_since group by kind) t),
    'all_time', (select coalesce(json_object_agg(kind, n), '{}'::json) from (
      select kind, count(*) n from card_events where page_id = p_page group by kind) t),
    'daily', (select coalesce(json_agg(d order by d.day), '[]'::json) from (
      select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
             count(*) filter (where kind = 'tap') as taps,
             count(*) filter (where kind = 'view') as views,
             count(*) filter (where kind = 'click') as clicks
      from card_events where page_id = p_page and created_at >= v_since group by 1) d),
    'links', (select coalesce(json_object_agg(link_id, n), '{}'::json) from (
      select link_id, count(*) n from card_events
      where page_id = p_page and kind = 'click' and link_id is not null and created_at >= v_since
      group by link_id) l),
    'ratings', (select coalesce(json_object_agg(rating, n), '{}'::json) from (
      select rating, count(*) n from card_events
      where page_id = p_page and kind = 'review' and rating is not null and created_at >= v_since
      group by rating) r)
  );
end;
$$;
grant execute on function public.card_page_stats(uuid, int) to authenticated;

-- Event counts per page for the stats email, for one period. Server only (service role).
create or replace function public.card_report_counts(p_pages uuid[], p_since timestamptz, p_until timestamptz)
returns table (page_id uuid, kind text, link_id text, rating int, n bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.page_id, e.kind,
         case when e.kind = 'click' then e.link_id end,
         case when e.kind = 'review' then e.rating end,
         count(*)
  from card_events e
  where e.page_id = any(p_pages) and e.created_at >= p_since and e.created_at < p_until
  group by 1, 2, 3, 4;
$$;
revoke execute on function public.card_report_counts(uuid[], timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.card_report_counts(uuid[], timestamptz, timestamptz) to service_role;

-- Tap and view counts for every page and card, for the admin Tap Cards tab.
-- Counts only: no visitor contact details.
create or replace function public.admin_card_stats(p_days int default 30)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := now() - make_interval(days => greatest(1, least(p_days, 365)));
begin
  if not public.is_admin() then raise exception 'admins only'; end if;
  return json_build_object(
    'pages', (select coalesce(json_object_agg(page_id, json_build_object(
        'taps', taps, 'views', views, 'taps_all', taps_all, 'last_tap', last_tap)), '{}'::json) from (
      select page_id,
             count(*) filter (where kind = 'tap' and created_at >= v_since) as taps,
             count(*) filter (where kind = 'view' and created_at >= v_since) as views,
             count(*) filter (where kind = 'tap') as taps_all,
             max(created_at) filter (where kind = 'tap') as last_tap
      from card_events group by page_id) p),
    'cards', (select coalesce(json_object_agg(card_id, json_build_object(
        'taps', taps, 'taps_all', taps_all, 'last_tap', last_tap)), '{}'::json) from (
      select card_id,
             count(*) filter (where created_at >= v_since) as taps,
             count(*) as taps_all,
             max(created_at) as last_tap
      from card_events where kind = 'tap' and card_id is not null group by card_id) c)
  );
end;
$$;
grant execute on function public.admin_card_stats(int) to authenticated;

-- A sales rep's Tap Cards tab: the cards given to them, the pages those cards are on,
-- and tap counts. Safe columns only (no billing ids or lead email), no visitor details.
-- An admin passes p_rep to see a rep's view.
create or replace function public.rep_tap_cards(p_days int default 30, p_rep uuid default null)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := now() - make_interval(days => greatest(1, least(p_days, 365)));
  v_rep uuid;
begin
  if p_rep is not null and public.is_admin() then
    v_rep := p_rep;
  elsif exists (select 1 from profiles where id = auth.uid() and role = 'rep') then
    v_rep := auth.uid();
  else
    raise exception 'team only';
  end if;
  return json_build_object(
    'cards', (select coalesce(json_agg(json_build_object(
        'id', id, 'page_id', page_id, 'status', status, 'label', label,
        'claimed_at', claimed_at, 'created_at', created_at) order by created_at desc), '[]'::json)
      from cards where rep_id = v_rep),
    'pages', (select coalesce(json_agg(json_build_object(
        'id', p.id, 'slug', p.slug, 'display_name', p.display_name, 'plan', p.plan,
        'published', p.published, 'created_at', p.created_at, 'links', p.links, 'review', p.review)
        order by p.created_at desc), '[]'::json)
      from card_pages p where exists (select 1 from cards c where c.page_id = p.id and c.rep_id = v_rep)),
    'stats', json_build_object(
      'pages', (select coalesce(json_object_agg(page_id, json_build_object(
          'taps', taps, 'views', views, 'taps_all', taps_all, 'last_tap', last_tap)), '{}'::json) from (
        select page_id,
               count(*) filter (where kind = 'tap' and created_at >= v_since) as taps,
               count(*) filter (where kind = 'view' and created_at >= v_since) as views,
               count(*) filter (where kind = 'tap') as taps_all,
               max(created_at) filter (where kind = 'tap') as last_tap
        from card_events
        where page_id in (select page_id from cards where rep_id = v_rep and page_id is not null)
        group by page_id) s),
      'cards', (select coalesce(json_object_agg(card_id, json_build_object(
          'taps', taps, 'taps_all', taps_all, 'last_tap', last_tap)), '{}'::json) from (
        select card_id,
               count(*) filter (where created_at >= v_since) as taps,
               count(*) as taps_all,
               max(created_at) as last_tap
        from card_events
        where kind = 'tap' and card_id in (select id from cards where rep_id = v_rep)
        group by card_id) s)
    )
  );
end;
$$;
grant execute on function public.rep_tap_cards(int, uuid) to authenticated;

-- Photo uploads: public bucket, each user writes only inside their own folder.
insert into storage.buckets (id, name, public)
values ('card-media', 'card-media', true)
on conflict (id) do nothing;

drop policy if exists "card_media_read" on storage.objects;
create policy "card_media_read" on storage.objects
  for select using (bucket_id = 'card-media');
drop policy if exists "card_media_insert" on storage.objects;
create policy "card_media_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'card-media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "card_media_update" on storage.objects;
create policy "card_media_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'card-media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "card_media_delete" on storage.objects;
create policy "card_media_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'card-media' and (storage.foldername(name))[1] = auth.uid()::text);
