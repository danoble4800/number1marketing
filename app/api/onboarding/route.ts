import { NextRequest, NextResponse } from 'next/server';
import { AGREEMENTS, agreementText } from '@/lib/agreements';
import { buildAgreementPdf, type AgreementRecord } from '@/lib/agreementPdf';
import { serviceClient } from '@/lib/cards/server';
import {
  CLIENT_FILES_BUCKET, emailAgreement, newAgreementNumber, ownerEmail, requestIp, sha256, slug,
} from '@/lib/clientHub';

export const runtime = 'nodejs';

function joinField(val: unknown): string {
  if (val == null) return '';
  return (Array.isArray(val) ? val.join(', ') : String(val)).trim();
}

// Completed onboarding wizard: saves the client and their answers, records the signed
// Service Agreement with the exact text they were shown, then builds the signed PDF and
// emails it to the client and the owner. The signature itself is the required part;
// the PDF and emails are best effort (the PDF can be rebuilt from the stored record).
export async function POST(req: NextRequest) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const body: Record<string, string> = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, joinField(v)]));

  if (!body.clientCompany || !body.clientContact || !body.signatureName || body.agreedToTerms !== 'true') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.clientEmail)) {
    return NextResponse.json({ error: 'A valid contact email is required' }, { status: 400 });
  }
  const agreement = AGREEMENTS[body.agreementVersion];
  if (!agreement) {
    // An unknown version means the page is out of date; reloading shows the current agreement.
    return NextResponse.json({ error: 'This agreement is out of date. Please reload the page and sign again.' }, { status: 409 });
  }

  const db = serviceClient();
  if (!db) {
    console.error('Onboarding: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
    return NextResponse.json({ error: 'Failed to submit onboarding' }, { status: 500 });
  }

  const text = agreementText(agreement);
  const textHash = sha256(text);

  // A version's wording must never change after someone has signed it.
  const { data: drift, error: driftErr } = await db
    .from('client_agreements')
    .select('agreement_number')
    .eq('version', agreement.version)
    .neq('text_sha256', textHash)
    .limit(1);
  if (driftErr || drift?.length) {
    console.error(
      driftErr ?? `Onboarding: the text of ${agreement.version} was edited after clients signed it ` +
        `(e.g. ${drift![0].agreement_number}). Restore it and publish the change as a new version in lib/agreements.ts.`,
    );
    return NextResponse.json({ error: 'Failed to submit onboarding' }, { status: 500 });
  }

  const answers = { ...body };
  delete answers.agreementVersion;
  delete answers.agreedToTerms;
  const { data: client, error: clientErr } = await db
    .from('clients')
    .insert({
      company: body.companyLegalName || body.clientCompany,
      contact_name: body.contactName || body.clientContact,
      email: body.contactEmail || body.clientEmail,
      phone: body.contactPhone ?? '',
      website: body.websiteURL ?? '',
      industry: body.companyIndustry ?? '',
      onboarding: answers,
    })
    .select('id')
    .single();
  if (clientErr || !client) {
    console.error('Onboarding: could not save client:', clientErr);
    return NextResponse.json({ error: 'Failed to submit onboarding' }, { status: 500 });
  }

  const record: AgreementRecord = {
    agreement_number: newAgreementNumber(),
    version: agreement.version,
    text_sha256: textHash,
    effective_date: body.effectiveDate ?? '',
    client_company: body.clientCompany,
    client_address: body.clientAddress ?? '',
    client_contact: body.clientContact,
    client_email: body.clientEmail,
    signer_name: body.signatureName,
    signed_at: new Date().toISOString(),
    signer_ip: requestIp(req),
    signer_user_agent: req.headers.get('user-agent') ?? '',
  };
  const { data: saved, error: agreementErr } = await db
    .from('client_agreements')
    .insert({ ...record, client_id: client.id, agreement_text: text })
    .select('id')
    .single();
  if (agreementErr || !saved) {
    console.error('Onboarding: could not save signed agreement:', agreementErr);
    await db.from('clients').delete().eq('id', client.id);
    return NextResponse.json({ error: 'Failed to submit onboarding' }, { status: 500 });
  }

  // Signed PDF → storage → emails.
  try {
    const pdf = buildAgreementPdf(record);
    const path = `${client.id}/agreements/${record.agreement_number}-signed.pdf`;
    const { error: upErr } = await db.storage
      .from(CLIENT_FILES_BUCKET)
      .upload(path, pdf, { contentType: 'application/pdf', upsert: false });
    if (upErr) throw upErr;
    await db.from('client_agreements').update({ signed_pdf_path: path, signed_pdf_sha256: sha256(pdf) }).eq('id', saved.id);

    const fileName = `Service Agreement - ${slug(record.client_company)} - ${record.agreement_number}.pdf`;
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';
    await Promise.all([
      emailAgreement({
        to: [record.client_email],
        subject: `Your signed Service Agreement — ${record.agreement_number}`,
        heading: `Thanks, ${record.signer_name.split(' ')[0]} — your agreement is signed`,
        lines: [
          `Attached is your copy of the Service Agreement between ${record.client_company} and Number 1 Digital Marketing, ` +
            `signed ${new Date(record.signed_at).toUTCString()}.`,
          'Keep it for your records. You will receive the fully executed copy once we countersign.',
        ],
        pdf,
        fileName,
      }),
      emailAgreement({
        to: [ownerEmail()],
        subject: `New client signed: ${record.client_company} — countersign needed`,
        heading: `${record.client_company} signed the Service Agreement`,
        lines: [
          `${record.signer_name} (${record.client_email}) signed ${record.agreement_number} on version ${record.version}.`,
          `Review their onboarding answers and countersign in the admin hub: ${site}/en/admin?tab=clients`,
        ],
        pdf,
        fileName,
      }),
    ]);
  } catch (err) {
    console.error(`Onboarding: signed PDF or emails failed for ${record.agreement_number} (signature is saved):`, err);
  }

  return NextResponse.json({ success: true });
}
