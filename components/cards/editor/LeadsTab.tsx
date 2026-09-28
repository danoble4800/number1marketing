'use client';

import { useEffect, useState } from 'react';
import { Download, Mail, Phone, Star, Trash2 } from 'lucide-react';
import type { CardLead, CardPage } from '@/lib/cards/types';
import { can } from '@/lib/cards/plans';
import { DEMO_LEADS } from '@/lib/cards/demo';
import { getSupabase } from '@/lib/supabase';
import { Section } from './ui';

type Props = { page: CardPage; demo: boolean; onUpgrade: () => void };

export default function LeadsTab({ page, demo, onUpgrade }: Props) {
  const [leads, setLeads] = useState<CardLead[] | null>(null);

  useEffect(() => {
    if (demo) { setLeads(DEMO_LEADS); return; }
    getSupabase()
      .from('card_leads')
      .select('*')
      .eq('page_id', page.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setLeads((data as CardLead[]) ?? []));
  }, [page.id, demo]);

  async function remove(id: number) {
    if (!confirm('Delete this contact?')) return;
    if (!demo) await getSupabase().from('card_leads').delete().eq('id', id);
    setLeads((l) => l?.filter((x) => x.id !== id) ?? null);
  }

  function exportCsv() {
    if (!leads) return;
    const q = (s: string | number | null) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Date', 'Type', 'Name', 'Email', 'Phone', 'Message', 'Rating'],
      ...leads.map((l) => [new Date(l.created_at).toLocaleString(), l.kind, l.name, l.email, l.phone, l.note, l.rating ?? '']),
    ];
    const blob = new Blob([rows.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${page.slug}-contacts.csv`;
    a.click();
  }

  const locked = !can(page.plan, 'leadCapture');

  return (
    <Section
      title="Contacts"
      hint="People who shared their info from your page, plus private feedback from the review step."
      locked={locked ? 'pro' : null}
      onUpgrade={onUpgrade}
      right={
        !locked && leads && leads.length > 0 && (
          <button type="button" onClick={exportCsv} className="flex items-center gap-1.5 border border-brand-mid px-3 py-1.5 text-xs uppercase tracking-wider text-brand-offwhite hover:border-brand-white">
            <Download size={13} /> CSV
          </button>
        )
      }
    >
      {!leads ? (
        <p className="text-sm text-brand-light1">Loading…</p>
      ) : (locked ? DEMO_LEADS : leads).length === 0 ? (
        <p className="text-sm text-brand-mid">
          No contacts yet. {page.lead_capture ? 'They’ll show up here when someone taps “Share your info”.' : 'Turn on Contact exchange in the Page tab.'}
        </p>
      ) : (
        <ul className="divide-y divide-brand-dark2">
          {(locked ? DEMO_LEADS : leads).map((l) => (
            <li key={l.id} className="flex items-start justify-between gap-3 py-3.5">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm text-brand-white">
                  {l.name || 'No name'}
                  {l.kind === 'feedback' && (
                    <span className="flex items-center gap-1 rounded-full border border-brand-mid px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand-light2">
                      Feedback {l.rating && <>· {l.rating}<Star size={9} fill="currentColor" /></>}
                    </span>
                  )}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-light1">
                  {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-brand-white"><Mail size={12} />{l.email}</a>}
                  {l.phone && <a href={`tel:${l.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1 hover:text-brand-white"><Phone size={12} />{l.phone}</a>}
                  <span>{new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </p>
                {l.note && <p className="mt-1.5 text-sm text-brand-light2">{l.note}</p>}
              </div>
              {!locked && (
                <button type="button" aria-label="Delete" onClick={() => remove(l.id)} className="p-1 text-brand-mid hover:text-red-400">
                  <Trash2 size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
