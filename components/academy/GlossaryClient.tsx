'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Check, RotateCcw, Search, X } from 'lucide-react';
import { CATEGORIES, GLOSSARY, toLocale, type CategoryId, type GlossaryTerm } from '@/content/academy/glossary';
import { readKnownTerms, writeKnownTerms } from '@/lib/academyLocal';
import { getSupabase } from '@/lib/supabase';

type Mode = 'list' | 'flashcards' | 'quiz';

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function GlossaryClient({ locale }: { locale: string }) {
  const t = useTranslations('academy.glossary');
  const lang = toLocale(locale);
  const [mode, setMode] = useState<Mode>('list');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, []);

  // Opening a link like /academy/glossary#nap scrolls to that term.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'center' }));
  }, []);

  const inCategory = useMemo(
    () => GLOSSARY.filter((g) => category === 'all' || g.category === category),
    [category]
  );
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inCategory;
    return inCategory.filter((g) => g[lang][0].toLowerCase().includes(q) || g[lang][1].toLowerCase().includes(q) || g.en[0].toLowerCase().includes(q));
  }, [inCategory, query, lang]);

  const tabClass = (active: boolean) =>
    `text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
      active ? 'bg-brand-white text-brand-black border-brand-white' : 'border-brand-dark2 text-brand-light1 hover:border-brand-light1'
    }`;

  return (
    <div className="min-h-screen bg-brand-near-black">
      <div className="border-b border-brand-dark2 bg-brand-black pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={signedIn ? `/${locale}/academy/dashboard` : `/${locale}/academy`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light1 transition-colors mb-4"
          >
            <ArrowLeft size={13} />
            {signedIn ? t('backToDashboard') : t('backToAcademy')}
          </Link>
          <span className="block text-xs uppercase tracking-widest text-brand-mid mb-1">N°1 Academy</span>
          <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">{t('title')}</h1>
          <p className="text-brand-light1 text-sm mt-2 max-w-3xl">{t('intro')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-wrap gap-2" role="tablist">
          {(['list', 'flashcards', 'quiz'] as Mode[]).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={tabClass(mode === m)}>
              {t(m)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCategory('all')} className={tabClass(category === 'all')}>
            {t('all')}
          </button>
          {(Object.keys(CATEGORIES) as CategoryId[]).map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={tabClass(category === c)}>
              {CATEGORIES[c][lang]}
            </button>
          ))}
        </div>

        {mode === 'list' && (
          <>
            <label className="flex items-center gap-3 border border-brand-dark2 bg-brand-dark1 px-4 py-3 max-w-md">
              <Search size={16} className="text-brand-mid" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full bg-transparent text-sm text-brand-white placeholder:text-brand-mid outline-none"
              />
            </label>
            {shown.length === 0 ? (
              <p className="text-brand-mid text-sm">{t('noResults')}</p>
            ) : (
              <dl className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {shown.map((g) => (
                  <div key={g.id} id={g.id} className="bg-brand-dark1 border border-brand-dark2 p-6 scroll-mt-24 target:border-brand-light1">
                    <span className="text-xs uppercase tracking-widest text-brand-mid">{CATEGORIES[g.category][lang]}</span>
                    <dt className="font-display text-lg text-brand-white uppercase tracking-tight mt-1">{g[lang][0]}</dt>
                    <dd className="text-brand-light1 text-sm leading-relaxed mt-2">{g[lang][1]}</dd>
                    <dd className="text-sm leading-relaxed mt-3 border-l-2 border-brand-dark2 pl-3 text-brand-mid">
                      <span className="text-brand-light2">{t('example')}:</span> {g[lang][2]}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}

        {mode === 'flashcards' && <Flashcards key={category} terms={inCategory} lang={lang} />}
        {mode === 'quiz' && <Quiz key={category} terms={inCategory} lang={lang} />}
      </div>
    </div>
  );
}

function Flashcards({ terms, lang }: { terms: GlossaryTerm[]; lang: 'en' | 'es' | 'pt' }) {
  const t = useTranslations('academy.glossary');
  const [known, setKnown] = useState<string[]>([]);
  const [deck, setDeck] = useState<GlossaryTerm[]>([]);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const k = readKnownTerms();
    setKnown(k);
    setDeck(shuffle(terms.filter((g) => !k.includes(g.id))));
  }, [terms]);

  const knownHere = terms.filter((g) => known.includes(g.id)).length;
  const card = deck[0];

  function answer(gotIt: boolean) {
    if (!card) return;
    setFlipped(false);
    if (gotIt) {
      const next = [...known, card.id];
      setKnown(next);
      writeKnownTerms(next);
      setDeck(deck.slice(1));
    } else {
      setDeck([...deck.slice(1), card]);
    }
  }

  function reset() {
    const ids = new Set(terms.map((g) => g.id));
    const next = known.filter((id) => !ids.has(id));
    setKnown(next);
    writeKnownTerms(next);
    setDeck(shuffle(terms));
    setFlipped(false);
  }

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-brand-mid">
        <span>{t('knownCount', { known: knownHere, total: terms.length })}</span>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 hover:text-brand-light1">
          <RotateCcw size={12} /> {t('reset')}
        </button>
      </div>
      <div className="h-1 bg-brand-dark2">
        <div className="h-1 bg-brand-light2" style={{ width: `${terms.length ? (knownHere / terms.length) * 100 : 0}%` }} />
      </div>

      {card ? (
        <>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[240px] bg-brand-dark1 border border-brand-dark2 hover:border-brand-light1 p-8 text-left flex flex-col justify-center transition-colors"
          >
            {flipped ? (
              <>
                <span className="text-brand-light1 leading-relaxed">{card[lang][1]}</span>
                <span className="text-sm text-brand-mid mt-4 border-l-2 border-brand-dark2 pl-3">{card[lang][2]}</span>
              </>
            ) : (
              <>
                <span className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">{card[lang][0]}</span>
                <span className="text-xs uppercase tracking-widest text-brand-mid mt-6">{t('tapToFlip')}</span>
              </>
            )}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => answer(false)}
              className="inline-flex items-center justify-center gap-2 border border-brand-dark2 text-brand-light1 text-xs uppercase tracking-widest px-5 py-3 hover:border-brand-light1"
            >
              <X size={13} /> {t('again')}
            </button>
            <button
              type="button"
              onClick={() => answer(true)}
              className="inline-flex items-center justify-center gap-2 bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite"
            >
              <Check size={13} /> {t('known')}
            </button>
          </div>
        </>
      ) : (
        <p className="bg-brand-dark1 border border-brand-light2/40 p-8 text-brand-light2">{t('allKnown')}</p>
      )}
    </div>
  );
}

function Quiz({ terms, lang }: { terms: GlossaryTerm[]; lang: 'en' | 'es' | 'pt' }) {
  const t = useTranslations('academy.glossary');
  // Wrong options come from the whole glossary when a category has fewer than four terms.
  const [round, setRound] = useState<{ term: GlossaryTerm; options: GlossaryTerm[] } | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  function nextRound() {
    const term = terms[Math.floor(Math.random() * terms.length)];
    const pool = (terms.length >= 4 ? terms : GLOSSARY).filter((g) => g.id !== term.id);
    setRound({ term, options: shuffle([term, ...shuffle(pool).slice(0, 3)]) });
    setPicked(null);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(nextRound, [terms]);

  if (!round) return null;
  const isRight = picked === round.term.id;

  function pick(id: string) {
    if (picked) return;
    setPicked(id);
    setScore((s) => ({ right: s.right + (id === round!.term.id ? 1 : 0), total: s.total + 1 }));
  }

  return (
    <div className="max-w-xl space-y-4">
      <span className="block text-xs uppercase tracking-widest text-brand-mid">
        {t('score', { score: score.right, total: score.total })}
      </span>
      <div className="bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-3">{t('quizPrompt')}</p>
        <p className="text-brand-offwhite leading-relaxed">{round.term[lang][1]}</p>
        <div className="mt-6 space-y-2">
          {round.options.map((o) => {
            const state = !picked ? '' : o.id === round.term.id ? 'border-emerald-600 text-emerald-300' : o.id === picked ? 'border-red-700 text-red-300' : 'opacity-50';
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => pick(o.id)}
                className={`w-full text-left px-4 py-3 border border-brand-dark2 text-sm text-brand-light1 hover:border-brand-mid transition-colors ${state}`}
              >
                {o[lang][0]}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className={`text-sm ${isRight ? 'text-emerald-300' : 'text-red-300'}`}>
              {isRight ? t('correct') : t('wrong', { answer: round.term[lang][0] })}
            </p>
            <button
              type="button"
              onClick={nextRound}
              className="bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-5 py-3 hover:bg-brand-offwhite"
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
