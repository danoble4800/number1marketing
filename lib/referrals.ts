import type { NextRequest } from 'next/server';
import { serviceClient } from '@/lib/cards/server';
import { splitNames } from '@/lib/teamAuth';

// Rep referral links: number1digitalmarketing.com/free-audit?ref=jennifer-souza.
// middleware.ts keeps the latest ?ref in a cookie for 30 days, so a lead who comes back
// later without the link still counts. The website lead forms put the rep's name in
// the "Referred By" column (R) of Website Leads.

export const REF_COOKIE = 'n1_ref';
export const REF_DAYS = 30;
export const REF_RE = /^[a-z0-9-]{1,60}$/;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';

// A rep's first listed tracker name: "Jennifer Souza" → "jennifer-souza".
export const repDisplayName = (p: { rep_name?: string | null; full_name?: string | null }) =>
  splitNames(p.rep_name || p.full_name || '')[0] ?? '';

export const refCode = (name: string) =>
  name.normalize('NFD').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-').slice(0, 60);

// No locale on purpose: visitors land on the free audit page in their own language.
export const referralUrl = (name: string) => `${SITE}/free-audit?ref=${refCode(name)}`;

// Same cookie, but lands on the Mac Assistant page. Sales from it earn the rep a commission.
export const assistantReferralUrl = (name: string) => `${SITE}/mac-assistant?ref=${refCode(name)}`;

// The rep who referred this visitor, or '' if none (or the code doesn't match a rep).
export async function referredBy(req: NextRequest): Promise<string> {
  const code = req.cookies.get(REF_COOKIE)?.value ?? '';
  if (!REF_RE.test(code)) return '';
  const db = serviceClient();
  if (!db) return '';
  const { data, error } = await db.from('profiles').select('*').eq('role', 'rep');
  if (error) {
    console.error('Referrals: could not load reps:', error);
    return '';
  }
  for (const p of data ?? []) {
    const name = repDisplayName(p);
    if (name && refCode(name) === code) return name;
  }
  return '';
}
