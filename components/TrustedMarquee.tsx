'use client';

const BRANDS = [
  'TechFlow', 'NovaCRM', 'ScaleAI', 'GrowthOS',
  'PulseHQ', 'LoopBase', 'VaultAI', 'DriftCo',
];

// Duplicate so the second set picks up exactly where the first ends — seamless loop
const ITEMS = [...BRANDS, ...BRANDS];

export default function TrustedMarquee() {
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          animation: 'marquee 30s linear infinite',
          willChange: 'transform',
        }}
      >
        {ITEMS.map((brand, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-display text-2xl text-brand-light1 tracking-widest uppercase px-10">
              {brand}
            </span>
            <span className="text-brand-dark2 text-base select-none">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
