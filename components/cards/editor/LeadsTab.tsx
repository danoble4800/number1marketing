'use client';

import { useEffect, useState } from 'react';
import { Download, Mail, Phone, Star, Trash2 } from 'lucide-react';
import type { CardLead, CardPage } from '@/lib/cards/types';
import { can } from '@/lib/cards/plans';
import { DEMO_LEADS } from '@/lib/cards/demo';
import { getSupabase } from '@/lib/supabase';
import { Section, type Undoable } from './ui';

type Props = { page: CardPage; demo: boolean; onUpgrade: () => void; onUndoable: (u: Undoable) => void };

export default function LeadsTab({ page, demo, onUpgrade, onUndoable }: Props) {
  const [leads, setLeads] = useState<CardLead[] | null>(null);
  const [sample, setSample] = useState(false);

  useEffect(() => {
    if (demo) { setLeads(DEMO_LEADS); return; }
    getSupabase()
      .from('card_leads')
      .select('*')
      .eq('page_id', page.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setLeads((data as CardLead[]) ?? []));
  }, [page.id, demo]);

  // Hide right away; the row is only deleted once the Undo toast closes.
  function remove(lead: CardLead) {
    setLeads((l) => l?.filter((x) => x.id !== lead.id) ?? null);
    onUndoable({
      text: 'Contact deleted',
      undo: () => setLeads((l) => (l ? [...l, lead].sort((a, b) => b.created_at.localeCompare(a.created_at)) : l)),
      commit: () => {
        if (!demo) getSupabase().from('card_leads').delete().eq('id', lead.id).then();
      },
    });
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
  const list = locked || sample ? DEMO_LEADS : leads ?? [];

  return (
    <Section
      title="Contacts"
      hint="People who shared their info from your page, plus private feedback from the review step."
      locked={locked ? 'pro' : null}
      onUpgrade={onUpgrade}
      right={
        !locked && !sample && leads && leads.length > 0 && (
          <button type="button" onClick={exportCsv} className="flex items-center gap-1.5 rounded-full border border-ed-line px-3 py-1.5 text-xs text-ed-fg hover:border-ed-ink">
            <Download size={13} /> CSV
          </button>
        )
      }
    >
      {!leads ? (
        <p className="text-sm text-ed-muted">Loading…</p>
      ) : list.length === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ed-faint">
            No contacts yet. {page.lead_capture ? 'They’ll show up here when someone taps “Share your info”.' : 'Turn on Contact exchange in the Page tab.'}
          </p>
          <SampleButton on={false} onClick={() => setSample(true)} />
        </div>
      ) : (
        <>
          {sample && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-ed-muted">
              Showing sample contacts. These aren’t real people.
              <SampleButton on onClick={() => setSample(false)} />
            </div>
          )}
          <ul className="divide-y divide-ed-line">
            {list.map((l) => (
              <li key={l.id} className="flex items-start justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-ed-ink">
                    {l.name || 'No name'}
                    {l.kind === 'feedback' && (
                      <span className="flex items-center gap-1 rounded-full border border-ed-faint px-2 py-0.5 text-[10px] text-ed-soft">
                        Feedback {l.rating && <>· {l.rating}<Star size={9} fill="currentColor" /></>}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ed-muted">
                    {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-ed-ink"><Mail size={12} />{l.email}</a>}
                    {l.phone && <a href={`tel:${l.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1 hover:text-ed-ink"><Phone size={12} />{l.phone}</a>}
                    <span>{new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </p>
                  {l.note && <p className="mt-1.5 text-sm text-ed-soft">{l.note}</p>}
                </div>
                {!locked && !sample && (
                  <button type="button" aria-label="Delete" onClick={() => remove(l)} className="p-1 text-ed-faint hover:text-ed-err">
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

function SampleButton({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-full border border-ed-line px-3 py-1.5 text-sm font-medium text-ed-fg hover:border-ed-ink">
      {on ? 'Hide sample' : 'Show sample data'}
    </button>
  );
}
