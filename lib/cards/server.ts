import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PublicPage } from './types';
import { getDemoPage } from './demo';
import { noStoreFetch as noStore } from '@/lib/noStoreFetch';

// Server-side clients for the tap-card pages. The anon client only reaches the
// security-definer functions in supabase/cards.sql; the service client (Stripe
// webhook, lead emails) needs SUPABASE_SERVICE_ROLE_KEY and bypasses RLS.
// All of them skip Next's fetch cache, or saved page edits never reach /c/<slug>.

export function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false }, global: { fetch: noStore } });
}

export function serviceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false }, global: { fetch: noStore } });
}

// Client acting as the signed-in user, from the "Authorization: Bearer" header.
export function userClient(req: Request): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const auth = req.headers.get('authorization');
  if (!url || !key || !auth?.startsWith('Bearer ')) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { Authorization: auth }, fetch: noStore },
  });
}

export async function getPublicPage(slug: string): Promise<PublicPage | null> {
  const demo = getDemoPage(slug.toLowerCase());
  if (demo) return demo;
  const supabase = anonClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_public_page', { p_slug: slug });
  if (error || !data) return null;
  return data as PublicPage;
}

export function isDemoId(id: string) {
  return id.startsWith('00000000-0000-0000-0000-');
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com').replace(/\/$/, '');
}
