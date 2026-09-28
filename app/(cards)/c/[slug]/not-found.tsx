import Link from 'next/link';

export default function CardNotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#0E0E10] px-6 text-center text-[#F5F5F6]">
      <p className="font-display text-2xl uppercase tracking-wide">N°1</p>
      <h1 className="mt-4 text-xl font-semibold">This page isn’t set up yet.</h1>
      <p className="mt-2 max-w-sm text-sm text-[#8C8C91]">
        If this is your card, sign in to finish your page.
      </p>
      <Link href="/card" className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">
        Set up my page
      </Link>
    </main>
  );
}
