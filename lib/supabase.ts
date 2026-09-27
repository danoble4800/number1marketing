import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Browser client for the Academy. The anon key is public by design —
// row level security in supabase/schema.sql decides what each user can read.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    client = createClient(url, anonKey);
  }
  return client;
}

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'admin';
  created_at: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .eq('id', session.user.id)
    .single();
  return (data as Profile) ?? null;
}
