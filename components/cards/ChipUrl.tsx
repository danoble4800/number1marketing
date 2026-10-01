'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

// A card's permanent chip URL (what's written to the NFC chip) with a copy button.
// Used in the Cards tables of Admin → Tap Cards and the team Tap Cards tab.
export default function ChipUrl({ id }: { id: string }) {
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}/t/${id}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      prompt('Copy this link:', url);
    }
  };

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-brand-light2 hover:text-brand-white hover:underline">
        {url.replace(/^https?:\/\//, '')}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy link for card ${id}`}
        className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${
          copied ? 'border-green-400/60 text-green-400' : 'border-brand-dark2 text-brand-light1 hover:border-brand-light1 hover:text-brand-white'
        }`}
      >
        {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  );
}
