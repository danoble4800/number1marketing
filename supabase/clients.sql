-- Client hub — run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run. Needs supabase/schema.sql first (for public.is_admin()).
--
-- Everything a client submits or signs lives here instead of the Google Sheet:
-- their onboarding answers, their signed Service Agreement, and any other contracts
-- uploaded for them. The website writes with the service role key; admins can read.

-- One row per onboarded client, with every onboarding answer keyed by form field.
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null default '',
  email text not null default '',
  phone text not null default '',
  website text not null default '',
  industry text not null default '',
  onboarding jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- The signed Service Agreement. Stores the exact text the client agreed to, its
-- SHA-256 fingerprint, and the signing evidence, plus the PDFs in storage.
create table if not exists public.client_agreements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  agreement_number text not null unique,
  version text not null,
  agreement_text text not null,
  text_sha256 text not null,
  effective_date text not null default '',
  -- Client (the parties block of the contract)
  client_company text not null,
  client_address text not null default '',
  client_contact text not null default '',
  client_email text not null,
  -- Client signature
  signer_name text not null,
  signed_at timestamptz not null default now(),
  signer_ip text not null default '',
  signer_user_agent text not null default '',
  signed_pdf_path text,
  signed_pdf_sha256 text,
  -- Service Provider countersignature (filled in once, from the admin hub)
  countersigner_name text,
  countersigner_email text,
  countersigned_at timestamptz,
  countersigner_ip text,
  executed_pdf_path text,
  executed_pdf_sha256 text
);
create index if not exists client_agreements_client_idx on public.client_agreements (client_id);

-- Other contracts uploaded for a client (proposals, statements of work, change orders).
create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  label text not null,
  file_name text not null,
  file_path text not null,
  content_type text not null default '',
  size_bytes bigint not null default 0,
  uploaded_by text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists client_documents_client_idx on public.client_documents (client_id);

-- Signed agreements are permanent: no deletes, and after the client signs only the
-- countersignature can be added (once) and the PDF paths filled in (once).
create or replace function public.protect_client_agreement()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Signed agreements cannot be deleted';
  end if;
  if (new.client_id, new.agreement_number, new.version, new.agreement_text, new.text_sha256,
      new.effective_date, new.client_company, new.client_address, new.client_contact, new.client_email,
      new.signer_name, new.signed_at, new.signer_ip, new.signer_user_agent)
     is distinct from
     (old.client_id, old.agreement_number, old.version, old.agreement_text, old.text_sha256,
      old.effective_date, old.client_company, old.client_address, old.client_contact, old.client_email,
      old.signer_name, old.signed_at, old.signer_ip, old.signer_user_agent) then
    raise exception 'The client''s signed terms and signature cannot be changed';
  end if;
  if old.signed_pdf_path is not null and new.signed_pdf_path is distinct from old.signed_pdf_path
     or old.signed_pdf_sha256 is not null and new.signed_pdf_sha256 is distinct from old.signed_pdf_sha256
     or old.countersigned_at is not null and (new.countersigner_name, new.countersigner_email, new.countersigned_at, new.countersigner_ip)
        is distinct from (old.countersigner_name, old.countersigner_email, old.countersigned_at, old.countersigner_ip)
     or old.executed_pdf_path is not null and new.executed_pdf_path is distinct from old.executed_pdf_path
     or old.executed_pdf_sha256 is not null and new.executed_pdf_sha256 is distinct from old.executed_pdf_sha256 then
    raise exception 'A countersignature or signed PDF that is already recorded cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_client_agreement on public.client_agreements;
create trigger protect_client_agreement
  before update or delete on public.client_agreements
  for each row execute function public.protect_client_agreement();

-- Admins can read everything; all writes go through the website's server routes.
alter table public.clients enable row level security;
alter table public.client_agreements enable row level security;
alter table public.client_documents enable row level security;

drop policy if exists "admins read clients" on public.clients;
create policy "admins read clients" on public.clients for select using (public.is_admin());
drop policy if exists "admins read client agreements" on public.client_agreements;
create policy "admins read client agreements" on public.client_agreements for select using (public.is_admin());
drop policy if exists "admins read client documents" on public.client_documents;
create policy "admins read client documents" on public.client_documents for select using (public.is_admin());

-- Private bucket for the signed PDFs and uploaded contracts. No storage policies:
-- files are only reachable through short-lived links the server hands to admins.
insert into storage.buckets (id, name, public)
values ('client-files', 'client-files', false)
on conflict (id) do nothing;
