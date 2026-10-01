'use client';

import { useEffect, useState } from 'react';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import Container from '@/components/Container';
import LeadsCRM from '@/components/admin/LeadsCRM';
import TapCardsTeam from '@/components/cards/TapCardsTeam';

type Gate = 'checking' | 'signedOut' | 'rep' | 'admin';
type Tab = 'leads' | 'cards';
const TABS: [Tab, string][] = [['leads', 'Leads'], ['cards', 'Tap Cards']];

const inputClass =
  'w-full bg-brand-dark2 border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors';
const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

// /team: a sales rep's own leads and tap cards. Same Supabase login as /admin.
// Admins can open it too and pick a rep to see exactly what that rep sees.
export default function TeamDashboard({ locale }: { locale: string }) {
  const [gate, setGate] = useState<Gate>('checking');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [reps, setReps] = useState<{ id: string; name: string }[]>([]);
  const [viewAs, setViewAs] = useState(''); // rep id, when an admin is looking
  const [tab, setTabState] = useState<Tab>('leads');

  // ?tab=cards opens Tap Cards directly.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('tab') === 'cards') setTabState('cards');
  }, []);
  const setTab = (t: Tab) => {
    setTabState(t);
    const url = new URL(window.location.href);
    if (t === 'leads') url.searchParams.delete('tab'); else url.searchParams.set('tab', t);
    window.history.replaceState(null, '', url);
  };

  const enter = (role?: string) => {
    if (role === 'rep') setGate('rep');
    else if (role === 'admin') setGate('admin');
    else setGate('signedOut');
  };

  useEffect(() => {
    let cancelled = false;
    getCurrentProfile().then((profile) => { if (!cancelled) enter(profile?.role); });
    return () => { cancelled = true; };
  }, []);

  // Admins: load the list of reps to pick from (admins can read every profile).
  useEffect(() => {
    if (gate !== 'admin') return;
    getSupabase().from('profiles').select('*').eq('role', 'rep').then(({ data }) => {
      const list = ((data ?? []) as { id: string; rep_name?: string; full_name?: string }[])
        .map((p) => ({ id: p.id, name: (p.rep_name || p.full_name || '').split(',')[0].trim() }))
        .filter((r) => r.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      setReps(list);
      setViewAs((v) => v || list[0]?.id || '');
    });
  }, [gate]);
  const viewing = reps.find((r) => r.id === viewAs);

  // Team sign-up is separate from the Academy's: only emails Dan has added to
  // team_invites can create an account, and those accounts are reps from the start.
  const signUp = async () => {
    const supabase = getSupabase();
    const cleanEmail = email.trim().toLowerCase();
    const { data: invited, error: inviteError } = await supabase.rpc('team_invite_open', { p_email: cleanEmail });
    if (inviteError) return setError('Couldn’t check the team list. Try again.');
    if (!invited) return setError('That email isn’t on the team list. Ask Dan to add you.');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/${locale}/team` },
    });
    if (signUpError) return setError(signUpError.message);
    // Supabase hides whether an email is taken: an existing address comes back with no identities.
    if (data.user && data.user.identities?.length === 0) {
      setMode('signin');
      return setError('You already have an account. Sign in, or use Forgot password.');
    }
    setPassword('');
    if (!data.session) {
      setMode('signin');
      return setMessage('Check your email and tap the link to confirm, then sign in here.');
    }
    enter((await getCurrentProfile())?.role);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    if (mode === 'signup') {
      await signUp();
      setBusy(false);
      return;
    }
    const supabase = getSupabase();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) {
      setError(signInError.message.toLowerCase().includes('not confirmed')
        ? 'Confirm your email first. Check your inbox for the link.'
        : 'Wrong email or password.');
      setBusy(false);
      return;
    }
    const profile = await getCurrentProfile();
    if (profile?.role !== 'rep' && profile?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('That account isn’t set up for the team yet. Ask Dan to add you.');
      setBusy(false);
      return;
    }
    setPassword('');
    setBusy(false);
    enter(profile.role);
  };

  const forgot = async () => {
    if (!email.trim()) {
      setError('Type your email first, then tap “Forgot password”.');
      return;
    }
    setError('');
    await getSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/${locale}/academy/reset-password`,
    });
    setMessage('If that email has an account, a reset link is on its way.');
  };

  const signOut = async () => {
    await getSupabase().auth.signOut();
    setGate('signedOut');
  };

  return (
    <div className="min-h-screen bg-brand-near-black">
      <header className="sticky top-0 z-30 border-b border-brand-dark2 bg-brand-black/95 backdrop-blur pt-[env(safe-area-inset-top)]">
        <Container>
          <div className="flex items-center justify-between gap-4 h-14">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl text-brand-white">N°1</span>
              <span className="hidden sm:block w-px h-4 bg-brand-dark2" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-widest text-brand-light1">Team</span>
            </div>
            {(gate === 'rep' || gate === 'admin') && (
              <nav className="flex gap-1 sm:gap-2" aria-label="Team sections">
                {TABS.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    aria-current={tab === id ? 'page' : undefined}
                    className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                      tab === id ? 'bg-brand-dark2 text-brand-white' : 'text-brand-light1 hover:text-brand-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            )}
            {gate === 'rep' || gate === 'admin' ? (
              <div className="flex items-center gap-4">
                {gate === 'admin' && (
                  <a href={`/${locale}/admin`} className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light2 transition-colors">
                    Admin
                  </a>
                )}
                <button onClick={signOut} className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light2 transition-colors">
                  Sign out
                </button>
              </div>
            ) : (
              <a href={`/${locale}`} className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light2 transition-colors">
                Back to site
              </a>
            )}
          </div>
        </Container>
      </header>

      <Container>
        {gate === 'checking' && <div className="min-h-[60vh]" />}

        {gate === 'signedOut' && (
          <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-sm flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">Sales Team</p>
                <h1 className="font-display text-3xl text-brand-white uppercase tracking-tight">
                  {mode === 'signup' ? 'Create account' : 'My Leads'}
                </h1>
                <p className="mt-2 text-sm text-brand-light1">
                  {mode === 'signup'
                    ? 'For Number 1 sales team members. Use the email Dan added to the team.'
                    : 'Sign in to see the leads you’ve logged.'}
                </p>
              </div>
              <form onSubmit={submit} className="flex flex-col gap-4">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="team-name" className={labelClass}>Full name</label>
                    <input
                      id="team-name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="team-email" className={labelClass}>Email</label>
                  <input
                    id="team-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    autoFocus
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="team-password" className={labelClass}>Password</label>
                  <input
                    id="team-password"
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    minLength={mode === 'signup' ? 8 : undefined}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                  />
                  {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
                  {message && <p className="mt-1.5 text-xs text-brand-light2">{message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-brand-white text-brand-black px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                >
                  {busy
                    ? (mode === 'signup' ? 'Creating account…' : 'Signing in…')
                    : (mode === 'signup' ? 'Create account' : 'Sign in')}
                </button>
                <div className="flex items-center justify-between gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setMessage(''); }}
                    className="text-brand-light1 hover:text-brand-white underline underline-offset-4"
                  >
                    {mode === 'signup' ? 'Have an account? Sign in' : 'New to the team? Create account'}
                  </button>
                  {mode === 'signin' && (
                    <button type="button" onClick={forgot} className="text-brand-light1 hover:text-brand-white underline underline-offset-4">
                      Forgot password?
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {gate === 'rep' && (
          <div className="py-8">
            {tab === 'leads' && <LeadsCRM team={{}} onSignedOut={() => setGate('signedOut')} />}
            {tab === 'cards' && <TapCardsTeam />}
          </div>
        )}

        {gate === 'admin' && (
          <div className="py-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border border-brand-dark2 px-4 py-3">
              <p className="text-sm text-brand-light1">
                {reps.length
                  ? 'You’re viewing a rep’s dashboard exactly as they see it.'
                  : 'No reps yet. Run supabase/team.sql and set each rep’s role to “rep”.'}
              </p>
              {reps.length > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="team-view-as" className="text-xs uppercase tracking-widest text-brand-mid">View as</label>
                  <select
                    id="team-view-as"
                    value={viewAs}
                    onChange={(e) => setViewAs(e.target.value)}
                    className="bg-brand-dark1 border border-brand-dark2 text-brand-offwhite px-3 py-2 text-sm"
                  >
                    {reps.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            {viewing && tab === 'leads' && <LeadsCRM key={viewing.id} team={{ rep: viewing.name }} onSignedOut={() => setGate('signedOut')} />}
            {viewing && tab === 'cards' && <TapCardsTeam key={viewing.id} repId={viewing.id} />}
          </div>
        )}
      </Container>
    </div>
  );
}
