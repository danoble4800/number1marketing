'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

type Pt = { x: number; y: number };

// A frame shape the cropper offers. 'original' follows the picture's own proportions (clamped to `range`).
export type CropShape = { label: string; aspect: number | 'original' };
export type CropSpec = {
  shapes: CropShape[];
  out: number; // pixels along the longer side of the finished image
  round?: boolean;
  range?: [number, number]; // min/max width÷height for 'original'
};

const PAD = 28; // Room around the frame so you can see what's being cut off.
const MAX_ZOOM = 5;

// Drag to move, pinch / scroll / slider to zoom, then bake the crop into a new image.
// Zoom 1 = the photo just covers the frame; below 1 (down to fully fitting) is allowed so a wide logo can sit inside a circle.
export default function ImageCropper({
  src, spec, type, onCancel, onDone,
}: {
  src: string;
  spec: CropSpec;
  type: 'image/jpeg' | 'image/png';
  onCancel: () => void;
  onDone: (blob: Blob) => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [shape, setShape] = useState(0);
  const [box, setBox] = useState({ w: 360, h: 600 });
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState<Pt>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Pt>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  useEffect(() => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => setImg(el);
    el.onerror = () => setFailed(true);
    el.src = src;
  }, [src]);

  useEffect(() => {
    // Leave room for the dialog's padding, heading, slider and buttons.
    const size = () => setBox({ w: window.innerWidth - 32 - 40 - PAD * 2, h: window.innerHeight - 320 });
    size();
    window.addEventListener('resize', size);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('resize', size); window.removeEventListener('keydown', esc); };
  }, [onCancel]);

  const nw = img?.naturalWidth || 512;
  const nh = img?.naturalHeight || 512;
  const want = spec.shapes[shape].aspect;
  const [lo, hi] = spec.range ?? [0.2, 5];
  const aspect = want === 'original' ? Math.max(lo, Math.min(hi, nw / nh)) : want;
  const fw = Math.max(120, Math.min(aspect >= 2 ? 380 : 300, box.w, box.h * aspect));
  const fh = fw / aspect;
  const cover = Math.max(fw / nw, fh / nh);
  const minZoom = Math.min(fw / nw, fh / nh) / cover;
  const dw = nw * cover * zoom;
  const dh = nh * cover * zoom;

  // Keep the photo covering the frame (or, when zoomed out past it, inside the frame).
  const clamp = (p: Pt, z = zoom): Pt => {
    const mx = Math.abs(nw * cover * z - fw) / 2;
    const my = Math.abs(nh * cover * z - fh) / 2;
    return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
  };
  const zoomTo = (z: number) => {
    const nz = Math.max(minZoom, Math.min(MAX_ZOOM, z));
    // Zoom around the frame center: scale the offset with the photo.
    setOff((o) => clamp({ x: (o.x * nz) / zoom, y: (o.y * nz) / zoom }, nz));
    setZoom(nz);
  };
  const reset = () => { setZoom(1); setOff({ x: 0, y: 0 }); };

  function down(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  }
  function move(e: React.PointerEvent) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values());
      zoomTo((pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist);
    } else if (pointers.current.size === 1) {
      setOff((o) => clamp({ x: o.x + e.clientX - prev.x, y: o.y + e.clientY - prev.y }));
    }
  }
  function up(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  }

  // Scroll-to-zoom needs a non-passive listener to stop the page scrolling behind.
  const stage = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoomTo);
  zoomRef.current = zoomTo;
  const zoomNow = useRef(zoom);
  zoomNow.current = zoom;
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => { e.preventDefault(); zoomRef.current(zoomNow.current * Math.exp(-e.deltaY / 400)); };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [img]);

  function save() {
    if (!img) return;
    const outW = Math.round(aspect >= 1 ? spec.out : spec.out * aspect);
    const k = outW / fw;
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = Math.round(outW / aspect);
    const ctx = canvas.getContext('2d')!;
    if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, (fw / 2 + off.x - dw / 2) * k, (fh / 2 + off.y - dh / 2) * k, dw * k, dh * k);
    try {
      canvas.toBlob((b) => (b ? onDone(b) : setFailed(true)), type, 0.9);
    } catch {
      setFailed(true); // The browser refused to read the image back (cross-site without permission).
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div
        role="dialog"
        aria-label="Adjust image"
        className="w-full max-w-fit rounded-2xl border border-ed-line bg-ed-surface p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold text-ed-ink">Adjust image</p>
            <p className="text-[13px] text-ed-muted">Drag to move. Pinch, scroll or use the slider to zoom.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="text-ed-muted hover:text-ed-ink"><X size={18} /></button>
        </div>

        {spec.shapes.length > 1 && (
          <div className="mb-3 flex justify-center gap-2">
            {spec.shapes.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => { setShape(i); reset(); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${i === shape ? 'border-ed-ink bg-ed-ink text-ed-field' : 'border-ed-line text-ed-soft hover:border-ed-faint'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div
          ref={stage}
          className="relative mx-auto touch-none select-none overflow-hidden rounded-xl bg-ed-field"
          style={{ width: fw + PAD * 2, height: fh + PAD * 2, cursor: img ? 'grab' : undefined }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none"
              style={{ left: PAD + fw / 2 + off.x - dw / 2, top: PAD + fh / 2 + off.y - dh / 2, width: dw, height: dh }}
            />
          )}
          {(!img || failed) && (
            <p className="absolute inset-0 flex items-center justify-center bg-ed-field/90 px-6 text-center text-xs text-ed-muted">
              {failed ? 'Couldn’t edit this image. Try Replace and upload it again.' : 'Loading…'}
            </p>
          )}
          {/* The crop frame; everything outside it is dimmed. */}
          <div
            className={`pointer-events-none absolute border-2 border-white/90 ${spec.round ? 'rounded-full' : 'rounded-md'}`}
            style={{ left: PAD, top: PAD, width: fw, height: fh, boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.55)' }}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={() => zoomTo(zoom / 1.2)} aria-label="Zoom out" className="text-ed-muted hover:text-ed-ink"><Minus size={16} /></button>
          <input
            type="range"
            aria-label="Zoom"
            min={minZoom}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => zoomTo(Number(e.target.value))}
            className="flex-1 accent-current text-ed-ink"
          />
          <button type="button" onClick={() => zoomTo(zoom * 1.2)} aria-label="Zoom in" className="text-ed-muted hover:text-ed-ink"><Plus size={16} /></button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button type="button" onClick={reset} className="mr-auto text-xs text-ed-muted underline hover:text-ed-ink">Reset</button>
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2.5 text-sm font-semibold text-ed-soft hover:text-ed-ink">Cancel</button>
          <button type="button" onClick={save} disabled={!img || failed} className="rounded-full bg-ed-ink px-5 py-2.5 text-sm font-semibold text-ed-field disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Upload with crop ----------

// Each upload keeps its untouched original next to the cropped copy, so Adjust can zoom back out later:
//   avatar-<ts>-src  (original)  ·  avatar-<ts>-c<ts>.jpg  (what the page shows)
const originalOf = (url: string) => url.replace(/-c\d+\.(jpg|png)$/, '-src');

// Pick → crop → upload, plus Adjust for an image that's already saved. Render `modal` somewhere in the input.
export function useCropUpload({
  name, spec, maxMB, value, onChange, demo, userId, pageId,
}: {
  name: string; // file prefix in storage, e.g. 'avatar'
  spec: CropSpec;
  maxMB: number;
  value?: string | null;
  onChange: (url: string) => void;
  demo: boolean;
  userId: string | null;
  pageId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // What's open in the cropper: a freshly picked file, or a saved image being re-adjusted.
  // `base` is the storage path the original lives under, when there is one.
  const [crop, setCrop] = useState<{ src: string; png: boolean; file?: File; base?: string } | null>(null);
  // Demo mode has nowhere to store originals, so remember the last one here.
  const local = useRef<{ value: string; src: string; png: boolean } | null>(null);

  function pick(file: File) {
    setErr('');
    if (file.size > maxMB * 1024 * 1024) { setErr(`Max ${maxMB} MB`); return; }
    // PNG/GIF/WebP/SVG may be see-through (logos), so keep transparency; photos go to JPEG.
    setCrop({ src: URL.createObjectURL(file), file, png: !/jpe?g|heic|heif/.test(file.type) });
  }

  function adjust() {
    if (!value) return;
    setErr('');
    if (local.current?.value === value) { setCrop({ src: local.current.src, png: local.current.png }); return; }
    const png = value.endsWith('.png');
    const src = originalOf(value);
    const path = src.split('/card-media/')[1];
    // Uploads from before cropping existed have no original; crop the image itself.
    if (src === value || !path) { setCrop({ src: value, png }); return; }
    const probe = new Image();
    probe.onload = () => setCrop({ src, png, base: path.replace(/-src$/, '') });
    probe.onerror = () => setCrop({ src: value, png });
    probe.src = src;
  }

  async function done(blob: Blob) {
    const c = crop!;
    setCrop(null);
    if (demo || !userId) {
      const url = URL.createObjectURL(blob);
      local.current = { value: url, src: c.src, png: c.png };
      onChange(url);
      return;
    }
    setBusy(true);
    const bucket = getSupabase().storage.from('card-media');
    const base = c.base ?? `${userId}/${pageId}/${name}-${Date.now()}`;
    if (c.file) {
      const { error } = await bucket.upload(`${base}-src`, c.file, { contentType: c.file.type, upsert: true });
      if (error) { setBusy(false); setErr('Upload failed. Please try again.'); return; }
    }
    // A fresh name each time so the new crop isn't served from cache.
    const path = `${base}-c${Date.now()}.${c.png ? 'png' : 'jpg'}`;
    const { error } = await bucket.upload(path, blob, { contentType: blob.type, upsert: true });
    setBusy(false);
    if (error) { setErr('Upload failed. Please try again.'); return; }
    onChange(bucket.getPublicUrl(path).data.publicUrl);
  }

  const cancel = useCallback(() => setCrop(null), []);
  const modal = crop && (
    <ImageCropper key={crop.src} src={crop.src} spec={spec} type={crop.png ? 'image/png' : 'image/jpeg'} onCancel={cancel} onDone={done} />
  );

  return { pick, adjust, busy, err, modal };
}
