import type { Product } from '@/lib/shop/products';

// Simple drawn mockups of each product (no product photos yet).

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

function Card({ x, y, w = 190, rotate = 0 }: { x: number; y: number; w?: number; rotate?: number }) {
  const h = w * 0.63;
  const s = w / 190;
  return (
    <g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} rx={10 * s} fill="#1A1A1E" stroke="#5F5F64" strokeWidth={1.2} />
      <rect x={x + 14 * s} y={y + 14 * s} width={38 * s} height={38 * s} rx={19 * s} fill="#2D2D32" />
      <text x={x + 33 * s} y={y + 37 * s} textAnchor="middle" fontSize={9 * s} fill="#8C8C91" fontFamily="sans-serif" fontWeight={700}>
        LOGO
      </text>
      <text x={x + 14 * s} y={y + 76 * s} fontSize={13 * s} fill="#FFFFFF" fontFamily="var(--font-anton), sans-serif" letterSpacing={0.5}>
        TAP TO REVIEW US
      </text>
      <Stars x={x + 20 * s} y={y + 96 * s} size={5.5 * s} />
      <Waves x={x + 150 * s} y={y + 34 * s} s={s * 0.8} />
    </g>
  );
}

function Stand({ x, y, w = 130 }: { x: number; y: number; w?: number }) {
  const s = w / 130;
  const h = 170 * s;
  return (
    <g>
      <path d={`M${x - 10 * s} ${y + h} L${x + w + 10 * s} ${y + h} L${x + w} ${y + h - 16 * s} L${x} ${y + h - 16 * s} Z`} fill="#2D2D32" />
      <rect x={x} y={y} width={w} height={h - 16 * s} rx={8 * s} fill="#1A1A1E" stroke="#8C8C91" strokeWidth={1.2} />
      <rect x={x + 4 * s} y={y + 4 * s} width={w - 8 * s} height={10 * s} rx={4 * s} fill="#FFFFFF" opacity={0.06} />
      <text x={x + w / 2} y={y + 30 * s} textAnchor="middle" fontSize={12 * s} fill="#FFFFFF" fontFamily="var(--font-anton), sans-serif">
        LOVE IT HERE?
      </text>
      <Stars x={x + 24 * s} y={y + 44 * s} size={5 * s} />
      <Qr x={x + w / 2 - 26 * s} y={y + 58 * s} size={52 * s} />
      <Waves x={x + w / 2 - 6 * s} y={y + 128 * s} s={s * 0.4} />
      <text x={x + w / 2} y={y + 148 * s} textAnchor="middle" fontSize={7 * s} fill="#8C8C91" fontFamily="sans-serif" letterSpacing={1}>
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

export default function ProductArt({ art }: { art: Product['art'] }) {
  return (
    <svg viewBox="0 0 320 220" className="w-full h-auto" role="img" aria-hidden="true">
      <rect width="320" height="220" fill="#0E0E10" />
      <circle cx="160" cy="110" r="120" fill="#1A1A1E" opacity={0.5} />
      {art === 'card' && (
        <>
          <Card x={78} y={48} rotate={-8} />
          <Card x={64} y={62} rotate={4} />
        </>
      )}
      {art === 'stand' && <Stand x={95} y={22} />}
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
          <Stand x={40} y={40} w={100} />
          <Card x={150} y={62} w={140} rotate={-6} />
          <Card x={140} y={96} w={140} rotate={3} />
          <Sticker cx={262} cy={46} r={26} />
        </>
      )}
    </svg>
  );
}
