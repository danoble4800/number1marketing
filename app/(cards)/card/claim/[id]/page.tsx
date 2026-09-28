'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Nfc } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import CardSignIn from '@/components/cards/CardSignIn';
import { createPage, listMyPages, slugAvailable, slugify } from '@/lib/cards/client';
import type { CardPage } from '@/lib/cards/types';

type Status = 'loading' | 'missing' | 'disabled' | 'unpublished' | 'unclaimed' | 'mine' | 'taken';

const MESSAGES: Partial<Record<Status, [string, string]>> = {
  missing: ['Card not found', 'We couldn’t find this card. Check that it was set up by N°1, or contact us.'],
  disabled: ['This card is switched off', 'The owner turned this card off. If it’s yours, sign in to turn it back on.'],
  unpublished: ['Page is hidden', 'The owner of this card has hidden their page for now.'],
  taken: ['Already claimed', 'This card belongs to someone else’s page.'],
};

const field =
  'w-full border border-brand-dark2 bg-brand-black px-4 py-3 text-sm text-brand-offwhite placeholder:text-brand-mid focus:border-brand-light1 focus:outline-none';

export default function ClaimPage({ params }: { params: { id: string } }) {
  const id = params.id.toUpperCase();
  const router = useRouter();
  const search = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [pages, setPages] = useState<CardPage[]>([]);
  const [choice, setChoice] = useState<string>('new');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      setSession(s.session);
      const forced = search.get('state') as Status | null;
      if (forced && MESSAGES[forced]) {
        setStatus(forced);
        return;
      }
      const { data } = await supabase.rpc('card_claim_status', { p_card: id });
      const st = (data as Status) ?? 'missing';
      if (st === 'mine') {
        router.replace('/card/edit?tab=cards');
        return;
      }
      setStatus(st);
      if (s.session && st === 'unclaimed') {
        const mine = await listMyPages();
        setPages(mine);
        setChoice(mine[0]?.id ?? 'new');
      }
    })();
  }, [id, router, search]);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    setError('');
    try {
      let pageId = choice;
      if (choice === 'new') {
        const s = slugify(slug || name);
        if (s.length < 3) throw new Error('Pick a page address with at least 3 letters or numbers.');
        if (!(await slugAvailable(s))) throw new Error(`“${s}” is taken. Try another address.`);
        const page = await createPage(session.user.id, name.trim(), s, session.user.email);
        pageId = page.id;
      }
      const { data, error: err } = await getSupabase().rpc('claim_card', { p_card: id, p_page: pageId });
      if (err) throw err;
      if (!(data as { ok: boolean }).ok) throw new Error('This card can’t be claimed. It may already belong to someone.');
      router.push('/card/edit?welcome=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  const message = MESSAGES[status];

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-brand-near-black px-4 py-12 text-brand-offwhite">
      <p className="mb-8 font-display text-lg uppercase tracking-wider text-brand-white">N°1 Tap Cards</p>

      {status === 'loading' && <p className="text-sm text-brand-light1">Checking your card…</p>}

      {message && (
        <div className="w-full max-w-md border border-brand-dark2 bg-brand-dark1 p-8 text-center">
          <h1 className="font-display text-2xl uppercase text-brand-white">{message[0]}</h1>
          <p className="mt-3 text-sm text-brand-light1">{message[1]}</p>
          <Link href="/card" className="mt-6 inline-block text-sm text-brand-white underline">Sign in</Link>
        </div>
      )}

      {status === 'unclaimed' && !session && (
        <>
          <div className="mb-6 flex items-center gap-2 text-sm text-brand-light2">
            <Nfc size={18} /> New card <span className="font-mono text-brand-white">{id}</span>
          </div>
          <CardSignIn
            next={`/card/claim/${id}`}
            heading="Claim this card"
            sub="Your card is ready. Enter your email to set up the page it opens. It takes about two minutes."
          />
        </>
      )}

      {status === 'unclaimed' && session && (
        <form onSubmit={claim} className="w-full max-w-md space-y-5 border border-brand-dark2 bg-brand-dark1 p-8">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-tight text-brand-white">Claim this card</h1>
            <p className="mt-2 text-sm text-brand-light1">
              Card <span className="font-mono text-brand-white">{id}</span> will open the page you choose. You can change
              it any time.
            </p>
          </div>

          {pages.length > 0 && (
            <div className="space-y-2">
              {pages.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-3 border border-brand-dark2 bg-brand-black p-3 text-sm">
                  <input type="radio" name="page" checked={choice === p.id} onChange={() => setChoice(p.id)} />
                  <span>
                    <span className="block text-brand-white">{p.display_name || p.slug}</span>
                    <span className="text-xs text-brand-mid">/c/{p.slug}</span>
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-3 border border-brand-dark2 bg-brand-black p-3 text-sm">
                <input type="radio" name="page" checked={choice === 'new'} onChange={() => setChoice('new')} />
                Create a new page
              </label>
            </div>
          )}

          {choice === 'new' && (
            <>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-brand-mid">Your name or business</label>
                <input
                  className={field}
                  required
                  value={name}
                  placeholder="Tony’s Brick Oven"
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-brand-mid">Page address</label>
                <div className="flex items-center border border-brand-dark2 bg-brand-black focus-within:border-brand-light1">
                  <span className="pl-4 text-sm text-brand-mid">…/c/</span>
                  <input
                    className="w-full bg-transparent px-1 py-3 text-sm text-brand-offwhite focus:outline-none"
                    required
                    value={slug}
                    placeholder="tonys-brick-oven"
                    onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brand-white py-3 text-sm font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-offwhite disabled:opacity-60"
          >
            {busy ? 'Setting up…' : 'Claim card'}
          </button>
        </form>
      )}
    </main>
  );
}
