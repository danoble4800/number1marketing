'use client';

import { useState, useEffect } from 'react';
import { getSupabase, getCurrentProfile } from '@/lib/supabase';
import Container from '@/components/Container';
import LeadsCRM from './LeadsCRM';
import OnboardingClients from './OnboardingClients';
import TeamMembers from './TeamMembers';
import CreatorApplications from './CreatorApplications';
import TapCardsAdmin from '@/components/cards/TapCardsAdmin';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1gr4UrY65r2g-dy0IUJFCFIQBUgoX0sQ9_GdmZHccpko/edit';
const DRIVE_URL = 'https://drive.google.com/drive/folders/1cjptMcb6Tk8z48zg_3LoCdlkdq1fMl17';
const ONBOARDING_URL = 'https://number1digitalmarketing.com/en/onboarding';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex-shrink-0 px-4 py-2 text-xs uppercase tracking-widest border border-brand-dark2 text-brand-light1 hover:border-brand-light2 hover:text-brand-white transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy Link'}
    </button>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
      <path d="M10 2L2 10M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DataDestination({
  icon, title, subtitle, items, href, badge,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: string[];
  href: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-brand-dark2 hover:border-brand-light1 transition-colors p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-dark2 flex items-center justify-center flex-shrink-0 text-brand-light2">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-brand-white">{title}</p>
              {badge && (
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-brand-dark2 text-brand-mid border border-brand-dark2">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-brand-mid mt-0.5">{subtitle}</p>
          </div>
        </div>
        <ExternalIcon />
      </div>
      <ul className="flex flex-col gap-1.5 ml-11">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-brand-light1">
            <span className="text-brand-dark2 mt-0.5 flex-shrink-0">→</span>
            {item}
          </li>
        ))}
      </ul>
    </a>
  );
}

function Resources() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10">

      {/* Onboarding Link */}
      <div className="border border-brand-dark2 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand-white" />
          <h2 className="font-display text-lg text-brand-white uppercase tracking-tight">
            Client Onboarding Link
          </h2>
        </div>
        <p className="text-brand-light1 text-sm">
          Send this link to new clients. They complete all 4 steps — agreement, intake form, and access checklist — in one session.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-brand-dark2 border border-brand-dark2 px-4 py-3 text-sm text-brand-light2 font-mono truncate">
            {ONBOARDING_URL}
          </div>
          <CopyButton value={ONBOARDING_URL} />
        </div>
        <a
          href={ONBOARDING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-brand-mid hover:text-brand-light2 transition-colors"
        >
          <ExternalIcon />
          Preview the onboarding wizard
        </a>
      </div>

      {/* Where data goes */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-lg text-brand-white uppercase tracking-tight">
            Where Submissions Go
          </h2>
          <p className="mt-1 text-brand-light1 text-sm">
            Every completed onboarding is saved to the Clients tab, and the signed agreement is emailed to the client and to you.
          </p>
        </div>

        <DataDestination
          href="?tab=clients"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          title="Clients Tab — Client Hub"
          subtitle="One place per client, stored in Supabase"
          badge="Supabase"
          items={[
            'Every onboarding answer, grouped by step',
            'Signed Service Agreement PDF with the full contract text and an audit-trail page',
            'Agreement version, SHA-256 fingerprint of the text, signer IP, browser and timestamp',
            'Countersign button (owner) — sends the fully executed PDF to both parties',
            'Upload other contracts: proposals, statements of work, change orders',
          ]}
        />

        <DataDestination
          href={SHEET_URL}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
          }
          title="Google Sheet & Drive — Archive"
          subtitle="Clients onboarded before the hub launched"
          items={[
            'Onboarding, Signed Agreements and Client Contacts tabs (no longer written to)',
            'Older signed agreement Google Docs live in the Drive folder',
          ]}
        />
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg text-brand-white uppercase tracking-tight">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Google Sheet', desc: 'Older submissions', href: SHEET_URL },
            { label: 'Drive Folder', desc: 'Older signed agreements', href: DRIVE_URL },
            { label: 'Vercel', desc: 'Deployments & logs', href: 'https://vercel.com/dashboard' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 border border-brand-dark2 hover:border-brand-light1 transition-colors px-4 py-3 group"
            >
              <div>
                <p className="text-sm font-semibold text-brand-offwhite group-hover:text-brand-white transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-brand-mid">{link.desc}</p>
              </div>
              <ExternalIcon />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}

// Shareable link to the sales team's NFC lead form. The server only hands it to the
// owner, so for everyone else this renders nothing.
function NfcFormLink() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await getSupabase().auth.getSession();
      if (!session) return;
      const res = await fetch('/api/admin/nfc-link', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = res.ok ? await res.json() : null;
      if (!cancelled && data?.url) setUrl(data.url);
    })().catch(() => {});
    return () => { cancelled = true; };
  }, []);
  if (!url) return null;

  return (
    <div className="mb-8 -mt-5 flex flex-wrap items-center justify-between gap-3 border border-brand-dark2 px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid">NFC Lead Form · Owner only</p>
        <p className="text-sm text-brand-light1">Send to your sales reps. Entries land in the In-person tracker.</p>
      </div>
      <div className="flex items-center gap-2">
        <CopyButton value={url} />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-white text-brand-black px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-brand-offwhite transition-colors"
        >
          Open Form
          <ExternalIcon />
        </a>
      </div>
    </div>
  );
}

