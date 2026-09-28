// Builds the N°1 Academy certificate as a landscape Letter PDF in the browser.
// jsPDF is loaded on demand so it only downloads when someone clicks the button.

export type CertificateText = {
  academy: string;       // "N°1 ACADEMY"
  title: string;         // "CERTIFICATE OF COMPLETION"
  certifies: string;     // "This certifies that"
  completed: string;     // "has completed all six modules and passed the final assessment of the"
  courseName: string;    // "AI Marketing Certification"
  issuer: string;        // "Number 1 Digital Marketing"
  dateLabel: string;     // "Date issued"
  idLabel: string;       // "Certificate ID"
  verifyLabel: string;   // "Verify at"
};

export async function downloadCertificatePdf(opts: {
  name: string;
  code: string;
  issuedAt: string;
  verifyUrl: string;
  locale: string;
  text: CertificateText;
}) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const cx = W / 2;
  const { text } = opts;

  // Centered text with optional letter spacing (jsPDF's align ignores charSpace).
  const centered = (value: string, y: number, charSpace = 0) => {
    const width = doc.getTextWidth(value) + charSpace * Math.max(value.length - 1, 0);
    doc.text(value, cx - width / 2, y, { charSpace });
  };

  // Frame
  doc.setDrawColor(10, 10, 10);
  doc.setLineWidth(2);
  doc.rect(24, 24, W - 48, H - 48);
  doc.setLineWidth(0.5);
  doc.rect(34, 34, W - 68, H - 68);

  doc.setTextColor(10, 10, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  centered(text.academy.toUpperCase(), 92, 4);

  doc.setFontSize(34);
  centered(text.title.toUpperCase(), 150, 1.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  centered(text.certifies, 200);

  // Shrink long names so they always fit inside the frame.
  doc.setFont('times', 'bolditalic');
  doc.setTextColor(10, 10, 10);
  let nameSize = 40;
  doc.setFontSize(nameSize);
  while (doc.getTextWidth(opts.name) > W - 200 && nameSize > 20) {
    nameSize -= 2;
    doc.setFontSize(nameSize);
  }
  centered(opts.name, 258);
  doc.setLineWidth(0.75);
  doc.line(cx - 220, 276, cx + 220, 276);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  const lines = doc.splitTextToSize(text.completed, W - 260) as string[];
  lines.forEach((line, i) => centered(line, 314 + i * 18));

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(10, 10, 10);
  centered(text.courseName.toUpperCase(), 314 + lines.length * 18 + 28, 1);

  // Footer: date · issuer · id
  const footerY = H - 110;
  const issued = new Date(opts.issuedAt).toLocaleDateString(opts.locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const column = (label: string, value: string, x: number) => {
    doc.setDrawColor(10, 10, 10);
    doc.setLineWidth(0.5);
    doc.line(x - 90, footerY - 18, x + 90, footerY - 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(10, 10, 10);
    doc.text(value, x, footerY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(label.toUpperCase(), x, footerY + 15, { align: 'center' });
  };
  column(text.dateLabel, issued, 170);
  column(text.issuer, 'N°1', cx);
  column(text.idLabel, opts.code, W - 170);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  centered(`${text.verifyLabel} ${opts.verifyUrl}`, H - 52);

  doc.save(`N1-Academy-Certificate-${opts.code}.pdf`);
}
