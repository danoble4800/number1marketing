'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Nfc, Power } from 'lucide-react';
import type { CardPage, CardRow } from '@/lib/cards/types';
import { DEMO_CARDS } from '@/lib/cards/demo';
import { getSupabase } from '@/lib/supabase';
import { Section, inputCls } from './ui';

type Props = { page: CardPage; demo: boolean };

export default function CardsTab({ page, demo }: Props) {
  const [cards, setCards] = useState<CardRow[] | null>(null);
  const [qr, setQr] = useState('');
  const [newId, setNewId] = useState('');
  const [msg, setMsg] = useState('');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pageUrl = `${origin}/c/${page.slug}`;

  useEffect(() => {
    if (demo) { setCards(DEMO_CARDS); return; }
    getSupabase()
      .from('cards')
      .select('*')
      .eq('page_id', page.id)
      .order('claimed_at')
      .then(({ data }) => setCards((data as CardRow[]) ?? []));
  }, [page.id, demo]);

  useEffect(() => {
    QRCode.toDataURL(`${pageUrl}?src=qr`, { width: 720, margin: 2 }).then(setQr);
  }, [pageUrl]);

  async function toggle(card: CardRow) {
    const status = card.status === 'active' ? 'disabled' : 'active';
    if (status === 'disabled' && !confirm(`Switch off card ${card.id}? Taps will show “card switched off” until you turn it back on.`)) return;
    if (!demo) {
      const { error } = await getSupabase().rpc('set_card_status', { p_card: card.id, p_status: status });
      if (error) return;
    }
    setCards((cs) => cs?.map((c) => (c.id === card.id ? { ...c, status } : c)) ?? null);
  }

  async function link(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    const id = newId.trim().toUpperCase().replace(/^.*\/T\//, '').replace(/[^A-Z0-9]/g, '');
    if (!id) return;
    if (demo) { setMsg('Demo: card would be linked.'); return; }
    const { data, error } = await getSupabase().rpc('claim_card', { p_card: id, p_page: page.id });
    if (error || !(data as { ok: boolean })?.ok) {
      setMsg('That card couldn’t be linked. Check the code, or it may belong to someone else.');
      return;
    }
    setNewId('');
    setMsg(`Card ${id} now opens this page.`);
    const { data: rows } = await getSupabase().from('cards').select('*').eq('page_id', page.id);
    setCards((rows as CardRow[]) ?? []);
  }

  return (
    <div className="space-y-5">
      <Section title="Your cards" hint="Every card linked to this page. Lost one? Switch it off.">
        {!cards ? (
          <p className="text-sm text-brand-light1">Loading…</p>
        ) : cards.length === 0 ? (
          <p className="text-sm text-brand-mid">No cards linked yet. Tap a new card with your phone to claim it, or enter its code below.</p>
        ) : (
          <ul className="divide-y divide-brand-dark2">
            {cards.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <Nfc size={18} className={c.status === 'active' ? 'text-brand-white' : 'text-brand-mid'} />
                  <div>
                    <p className="font-mono text-sm text-brand-white">{c.id}</p>
                    <p className="text-xs text-brand-light1">
                      {c.status === 'active' ? 'Active' : 'Switched off'}
                      {c.label && ` · ${c.label}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(c)}
                  className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs uppercase tracking-wider ${c.status === 'active' ? 'border-brand-dark2 text-brand-light1 hover:border-red-400 hover:text-red-400' : 'border-brand-white text-brand-white'}`}
                >
                  <Power size={13} /> {c.status === 'active' ? 'Switch off' : 'Turn on'}
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={link} className="mt-5 flex gap-2">
          <input className={inputCls} placeholder="Card code, e.g. K7M2QX9" value={newId} onChange={(e) => setNewId(e.target.value)} />
          <button type="submit" className="shrink-0 bg-brand-white px-4 text-xs font-semibold uppercase tracking-widest text-brand-black">Link card</button>
        </form>
        {msg && <p className="mt-2 text-sm text-brand-light2">{msg}</p>}
      </Section>

      <Section title="QR code" hint="For flyers, counter signs, table tents and the back of your card. Opens the same page.">
        <div className="flex flex-wrap items-center gap-5">
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR code for your page" className="h-40 w-40 bg-white" />
          )}
          <div className="space-y-3">
            <p className="break-all font-mono text-xs text-brand-light1">{pageUrl}</p>
            <a
              href={qr}
              download={`${page.slug}-qr.png`}
              className="inline-flex items-center gap-2 bg-brand-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-black"
            >
              <Download size={14} /> Download PNG
            </a>
          </div>
        </div>
      </Section>

      <Section title="Need more cards?" hint="Metal cards, review stands for your counter, stickers for tables.">
        <a
          href="mailto:hello@number1digitalmarketing.com?subject=Tap%20card%20order"
          className="inline-block border border-brand-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-white hover:bg-brand-white hover:text-brand-black"
        >
          Order more
        </a>
      </Section>
    </div>
  );
}
