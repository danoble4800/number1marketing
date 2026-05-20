export interface FormData {
  // Step 1 — Service Agreement
  clientCompany: string;
  clientAddress: string;
  clientContact: string;
  clientEmail: string;
  signatureName: string;
  agreedToTerms: boolean;
  effectiveDate: string;

  // Step 2 — Contact
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactBestTimes: string;
  contactDecisionMaking: string;
  contactPreferredChannel: string;
  backupContact: string;

  // Step 2 — Company
  companyLegalName: string;
  companyIndustry: string;
  companyYearFounded: string;
  companyDBA: string;
  companyBusinessModel: string;
  companyRevenue: string;
  companyTeamSize: string;
  companyHQ: string;
  companyOneSentence: string;

  // Step 2 — Goals
  goal90Day: string;
  threeOutcomes: string;
  bottleneck: string;
  successMetric: string;

  // Step 3 — Website
  websiteURL: string;
  websiteTraffic: string;
  websiteCMS: string;
  websiteTopTraffic: string;
  websiteHosting: string;
  websiteDomainRegistrar: string;
  websiteConversionRate: string;
  websiteOtherDomains: string;
  websiteLikes: string;
  websiteHates: string;

  // Step 3 — Competition
  competitor1Name: string;
  competitor1URL: string;
  competitor1Threats: string;
  competitor1Weakness: string;
  competitor2Name: string;
  competitor2URL: string;
  competitor2Threats: string;
  competitor2Weakness: string;
  competitor3Name: string;
  competitor3URL: string;
  competitor3Threats: string;
  competitor3Weakness: string;

  // Step 3 — Marketing Stack + Misc
  marketingStack: string[];
  marketingStackOther: string;
  additionalInfo: string;
  signoffName: string;

  // Step 4 — Access Request
  websiteAccess: string[];
  analyticsAccess: string[];
  adsAccess: string[];
  marTechAccess: string[];
  socialAccess: string[];
  accessNotes: string;
}

export const initialFormData: FormData = {
  clientCompany: '', clientAddress: '', clientContact: '', clientEmail: '',
  signatureName: '', agreedToTerms: false,
  effectiveDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),

  contactName: '', contactTitle: '', contactEmail: '', contactPhone: '',
  contactBestTimes: '', contactDecisionMaking: '', contactPreferredChannel: '', backupContact: '',

  companyLegalName: '', companyIndustry: '', companyYearFounded: '', companyDBA: '',
  companyBusinessModel: '', companyRevenue: '', companyTeamSize: '', companyHQ: '', companyOneSentence: '',

  goal90Day: '', threeOutcomes: '', bottleneck: '', successMetric: '',

  websiteURL: '', websiteTraffic: '', websiteCMS: '', websiteTopTraffic: '',
  websiteHosting: '', websiteDomainRegistrar: '', websiteConversionRate: '', websiteOtherDomains: '',
  websiteLikes: '', websiteHates: '',

  competitor1Name: '', competitor1URL: '', competitor1Threats: '', competitor1Weakness: '',
  competitor2Name: '', competitor2URL: '', competitor2Threats: '', competitor2Weakness: '',
  competitor3Name: '', competitor3URL: '', competitor3Threats: '', competitor3Weakness: '',

  marketingStack: [], marketingStackOther: '', additionalInfo: '', signoffName: '',

  websiteAccess: [], analyticsAccess: [], adsAccess: [], marTechAccess: [], socialAccess: [],
  accessNotes: '',
};
