'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import CardSignIn from '@/components/cards/CardSignIn';

export default function CardHome() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/card/edit');
      else setChecking(false);
    });
  }, [router]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-brand-near-black px-4 py-12 text-brand-offwhite">
      <p className="mb-8 font-display text-lg uppercase tracking-wider text-brand-white">N°1 Tap Cards</p>
      {checking ? (
        <p className="text-sm text-brand-light1">Loading…</p>
      ) : (
        <>
          <CardSignIn next="/card/edit" />
          <p className="mt-6 text-sm text-brand-light1">
            Just looking?{' '}
            <Link href="/card/edit?demo=pizza" className="text-brand-white underline">Try the editor</Link>
            {' · '}
            <Link href="/en/cards" className="text-brand-white underline">Plans</Link>
          </p>
        </>
      )}
    </main>
  );
}
