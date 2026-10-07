'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { CAMPAIGN_TYPES, FOLLOWER_RANGES, NICHES, type CampaignType } from '@/content/creators/plans';

type Fields = {
  fullName: string;
  email: string;
  instagram: string;
  tiktok: string;
  followers: string;
  niche: string;
  rate: string;
  location: string;
  links: string;
  about: string;
};

const initial: Fields = {
  fullName: '', email: '', instagram: '', tiktok: '', followers: '', niche: '', rate: '', location: '', links: '', about: '',
};

type ErrorKey = 'missingContact' | 'missingHandle' | 'missingDetails' | 'missingConsent' | 'failed';

const inputClass =
  'w-full bg-brand-near-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light2 transition-colors';
const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

// Creator application on /creators. Saves through /api/creators for review in the admin Creators tab.
export default function CreatorApplyForm({ locale }: { locale: string }) {
  const t = useTranslations('creators.apply');
  const [form, setForm] = useState<Fields>(initial);
  const [types, setTypes] = useState<CampaignType[]>(['gifted', 'paid']);
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'duplicate'>('idle');
  const [error, setError] = useState<ErrorKey | null>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };
  const toggleType = (type: CampaignType) => {
    setTypes((prev) => (prev.includes(type) ? prev.filter((x) => x !== type) : [...prev, type]));
    setError(null);
  };

  // Same checks as the API, so most mistakes show without a round trip.
  const validate = (): ErrorKey | null => {
    if (!form.fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'missingContact';
    if (!form.instagram.trim() && !form.tiktok.trim()) return 'missingHandle';
    if (!form.followers || !form.niche || !types.length || !form.links.trim()) return 'missingDetails';
    if (!consent) return 'missingConsent';
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setStatus('sending');
    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, campaignTypes: types, consent, company, locale }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((['missingContact', 'missingHandle', 'missingDetails', 'missingConsent'] as string[]).includes(json.error) ? json.error : 'failed');
        setStatus('idle');
        return;
      }
      setStatus(json.duplicate ? 'duplicate' : 'sent');
    } catch {
      setError('failed');
      setStatus('idle');
    }
  };

  if (status === 'sent' || status === 'duplicate') {
    return (
      <div className="bg-brand-dark1 border border-brand-light2 p-8 flex flex-col gap-4" role="status">
        <div className="w-12 h-12 border-2 border-brand-light2 flex items-center justify-center">
          <Check size={22} className="text-brand-white" />
        </div>
        <h3 className="font-display text-2xl text-brand-white uppercase tracking-tight">{t('successTitle')}</h3>
        <p className="text-brand-light1">
          {status === 'duplicate' ? t('duplicateDesc') : t('successDesc', { name: form.fullName.trim().split(/\s+/)[0] })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative overflow-hidden bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cr-name" className={labelClass}>{t('fullName')}</label>
          <input id="cr-name" type="text" autoComplete="name" value={form.fullName} onChange={set('fullName')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cr-email" className={labelClass}>{t('email')}</label>
          <input id="cr-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={inputClass} />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cr-ig" className={labelClass}>{t('instagram')}</label>
            <input id="cr-ig" type="text" value={form.instagram} onChange={set('instagram')} placeholder={t('handlePlaceholder')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="cr-tt" className={labelClass}>{t('tiktok')}</label>
            <input id="cr-tt" type="text" value={form.tiktok} onChange={set('tiktok')} placeholder={t('handlePlaceholder')} className={inputClass} />
          </div>
        </div>
        <p className="mt-1.5 text-xs text-brand-mid">{t('handleHint')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cr-followers" className={labelClass}>{t('followers')}</label>
          <select id="cr-followers" value={form.followers} onChange={set('followers')} className={inputClass}>
            <option value="">{t('choose')}</option>
            {Object.keys(FOLLOWER_RANGES).map((k) => <option key={k} value={k}>{t(`followerRanges.${k}`)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cr-niche" className={labelClass}>{t('niche')}</label>
          <select id="cr-niche" value={form.niche} onChange={set('niche')} className={inputClass}>
            <option value="">{t('choose')}</option>
            {Object.keys(NICHES).map((k) => <option key={k} value={k}>{t(`niches.${k}`)}</option>)}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>{t('campaignTypes')}</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CAMPAIGN_TYPES) as CampaignType[]).map((type) => {
            const on = types.includes(type);
            return (
              <label
                key={type}
                htmlFor={`cr-type-${type}`}
                className={`cursor-pointer select-none px-4 py-2.5 text-sm border transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-light2 ${
                  on ? 'bg-brand-white text-brand-black border-brand-white' : 'bg-brand-near-black text-brand-light2 border-brand-dark2 hover:border-brand-light1'
                }`}
              >
                <input id={`cr-type-${type}`} type="checkbox" checked={on} onChange={() => toggleType(type)} className="sr-only" />
                {t(`types.${type}`)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cr-rate" className={labelClass}>{t('rate')}</label>
          <input id="cr-rate" type="text" inputMode="decimal" value={form.rate} onChange={set('rate')} placeholder={t('ratePlaceholder')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cr-location" className={labelClass}>{t('location')}</label>
          <input id="cr-location" type="text" autoComplete="address-level2" value={form.location} onChange={set('location')} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="cr-links" className={labelClass}>{t('links')}</label>
        <textarea id="cr-links" rows={3} value={form.links} onChange={set('links')} placeholder={t('linksPlaceholder')} className={inputClass} />
      </div>

      <div>
        <label htmlFor="cr-about" className={labelClass}>{t('about')}</label>
        <textarea id="cr-about" rows={3} value={form.about} onChange={set('about')} className={inputClass} />
      </div>

      {/* Honeypot: hidden from people, filled in by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="cr-company">Company</label>
        <input id="cr-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <label htmlFor="cr-consent" className="flex items-start gap-3 text-sm text-brand-light1 cursor-pointer">
        <input
          id="cr-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => { setConsent(e.target.checked); setError(null); }}
          className="mt-0.5 w-4 h-4 flex-shrink-0 accent-current"
        />
        {t('consent')}
      </label>

      {error && <p className="text-sm text-red-500" role="alert">{t(`errors.${error}`)}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-brand-white text-brand-black border border-brand-white px-6 py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
