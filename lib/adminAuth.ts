import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Server-side check for /api/admin routes. The browser sends the Supabase access
// token from the Academy login; we confirm it with Supabase and then read the
// caller's own profile (row level security allows that) to check for the admin role.
// Returns null when the caller is an admin, or the error response to send back.
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const result = await adminUser(req);
  return result instanceof NextResponse ? result : null;
}

// Like requireAdmin, but only the business owner passes: the admin whose email is
// OWNER_EMAIL. Sales reps with admin accounts get a 403.
export async function requireOwner(req: NextRequest): Promise<NextResponse | null> {
  const result = await adminUser(req);
  if (result instanceof NextResponse) return result;
  if (!isOwnerEmail(result.email)) return NextResponse.json({ error: 'Owner only' }, { status: 403 });
  return null;
}

// For routes that let every admin in but give the owner extra controls.
export async function adminIdentity(req: NextRequest): Promise<NextResponse | { email: string; isOwner: boolean }> {
  const result = await adminUser(req);
  if (result instanceof NextResponse) return result;
  return { email: result.email ?? '', isOwner: isOwnerEmail(result.email) };
}

function isOwnerEmail(email?: string) {
  const owner = (process.env.OWNER_EMAIL ?? 'danoble4800@gmail.com').trim().toLowerCase();
  return email?.toLowerCase() === owner;
}

async function adminUser(req: NextRequest): Promise<NextResponse | { email?: string }> {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error('Admin auth: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Not an admin' }, { status: 403 });

  return { email: user.email };
}
