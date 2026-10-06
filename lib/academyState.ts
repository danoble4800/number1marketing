// Academy extras that don't affect grading: checklist ticks and flashcards marked as known.
// Signed-in students keep them in their account (academy_user_state in supabase/schema.sql) so
// they follow them across devices. Visitors who aren't signed in (the glossary is public) keep
// them in this browser; the first time a student loads their account, any browser copy is
// merged in and cleared.

import { getSupabase } from '@/lib/supabase';

export type AcademyState = { checklists: Record<string, number[]>; knownTerms: string[] };

const LOCAL_CHECKLIST = (moduleNumber: string) => `n1-academy-checklist-${moduleNumber}`;
const LOCAL_KNOWN = 'n1-academy-known-terms';
const LOCAL_CHECKLIST_PREFIX = 'n1-academy-checklist-';

function readLocal(): AcademyState {
  const state: AcademyState = { checklists: {}, knownTerms: [] };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LOCAL_CHECKLIST_PREFIX)) {
        state.checklists[key.slice(LOCAL_CHECKLIST_PREFIX.length)] = JSON.parse(localStorage.getItem(key) || '[]');
      }
    }
    state.knownTerms = JSON.parse(localStorage.getItem(LOCAL_KNOWN) || '[]');
  } catch {
    // Storage can be blocked (private mode); start empty.
  }
  return state;
}

function writeLocal(state: AcademyState) {
  try {
    for (const [moduleNumber, done] of Object.entries(state.checklists)) {
      localStorage.setItem(LOCAL_CHECKLIST(moduleNumber), JSON.stringify(done));
    }
    localStorage.setItem(LOCAL_KNOWN, JSON.stringify(state.knownTerms));
  } catch {
    // Ticks then last only for this visit.
  }
}

function clearLocal() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LOCAL_CHECKLIST_PREFIX) || key === LOCAL_KNOWN) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing to clear.
  }
}

const union = <T,>(a: T[], b: T[]) => Array.from(new Set([...a, ...b]));

// One load per page; later saves update this copy so read-modify-write stays consistent.
let cache: { userId: string | null; state: AcademyState } | null = null;
let loading: Promise<AcademyState> | null = null;

async function load(): Promise<AcademyState> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const local = readLocal();
  if (!session) {
    cache = { userId: null, state: local };
    return local;
  }

  const userId = session.user.id;
  const { data, error } = await supabase
    .from('academy_user_state')
    .select('checklists, known_terms')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    // Table missing or offline: fall back to this browser so ticks still work.
    cache = { userId: null, state: local };
    return local;
  }

  const remote: AcademyState = {
    checklists: (data?.checklists as Record<string, number[]>) ?? {},
    knownTerms: (data?.known_terms as string[]) ?? [],
  };
  const hasLocal = local.knownTerms.length > 0 || Object.keys(local.checklists).length > 0;
  const state: AcademyState = hasLocal
    ? {
        checklists: Object.fromEntries(
          union(Object.keys(remote.checklists), Object.keys(local.checklists)).map((m) => [
            m,
            union(remote.checklists[m] ?? [], local.checklists[m] ?? []),
          ])
        ),
        knownTerms: union(remote.knownTerms, local.knownTerms),
      }
    : remote;

  cache = { userId, state };
  if (hasLocal && (await persist(state))) clearLocal();
  return state;
}

export function loadAcademyState(): Promise<AcademyState> {
  if (cache) return Promise.resolve(cache.state);
  loading ??= load().finally(() => { loading = null; });
  return loading;
}

async function persist(state: AcademyState): Promise<boolean> {
  const userId = cache?.userId ?? null;
  cache = { userId, state };
  if (!userId) {
    writeLocal(state);
    return true;
  }
  const { error } = await getSupabase().from('academy_user_state').upsert({
    user_id: userId,
    checklists: state.checklists,
    known_terms: state.knownTerms,
    updated_at: new Date().toISOString(),
  });
  if (error) writeLocal(state);
  return !error;
}

export async function saveChecklist(moduleNumber: string, done: number[]) {
  const state = await loadAcademyState();
  await persist({ ...state, checklists: { ...state.checklists, [moduleNumber]: done } });
}

export async function saveKnownTerms(ids: string[]) {
  const state = await loadAcademyState();
  await persist({ ...state, knownTerms: ids });
}

// Signing in or out switches whose state this is, so reload it next time.
if (typeof window !== 'undefined') {
  try {
    getSupabase().auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') cache = null;
    });
  } catch {
    // Supabase isn't configured; browser storage still works.
  }
}
