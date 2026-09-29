// Per-device Academy extras kept in the browser: checklist ticks and known flashcards.
// Nothing here affects grading or certificates; it can be cleared without losing progress.

const CHECKLIST_KEY = (moduleNumber: string) => `n1-academy-checklist-${moduleNumber}`;
const KNOWN_KEY = 'n1-academy-known-terms';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); ticks then last only for this visit.
  }
}

export const readChecklist = (moduleNumber: string) => read<number[]>(CHECKLIST_KEY(moduleNumber), []);
export const writeChecklist = (moduleNumber: string, done: number[]) => write(CHECKLIST_KEY(moduleNumber), done);

export const readKnownTerms = () => read<string[]>(KNOWN_KEY, []);
export const writeKnownTerms = (ids: string[]) => write(KNOWN_KEY, ids);
