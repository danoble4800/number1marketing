import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet, safeCell, sendLeadAlert } from '@/lib/websiteLeads';

const SERVICE_LABELS: Record<string, string> = {
  simpleAI: 'Never Miss a Lead — Starter',
  professionalAI: 'Never Miss a Lead — Advanced',
  webDesign: 'Website Design & Support',
  socialMedia: 'Social Media & Creators',
  consulting: 'Not Sure Yet',
};

const LEAD_SOURCES = ['Audit Page', 'Contact Page'];

const ACADEMY_OFFERS: Record<string, string> = {
  'academy-group': 'Live Group Call ($49/mo)',
  'academy-1on1': '1-on-1 Zoom ($197)',
  'academy-dwy-one': 'Done-With-You, one system ($497)',
  'academy-dwy-both': 'Done-With-You, both systems ($997)',
  'academy-team': 'Team Training (quote)',
  'academy-done-for-you': 'Done-For-You setup by our team (from an Academy lesson)',
};

// N°1 Creators brand plan buttons (content/creators/plans.ts)
const CREATOR_PLANS: Record<string, string> = {
  'creators-starter': 'Starter ($79/mo)',
  'creators-growth': 'Growth ($179/mo)',
  'creators-pro': 'Pro ($279/mo)',
  'creators-managed': 'Managed Campaigns ($497/mo)',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, businessName, industry, location, services, consent, source, inPersonRef, interest } = body;

    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const servicesList = Array.isArray(services)
      ? services.map((s: string) => SERVICE_LABELS[s] ?? s).join(', ')
      : '';
    // QR codes on the in-person follow-up PDFs tag the visit with the business they were made for
    const ref = typeof inPersonRef === 'string' && /^[a-z0-9-]{1,40}$/.test(inPersonRef) ? inPersonRef : '';
    // Academy offer and Creators plan buttons link here with ?interest=<offer> so the lead says what they want
    const academyOffer = typeof interest === 'string' ? ACADEMY_OFFERS[interest] : undefined;
    const creatorPlan = typeof interest === 'string' ? CREATOR_PLANS[interest] : undefined;
    const leadSource = ref
      ? `In-Person QR (${ref})`
      : academyOffer
      ? `Academy: ${academyOffer}`
      : creatorPlan
      ? `Creators: ${creatorPlan}`
      : LEAD_SOURCES.includes(source)
      ? source
      : 'Website';
    // "YYYY-MM-DD HH:MM:SS" in New York time so Sheets stores a real, sortable date
    const submittedAt = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' });

    await appendToSheet([
      submittedAt,
      'New',
      safeCell(firstName),
      safeCell(lastName),
      safeCell(businessName ?? ''),
      safeCell(industry ?? ''),
      safeCell(location ?? ''),
      safeCell(phone),
      safeCell(email),
      servicesList,
      leadSource,
      consent ? 'Yes' : 'No',
    ]);

    await sendLeadAlert({
      firstName: String(firstName),
      lastName: String(lastName),
      businessName: String(businessName ?? ''),
      industry: String(industry ?? ''),
      location: String(location ?? ''),
      phone: String(phone),
      email: String(email),
      services: servicesList,
      source: leadSource,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
