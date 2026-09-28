import type { Design, Product } from '@/lib/shop/products';

// Simple drawn mockups of each product (no product photos yet). Cards and stands
// show the selected pre-printed design.

const CARD_TEXT: Record<Design, string> = {
  googleReview: 'TAP TO REVIEW US',
  instagram: 'TAP TO FOLLOW US',
  menu: 'TAP FOR THE MENU',
  wifi: 'TAP FOR FREE WI-FI',
};

const STAND_TEXT: Record<Design, string> = {
  googleReview: 'LOVE IT HERE?',
  instagram: 'FOLLOW US',
  menu: 'SEE THE MENU',
  wifi: 'FREE WI-FI',
};

function Stars({ x, y, size = 9 }: { x: number; y: number; size?: number }) {
  const star = (cx: number) => {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 ? size * 0.42 : size;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      return `${cx + r * Math.cos(a)},${y + r * Math.sin(a)}`;
    }).join(' ');
    return <polygon key={cx} points={pts} fill="#FFFFFF" />;
  };
  return <g>{[0, 1, 2, 3, 4].map((i) => star(x + i * size * 2.4))}</g>;
}

function Waves({ x, y, s = 1, color = '#B9B9BE' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={2.2 * s} strokeLinecap="round">
      <path d={`M${x} ${y - 6 * s} a ${8 * s} ${8 * s} 0 0 1 0 ${12 * s}`} />
      <path d={`M${x + 6 * s} ${y - 12 * s} a ${15 * s} ${15 * s} 0 0 1 0 ${24 * s}`} />
      <path d={`M${x + 12 * s} ${y - 18 * s} a ${22 * s} ${22 * s} 0 0 1 0 ${36 * s}`} />
    </g>
  );
}

// Design icon centered on (cx, cy), roughly 2r across.
function DesignIcon({ design, cx, cy, r }: { design: Design; cx: number; cy: number; r: number }) {
  const w = r * 0.14;
  if (design === 'googleReview') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" />
        <text x={cx} y={cy + r * 0.42} textAnchor="middle" fontSize={r * 1.2} fontWeight={700} fill="#0E0E10" fontFamily="sans-serif">
          G
        </text>
      </g>
    );
  }
  if (design === 'instagram') {
    return (
      <g fill="none" stroke="#FFFFFF" strokeWidth={w}>
        <rect x={cx - r * 0.85} y={cy - r * 0.85} width={r * 1.7} height={r * 1.7} rx={r * 0.5} />
        <circle cx={cx} cy={cy} r={r * 0.42} />
        <circle cx={cx + r * 0.46} cy={cy - r * 0.46} r={w * 0.6} fill="#FFFFFF" stroke="none" />
      </g>
    );
  }
  if (design === 'menu') {
    return (
      <g stroke="#FFFFFF" strokeWidth={w} strokeLinecap="round" fill="none">
        {/* fork */}
        <path d={`M${cx - r * 0.45} ${cy - r * 0.85} V${cy + r * 0.85}`} />
        <path d={`M${cx - r * 0.75} ${cy - r * 0.85} V${cy - r * 0.3} Q${cx - r * 0.45} ${cy} ${cx - r * 0.15} ${cy - r * 0.3} V${cy - r * 0.85}`} />
        {/* knife */}
        <path d={`M${cx + r * 0.5} ${cy + r * 0.85} V${cy - r * 0.85} Q${cx + r * 0.95} ${cy - r * 0.5} ${cx + r * 0.5} ${cy + r * 0.05}`} />
      </g>
    );
  }
  return (
    <g stroke="#FFFFFF" strokeWidth={w} strokeLinecap="round" fill="none">
      <path d={`M${cx - r * 0.95} ${cy - r * 0.2} Q${cx} ${cy - r * 1.05} ${cx + r * 0.95} ${cy - r * 0.2}`} />
      <path d={`M${cx - r * 0.62} ${cy + r * 0.15} Q${cx} ${cy - r * 0.45} ${cx + r * 0.62} ${cy + r * 0.15}`} />
      <path d={`M${cx - r * 0.3} ${cy + r * 0.48} Q${cx} ${cy + r * 0.2} ${cx + r * 0.3} ${cy + r * 0.48}`} />
      <circle cx={cx} cy={cy + r * 0.8} r={w * 0.7} fill="#FFFFFF" stroke="none" />
    </g>
  );
}

function Qr({ x, y, size }: { x: number; y: number; size: number }) {
  const n = 9;
  const c = size / n;
  // Fixed pseudo-random pattern with the three corner finders.
  const bits = '101101001011010110010111001101011100101001110100101101011001011010010110101100110';
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx} y={fy} width={c * 3} height={c * 3} fill="#0E0E10" />
      <rect x={fx + c * 0.6} y={fy + c * 0.6} width={c * 1.8} height={c * 1.8} fill="#FFFFFF" />
      <rect x={fx + c} y={fy + c} width={c} height={c} fill="#0E0E10" />
    </g>
  );
  return (
    <g>
      <rect x={x - 4} y={y - 4} width={size + 8} height={size + 8} fill="#FFFFFF" />
      {Array.from({ length: n * n }, (_, i) => {
        const r = Math.floor(i / n);
        const col = i % n;
        const inFinder = (r < 3 && col < 3) || (r < 3 && col > 5) || (r > 5 && col < 3);
        return !inFinder && bits[i] === '1' ? (
          <rect key={i} x={x + col * c} y={y + r * c} width={c} height={c} fill="#0E0E10" />
        ) : null;
      })}
      {finder(x, y)}
      {finder(x + c * 6, y)}
      {finder(x, y + c * 6)}
    </g>
  );
}