type Gate = 'checking' | 'signedOut' | 'admin';
type Tab = 'leads' | 'clients' | 'creators' | 'team' | 'cards' | 'resources';
const TABS: [Tab, string][] = [['leads', 'Leads'], ['clients', 'Clients'], ['creators', 'Creators'], ['team', 'Team'], ['cards', 'Tap Cards'], ['resources', 'Links']];

export default function AdminDashboard({ locale }: { locale: string }) {
  const [gate, setGate] = useState<Gate>('checking');
  const [tab, setTabState] = useState<Tab>('leads');

  // ?tab=cards opens a section directly (old /card/admin links forward here).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    if (TABS.some(([id]) => id === t)) setTabState(t as Tab);
  }, []);
  const setTab = (t: Tab) => {
    setTabState(t);
    const url = new URL(window.location.href);
    if (t === 'leads') url.searchParams.delete('tab'); else url.searchParams.set('tab', t);
    window.history.replaceState(null, '', url);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Uses the same Supabase login as the Academy, so an Academy admin session carries over.
  useEffect(() => {
    let cancelled = false;
    getCurrentProfile().then((profile) => {
      if (cancelled) return;
      // Sales reps have their own dashboard.
      if (profile?.role === 'rep') window.location.replace(`/${locale}/team`);
      else setGate(profile?.role === 'admin' ? 'admin' : 'signedOut');
    });
    return () => { cancelled = true; };
  }, [locale]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const supabase = getSupabase();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) {
      setError('Wrong email or password.');
      setBusy(false);
      return;
    }
    const profile = await getCurrentProfile();
    if (profile?.role === 'rep') {
      window.location.replace(`/${locale}/team`);
      return;
    }
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('That account isn’t an admin.');
      setBusy(false);
      return;
    }
    setPassword('');
    setBusy(false);
    setGate('admin');
  };

  const signOut = async () => {
    await getSupabase().auth.signOut();
    setGate('signedOut');
  };

  const header = (
    <header className="sticky top-0 z-30 border-b border-brand-dark2 bg-brand-black/95 backdrop-blur pt-[env(safe-area-inset-top)]">
      <Container>
        <div className="flex items-center justify-between gap-4 h-14">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-brand-white">N°1</span>
            <span className="hidden sm:block w-px h-4 bg-brand-dark2" />
            <span className="hidden sm:inline text-[11px] uppercase tracking-widest text-brand-light1">Admin</span>
          </div>
          {gate === 'admin' && (
            <nav className="flex min-w-0 gap-1 sm:gap-2 overflow-x-auto" aria-label="Admin sections">
              {TABS.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  aria-current={tab === id ? 'page' : undefined}
                  className={`flex-shrink-0 px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                    tab === id ? 'bg-brand-dark2 text-brand-white' : 'text-brand-light1 hover:text-brand-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}
          {gate === 'admin' ? (
            <button onClick={signOut} className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light2 transition-colors">
              Sign out
            </button>
          ) : (
            <a href={`/${locale}`} className="text-xs uppercase tracking-widest text-brand-mid hover:text-brand-light2 transition-colors">
              Back to site
            </a>
          )}
        </div>
      </Container>
    </header>
  );

  return (
    <div className="min-h-screen bg-brand-near-black">
      {header}
      <Container>
        {gate === 'checking' && <div className="min-h-[60vh]" />}
        {gate === 'signedOut' && (
          <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-sm flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">Admin Access</p>
                <h1 className="font-display text-3xl text-brand-white uppercase tracking-tight">
                  N°1 Portal
                </h1>
                <p className="mt-2 text-sm text-brand-light1">Sign in with your Academy admin account.</p>
              </div>
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="admin-email" className="block text-xs uppercase tracking-widest text-brand-light1 mb-1.5">
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    autoFocus
                    required
                    className="w-full bg-brand-dark2 border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-xs uppercase tracking-widest text-brand-light1 mb-1.5">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    className={`w-full bg-brand-dark2 border ${
                      error ? 'border-red-500' : 'border-brand-dark2'
                    } text-brand-offwhite px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors`}
                  />
                  {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-brand-white text-brand-black px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                >
                  {busy ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        )}
        {gate === 'admin' && (
          <div className="py-8">
            {/* Client onboarding shortcut — shown on every tab */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-brand-dark2 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-mid">Client Onboarding</p>
                <p className="text-sm text-brand-light1">Agreement, intake form and access checklist in one page.</p>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton value={ONBOARDING_URL} />
                <a
                  href={`/${locale}/onboarding`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-white text-brand-black px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-brand-offwhite transition-colors"
                >
                  Open Onboarding
                  <ExternalIcon />
                </a>
              </div>
            </div>
            <NfcFormLink />
            {tab === 'leads' && <LeadsCRM onSignedOut={() => setGate('signedOut')} />}
            {tab === 'clients' && <OnboardingClients onSignedOut={() => setGate('signedOut')} />}
            {tab === 'creators' && <CreatorApplications onSignedOut={() => setGate('signedOut')} />}
            {tab === 'team' && <TeamMembers onSignedOut={() => setGate('signedOut')} />}
            {tab === 'cards' && <TapCardsAdmin />}
            {tab === 'resources' && <div className="py-4"><Resources /></div>}
          </div>
        )}
      </Container>
    </div>
  );
}
