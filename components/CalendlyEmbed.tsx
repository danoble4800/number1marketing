'use client';

interface CalendlyEmbedProps {
  url?: string;
  height?: number;
}

export default function CalendlyEmbed({
  url,
  height = 700,
}: CalendlyEmbedProps) {
  const calendlyUrl =
    url ||
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    'https://calendly.com/example/strategy-call';

  return (
    <div className="w-full overflow-hidden bg-brand-dark1 border border-brand-dark2">
      <iframe
        src={`${calendlyUrl}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=1A1A1E&text_color=F5F5F6&primary_color=FFFFFF`}
        width="100%"
        height={height}
        frameBorder="0"
        title="Schedule a strategy call"
        className="block"
      />
    </div>
  );
}
