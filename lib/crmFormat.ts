// Display helpers shared by the admin CRM page and the morning digest.
// They only change how names look on screen; the sheets keep what was typed.

const SMALL_WORDS = new Set(['and', 'of', 'the', 'at', 'in', 'for', 'a', 'an', '&']);

// "brancato barbershop" → "Brancato Barbershop", "SRS CASH HOME BUYERS" → "SRS Cash Home Buyers".
// Mixed-case words ("McLaren", "iPhone") are left alone.
export function tidy(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      if (word === lower) return word.charAt(0).toUpperCase() + word.slice(1);
      // Short all-caps words are usually acronyms (SRS, LLC); longer ones are shouting.
      if (word === word.toUpperCase() && /[A-Z]/.test(word) && word.replace(/\W/g, '').length > 3) {
        return word.charAt(0) + lower.slice(1);
      }
      return word;
    })
    .join(' ');
}

export function showPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const d = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : phone;
}

// "2026-09-28" → "Mon 9/28"
export function showDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
}
