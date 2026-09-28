'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function VerifyLookupForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy.certificate.verify');
  const [code, setCode] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) router.push(`/${locale}/academy/verify/${encodeURIComponent(code.trim().toUpperCase())}`);
      }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="N1-XXXX-XXXX"
        required
        className="flex-1 bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm font-mono uppercase placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
      />
      <button
        type="submit"
        className="bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-brand-offwhite transition-colors"
      >
        {t('lookupButton')}
      </button>
    </form>
  );
}
