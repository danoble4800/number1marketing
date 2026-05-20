'use client';

import Heading from '@/components/Heading';
import { FormData } from './types';

interface Props {
  data: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onChange: (field: keyof FormData, value: string) => void;
}

const inputClass = (error?: string) =>
  `w-full bg-brand-dark2 border ${
    error ? 'border-red-500' : 'border-brand-dark2'
  } text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors`;

const textareaClass = (error?: string) =>
  `w-full bg-brand-dark2 border ${
    error ? 'border-red-500' : 'border-brand-dark2'
  } text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors resize-none`;

const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

const CHANNEL_OPTIONS = ['Slack', 'Email', 'Call', 'Text'];
const BUSINESS_MODELS = ['B2B', 'B2C', 'DTC', 'SaaS', 'Marketplace', 'Agency', 'Other'];
const REVENUE_RANGES = [
  'Pre-revenue', 'Under $100K', '$100K–$500K', '$500K–$1M',
  '$1M–$5M', '$5M–$20M', '$20M+',
];

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

export default function StepOnboarding1({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">Step 02 — Onboarding Form</p>
        <Heading as="h2" size="md" animate={false}>Tell Us Everything</Heading>
        <p className="mt-2 text-brand-light1 text-sm">
          The more you share, the faster we build. Vague answers = vague results.
          Take 10 minutes — be specific.
        </p>
      </div>

      {/* Section 01 — Point of Contact */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">01</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Point of Contact</h3>
        </div>
        <p className="text-brand-light1 text-sm -mt-2">
          Who do we Slack, email, and call? Pick one — too many cooks slows everything down.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              value={data.contactName}
              onChange={(e) => onChange('contactName', e.target.value)}
              placeholder="Jane Smith"
              className={inputClass(errors.contactName)}
            />
            {errors.contactName && <p className="mt-1 text-xs text-red-400">{errors.contactName}</p>}
          </div>
          <div>
            <label className={labelClass}>Job Title / Role</label>
            <input
              type="text"
              value={data.contactTitle}
              onChange={(e) => onChange('contactTitle', e.target.value)}
              placeholder="CEO, Marketing Director, etc."
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email Address *</label>
            <input
              type="email"
              value={data.contactEmail}
              onChange={(e) => onChange('contactEmail', e.target.value)}
              placeholder="jane@company.com"
              className={inputClass(errors.contactEmail)}
            />
            {errors.contactEmail && <p className="mt-1 text-xs text-red-400">{errors.contactEmail}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={data.contactPhone}
              onChange={(e) => onChange('contactPhone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Best Times to Reach</label>
            <input
              type="text"
              value={data.contactBestTimes}
              onChange={(e) => onChange('contactBestTimes', e.target.value)}
              placeholder="Weekdays 9–5 EST"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Decision-Making Authority</label>
            <input
              type="text"
              value={data.contactDecisionMaking}
              onChange={(e) => onChange('contactDecisionMaking', e.target.value)}
              placeholder="Final say / Needs approval from..."
              className={inputClass()}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Preferred Communication Channel</label>
          <SelectButton
            options={CHANNEL_OPTIONS}
            value={data.contactPreferredChannel}
            onChange={(v) => onChange('contactPreferredChannel', v)}
          />
        </div>

        <div>
          <label className={labelClass}>Backup Contact</label>
          <input
            type="text"
            value={data.backupContact}
            onChange={(e) => onChange('backupContact', e.target.value)}
            placeholder="Name, email, or phone — in case primary is unavailable"
            className={inputClass()}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-brand-dark2" />

      {/* Section 02 — Company */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">02</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Your Company</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Legal Company Name *</label>
            <input
              type="text"
              value={data.companyLegalName}
              onChange={(e) => onChange('companyLegalName', e.target.value)}
              placeholder="Acme Corporation LLC"
              className={inputClass(errors.companyLegalName)}
            />
            {errors.companyLegalName && <p className="mt-1 text-xs text-red-400">{errors.companyLegalName}</p>}
          </div>
          <div>
            <label className={labelClass}>DBA / Brand Name</label>
            <input
              type="text"
              value={data.companyDBA}
              onChange={(e) => onChange('companyDBA', e.target.value)}
              placeholder="If different from legal name"
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Industry / Vertical</label>
            <input
              type="text"
              value={data.companyIndustry}
              onChange={(e) => onChange('companyIndustry', e.target.value)}
              placeholder="e.g. SaaS, Real Estate, eCommerce"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Year Founded</label>
            <input
              type="text"
              value={data.companyYearFounded}
              onChange={(e) => onChange('companyYearFounded', e.target.value)}
              placeholder="e.g. 2019"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Team Size</label>
            <input
              type="text"
              value={data.companyTeamSize}
              onChange={(e) => onChange('companyTeamSize', e.target.value)}
              placeholder="e.g. 1–5, 10–50"
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>HQ Location</label>
            <input
              type="text"
              value={data.companyHQ}
              onChange={(e) => onChange('companyHQ', e.target.value)}
              placeholder="City, State / Remote"
              className={inputClass()}
            />
          </div>
          <div>
            <label className={labelClass}>Annual Revenue Range (optional)</label>
            <SelectButton
              options={REVENUE_RANGES}
              value={data.companyRevenue}
              onChange={(v) => onChange('companyRevenue', v)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Business Model</label>
          <SelectButton
            options={BUSINESS_MODELS}
            value={data.companyBusinessModel}
            onChange={(v) => onChange('companyBusinessModel', v)}
          />
        </div>

        <div>
          <label className={labelClass}>In one sentence — what does your company do?</label>
          <input
            type="text"
            value={data.companyOneSentence}
            onChange={(e) => onChange('companyOneSentence', e.target.value)}
            placeholder="We help [WHO] achieve [WHAT] by [HOW]."
            className={inputClass()}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-brand-dark2" />

      {/* Section 03 — Goals */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl text-brand-dark2 leading-none">03</span>
          <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">Your Goals</h3>
        </div>
        <p className="text-brand-light1 text-sm -mt-2">
          "Get more leads" is not a goal. "Triple qualified MQL volume by Q4" is.
        </p>

        <div>
          <label className={labelClass}>Your #1 Goal for the Next 90 Days *</label>
          <textarea
            rows={3}
            value={data.goal90Day}
            onChange={(e) => onChange('goal90Day', e.target.value)}
            placeholder="Be specific — include a number and a deadline."
            className={textareaClass(errors.goal90Day)}
          />
          {errors.goal90Day && <p className="mt-1 text-xs text-red-400">{errors.goal90Day}</p>}
        </div>

        <div>
          <label className={labelClass}>3 Specific Outcomes You Want by End of Engagement</label>
          <textarea
            rows={4}
            value={data.threeOutcomes}
            onChange={(e) => onChange('threeOutcomes', e.target.value)}
            placeholder="1. &#10;2. &#10;3."
            className={textareaClass()}
          />
        </div>

        <div>
          <label className={labelClass}>What's the Biggest Bottleneck Stopping You Today?</label>
          <textarea
            rows={3}
            value={data.bottleneck}
            onChange={(e) => onChange('bottleneck', e.target.value)}
            placeholder="Traffic? Conversion? Retention? Lack of automation? Be honest."
            className={textareaClass()}
          />
        </div>

        <div>
          <label className={labelClass}>If We Exceed Expectations — What Does That Look Like in Numbers?</label>
          <textarea
            rows={3}
            value={data.successMetric}
            onChange={(e) => onChange('successMetric', e.target.value)}
            placeholder="e.g. 300% ROI, 10× organic traffic, 2,000 new subscribers"
            className={textareaClass()}
          />
        </div>
      </div>
    </div>
  );
}
