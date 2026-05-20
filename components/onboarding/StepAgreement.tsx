'use client';

import Heading from '@/components/Heading';
import { FormData } from './types';

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
            Number 1 Digital Marketing — Service Agreement
          </p>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto text-brand-light1 text-sm leading-relaxed space-y-5 scrollbar-thin">
          <p className="text-brand-offwhite font-semibold">THE AGREEMENT</p>

          <p>
            This Service Agreement (the "Agreement") is entered into as of the Effective Date set forth above, by and
            between <strong className="text-brand-white">Number 1 Digital Marketing</strong> ("Service Provider," "we," "us," or "our") and the client identified
            above ("Client," "you," or "your"). The parties agree as follows:
          </p>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">1. Services &amp; Scope</p>
            <p>Service Provider will provide digital marketing, AI integration, automation, and related services ("Services") as
            described in the Statement of Work, proposal, onboarding form, or other written description attached to or
            referenced in this Agreement (the "Scope"). Changes to the Scope require a written change order signed
            (electronically or otherwise) by both parties. Out-of-scope work will be quoted separately.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">2. Deliverables</p>
            <p>Service Provider will use commercially reasonable efforts to deliver the Services according to the timelines and
            milestones outlined in the Scope. Client acknowledges that marketing and AI outcomes depend on many factors
            outside Service Provider's control (algorithms, market conditions, client cooperation), and that Service Provider
            does not guarantee specific results, traffic, leads, revenue, or rankings.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">3. Term</p>
            <p>This Agreement begins on the Effective Date and continues until the Services are completed or terminated under
            Section 9. Either party may renew or extend by written agreement. Month-to-month engagements automatically
            renew each calendar month unless either party gives written notice of non-renewal at least fifteen (15) days
            before the next billing cycle.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">4. Fees &amp; Payment</p>
            <p>Client agrees to pay the fees set forth in the Scope. Unless otherwise stated, all fees are in USD, exclusive of
            taxes, and due within fifteen (15) days of invoice date. Late payments accrue interest at 1.5% per month (or the
            maximum allowed by law). Service Provider may pause Services for invoices more than thirty (30) days overdue.
            A non-refundable deposit (typically 50%) is required to commence work; the remainder is due per the schedule in
            the Scope. Ad spend, software licenses, third-party fees, and pass-through costs are billed to Client at cost.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">5. Client Responsibilities</p>
            <p>Client agrees to: (a) provide timely access to platforms, assets, and personnel necessary for Service Provider to
            perform the Services; (b) review and approve deliverables within the timelines agreed; (c) supply accurate
            information, branding assets, and any content required; (d) designate a single point of contact with authority to
            approve decisions. Delays caused by Client may extend timelines without additional cost to Service Provider.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">6. Intellectual Property</p>
            <p>Upon full payment of all fees, Client owns all final deliverables created specifically for Client under this
            Agreement. Service Provider retains ownership of any pre-existing tools, templates, frameworks, or proprietary
            systems used to deliver the Services ("Background IP"). Service Provider may use anonymized project details and
            results for portfolio and marketing purposes unless Client objects in writing within 30 days of project completion.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">7. Confidentiality</p>
            <p>Each party agrees to keep the other's Confidential Information strictly confidential and not to disclose it to third
            parties without prior written consent, except as required by law. "Confidential Information" means any non-public
            information designated as confidential or reasonably understood to be confidential given its nature.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">8. Limitation of Liability</p>
            <p>To the maximum extent permitted by law, Service Provider's total liability to Client shall not exceed the total fees
            paid by Client in the three (3) months preceding the claim. In no event shall Service Provider be liable for
            indirect, incidental, consequential, or punitive damages, even if advised of the possibility of such damages.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">9. Termination</p>
            <p>Either party may terminate this Agreement for convenience with fifteen (15) days written notice. Either party may
            terminate immediately for material breach if the breach is not cured within ten (10) days of written notice. Upon
            termination, Client shall pay for all Services rendered to the date of termination. Non-refundable deposits are
            not returned upon termination.</p>
          </div>

          <div>
            <p className="text-brand-offwhite font-semibold mb-1">10. Governing Law</p>
            <p>This Agreement shall be governed by and construed in accordance with applicable law. The parties agree to
            attempt to resolve any dispute through good-faith negotiation before pursuing formal legal proceedings.</p>
          </div>

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
            By typing your name, you are signing this agreement electronically with the same legal effect as a handwritten signature.
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
            I have read and agree to the Number 1 Digital Marketing Service Agreement in its entirety.
            I confirm I have the authority to sign this agreement on behalf of my company.
          </span>
        </button>
        {errors.agreedToTerms && <p className="text-xs text-red-400">{errors.agreedToTerms}</p>}
      </div>
    </div>
  );
}
