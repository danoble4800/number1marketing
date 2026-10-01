'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

// A card's ID, linked to its permanent chip URL (what's written to the NFC chip), with
// a small button that copies the URL. Used in the Card column of Admin → Tap Cards and
// the team Tap Cards tab.
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
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <a href={url} target="_blank" rel="noopener noreferrer" title={url} className="font-mono text-brand-white hover:underline">
        {id}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy chip URL for card ${id}`}
        title={copied ? 'Copied' : `Copy ${url}`}
        className={`p-1 transition-colors ${copied ? 'text-green-400' : 'text-brand-mid hover:text-brand-white'}`}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </span>
  );
}
