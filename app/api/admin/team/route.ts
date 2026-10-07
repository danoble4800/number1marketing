import { NextRequest, NextResponse } from 'next/server';
import { adminIdentity, isOwnerEmail } from '@/lib/adminAuth';
import { serviceClient } from '@/lib/cards/server';

export const dynamic = 'force-dynamic';

export type TeamRow = {
  // 'account' rows are signed-up admins and reps (profiles); 'invite' rows are reps on
  // the team_invites list who haven't created their account yet.
  kind: 'account' | 'invite';
  id: string; // profile id, or the invite's email
  name: string;
  email: string;
  role: 'admin' | 'rep';
  repName: string; // how a rep is written in the in-person tracker
  isOwner: boolean;
  createdAt: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Everyone on the team: admins and reps, plus pending rep invites. Any admin can view;
// only the owner can edit.
export async function GET(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  // select('*') so this keeps working before supabase/team.sql adds rep_name.
  const [profiles, invites] = await Promise.all([
    db.from('profiles').select('*').in('role', ['admin', 'rep']).order('created_at'),
    db.from('team_invites').select('*').order('created_at'),
  ]);
  if (profiles.error || !profiles.data) {
    console.error('Admin team: could not load profiles:', profiles.error);
    return NextResponse.json({ error: 'Couldn’t load the team.' }, { status: 500 });
  }
  if (invites.error) console.error('Admin team: could not load invites:', invites.error);

  const signedUp = new Set(profiles.data.map((p) => String(p.email).toLowerCase()));
  const members: TeamRow[] = [
    ...profiles.data.map((p): TeamRow => ({
      kind: 'account',
      id: p.id,
      name: p.full_name ?? '',
      email: p.email,
      role: p.role,
      repName: p.rep_name ?? '',
      isOwner: isOwnerEmail(p.email),
      createdAt: p.created_at,
    })),
    ...(invites.data ?? [])
      .filter((i) => !signedUp.has(i.email))
      .map((i): TeamRow => ({
        kind: 'invite',
        id: i.email,
        name: i.rep_name,
        email: i.email,
        role: 'rep',
        repName: i.rep_name,
        isOwner: false,
        createdAt: i.created_at,
      })),
  ];
  // Owner first, then admins, then reps.
  const rank = (m: TeamRow) => (m.isOwner ? 0 : m.role === 'admin' ? 1 : 2);
  members.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));

  return NextResponse.json({ isOwner: who.isOwner, members });
}

// Edit a team member's name, email and (reps) tracker name. Owner only.
export async function PATCH(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;
  if (!who.isOwner) return NextResponse.json({ error: 'Owner only' }, { status: 403 });

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  const body = await req.json().catch(() => null);
  const kind = body?.kind;
  const id = String(body?.id ?? '');
  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim().toLowerCase();
  const repName = String(body?.repName ?? '').trim();
  if (!id || (kind !== 'account' && kind !== 'invite')) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  if (!name) return NextResponse.json({ error: 'Name can’t be empty.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'That email doesn’t look right.' }, { status: 400 });

  if (kind === 'invite') {
    // The invite's email is its key, so a changed email means delete + insert.
    if (email !== id) {
      const { error } = await db.from('team_invites').insert({ email, rep_name: repName || name });
      if (error) {
        const taken = error.code === '23505';
        if (!taken) console.error('Admin team: could not move invite:', error);
        return NextResponse.json({ error: taken ? 'That email is already invited.' : 'Couldn’t save.' }, { status: taken ? 409 : 500 });
      }
      await db.from('team_invites').delete().eq('email', id);
    } else {
      const { error } = await db.from('team_invites').update({ rep_name: repName || name }).eq('email', id);
      if (error) {
        console.error('Admin team: could not update invite:', error);
        return NextResponse.json({ error: 'Couldn’t save.' }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true });
  }

  const { data: profile } = await db.from('profiles').select('*').eq('id', id).single();
  if (!profile || (profile.role !== 'admin' && profile.role !== 'rep')) {
    return NextResponse.json({ error: 'Not a team member' }, { status: 404 });
  }

  if (email !== String(profile.email).toLowerCase()) {
    // Owner controls are tied to OWNER_EMAIL, so changing it here would lock you out.
    if (isOwnerEmail(profile.email)) {
      return NextResponse.json({ error: 'The owner email is set by OWNER_EMAIL in Vercel — change it there first.' }, { status: 400 });
    }
    // Their sign-in email: they log in with the new one straight away (no confirmation mail).
    const { error } = await db.auth.admin.updateUserById(id, { email, email_confirm: true });
    if (error) {
      const taken = /already|registered|exists/i.test(error.message);
      if (!taken) console.error('Admin team: could not change sign-in email:', error);
      return NextResponse.json({ error: taken ? 'Another account already uses that email.' : 'Couldn’t change the email.' }, { status: taken ? 409 : 500 });
    }
    // Keep a rep's invite pointing at their current email.
    if (profile.role === 'rep') await db.from('team_invites').update({ email }).eq('email', String(profile.email).toLowerCase());
  }

  const update: Record<string, string> = { full_name: name, email };
  if (profile.role === 'rep') update.rep_name = repName || name;
  const { error } = await db.from('profiles').update(update).eq('id', id);
  if (error) {
    console.error('Admin team: could not update profile:', error);
    return NextResponse.json({ error: 'Couldn’t save.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
