'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'N1Admin2026!';
const SESSION_KEY = 'n1_admin_unlocked';

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

function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10 py-12">

      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-3">Admin Portal</p>
        <h1 className="font-display text-4xl sm:text-5xl text-brand-white uppercase tracking-tight leading-none">
          N°1 Dashboard
        </h1>
        <p className="mt-3 text-brand-light1 text-sm">
          Manage client onboarding, access submissions, and review signed agreements.
        </p>
      </div>

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
            Every completed onboarding writes to all four destinations simultaneously.
          </p>
        </div>

        <DataDestination
          href={`${SHEET_URL}#gid=0`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
          }
          title="Onboarding Tab — Google Sheet"
          subtitle="Full form data, 60+ fields per client"
          items={[
            'Step 1 — Service Agreement: company, address, contact, email, signature, date',
            'Step 2 — Point of Contact: name, title, phone, preferred channel, backup contact',
            'Step 2 — Company: legal name, industry, revenue, business model, team size, one-sentence',
            'Step 2 — Goals: 90-day goal, outcomes, bottleneck, success metric',
            'Step 3 — Website: URL, traffic, CMS, hosting, domain registrar, top source, conversion rate',
            'Step 3 — Competition: 3 competitors with names, URLs, threats, and weaknesses',
            'Step 3 — Marketing Stack: all selected tools + any extras',
            'Step 4 — Access Checklist: all platform checkboxes + notes',
          ]}
        />

        <DataDestination
          href={SHEET_URL}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
          }
          title="Signed Agreements Tab — Google Sheet"
          subtitle="Formatted agreement record per client, with legal statement"
          items={[
            'Agreement number, date signed, submitted timestamp',
            'Client company, address, contact, email, phone',
            'Digital signature name + acceptance confirmation',
            'ISO timestamp and legal binding statement',
            '90-day goal summary',
          ]}
        />

        <DataDestination
          href={SHEET_URL}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          title="Client Contacts Tab — Google Sheet"
          subtitle="Quick-reference follow-up list — one row per client"
          items={[
            'Date added, company name, contact name',
            'Email, phone, website URL',
            'Industry, HQ location',
          ]}
        />

        <DataDestination
          href={DRIVE_URL}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
          title="N1 Marketing — Signed Agreements — Google Drive"
          subtitle="One Google Doc per client, auto-created on submission"
          badge="Google Drive"
          items={[
            'Formatted Google Doc with company letterhead styling',
            'Client info, digital signature, ISO timestamp',
            'Full legal binding statement',
            'Named: "Service Agreement — [Company] — [Date]"',
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
            { label: 'Google Sheet', desc: 'All submissions', href: SHEET_URL },
            { label: 'Drive Folder', desc: 'Signed agreements', href: DRIVE_URL },
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

export default function AdminDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (checking) return null;

  if (!unlocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-mid mb-2">Admin Access</p>
            <h1 className="font-display text-3xl text-brand-white uppercase tracking-tight">
              N°1 Portal
            </h1>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-light1 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                autoFocus
                className={`w-full bg-brand-dark2 border ${
                  error ? 'border-red-500' : 'border-brand-dark2'
                } text-brand-offwhite px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors`}
                placeholder="Enter admin password"
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-400">Incorrect password.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-white text-brand-black px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
