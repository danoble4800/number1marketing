'use client';

import Heading from '@/components/Heading';
import { FormData } from './types';

interface Props {
  data: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onChange: (field: keyof FormData, value: string | string[]) => void;
}

const inputClass = () =>
  'w-full bg-brand-dark2 border border-brand-dark2 text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors';

const textareaClass = () =>
  'w-full bg-brand-dark2 border border-brand-dark2 text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors resize-none';

const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

const TRAFFIC_SOURCES = ['Google Organic', 'Google Ads', 'Social Media', 'Referral', 'Direct', 'Email'];

const STACK_OPTIONS = [
  'Google Analytics', 'Google Ads', 'Google Search Console', 'Meta Business Manager',
  'LinkedIn Ads', 'TikTok Ads', 'Mailchimp / Klaviyo / ESP',
  'HubSpot / Salesforce / CRM', 'Webflow / WordPress / Shopify',
  'Notion / ClickUp / Asana', 'Slack / Teams',
  'Zapier / Make / n8n', 'Calendly / Cal.com',
  'ChatGPT / Claude (Pro)',
];

function MultiToggle({
  options, selected, onChange,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`flex items-center gap-2 px-3 py-2 text-xs border transition-colors ${
              active
                ? 'border-brand-white bg-brand-white text-brand-black'
                : 'border-brand-dark2 text-brand-light1 hover:border-brand-light1 hover:text-brand-offwhite'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center ${
                active ? 'border-brand-black' : 'border-brand-mid'
              }`}
            >
              {active && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3 5.5L8 1" stroke="#0E0E10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SelectButton({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? '' : opt)}
          className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
            value === opt
              ? 'border-brand-white bg-brand-white text-brand-black'
              : 'border-brand-dark2 text-brand-light1 hover:border-brand-light1 hover:text-brand-offwhite'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CompetitorBlock({
  num, nameKey, urlKey, threatsKey, weaknessKey, data, onChange,
}: {
  num: number;
  nameKey: keyof FormData;
  urlKey: keyof FormData;
  threatsKey: keyof FormData;
  weaknessKey: keyof FormData;
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="border border-brand-dark2 p-5 flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-brand-mid">Competitor {num}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company Name</label>
          <input
            type="text"
            value={String(data[nameKey])}
            onChange={(e) => onChange(nameKey, e.target.value)}
            placeholder="Their company name"
            className={inputClass()}
          />
        </div>
        <div>
          <label className={labelClass}>Website URL</label>
          <input
            type="url"
            value={String(data[urlKey])}
            onChange={(e) => onChange(urlKey, e.target.value)}
            placeholder="https://their-site.com"
            className={inputClass()}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>What Makes Them Threatening?</label>
          <textarea
            rows={2}
            value={String(data[threatsKey])}
            onChange={(e) => onChange(threatsKey, e.target.value)}
            placeholder="Brand, pricing, SEO, reach..."
            className={textareaClass()}
          />
        </div>
        <div>
          <label className={labelClass}>What's Their Weakness?</label>
          <textarea
            rows={2}
            value={String(data[weaknessKey])}
            onChange={(e) => onChange(weaknessKey, e.target.value)}
            placeholder="Slow site, weak content, poor reviews..."
            className={textareaClass()}
          />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StepOnboarding2({ data, errors: _errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">Step 03 — Onboarding Form Cont&apos;d</p>
        <Heading as="h2" size="md" animate={false}>Website, Competition &amp; Stack</Heading>
        <p className="mt-2 text-brand-light1 text-sm">
          Help us understand your digital footprint and who you're up against.
        </p>
      </div>

      {/* Section 04 — Website */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">04</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Your Website</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Website URL</label>
            <input
              type="url"
              value={data.websiteURL}
              onChange={(e) => onChange('websiteURL', e.target.value)}
              placeholder="https://yoursite.com"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Monthly Traffic (rough estimate)</label>
            <input
              type="text"
              value={data.websiteTraffic}
              onChange={(e) => onChange('websiteTraffic', e.target.value)}
              placeholder="e.g. ~500, 5K, 50K+"
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>CMS / Platform</label>
            <input
              type="text"
              value={data.websiteCMS}
              onChange={(e) => onChange('websiteCMS', e.target.value)}
              placeholder="WordPress, Webflow, Shopify..."
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Hosting Provider</label>
            <input
              type="text"
              value={data.websiteHosting}
              onChange={(e) => onChange('websiteHosting', e.target.value)}
              placeholder="WP Engine, Kinsta, Vercel..."
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Domain Registrar</label>
            <input
              type="text"
              value={data.websiteDomainRegistrar}
              onChange={(e) => onChange('websiteDomainRegistrar', e.target.value)}
              placeholder="GoDaddy, Namecheap, Cloudflare..."
              className={inputClass()}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Top Traffic Source</label>
          <SelectButton
            options={TRAFFIC_SOURCES}
            value={data.websiteTopTraffic}
            onChange={(v) => onChange('websiteTopTraffic', v)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Conversion Rate (if known)</label>
            <input
              type="text"
              value={data.websiteConversionRate}
              onChange={(e) => onChange('websiteConversionRate', e.target.value)}
              placeholder="e.g. 2.3%"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Other Active Domains / Landing Pages</label>
            <input
              type="text"
              value={data.websiteOtherDomains}
              onChange={(e) => onChange('websiteOtherDomains', e.target.value)}
              placeholder="e.g. promo.yoursite.com"
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>What Do You Like About Your Current Site?</label>
            <textarea
              rows={3}
              value={data.websiteLikes}
              onChange={(e) => onChange('websiteLikes', e.target.value)}
              placeholder="Design, speed, content..."
              className={textareaClass()}
            />
          </div>
          <div>
            <label className={labelClass}>What Do You Hate About It?</label>
            <textarea
              rows={3}
              value={data.websiteHates}
              onChange={(e) => onChange('websiteHates', e.target.value)}
              placeholder="Slow, outdated, hard to update..."
              className={textareaClass()}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-brand-dark2" />

      {/* Section 05 — Competition */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">05</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Your Competition</h3>
        </div>
        <p className="text-brand-light1 text-sm -mt-2">
          List 3 competitors you want to outperform. We'll benchmark against them and find the gaps.
        </p>

        <CompetitorBlock
          num={1}
          nameKey="competitor1Name" urlKey="competitor1URL"
          threatsKey="competitor1Threats" weaknessKey="competitor1Weakness"
          data={data} onChange={onChange as (field: keyof FormData, value: string) => void}
        />
        <CompetitorBlock
          num={2}
          nameKey="competitor2Name" urlKey="competitor2URL"
          threatsKey="competitor2Threats" weaknessKey="competitor2Weakness"
          data={data} onChange={onChange as (field: keyof FormData, value: string) => void}
        />
        <CompetitorBlock
          num={3}
          nameKey="competitor3Name" urlKey="competitor3URL"
          threatsKey="competitor3Threats" weaknessKey="competitor3Weakness"
          data={data} onChange={onChange as (field: keyof FormData, value: string) => void}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-brand-dark2" />

      {/* Section 06 — Marketing Stack */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">06</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Your Marketing Stack</h3>
        </div>
        <p className="text-brand-light1 text-sm -mt-2">
          Check all that apply — helps us understand what's already in place.
        </p>

        <MultiToggle
          options={STACK_OPTIONS}
          selected={data.marketingStack}
          onChange={(v) => onChange('marketingStack', v)}
        />

        <div>
          <label className={labelClass}>Anything Else in Your Stack?</label>
          <input
            type="text"
            value={data.marketingStackOther}
            onChange={(e) => onChange('marketingStackOther', e.target.value)}
            placeholder="Other tools, platforms, or integrations"
            className={inputClass()}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-brand-dark2" />

      {/* Section 07 — Anything Else */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">07</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Anything Else?</h3>
        </div>
        <p className="text-brand-light1 text-sm -mt-2">
          Past agencies that failed you, sensitive topics, internal politics, weird quirks — the more we know upfront, the better.
        </p>

        <div>
          <label className={labelClass}>Tell Us What's on Your Mind</label>
          <textarea
            rows={5}
            value={data.additionalInfo}
            onChange={(e) => onChange('additionalInfo', e.target.value)}
            placeholder="Anything we should know before we start..."
            className={textareaClass()}
          />
        </div>

        <div>
          <label className={labelClass}>Sign-Off Name</label>
          <input
            type="text"
            value={data.signoffName}
            onChange={(e) => onChange('signoffName', e.target.value)}
            placeholder="Your full name"
            className={inputClass()}
          />
        </div>
      </div>
    </div>
  );
}
