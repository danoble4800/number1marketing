import { NextRequest, NextResponse } from 'next/server';
import { requireOwner } from '@/lib/adminAuth';
import { nfcFormKey } from '@/lib/nfcLead';

export const dynamic = 'force-dynamic';

// The shareable NFC lead form link, key included. Owner only.
export async function GET(req: NextRequest) {
  const denied = await requireOwner(req);
  if (denied) return denied;

  const key = nfcFormKey();
  if (!key) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  return NextResponse.json({ url: `${site}/en/nfc-lead?k=${encodeURIComponent(key)}` });
}
