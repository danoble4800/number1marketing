import { getSupabase } from '@/lib/supabase';
import type { CardPage } from './types';

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export async function slugAvailable(slug: string) {
  const { data } = await getSupabase().rpc('slug_available', { p_slug: slug });
  return !!data;
}

export async function listMyPages(): Promise<CardPage[]> {
  const { data } = await getSupabase().from('card_pages').select('*').order('created_at');
  return (data as CardPage[]) ?? [];
}

export async function createPage(ownerId: string, displayName: string, slug: string, email?: string) {
  const { data, error } = await getSupabase()
    .from('card_pages')
    .insert({
      owner_id: ownerId,
      slug,
      display_name: displayName,
      contact: email ? { email } : {},
      links: [],
      theme: { preset: 'midnight' },
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as CardPage;
}

export async function authHeader(): Promise<Record<string, string>> {
  const { data } = await getSupabase().auth.getSession();
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}
