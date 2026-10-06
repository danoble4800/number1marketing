'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ClipboardCheck, ExternalLink } from 'lucide-react';
import { getSupabase, type Profile } from '@/lib/supabase';
import type { CapstoneStatus, CapstoneSubmission } from '@/components/academy/CapstoneCard';

export type CapstoneRow = CapstoneSubmission & { user_id: string; reviewed_at: string | null };

interface Props {
  locale: string;
  submissions: CapstoneRow[];
  students: Profile[];
  finalPassed: Set<string>;
  certified: Set<string>;
  onReviewed: (userId: string, status: CapstoneStatus, feedback: string, certificate: boolean) => void;
}

const statusClass: Record<CapstoneStatus, string> = {
  pending: 'text-amber-700 border-amber-700/40 [[data-site-theme=dark]_&]:text-amber-200 [[data-site-theme=dark]_&]:border-amber-200/40',
  approved: 'text-emerald-700 border-emerald-700/40 [[data-site-theme=dark]_&]:text-emerald-300 [[data-site-theme=dark]_&]:border-emerald-300/40',
  changes_requested: 'text-red-700 border-red-700/40 [[data-site-theme=dark]_&]:text-red-300 [[data-site-theme=dark]_&]:border-red-300/40',
};

// Waiting reviews first, oldest first, so nobody sits in the queue the longest.
const order: Record<CapstoneStatus, number> = { pending: 0, changes_requested: 1, approved: 2 };

export default function CapstoneReviews({ locale, submissions, students, finalPassed, certified, onReviewed }: Props) {
  const t = useTranslations('academy.admin.capstones');
  const tStatus = useTranslations('academy.dashboard.capstone.status');
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sorted = [...submissions].sort(
    (a, b) => order[a.status] - order[b.status] || a.submitted_at.localeCompare(b.submitted_at)
  );
  const waiting = submissions.filter((s) => s.status === 'pending').length;

  async function review(row: CapstoneRow, approve: boolean) {
    const text = (feedback[row.user_id] ?? row.feedback).trim();
    if (!approve && !text) {
      setErrors((e) => ({ ...e, [row.user_id]: t('feedbackRequired') }));
      return;
    }
    setErrors((e) => ({ ...e, [row.user_id]: '' }));
    setSaving(row.user_id);
    const { data, error } = await getSupabase().rpc('review_capstone', {
      p_user: row.user_id,
      p_approve: approve,
      p_feedback: text,
    });
    setSaving(null);
    if (error) {
      setErrors((e) => ({ ...e, [row.user_id]: t('error') }));
      return;
    }
    const result = data as { status: CapstoneStatus; certificate: boolean };
    onReviewed(row.user_id, result.status, text, result.certificate);
  }

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
        <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight">{t('heading')}</h2>
        {waiting > 0 && (
          <span className="text-xs uppercase tracking-widest text-brand-light2">{t('waiting', { count: waiting })}</span>
        )}
      </div>
      <div className="bg-brand-dark1 border border-brand-dark2 divide-y divide-brand-dark2">
        {sorted.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardCheck size={32} className="text-brand-dark2 mx-auto mb-4" />
            <p className="text-brand-mid text-sm uppercase tracking-widest">{t('empty')}</p>
          </div>
        ) : (
          sorted.map((row) => {
            const student = students.find((s) => s.id === row.user_id);
            const busy = saving === row.user_id;
            return (
              <div key={row.user_id} className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-brand-offwhite">{student?.full_name || student?.email || row.user_id}</p>
                    {student?.full_name && <p className="text-brand-mid text-sm">{student.email}</p>}
                    <p className="text-brand-mid text-xs uppercase tracking-widest mt-1">
                      {t('submitted', { date: new Date(row.submitted_at).toLocaleDateString(locale) })}
                      {' · '}
                      {finalPassed.has(row.user_id) ? t('finalPassed') : t('finalNotPassed')}
                      {certified.has(row.user_id) && ` · ${t('certificateIssued')}`}
                    </p>
                  </div>
                  <span className={`text-xs uppercase tracking-widest border px-2 py-0.5 ${statusClass[row.status]}`}>
                    {tStatus(row.status)}
                  </span>
                </div>

                <a
                  href={row.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-brand-light2 hover:text-brand-white transition-colors break-all"
                >
                  <ExternalLink size={13} className="flex-shrink-0" /> {t('open')}
                </a>
                {row.note && <p className="text-brand-light1 text-sm whitespace-pre-line">{row.note}</p>}

                {row.status === 'approved' ? (
                  row.feedback && <p className="text-brand-mid text-sm whitespace-pre-line">{row.feedback}</p>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={feedback[row.user_id] ?? row.feedback}
                      onChange={(e) => setFeedback((f) => ({ ...f, [row.user_id]: e.target.value }))}
                      placeholder={t('feedbackPlaceholder')}
                      rows={3}
                      maxLength={2000}
                      className="w-full bg-brand-near-black border border-brand-dark2 px-4 py-3 text-sm text-brand-white placeholder:text-brand-mid focus:outline-none focus:border-brand-light1"
                    />
                    {errors[row.user_id] && (
                      <p className="text-red-600 [[data-site-theme=dark]_&]:text-red-400 text-sm">{errors[row.user_id]}</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => review(row, true)}
                        disabled={busy}
                        className="bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                      >
                        {busy ? t('saving') : t('approve')}
                      </button>
                      <button
                        onClick={() => review(row, false)}
                        disabled={busy}
                        className="border border-brand-dark2 text-brand-light1 text-xs uppercase tracking-widest px-5 py-3 hover:border-brand-light1 hover:text-brand-white transition-colors disabled:opacity-50"
                      >
                        {t('requestChanges')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
