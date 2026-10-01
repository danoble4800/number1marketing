import { NextRequest, NextResponse } from 'next/server';
import { adminIdentity } from '@/lib/adminAuth';
import { buildAgreementPdf, type AgreementRecord } from '@/lib/agreementPdf';
import { serviceClient } from '@/lib/cards/server';
import { CLIENT_FILES_BUCKET, emailAgreement, ownerEmail, requestIp, sha256, slug } from '@/lib/clientHub';

export const runtime = 'nodejs';

// Owner countersigns a client-signed agreement. Records the countersignature (once —
// the database refuses to change it later), builds the fully executed PDF as a new
// file next to the client-signed one, and emails it to both parties.
export async function POST(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;
  if (!who.isOwner) return NextResponse.json({ error: 'Only the owner can countersign' }, { status: 403 });

  const { agreementId, name } = (await req.json().catch(() => ({}))) as { agreementId?: string; name?: string };
  const signerName = name?.trim() ?? '';
  if (!agreementId || signerName.length < 2) {
    return NextResponse.json({ error: 'Type your full legal name to countersign' }, { status: 400 });
  }

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const { data: row, error } = await db.from('client_agreements').select('*').eq('id', agreementId).single();
  if (error || !row) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
  if (row.countersigned_at) return NextResponse.json({ error: 'This agreement is already countersigned' }, { status: 409 });

  const counter = {
    countersigner_name: signerName,
    countersigner_email: who.email,
    countersigned_at: new Date().toISOString(),
    countersigner_ip: requestIp(req),
  };
  // Only fills in an empty countersignature, so two clicks can't both succeed.
  const { data: updated, error: updErr } = await db
    .from('client_agreements')
    .update(counter)
    .eq('id', agreementId)
    .is('countersigned_at', null)
    .select('id');
  if (updErr || !updated?.length) {
    console.error('Countersign failed:', updErr);
    return NextResponse.json({ error: 'Couldn’t record the countersignature. Refresh and try again.' }, { status: 409 });
  }

  const record: AgreementRecord = { ...(row as AgreementRecord), ...counter };
  try {
    const pdf = buildAgreementPdf(record);
    const path = `${row.client_id}/agreements/${row.agreement_number}-executed.pdf`;
    const { error: upErr } = await db.storage
      .from(CLIENT_FILES_BUCKET)
      .upload(path, pdf, { contentType: 'application/pdf', upsert: false });
    if (upErr) throw upErr;
    await db.from('client_agreements').update({ executed_pdf_path: path, executed_pdf_sha256: sha256(pdf) }).eq('id', agreementId);

    await emailAgreement({
      to: [row.client_email, ownerEmail()],
      subject: `Fully executed Service Agreement — ${row.agreement_number}`,
      heading: 'Your Service Agreement is fully executed',
      lines: [
        `The Service Agreement between ${row.client_company} and Number 1 Digital Marketing has now been signed by both parties.`,
        'The attached PDF is the final copy. Please keep it for your records.',
      ],
      pdf,
      fileName: `Service Agreement (executed) - ${slug(row.client_company)} - ${row.agreement_number}.pdf`,
    });
  } catch (err) {
    console.error(`Countersign: executed PDF or email failed for ${row.agreement_number} (countersignature is saved):`, err);
    return NextResponse.json({ success: true, warning: 'Countersigned, but the executed PDF couldn’t be created. Check the logs.' });
  }

  return NextResponse.json({ success: true });
}
