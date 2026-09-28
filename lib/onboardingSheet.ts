import { looksLikeTest, readTab, rowUrl, tabIds } from '@/lib/crmSheets';

// Onboarding (GOOGLE_SHEET_ID): one row per completed onboarding, written by /api/onboarding.
// Read-only here. Columns are looked up by their header so a moved column doesn't break the CRM.
export const ONBOARDING_TAB = 'Onboarding';
const AGREEMENTS_FOLDER = 'https://drive.google.com/drive/folders/1cjptMcb6Tk8z48zg_3LoCdlkdq1fMl17';

// How the full answers are grouped in the CRM, in form order.
const SECTIONS: [string, string[]][] = [
  ['Service Agreement', ['Client Company', 'Client Address', 'Client Contact', 'Client Email', 'Signature Name', 'Agreed To Terms', 'Effective Date']],
  ['Point of Contact', ['Contact Name', 'Contact Title', 'Contact Email', 'Contact Phone', 'Contact Best Times', 'Decision Making', 'Preferred Channel', 'Backup Contact']],
  ['Company', ['Company Legal Name', 'Industry', 'Year Founded', 'DBA', 'Business Model', 'Revenue Range', 'Team Size', 'HQ Location', 'One Sentence']],
  ['Goals', ['90-Day Goal', 'Three Outcomes', 'Bottleneck', 'Success Metric']],
  ['Website', ['Website URL', 'Monthly Traffic', 'CMS Platform', 'Top Traffic Source', 'Hosting Provider', 'Domain Registrar', 'Conversion Rate', 'Other Domains', 'Site Likes', 'Site Hates']],
  ['Competition', [1, 2, 3].flatMap((n) => ['Name', 'URL', 'Threats', 'Weakness'].map((f) => `Competitor ${n} ${f}`))],
  ['Marketing Stack', ['Marketing Stack', 'Stack Other', 'Additional Info', 'Signoff Name']],
  ['Platform Access', ['Website Access', 'Analytics Access', 'Ads Access', 'MarTech Access', 'Social Access', 'Access Notes']],
];

export type OnboardingDoc = { label: string; href: string; note?: string };

export type OnboardingClient = {
  key: string;
  submitted: string;
  submittedSort: number;
  company: string;
  contact: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  goal: string;
  documents: OnboardingDoc[];
  sections: { title: string; fields: [string, string][] }[];
};

export async function loadOnboarding(): Promise<OnboardingClient[]> {
  const id = process.env.GOOGLE_SHEET_ID!;
  const [{ shown, raw }, gids] = await Promise.all([readTab(id, `'${ONBOARDING_TAB}'!A1:BZ`), tabIds(id)]);
  const headers = (shown[0] ?? []).map((h) => String(h).trim());
  const col = (name: string) => headers.indexOf(name);

  return shown.slice(1).flatMap((r, i) => {
    const row = i + 2;
    const get = (name: string) => {
      const c = col(name);
      return c < 0 ? '' : String(r[c] ?? '').trim();
    };
    const company = get('Company Legal Name') || get('Client Company');
    const contact = get('Contact Name') || get('Client Contact');
    if (!company && !contact) return [];
    if (looksLikeTest(`${company} ${contact} ${get('Client Company')}`)) return [];

    const submitted = get('Submitted At');
    const serial = raw[i + 1]?.[col('Submitted At')];
    // Rows saved before the Agreement Doc column existed: search Drive by the name the doc was given.
    const docUrl = get('Agreement Doc');
    const docSearch = `https://drive.google.com/drive/search?q=${encodeURIComponent(`Service Agreement — ${get('Client Company')}`)}`;

    return [{
      key: `onboarding:${row}`,
      submitted,
      submittedSort: typeof serial === 'number' ? serial : Date.parse(submitted) / 86400000 + 25569 || 0,
      company,
      contact,
      email: get('Contact Email') || get('Client Email'),
      phone: get('Contact Phone'),
      website: get('Website URL'),
      industry: get('Industry'),
      goal: get('90-Day Goal'),
      documents: [
        docUrl
          ? { label: 'Signed Service Agreement', href: docUrl, note: 'Google Doc' }
          : { label: 'Signed Service Agreement', href: docSearch, note: 'Search in Drive' },
        { label: 'Full onboarding answers', href: rowUrl(id, gids[ONBOARDING_TAB], row), note: 'Google Sheet row' },
        { label: 'All signed agreements', href: AGREEMENTS_FOLDER, note: 'Drive folder' },
      ],
      sections: SECTIONS.map(([title, names]) => ({
        title,
        fields: names.map((n) => [n, get(n)] as [string, string]).filter(([, v]) => v),
      })).filter((s) => s.fields.length),
    }];
  }).sort((a, b) => b.submittedSort - a.submittedSort);
}
