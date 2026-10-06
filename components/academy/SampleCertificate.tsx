import type { CertificateText } from '@/lib/certificatePdf';

// A web copy of the certificate that lib/certificatePdf.ts draws, with a sample name and a
// SAMPLE mark. It stays paper-white with dark ink in both site themes, like the printed PDF.
// Sizes are in container-width units so it scales as one picture.

const INK = '#0A0A0A';
const GREY = '#5A5A5A';

export default function SampleCertificate({
  text,
  name,
  watermark,
  date,
}: {
  text: CertificateText;
  name: string;
  watermark: string;
  date: string;
}) {
  const footer = [
    { label: text.dateLabel, value: date },
    { label: text.issuer, value: 'N°1' },
    { label: text.idLabel, value: 'N1-0000-0000' },
  ];
  return (
    <div
      className="relative w-full overflow-hidden shadow-2xl select-none"
      style={{ aspectRatio: '11 / 8.5', background: '#FFFFFF', color: INK, containerType: 'inline-size' }}
      role="img"
      aria-label={`${text.title} — ${watermark}`}
    >
      <div className="absolute" style={{ inset: '3%', border: `0.3cqw solid ${INK}` }} />
      <div className="absolute" style={{ inset: '4.3%', border: `0.08cqw solid ${INK}` }} />

      <div className="absolute inset-0 flex flex-col items-center text-center" style={{ padding: '10.5cqw 9cqw 0' }}>
        <p className="font-bold uppercase" style={{ fontSize: '1.25cqw', letterSpacing: '0.45cqw' }}>
          {text.academy}
        </p>
        <p className="font-bold uppercase" style={{ fontSize: '3.9cqw', letterSpacing: '0.17cqw', marginTop: '3.4cqw', lineHeight: 1.1 }}>
          {text.title}
        </p>
        <p style={{ fontSize: '1.5cqw', color: GREY, marginTop: '3.6cqw' }}>{text.certifies}</p>
        <p
          className="italic font-bold"
          style={{ fontFamily: 'Times New Roman, Times, serif', fontSize: '4.5cqw', marginTop: '2.4cqw', lineHeight: 1.1 }}
        >
          {name}
        </p>
        <div style={{ width: '50%', borderTop: `0.09cqw solid ${INK}`, marginTop: '1.2cqw' }} />
        <p style={{ fontSize: '1.5cqw', color: GREY, marginTop: '3cqw', maxWidth: '75%', lineHeight: 1.4 }}>{text.completed}</p>
        <p className="font-bold uppercase" style={{ fontSize: '2.3cqw', letterSpacing: '0.11cqw', marginTop: '2.2cqw' }}>
          {text.courseName}
        </p>
      </div>

      <div className="absolute left-0 right-0 flex justify-between" style={{ bottom: '13%', padding: '0 9.3cqw' }}>
        {footer.map(({ label, value }) => (
          <div key={label} className="text-center" style={{ width: '20.5cqw' }}>
            <div style={{ borderTop: `0.06cqw solid ${INK}`, marginBottom: '1.2cqw' }} />
            <p className="font-bold" style={{ fontSize: '1.35cqw' }}>{value}</p>
            <p className="uppercase" style={{ fontSize: '1cqw', color: '#6E6E6E', marginTop: '0.5cqw' }}>{label}</p>
          </div>
        ))}
      </div>

      <p
        aria-hidden
        className="absolute inset-0 flex items-center justify-center font-bold uppercase pointer-events-none"
        style={{ fontSize: '13cqw', letterSpacing: '1.5cqw', color: 'rgba(10,10,10,0.06)', transform: 'rotate(-18deg)' }}
      >
        {watermark}
      </p>
    </div>
  );
}
