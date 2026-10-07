'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check, Copy, Download } from 'lucide-react';
import { getCurrentProfile } from '@/lib/supabase';
import { toLocale } from '@/content/academy/glossary';
import { LISTING_SITES, SHEETS, TOOLKIT, type Sheet } from '@/content/academy/toolkit';

// Students only: the templates are part of what the course sells.
export default function AcademyToolkitClient({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('academy.toolkit');
  const lang = toLocale(locale);
  const [authed, setAuthed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getCurrentProfile().then((profile) => {
      if (profile) setAuthed(true);
      else router.replace(`/${locale}/academy/login?role=student`);
    });
  }, [locale, router]);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      // Clipboard can be blocked; the text is selectable on screen.
    }
  }

  function download(sheet: Sheet) {
    const header = sheet.columns[lang];
    const rows: string[][] = [];
    if (sheet.id === 'content-calendar') {
      const day = new Date();
      for (let i = 0; i < sheet.rows; i++) {
        const d = new Date(day.getFullYear(), day.getMonth(), day.getDate() + i);
        rows.push([d.toLocaleDateString(locale), ...header.slice(1).map(() => '')]);
      }
    } else if (sheet.id === 'listings-tracker') {
      for (const site of LISTING_SITES) rows.push([site, ...header.slice(1).map(() => '')]);
    }
    const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const csv = [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
    // The BOM makes Excel read accented characters correctly.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${sheet.title[lang]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!authed) return <div className="min-h-screen bg-brand-near-black" />;

  return (
    <div className="min-h-screen bg-brand-near-black">
      <div className="border-b border-brand-dark2 bg-brand-black pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/academy/dashboard`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light1 transition-colors mb-4"
          >
            <ArrowLeft size={13} />
            {t('backToDashboard')}
          </Link>
          <span className="block text-xs uppercase tracking-widest text-brand-mid mb-1">N°1 AI Starter Guide</span>
          <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">{t('title')}</h1>
          <p className="text-brand-light1 text-sm mt-2 max-w-3xl">{t('intro')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {TOOLKIT.map((section) => (
          <section key={section.id}>
            <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight">{section.title[lang]}</h2>
            <p className="text-brand-light1 text-sm mt-2 mb-6 max-w-3xl">{section.intro[lang]}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {section.templates.map((tpl) => (
                <article key={tpl.id} className="bg-brand-dark1 border border-brand-dark2 p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base uppercase tracking-tight text-brand-white">{tpl.title[lang]}</h3>
                      <p className="text-xs text-brand-mid mt-1">{tpl.note[lang]}</p>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-brand-mid border border-brand-dark2 px-2 py-0.5 whitespace-nowrap">
                      {t('module', { number: tpl.module })}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-brand-light1 leading-relaxed bg-brand-near-black border border-brand-dark2 p-4 select-all">
                    {tpl.body[lang]}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copy(tpl.id, tpl.body[lang])}
                    className="self-start inline-flex items-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite transition-colors"
                  >
                    {copied === tpl.id ? <Check size={13} /> : <Copy size={13} />}
                    {copied === tpl.id ? t('copied') : t('copy')}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="font-display text-xl sm:text-2xl text-brand-white uppercase tracking-tight mb-6">{t('sheetsHeading')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHEETS.map((sheet) => (
              <article key={sheet.id} className="bg-brand-dark1 border border-brand-dark2 p-6 flex flex-col gap-3">
                <h3 className="font-display text-base uppercase tracking-tight text-brand-white">{sheet.title[lang]}</h3>
                <p className="text-sm text-brand-light1">{sheet.note[lang]}</p>
                <p className="text-xs text-brand-mid">{sheet.columns[lang].join(' · ')}</p>
                <button
                  type="button"
                  onClick={() => download(sheet)}
                  className="mt-auto self-start inline-flex items-center gap-2 border border-brand-dark2 text-brand-light1 text-xs uppercase tracking-widest px-5 py-3 hover:border-brand-light1 hover:text-brand-white transition-colors"
                >
                  <Download size={13} /> {t('download')}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
