import { Suspense } from 'react';
import type { Metadata } from 'next';
import Editor from '@/components/cards/editor/Editor';

export const metadata: Metadata = { title: 'Edit your page · N°1 Tap Cards', robots: { index: false } };

export default function EditPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-brand-near-black" />}>
      <Editor />
    </Suspense>
  );
}
