import { jsPDF } from 'jspdf';
import { AGREEMENTS, PROVIDER_NAME } from '@/lib/agreements';

// Server-side PDF of a signed Service Agreement: the full contract text exactly as the
// client read it, both signature blocks, and a closing audit-trail page with the
// signing evidence and the SHA-256 fingerprint of the text. Built once when the client
// signs, and again (as a new file) once the agreement is countersigned.

export type AgreementRecord = {
  agreement_number: string;
  version: string;
  text_sha256: string;
  effective_date: string;
  client_company: string;
  client_address: string;
  client_contact: string;
  client_email: string;
  signer_name: string;
  signed_at: string;
  signer_ip: string;
  signer_user_agent: string;
  countersigner_name?: string | null;
  countersigner_email?: string | null;
  countersigned_at?: string | null;
  countersigner_ip?: string | null;
};

const M = 54; // page margin
const utc = (iso: string) => new Date(iso).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');

export function buildAgreementPdf(r: AgreementRecord): Buffer {
  const a = AGREEMENTS[r.version];
  if (!a) throw new Error(`Unknown agreement version ${r.version}`);

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const textW = W - M * 2;
  let y = M;

  const ensure = (h: number) => {
    if (y + h > H - M - 20) {
      doc.addPage();
      y = M;
    }
  };
  const para = (text: string, opts: { size?: number; bold?: boolean; gap?: number; color?: number } = {}) => {
    const size = opts.size ?? 10;
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(opts.color ?? 20);
    const lh = size * 1.4;
    for (const line of doc.splitTextToSize(text, textW) as string[]) {
      ensure(lh);
      doc.text(line, M, y + size);
      y += lh;
    }
    y += opts.gap ?? 8;
  };
  const rule = () => {
    ensure(16);
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(M, y + 4, W - M, y + 4);
    y += 16;
  };
  const rows = (pairs: [string, string][]) => {
    for (const [label, value] of pairs) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value || '—', textW - 150) as string[];
      ensure(lines.length * 13 + 2);
      doc.setTextColor(110);
      doc.text(label, M, y + 9);
      doc.setTextColor(20);
      lines.forEach((l, i) => doc.text(l, M + 150, y + 9 + i * 13));
      y += lines.length * 13 + 3;
    }
    y += 6;
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(10);
  doc.text('SERVICE AGREEMENT', M, y + 18);
  y += 30;
  para(`${PROVIDER_NAME} · number1digitalmarketing.com · hello@number1digitalmarketing.com`, { size: 9, color: 110, gap: 4 });
  para(`Agreement ${r.agreement_number} · Version ${r.version}`, { size: 9, color: 110, gap: 4 });
  rule();

  // Parties
  para('PARTIES', { size: 9, bold: true, gap: 4 });
  rows([
    ['Service Provider', PROVIDER_NAME],
    ['Client', r.client_company],
    ['Client address', r.client_address],
    ['Client contact', r.client_contact],
    ['Client email', r.client_email],
    ['Effective Date', r.effective_date],
  ]);
  rule();

  // Contract text, verbatim
  para(a.title, { size: 12, bold: true });
  para('THE AGREEMENT', { size: 10, bold: true, gap: 4 });
  para(a.intro);
  for (const s of a.sections) {
    ensure(60); // keep each heading with the start of its section
    para(s.heading, { bold: true, gap: 2 });
    para(s.body);
  }
  rule();

  // Signatures
  ensure(200);
  para('SIGNATURES', { size: 9, bold: true, gap: 6 });
  const sigBlock = (title: string, lines: [string, string][], sig: string | null) => {
    ensure(110);
    para(title, { bold: true, gap: 4 });
    doc.setFont('times', 'italic');
    doc.setFontSize(20);
    doc.setTextColor(sig ? 10 : 150);
    doc.text(sig ?? 'Awaiting countersignature', M, y + 20);
    y += 28;
    doc.setDrawColor(120);
    doc.line(M, y, M + 260, y);
    y += 8;
    rows(lines);
  };
  sigBlock(
    'Client',
    [
      ['Name', r.signer_name],
      ['For', r.client_company],
      ['Signed', utc(r.signed_at)],
    ],
    r.signer_name,
  );
  sigBlock(
    `Service Provider — ${PROVIDER_NAME}`,
    r.countersigned_at
      ? [
          ['Name', r.countersigner_name ?? ''],
          ['Signed', utc(r.countersigned_at)],
        ]
      : [['Status', 'Not yet countersigned']],
    r.countersigned_at ? r.countersigner_name ?? '' : null,
  );

  // Audit trail
  doc.addPage();
  y = M;
  para('ELECTRONIC SIGNATURE CERTIFICATE', { size: 14, bold: true, gap: 4 });
  para(
    'This page records how and when this agreement was signed. The fingerprint below is a SHA-256 hash of the exact ' +
      'agreement text presented to the Client; any change to that text, however small, produces a different fingerprint.',
    { size: 9, color: 90 },
  );
  rule();
  para('DOCUMENT', { size: 9, bold: true, gap: 4 });
  rows([
    ['Agreement number', r.agreement_number],
    ['Agreement version', r.version],
    ['Text fingerprint (SHA-256)', r.text_sha256],
  ]);
  para('CLIENT SIGNATURE', { size: 9, bold: true, gap: 4 });
  rows([
    ['Signed by', r.signer_name],
    ['On behalf of', r.client_company],
    ['Email', r.client_email],
    ['Signed at', utc(r.signed_at)],
    ['IP address', r.signer_ip],
    ['Browser', r.signer_user_agent],
    ['Method', 'Typed full legal name and ticked the acceptance checkbox on the Number 1 Digital Marketing onboarding portal'],
    ['Acceptance statement', a.acceptance],
    ['Signature notice shown', a.signatureNotice],
  ]);
  para('SERVICE PROVIDER COUNTERSIGNATURE', { size: 9, bold: true, gap: 4 });
  rows(
    r.countersigned_at
      ? [
          ['Signed by', r.countersigner_name ?? ''],
          ['Email', r.countersigner_email ?? ''],
          ['Signed at', utc(r.countersigned_at)],
          ['IP address', r.countersigner_ip ?? ''],
          ['Method', 'Typed full legal name in the Number 1 Digital Marketing admin portal'],
        ]
      : [['Status', 'Not yet countersigned']],
  );

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140);
    doc.text(`Agreement ${r.agreement_number} · ${r.version} · SHA-256 ${r.text_sha256.slice(0, 16)}…`, M, H - 30);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 30, { align: 'right' });
  }

  return Buffer.from(doc.output('arraybuffer'));
}
