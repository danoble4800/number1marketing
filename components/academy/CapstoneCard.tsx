'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, Lock, Send } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export type CapstoneStatus = 'pending' | 'approved' | 'changes_requested';
export type CapstoneSubmission = {
  link: string;
  note: string;
  status: CapstoneStatus;
  feedback: string;
  submitted_at: string;
};

interface Props {
  locale: string;
  // Module 06 is unlocked (Module 05 passed), so the capstone can be submitted.
  unlocked: boolean;
  submission: CapstoneSubmission | null;
  onSubmitted: (submission: CapstoneSubmission) => void;
}

// Darker shades read on the light theme; the dark theme gets the lighter ones.
const statusClass: Record<CapstoneStatus, string> = {
  pending: 'text-amber-700 border-amber-700/40 [[data-site-theme=dark]_&]:text-amber-200 [[data-site-theme=dark]_&]:border-amber-200/40',
  approved: 'text-emerald-700 border-emerald-700/40 [[data-site-theme=dark]_&]:text-emerald-300 [[data-site-theme=dark]_&]:border-emerald-300/40',
  changes_requested: 'text-red-700 border-red-700/40 [[data-site-theme=dark]_&]:text-red-300 [[data-site-theme=dark]_&]:border-red-300/40',
};

export default function CapstoneCard({ locale, unlocked, submission, onSubmitted }: Props) {
  const t = useTranslations('academy.dashboard.capstone');
  const [link, setLink] = useState(submission?.link ?? '');
  const [note, setNote] = useState(submission?.note ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = unlocked && submission?.status !== 'approved';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = link.trim();
    if (!/^https?:\/\/\S+$/i.test(trimmed)) {
      setError(t('invalidLink'));
      return;
    }
    setError('');
    setSaving(true);
    const { error: rpcError } = await getSupabase().rpc('submit_capstone', { p_link: trimmed, p_note: note });
    setSaving(false);
    if (rpcError) {
      setError(rpcError.message.includes('invalid link') ? t('invalidLink') : t('error'));
      return;
    }
    onSubmitted({ link: trimmed, note: note.trim(), status: 'pending', feedback: '', submitted_at: new Date().toISOString() });
  }

  return (
    <div className="border-t border-brand-dark2 pt-6 mt-6">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h4 className="font-display text-base uppercase tracking-tight text-brand-white">{t('heading')}</h4>
        {submission && (
          <span className={`text-xs uppercase tracking-widest border px-2 py-0.5 ${statusClass[submission.status]}`}>
            {t(`status.${submission.status}`)}
          </span>
        )}
      </div>

      {!unlocked ? (
        <p className="flex items-center gap-2 text-brand-mid text-sm">
          <Lock size={13} /> {t('locked')}
        </p>
      ) : (
        <>
          {submission && (
            <div className="mb-4 space-y-2 text-sm">
              <p className="text-brand-mid text-xs uppercase tracking-widest">
                {t('submittedOn', { date: new Date(submission.submitted_at).toLocaleDateString(locale) })}
              </p>
              <a
                href={submission.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-light2 hover:text-brand-white transition-colors break-all"
              >
                <ExternalLink size={13} className="flex-shrink-0" /> {t('viewLink')}
              </a>
              {submission.status === 'pending' && <p className="text-brand-light1">{t('pendingNote')}</p>}
              {submission.feedback && (
                <div className="border border-brand-dark2 bg-brand-near-black px-4 py-3">
                  <p className="text-xs uppercase tracking-widest text-brand-mid mb-1">{t('feedbackLabel')}</p>
                  <p className="text-brand-light1 whitespace-pre-line">{submission.feedback}</p>
                </div>
              )}
            </div>
          )}

          {canSubmit && submission?.status !== 'pending' && (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-xl">
              {!submission && <p className="text-brand-light1 text-sm">{t('intro')}</p>}
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-brand-mid mb-1.5">{t('linkLabel')}</span>
                <input
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={t('linkPlaceholder')}
                  className="w-full bg-brand-near-black border border-brand-dark2 px-4 py-3 text-sm text-brand-white placeholder:text-brand-mid focus:outline-none focus:border-brand-light1"
                />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-brand-mid mb-1.5">{t('noteLabel')}</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className="w-full bg-brand-near-black border border-brand-dark2 px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-light1"
                />
              </label>
              {error && <p className="text-red-600 [[data-site-theme=dark]_&]:text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50"
              >
                <Send size={13} />
                {saving ? t('submitting') : submission ? t('resubmit') : t('submit')}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
