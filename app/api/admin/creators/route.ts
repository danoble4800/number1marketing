import { NextRequest, NextResponse } from 'next/server';
import { adminIdentity } from '@/lib/adminAuth';
import { serviceClient } from '@/lib/cards/server';

export const dynamic = 'force-dynamic';

export type CreatorApplication = {
  id: string;
  status: 'new' | 'approved' | 'rejected';
  full_name: string;
  email: string;
  instagram: string;
  tiktok: string;
  followers: string;
  niche: string;
  campaign_types: string[];
  rate: string;
  location: string;
  links: string;
  about: string;
  locale: string;
  reviewed_by: string;
  reviewed_at: string | null;
  created_at: string;
};

const STATUSES = ['new', 'approved', 'rejected'];

// Creator applications from /creators (supabase/creators.sql), newest first.
export async function GET(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  const { data, error } = await db
    .from('creator_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    console.error('Admin creators: could not load applications:', error);
    const missing = error.code === '42P01' || /does not exist/i.test(error.message);
    return NextResponse.json(
      { error: missing ? 'Run supabase/creators.sql in Supabase to turn on creator applications.' : 'Couldn’t load applications.' },
      { status: 500 },
    );
  }
  return NextResponse.json({ applications: data as CreatorApplication[] });
}

// Approve, reject, or move an application back to New. Any admin.
export async function PATCH(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? '');
  const status = String(body?.status ?? '');
  if (!id || !STATUSES.includes(status)) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const reviewed = status === 'new'
    ? { reviewed_by: '', reviewed_at: null }
    : { reviewed_by: who.email, reviewed_at: new Date().toISOString() };
  const { error } = await db.from('creator_applications').update({ status, ...reviewed }).eq('id', id);
  if (error) {
    console.error('Admin creators: could not update application:', error);
    return NextResponse.json({ error: 'Couldn’t save.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
