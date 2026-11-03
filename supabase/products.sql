-- Paid downloads (lib/macAssistant.ts). Private bucket with no storage policies: buyers
-- only reach the files through 10-minute links /api/mac-assistant/download hands out
-- after Stripe confirms the payment. Safe to re-run.
--
-- After running this, upload in Supabase → Storage → products, folder mac-assistant/:
--   MacAssistant-Template.zip
--   Setup-Guide.pdf
-- Never put these files in the repo: it's public on GitHub.

insert into storage.buckets (id, name, public)
values ('products', 'products', false)
on conflict (id) do nothing;
