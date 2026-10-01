'use client';

import Heading from '@/components/Heading';
import { FormData } from './types';
import { CURRENT_AGREEMENT, PROVIDER_NAME } from '@/lib/agreements';

interface Props {
  data: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onChange: (field: keyof FormData, value: string | boolean) => void;
}

const inputClass = (error?: string) =>
  `w-full bg-brand-dark2 border ${
    error ? 'border-red-500' : 'border-brand-dark2'
  } text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors`;

const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

export default function StepAgreement({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">Step 01 — Legal</p>
        <Heading as="h2" size="md" animate={false}>Service Agreement</Heading>
        <p className="mt-2 text-brand-light1 text-sm">
          Read the agreement below, fill in your details, and sign digitally to proceed.
        </p>
      </div>

      {/* Client Details */}
      <div className="border border-brand-dark2 p-6 flex flex-col gap-5">
        <p className="text-xs uppercase tracking-widest text-brand-mid">Your Information</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name *</label>
            <input
              type="text"
              value={data.clientCompany}
              onChange={(e) => onChange('clientCompany', e.target.value)}
              placeholder="Acme Corp"
              className={inputClass(errors.clientCompany)}
            />
            {errors.clientCompany && <p className="mt-1 text-xs text-red-400">{errors.clientCompany}</p>}
          </div>
          <div>
            <label className={labelClass}>Full Address</label>
            <input
              type="text"
              value={data.clientAddress}
              onChange={(e) => onChange('clientAddress', e.target.value)}
              placeholder="123 Main St, City, State ZIP"
              className={inputClass()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Contact Name *</label>
            <input
              type="text"
              value={data.clientContact}
              onChange={(e) => onChange('clientContact', e.target.value)}
              placeholder="Jane Smith"
              className={inputClass(errors.clientContact)}
            />
            {errors.clientContact && <p className="mt-1 text-xs text-red-400">{errors.clientContact}</p>}
          </div>
          <div>
            <label className={labelClass}>Contact Email *</label>
            <input
              type="email"
              value={data.clientEmail}
              onChange={(e) => onChange('clientEmail', e.target.value)}
              placeholder="jane@yourcompany.com"
              className={inputClass(errors.clientEmail)}
            />
            {errors.clientEmail && <p className="mt-1 text-xs text-red-400">{errors.clientEmail}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Effective Date</label>
          <input
            type="text"
            value={data.effectiveDate}
            readOnly
            className="w-full bg-brand-dark1 border border-brand-dark2 text-brand-mid px-4 py-3 text-sm cursor-default"
          />
        </div>
      </div>

      {/* Agreement Text */}
      <div className="border border-brand-dark2">
        <div className="bg-brand-dark1 px-6 py-3 border-b border-brand-dark2">
          <p className="text-xs uppercase tracking-widest text-brand-light1">
            {CURRENT_AGREEMENT.title}
          </p>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto text-brand-light1 text-sm leading-relaxed space-y-5 scrollbar-thin">
          <p className="text-brand-offwhite font-semibold">THE AGREEMENT</p>

          <p>
            {CURRENT_AGREEMENT.intro.split(PROVIDER_NAME).map((part, i) => (
              <span key={i}>
                {i > 0 && <strong className="text-brand-white">{PROVIDER_NAME}</strong>}
                {part}
              </span>
            ))}
          </p>

          {CURRENT_AGREEMENT.sections.map((s) => (
            <div key={s.heading}>
              <p className="text-brand-offwhite font-semibold mb-1">{s.heading}</p>
              <p>{s.body}</p>
            </div>
          ))}

          <p className="text-brand-mid text-xs pt-2">
            number1digitalmarketing.com · hello@number1digitalmarketing.com · @number1marketing
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="border border-brand-dark2 p-6 flex flex-col gap-5">
        <p className="text-xs uppercase tracking-widest text-brand-mid">Digital Signature</p>

        <div>
          <label className={labelClass}>Type Your Full Legal Name to Sign *</label>
          <input
            type="text"
            value={data.signatureName}
            onChange={(e) => onChange('signatureName', e.target.value)}
            placeholder="Jane Smith"
            className={`${inputClass(errors.signatureName)} font-display text-xl tracking-wide`}
          />
          {errors.signatureName && <p className="mt-1 text-xs text-red-400">{errors.signatureName}</p>}
          <p className="mt-1 text-xs text-brand-mid">
            {CURRENT_AGREEMENT.signatureNotice}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange('agreedToTerms', !data.agreedToTerms)}
          className={`flex items-start gap-3 text-left w-full`}
        >
          <span
            className={`mt-0.5 w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
              data.agreedToTerms
                ? 'border-brand-white bg-brand-white'
                : 'border-brand-mid bg-brand-dark2'
            }`}
          >
            {data.agreedToTerms && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1" stroke="#0E0E10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-sm text-brand-light2 leading-relaxed">
            {CURRENT_AGREEMENT.acceptance}
          </span>
        </button>
        {errors.agreedToTerms && <p className="text-xs text-red-400">{errors.agreedToTerms}</p>}
      </div>
    </div>
  );
}
