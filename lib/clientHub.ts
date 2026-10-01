import { createHash, randomBytes } from 'crypto';
import { Resend } from 'resend';
import { PROVIDER_NAME } from '@/lib/agreements';

// Shared by /api/onboarding and the /api/admin/clients routes.

export const CLIENT_FILES_BUCKET = 'client-files';

export const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

// N1-20260930-7F3A9C: date signed plus a random suffix.
export function newAgreementNumber(now = new Date()) {
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  return `N1-${day}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

export function requestIp(req: Request) {
  return (req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? '').trim();
}

export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'client';

// How the onboarding answers are grouped in the admin hub, in form order: [form field, label].
export const ONBOARDING_SECTIONS: [string, [string, string][]][] = [
  ['Service Agreement', [
    ['clientCompany', 'Client Company'], ['clientAddress', 'Client Address'], ['clientContact', 'Client Contact'],
    ['clientEmail', 'Client Email'], ['signatureName', 'Signature Name'], ['effectiveDate', 'Effective Date'],
  ]],
  ['Point of Contact', [
    ['contactName', 'Contact Name'], ['contactTitle', 'Contact Title'], ['contactEmail', 'Contact Email'],
    ['contactPhone', 'Contact Phone'], ['contactBestTimes', 'Best Times'], ['contactDecisionMaking', 'Decision Making'],
    ['contactPreferredChannel', 'Preferred Channel'], ['backupContact', 'Backup Contact'],
  ]],
  ['Company', [
    ['companyLegalName', 'Legal Name'], ['companyIndustry', 'Industry'], ['companyYearFounded', 'Year Founded'],
    ['companyDBA', 'DBA'], ['companyBusinessModel', 'Business Model'], ['companyRevenue', 'Revenue Range'],
    ['companyTeamSize', 'Team Size'], ['companyHQ', 'HQ Location'], ['companyOneSentence', 'One Sentence'],
  ]],
  ['Goals', [
    ['goal90Day', '90-Day Goal'], ['threeOutcomes', 'Three Outcomes'], ['bottleneck', 'Bottleneck'],
    ['successMetric', 'Success Metric'],
  ]],
  ['Website', [
    ['websiteURL', 'Website URL'], ['websiteTraffic', 'Monthly Traffic'], ['websiteCMS', 'CMS Platform'],
    ['websiteTopTraffic', 'Top Traffic Source'], ['websiteHosting', 'Hosting Provider'],
    ['websiteDomainRegistrar', 'Domain Registrar'], ['websiteConversionRate', 'Conversion Rate'],
    ['websiteOtherDomains', 'Other Domains'], ['websiteLikes', 'Site Likes'], ['websiteHates', 'Site Hates'],
  ]],
  ['Competition', [1, 2, 3].flatMap((n) =>
    (['Name', 'URL', 'Threats', 'Weakness'] as const).map((f): [string, string] => [`competitor${n}${f}`, `Competitor ${n} ${f}`]),
  )],
  ['Marketing Stack', [
    ['marketingStack', 'Marketing Stack'], ['marketingStackOther', 'Stack Other'], ['additionalInfo', 'Additional Info'],
    ['signoffName', 'Signoff Name'],
  ]],
  ['Platform Access', [
    ['websiteAccess', 'Website Access'], ['analyticsAccess', 'Analytics Access'], ['adsAccess', 'Ads Access'],
    ['marTechAccess', 'MarTech Access'], ['socialAccess', 'Social Access'], ['accessNotes', 'Access Notes'],
  ]],
];

export const ownerEmail = () => (process.env.OWNER_EMAIL ?? 'danoble4800@gmail.com').trim().toLowerCase();

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Emails a signed agreement PDF. Needs a sender on a domain verified in Resend to
// reach clients (Resend's onboarding@resend.dev sender only delivers to the account owner).
// Best effort: failures are logged and returned, never thrown.
export async function emailAgreement(opts: {
  to: string[];
  subject: string;
  heading: string;
  lines: string[];
  pdf: Buffer;
  fileName: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = Array.from(new Set(opts.to.map((t) => t.trim()).filter(Boolean)));
  if (!apiKey || !to.length) {
    console.warn('Agreement email skipped: RESEND_API_KEY or recipient missing');
    return false;
  }
  const from =
    process.env.AGREEMENT_EMAIL_FROM ||
    process.env.LEAD_ALERT_FROM ||
    `${PROVIDER_NAME} <agreements@number1digitalmarketing.com>`;
  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#111">
  <h2 style="margin:0 0 12px">${escapeHtml(opts.heading)}</h2>
  ${opts.lines.map((l) => `<p style="margin:0 0 10px;line-height:1.55">${escapeHtml(l)}</p>`).join('')}
  <p style="margin:18px 0 0;color:#777;font-size:12px">${PROVIDER_NAME} · number1digitalmarketing.com · hello@number1digitalmarketing.com</p>
</div>`;
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject: opts.subject,
      html,
      attachments: [{ filename: opts.fileName, content: opts.pdf }],
    });
    if (error) {
      console.error('Agreement email failed:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Agreement email failed:', err);
    return false;
  }
}
