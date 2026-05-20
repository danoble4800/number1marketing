'use client';

import Heading from '@/components/Heading';
import { FormData } from './types';

interface Props {
  data: FormData;
  onChange: (field: keyof FormData, value: string | string[]) => void;
}

const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

const ACCESS_GROUPS = [
  {
    key: 'websiteAccess' as keyof FormData,
    label: 'Website & Infrastructure',
    items: [
      { id: 'cms', label: 'Website CMS Admin', desc: 'WordPress / Webflow / Shopify — add us as Admin or Editor' },
      { id: 'hosting', label: 'Hosting Account', desc: 'WP Engine / Kinsta / SiteGround — share via vault or add collaborator' },
      { id: 'domain', label: 'Domain Registrar', desc: 'GoDaddy / Namecheap / Cloudflare — read-only DNS access is fine for V1' },
      { id: 'cloudflare', label: 'Cloudflare / CDN', desc: 'If used — add us as a member with appropriate permissions' },
    ],
  },
  {
    key: 'analyticsAccess' as keyof FormData,
    label: 'Analytics & Search',
    items: [
      { id: 'ga4', label: 'Google Analytics 4', desc: 'Add hello@number1digitalmarketing.com as Editor at the property level' },
      { id: 'gsc', label: 'Google Search Console', desc: 'Add as Owner (Settings → Users & Permissions)' },
      { id: 'gtm', label: 'Google Tag Manager', desc: 'Add as Editor or Admin on the container' },
      { id: 'clarity', label: 'Microsoft Clarity / Hotjar', desc: 'If used — invite us as collaborators' },
    ],
  },
  {
    key: 'adsAccess' as keyof FormData,
    label: 'Advertising Accounts',
    items: [
      { id: 'gads', label: 'Google Ads', desc: "Send us your Customer ID — we'll send a link request to accept" },
      { id: 'meta', label: 'Meta Business Manager', desc: "Add our Business as a Partner — we'll send our BM ID" },
      { id: 'li', label: 'LinkedIn Campaign Manager', desc: 'Add hello@number1digitalmarketing.com as Account Manager' },
      { id: 'tiktok', label: 'TikTok Ads Manager', desc: "Send us your Advertiser ID — we'll send a partner request" },
    ],
  },
  {
    key: 'marTechAccess' as keyof FormData,
    label: 'Marketing Tech & Comms',
    items: [
      { id: 'email', label: 'Email Platform', desc: 'Mailchimp / Klaviyo / ActiveCampaign — add as Admin' },
      { id: 'crm', label: 'CRM', desc: 'HubSpot / Salesforce / Pipedrive — user with contact + deal read/write at minimum' },
      { id: 'slack', label: 'Slack / Teams', desc: 'Invite hello@number1digitalmarketing.com to a shared client channel' },
      { id: 'cal', label: 'Calendar / Calendly', desc: 'Share booking links or grant scheduler access' },
    ],
  },
  {
    key: 'socialAccess' as keyof FormData,
    label: 'Social Media',
    items: [
      { id: 'ig', label: 'Instagram (Meta Business Manager)', desc: 'Assign page to your BM, then add us as Partner' },
      { id: 'linkedin', label: 'LinkedIn Company Page', desc: 'Add as Content Admin or Super Admin' },
      { id: 'tiktok_social', label: 'TikTok Business', desc: 'Add hello@number1digitalmarketing.com as a manager' },
      { id: 'x', label: 'X / Twitter', desc: 'Add us as a contributor or team member' },
      { id: 'yt', label: 'YouTube Channel', desc: 'Add as Manager via YouTube Studio → Settings → Permissions' },
    ],
  },
];

function AccessGroup({
  group, selected, onChange,
}: {
  group: typeof ACCESS_GROUPS[0];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange(next);
  };

  const allSelected = group.items.every((i) => selected.includes(i.id));
  const toggleAll = () => {
    onChange(allSelected ? [] : group.items.map((i) => i.id));
  };

  return (
    <div className="border border-brand-dark2">
      <div className="flex items-center justify-between px-5 py-4 bg-brand-dark1 border-b border-brand-dark2">
        <p className="text-xs uppercase tracking-widest text-brand-light2 font-semibold">{group.label}</p>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-brand-mid hover:text-brand-light2 transition-colors"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>
      <div className="divide-y divide-brand-dark2">
        {group.items.map((item) => {
          const checked = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors ${
                checked ? 'bg-brand-dark2' : 'hover:bg-brand-dark1'
              }`}
            >
              <span
                className={`mt-0.5 w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                  checked ? 'border-brand-white bg-brand-white' : 'border-brand-mid'
                }`}
              >
                {checked && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 5.5L8 1" stroke="#0E0E10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${checked ? 'text-brand-white' : 'text-brand-offwhite'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-brand-mid mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StepAccess({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">Step 04 — Access Request</p>
        <Heading as="h2" size="md" animate={false}>Let&apos;s Get Connected</Heading>
        <p className="mt-2 text-brand-light1 text-sm">
          To start building, we need access to a few platforms. Check everything that applies.
          The faster you share access, the faster we ship.
        </p>
      </div>

      {/* Security Note */}
      <div className="bg-brand-dark1 border border-brand-dark2 p-5 flex gap-4">
        <div className="w-8 h-8 bg-brand-dark2 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-light2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <p className="text-brand-offwhite text-sm font-semibold mb-1">Security First</p>
          <p className="text-brand-light1 text-xs leading-relaxed">
            We use <strong className="text-brand-light2">1Password</strong> for all client credentials. After submission, we'll send you a secure shared vault link.
            Never send passwords over email, Slack, or text. Skip anything that doesn't apply — we'll tell you if we need it.
          </p>
        </div>
      </div>

      {/* Access groups */}
      {ACCESS_GROUPS.map((group) => (
        <AccessGroup
          key={group.key}
          group={group}
          selected={(data[group.key] as string[]) ?? []}
          onChange={(v) => onChange(group.key, v)}
        />
      ))}

      {/* Notes */}
      <div>
        <label className={labelClass}>Additional Notes / Questions</label>
        <textarea
          rows={4}
          value={data.accessNotes}
          onChange={(e) => onChange('accessNotes', e.target.value)}
          placeholder="Don't have one of these? Haven't set it up yet? Tell us — we handle creation in many cases."
          className="w-full bg-brand-dark2 border border-brand-dark2 text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors resize-none"
        />
      </div>

      {/* Submit note */}
      <div className="bg-brand-dark1 border border-brand-dark2 p-5">
        <p className="text-brand-light1 text-sm">
          Clicking <strong className="text-brand-white">Submit</strong> sends your completed onboarding to the Number 1 Digital Marketing team.
          We'll review everything within <strong className="text-brand-white">24 hours</strong> and follow up with next steps.
        </p>
      </div>
    </div>
  );
}
