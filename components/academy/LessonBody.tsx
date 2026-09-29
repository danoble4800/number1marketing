import React from 'react';
import GlossaryTip from '@/components/academy/GlossaryTip';

// Renders the small markdown subset used in content/academy/lessons.ts:
// ## headings, paragraphs, "- " bullets, "1. " numbered lists, "> " callouts, **bold**, *italic*,
// and [[shown text|glossary-id]] glossary terms.

function inline(text: string, locale: string): React.ReactNode[] {
  return text.split(/(\[\[[^\]]+\]\]|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      const [shown, id] = part.slice(2, -2).split('|');
      return <GlossaryTip key={i} id={id ?? shown} locale={locale}>{shown}</GlossaryTip>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-brand-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function LessonBody({ body, locale = 'en' }: { body: string; locale?: string }) {
  const blocks = body.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-5 text-brand-light1 leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

        if (lines[0].startsWith('## ')) {
          return (
            <h3 key={i} className="font-display text-xl text-brand-white uppercase tracking-tight pt-4">
              {lines[0].slice(3)}
            </h3>
          );
        }
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i} className="space-y-2 pl-5 list-disc marker:text-brand-mid">
              {lines.map((l, j) => <li key={j}>{inline(l.slice(2), locale)}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i} className="space-y-2 pl-5 list-decimal marker:text-brand-mid">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\.\s/, ''), locale)}</li>)}
            </ol>
          );
        }
        if (lines[0].startsWith('> ')) {
          return (
            <div key={i} className="border-l-2 border-brand-light2 bg-brand-dark2/60 px-5 py-4 text-brand-offwhite">
              {inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '), locale)}
            </div>
          );
        }
        return <p key={i}>{inline(lines.join(' '), locale)}</p>;
      })}
    </div>
  );
}
