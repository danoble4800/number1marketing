import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { loadOnboarding } from '@/lib/onboardingSheet';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    return NextResponse.json({ clients: await loadOnboarding() });
  } catch (err) {
    console.error('Admin CRM: couldn\'t read Onboarding:', err);
    return NextResponse.json({ error: 'Couldn’t load onboarding submissions.' }, { status: 500 });
  }
}