function Card({ x, y, w = 190, rotate = 0, design }: { x: number; y: number; w?: number; rotate?: number; design: Design }) {
  const h = w * 0.63;
  const s = w / 190;
  return (
    <g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} rx={10 * s} fill="#1A1A1E" stroke="#5F5F64" strokeWidth={1.2} />
      <DesignIcon design={design} cx={x + 33 * s} cy={y + 33 * s} r={17 * s} />
      <text x={x + 14 * s} y={y + 80 * s} fontSize={13 * s} fill="#FFFFFF" fontFamily="var(--font-anton), sans-serif" letterSpacing={0.5}>
        {CARD_TEXT[design]}
      </text>
      {design === 'googleReview' && <Stars x={x + 20 * s} y={y + 98 * s} size={5.5 * s} />}
      <Waves x={x + 150 * s} y={y + 34 * s} s={s * 0.8} />
    </g>
  );
}

function Stand({ x, y, w = 130, design }: { x: number; y: number; w?: number; design: Design }) {
  const s = w / 130;
  const h = 170 * s;
  return (
    <g>
      <path d={`M${x - 10 * s} ${y + h} L${x + w + 10 * s} ${y + h} L${x + w} ${y + h - 16 * s} L${x} ${y + h - 16 * s} Z`} fill="#2D2D32" />
      <rect x={x} y={y} width={w} height={h - 16 * s} rx={8 * s} fill="#1A1A1E" stroke="#8C8C91" strokeWidth={1.2} />
      <rect x={x + 4 * s} y={y + 4 * s} width={w - 8 * s} height={10 * s} rx={4 * s} fill="#FFFFFF" opacity={0.06} />
      <text x={x + w / 2} y={y + 30 * s} textAnchor="middle" fontSize={12 * s} fill="#FFFFFF" fontFamily="var(--font-anton), sans-serif">
        {STAND_TEXT[design]}
      </text>
      {design === 'googleReview' ? (
        <Stars x={x + 24 * s} y={y + 44 * s} size={5 * s} />
      ) : (
        <DesignIcon design={design} cx={x + w / 2} cy={y + 44 * s} r={7 * s} />
      )}
      <Qr x={x + w / 2 - 26 * s} y={y + 60 * s} size={52 * s} />
      <Waves x={x + w / 2 - 6 * s} y={y + 130 * s} s={s * 0.4} />
      <text x={x + w / 2} y={y + 149 * s} textAnchor="middle" fontSize={7 * s} fill="#8C8C91" fontFamily="sans-serif" letterSpacing={1}>
        TAP OR SCAN
      </text>
    </g>
  );
}

function Sticker({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#F5F5F6" />
      <circle cx={cx} cy={cy} r={r - 5} fill="none" stroke="#0E0E10" strokeWidth={1} strokeDasharray="2 3" />
      <Waves x={cx - 10} y={cy - 4} s={r / 60} color="#0E0E10" />
      <text x={cx} y={cy + r * 0.55} textAnchor="middle" fontSize={r * 0.2} fill="#0E0E10" fontFamily="var(--font-anton), sans-serif">
        TAP HERE
      </text>
    </g>
  );
}

function Bracelet() {
  return (
    <g>
      {/* band seen at an angle: outer and inner ellipse */}
      <ellipse cx={160} cy={112} rx={98} ry={62} fill="#2D2D32" stroke="#5F5F64" strokeWidth={1.2} />
      <ellipse cx={160} cy={104} rx={80} ry={46} fill="#0E0E10" />
      <ellipse cx={160} cy={104} rx={80} ry={46} fill="none" stroke="#1A1A1E" strokeWidth={6} />
      {/* NFC chip badge on the front of the band */}
      <rect x={124} y={140} width={72} height={28} rx={14} fill="#1A1A1E" stroke="#8C8C91" strokeWidth={1} />
      <Waves x={140} y={154} s={0.4} />
      <text x={178} y={158} textAnchor="middle" fontSize={10} fill="#FFFFFF" fontFamily="var(--font-anton), sans-serif">
        N°1
      </text>
    </g>
  );
}

export default function ProductArt({ art, design = 'googleReview' }: { art: Product['art']; design?: Design }) {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" role="img" aria-hidden="true">
      <rect width="320" height="220" fill="#0E0E10" />
      <circle cx="160" cy="110" r="120" fill="#1A1A1E" opacity={0.5} />
      {art === 'card' && (
        <>
          <Card x={78} y={48} rotate={-8} design={design} />
          <Card x={64} y={62} rotate={4} design={design} />
        </>
      )}
      {art === 'stand' && <Stand x={95} y={22} design={design} />}
      {art === 'bracelet' && <Bracelet />}
      {art === 'stickers' && (
        <>
          <Sticker cx={110} cy={90} r={52} />
          <Sticker cx={205} cy={78} r={40} />
          <Sticker cx={200} cy={158} r={34} />
          <Sticker cx={124} cy={170} r={28} />
        </>
      )}
      {art === 'bundle' && (
        <>
          <Stand x={40} y={40} w={100} design={design} />
          <Card x={150} y={62} w={140} rotate={-6} design={design} />
          <Card x={140} y={96} w={140} rotate={3} design={design} />
          <Sticker cx={262} cy={46} r={26} />
        </>
      )}
    </svg>
  );
}
