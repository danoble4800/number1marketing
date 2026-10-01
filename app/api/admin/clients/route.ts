import { NextRequest, NextResponse } from 'next/server';
import { adminIdentity } from '@/lib/adminAuth';
import { serviceClient } from '@/lib/cards/server';
import { CLIENT_FILES_BUCKET, ONBOARDING_SECTIONS } from '@/lib/clientHub';

export const dynamic = 'force-dynamic';

// Download links handed to the browser expire after this many seconds.
const LINK_TTL = 60 * 30;

export type HubFile = { label: string; fileName: string; url: string; note?: string };

export type HubAgreement = {
  id: string;
  number: string;
  version: string;
  textSha256: string;
  signerName: string;
  signerEmail: string;
  signedAt: string;
  signerIp: string;
  countersignerName: string | null;
  countersignedAt: string | null;
  files: HubFile[];
};

export type HubClient = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  createdAt: string;
  goal: string;
  agreements: HubAgreement[];
  documents: (HubFile & { id: string; uploadedBy: string; createdAt: string })[];
  sections: { title: string; fields: [string, string][] }[];
};

// Every onboarded client, newest first, with their answers, signed agreements and
// uploaded contracts. Any admin can view; the owner also gets countersign/upload controls.
export async function GET(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  const [clients, agreements, documents] = await Promise.all([
    db.from('clients').select('*').order('created_at', { ascending: false }),
    db.from('client_agreements')
      .select('id, client_id, agreement_number, version, text_sha256, client_email, signer_name, signed_at, signer_ip, countersigner_name, countersigned_at, signed_pdf_path, executed_pdf_path')
      .order('signed_at', { ascending: false }),
    db.from('client_documents').select('*').order('created_at', { ascending: false }),
  ]);
  const err = clients.error ?? agreements.error ?? documents.error;
  if (err || !clients.data || !agreements.data || !documents.data) {
    console.error('Admin hub: could not load clients:', err);
    return NextResponse.json({ error: 'Couldn’t load clients.' }, { status: 500 });
  }

  // One batch of short-lived links for every stored file.
  const paths = [
    ...agreements.data.flatMap((a) => [a.signed_pdf_path, a.executed_pdf_path]),
    ...documents.data.map((d) => d.file_path),
  ].filter((p): p is string => !!p);
  const links = new Map<string, string>();
  if (paths.length) {
    const { data, error } = await db.storage.from(CLIENT_FILES_BUCKET).createSignedUrls(paths, LINK_TTL);
    if (error) console.error('Admin hub: could not sign file links:', error);
    for (const l of data ?? []) if (l.path && l.signedUrl) links.set(l.path, l.signedUrl);
  }

  const result: HubClient[] = clients.data.map((c) => {
    const answers = (c.onboarding ?? {}) as Record<string, string>;
    return {
      id: c.id,
      company: c.company,
      contact: c.contact_name,
      email: c.email,
      phone: c.phone,
      website: c.website,
      industry: c.industry,
      createdAt: c.created_at,
      goal: answers.goal90Day ?? '',
      agreements: agreements.data
        .filter((a) => a.client_id === c.id)
        .map((a) => ({
          id: a.id,
          number: a.agreement_number,
          version: a.version,
          textSha256: a.text_sha256,
          signerName: a.signer_name,
          signerEmail: a.client_email,
          signedAt: a.signed_at,
          signerIp: a.signer_ip,
          countersignerName: a.countersigner_name,
          countersignedAt: a.countersigned_at,
          files: ([
            a.executed_pdf_path && links.get(a.executed_pdf_path)
              ? { label: 'Fully executed agreement', fileName: `${a.agreement_number}-executed.pdf`, url: links.get(a.executed_pdf_path)!, note: 'Signed by both parties' }
              : null,
            a.signed_pdf_path && links.get(a.signed_pdf_path)
              ? { label: 'Client-signed agreement', fileName: `${a.agreement_number}-signed.pdf`, url: links.get(a.signed_pdf_path)!, note: 'As signed by the client' }
              : null,
          ] as (HubFile | null)[]).filter((f): f is HubFile => !!f),
        })),
      documents: documents.data
        .filter((d) => d.client_id === c.id)
        .map((d) => ({
          id: d.id,
          label: d.label,
          fileName: d.file_name,
          url: links.get(d.file_path) ?? '',
          uploadedBy: d.uploaded_by,
          createdAt: d.created_at,
        })),
      sections: ONBOARDING_SECTIONS.map(([title, fields]) => ({
        title,
        fields: fields
          .map(([key, label]): [string, string] => [label, String(answers[key] ?? '').trim()])
          .filter(([, v]) => v),
      })).filter((s) => s.fields.length),
    };
  });

  const sheetId = process.env.GOOGLE_SHEET_ID;
  return NextResponse.json({
    isOwner: who.isOwner,
    clients: result,
    legacySheetUrl: sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit` : null,
  });
}
