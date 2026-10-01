// The Service Agreement text, one entry per published version.
//
// NEVER edit the wording of a version once clients have signed it. Every signed
// agreement stores this exact text and a SHA-256 fingerprint of it, and the server
// refuses to record a signature if a version's text no longer matches what earlier
// clients signed. To change the contract: copy the latest version, give it a new
// `version` id, edit the copy, and point CURRENT_AGREEMENT at it.
//
// Shared by the onboarding form (what the client reads) and /api/onboarding (what
// gets stored and printed in the signed PDF), so the two can't drift apart.

export type AgreementVersion = {
  version: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  // The checkbox statement the client ticks, and the note under the signature box.
  acceptance: string;
  signatureNotice: string;
};

export const PROVIDER_NAME = 'Number 1 Digital Marketing';

const V1: AgreementVersion = {
  version: 'service-agreement-v1',
  title: 'Number 1 Digital Marketing — Service Agreement',
  intro:
    'This Service Agreement (the "Agreement") is entered into as of the Effective Date set forth above, by and ' +
    'between Number 1 Digital Marketing ("Service Provider," "we," "us," or "our") and the client identified ' +
    'above ("Client," "you," or "your"). The parties agree as follows:',
  sections: [
    {
      heading: '1. Services & Scope',
      body:
        'Service Provider will provide digital marketing, AI integration, automation, and related services ("Services") as ' +
        'described in the Statement of Work, proposal, onboarding form, or other written description attached to or ' +
        'referenced in this Agreement (the "Scope"). Changes to the Scope require a written change order signed ' +
        '(electronically or otherwise) by both parties. Out-of-scope work will be quoted separately.',
    },
    {
      heading: '2. Deliverables',
      body:
        'Service Provider will use commercially reasonable efforts to deliver the Services according to the timelines and ' +
        'milestones outlined in the Scope. Client acknowledges that marketing and AI outcomes depend on many factors ' +
        "outside Service Provider's control (algorithms, market conditions, client cooperation), and that Service Provider " +
        'does not guarantee specific results, traffic, leads, revenue, or rankings.',
    },
    {
      heading: '3. Term',
      body:
        'This Agreement begins on the Effective Date and continues until the Services are completed or terminated under ' +
        'Section 9. Either party may renew or extend by written agreement. Month-to-month engagements automatically ' +
        'renew each calendar month unless either party gives written notice of non-renewal at least fifteen (15) days ' +
        'before the next billing cycle.',
    },
    {
      heading: '4. Fees & Payment',
      body:
        'Client agrees to pay the fees set forth in the Scope. Unless otherwise stated, all fees are in USD, exclusive of ' +
        'taxes, and due within fifteen (15) days of invoice date. Late payments accrue interest at 1.5% per month (or the ' +
        'maximum allowed by law). Service Provider may pause Services for invoices more than thirty (30) days overdue. ' +
        'A non-refundable deposit (typically 50%) is required to commence work; the remainder is due per the schedule in ' +
        'the Scope. Ad spend, software licenses, third-party fees, and pass-through costs are billed to Client at cost.',
    },
    {
      heading: '5. Client Responsibilities',
      body:
        'Client agrees to: (a) provide timely access to platforms, assets, and personnel necessary for Service Provider to ' +
        'perform the Services; (b) review and approve deliverables within the timelines agreed; (c) supply accurate ' +
        'information, branding assets, and any content required; (d) designate a single point of contact with authority to ' +
        'approve decisions. Delays caused by Client may extend timelines without additional cost to Service Provider.',
    },
    {
      heading: '6. Intellectual Property',
      body:
        'Upon full payment of all fees, Client owns all final deliverables created specifically for Client under this ' +
        'Agreement. Service Provider retains ownership of any pre-existing tools, templates, frameworks, or proprietary ' +
        'systems used to deliver the Services ("Background IP"). Service Provider may use anonymized project details and ' +
        'results for portfolio and marketing purposes unless Client objects in writing within 30 days of project completion.',
    },
    {
      heading: '7. Confidentiality',
      body:
        "Each party agrees to keep the other's Confidential Information strictly confidential and not to disclose it to third " +
        'parties without prior written consent, except as required by law. "Confidential Information" means any non-public ' +
        'information designated as confidential or reasonably understood to be confidential given its nature.',
    },
    {
      heading: '8. Limitation of Liability',
      body:
        "To the maximum extent permitted by law, Service Provider's total liability to Client shall not exceed the total fees " +
        'paid by Client in the three (3) months preceding the claim. In no event shall Service Provider be liable for ' +
        'indirect, incidental, consequential, or punitive damages, even if advised of the possibility of such damages.',
    },
    {
      heading: '9. Termination',
      body:
        'Either party may terminate this Agreement for convenience with fifteen (15) days written notice. Either party may ' +
        'terminate immediately for material breach if the breach is not cured within ten (10) days of written notice. Upon ' +
        'termination, Client shall pay for all Services rendered to the date of termination. Non-refundable deposits are ' +
        'not returned upon termination.',
    },
    {
      heading: '10. Governing Law',
      body:
        'This Agreement shall be governed by and construed in accordance with applicable law. The parties agree to ' +
        'attempt to resolve any dispute through good-faith negotiation before pursuing formal legal proceedings.',
    },
  ],
  acceptance:
    'I have read and agree to the Number 1 Digital Marketing Service Agreement in its entirety. ' +
    'I confirm I have the authority to sign this agreement on behalf of my company.',
  signatureNotice:
    'By typing your name, you are signing this agreement electronically with the same legal effect as a handwritten signature.',
};

export const AGREEMENTS: Record<string, AgreementVersion> = { [V1.version]: V1 };
export const CURRENT_AGREEMENT = V1;

// The exact text that is fingerprinted and stored with each signature.
export function agreementText(a: AgreementVersion): string {
  return [
    a.title,
    a.intro,
    ...a.sections.map((s) => `${s.heading}\n${s.body}`),
    `Acceptance statement: ${a.acceptance}`,
    `Signature notice: ${a.signatureNotice}`,
  ].join('\n\n');
}
