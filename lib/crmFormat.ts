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

export function phoneForLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return digits ? `+${digits}` : '';
}

// Opens the phone's Messages app with the text filled in.
export function smsHref(phone: string, body: string) {
  const apple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  return `sms:${phoneForLink(phone)}${apple ? '&' : '?'}body=${encodeURIComponent(body)}`;
}

// Business names as reps type them in a hurry: "Joe's Pizza LLC" and "joes pizza" are the same place.
const BUSINESS_FILLER = new Set(['the', 'and', 'llc', 'inc', 'co', 'corp', 'company', 'ltd']);
export function businessKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/&/g, ' and ')
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !BUSINESS_FILLER.has(w))
    .join('');
}

// Also matches a shortened name ("Brancato" vs "Brancato Barbershop"), but only from the
// start, so a plain "Barbershop" doesn't flag every barbershop.
export function sameBusiness(a: string, b: string): boolean {
  const x = businessKey(a);
  const y = businessKey(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const [short, long] = x.length < y.length ? [x, y] : [y, x];
  return short.length >= 5 && long.startsWith(short);
}
