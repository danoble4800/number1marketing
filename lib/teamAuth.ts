import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { noStoreFetch } from '@/lib/noStoreFetch';

// Server-side check for /api/team routes. Like lib/adminAuth.ts, but lets in sales
// reps (role 'rep') as well as admins. Reps only ever see their own leads; an admin
// can look at any rep's dashboard by name.
export type TeamMember = {
  email: string;
  role: 'admin' | 'rep';
  repNames: string[]; // how this rep is written in the in-person tracker; [] for admins
  db: SupabaseClient; // acts as the signed-in user, so row level security applies
};

export async function teamMember(req: NextRequest): Promise<NextResponse | TeamMember> {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error('Team auth: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const db = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` }, fetch: noStoreFetch },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  // select('*') so this keeps working before supabase/team.sql adds rep_name.
  const { data: profile } = await db.from('profiles').select('*').eq('id', user.id).single();
  const role = profile?.role;
  if (role !== 'admin' && role !== 'rep') return NextResponse.json({ error: 'Not on the team' }, { status: 403 });

  const repNames = role === 'rep' ? splitNames(profile.rep_name || profile.full_name || '') : [];
  return { email: user.email ?? '', role, repNames, db };
}

export const splitNames = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean);

// "LaQuan Hazard", "laquan" and "Laquan H." all match "Laquan Hazard"; "Sergy" matches
// "Sergi". Compares first names, ignoring case, accents and punctuation, and treats a
// final y as i.
const firstName = (v: string) =>
  v.normalize('NFD').toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/)[0]?.replace(/y$/, 'i') ?? '';

export function isRepsLead(leadRep: string, repNames: string[]): boolean {
  const name = firstName(leadRep);
  return !!name && repNames.some((n) => firstName(n) === name);
}
