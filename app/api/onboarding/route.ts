import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Prefix values that start with + or = so Google Sheets won't treat them as formulas
function safeCell(val: string): string {
  return val && (val.startsWith('+') || val.startsWith('=') || val.startsWith('-'))
    ? `'${val}`
    : val;
}

function makeAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/documents',
    ],
  });
}

// ─── Google Sheets ────────────────────────────────────────────────────────────

async function ensureTab(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  tabName: string,
  headers: string[],
) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some((s) => s.properties?.title === tabName);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });
  }
}

async function appendToOnboardingSheet(data: Record<string, string>) {
  const auth = makeAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  // ── Onboarding tab (full form data) ──────────────────────────────────────
  await ensureTab(sheets, spreadsheetId, 'Onboarding', [
    'Submitted At',
    'Client Company', 'Client Address', 'Client Contact', 'Client Email',
    'Signature Name', 'Agreed To Terms', 'Effective Date',
    'Contact Name', 'Contact Title', 'Contact Email', 'Contact Phone',
    'Contact Best Times', 'Decision Making', 'Preferred Channel', 'Backup Contact',
    'Company Legal Name', 'Industry', 'Year Founded', 'DBA',
    'Business Model', 'Revenue Range', 'Team Size', 'HQ Location', 'One Sentence',
    '90-Day Goal', 'Three Outcomes', 'Bottleneck', 'Success Metric',
    'Website URL', 'Monthly Traffic', 'CMS Platform', 'Top Traffic Source',
    'Hosting Provider', 'Domain Registrar', 'Conversion Rate', 'Other Domains',
    'Site Likes', 'Site Hates',
    'Competitor 1 Name', 'Competitor 1 URL', 'Competitor 1 Threats', 'Competitor 1 Weakness',
    'Competitor 2 Name', 'Competitor 2 URL', 'Competitor 2 Threats', 'Competitor 2 Weakness',
    'Competitor 3 Name', 'Competitor 3 URL', 'Competitor 3 Threats', 'Competitor 3 Weakness',
    'Marketing Stack', 'Stack Other', 'Additional Info', 'Signoff Name',
    'Website Access', 'Analytics Access', 'Ads Access', 'MarTech Access',
    'Social Access', 'Access Notes',
  ]);

  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Onboarding!A:BJ',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        submittedAt,
        data.clientCompany ?? '', data.clientAddress ?? '', data.clientContact ?? '', data.clientEmail ?? '',
        data.signatureName ?? '', data.agreedToTerms ?? '', data.effectiveDate ?? '',
        data.contactName ?? '', data.contactTitle ?? '', data.contactEmail ?? '', safeCell(data.contactPhone ?? ''),
        data.contactBestTimes ?? '', data.contactDecisionMaking ?? '', data.contactPreferredChannel ?? '', data.backupContact ?? '',
        data.companyLegalName ?? '', data.companyIndustry ?? '', data.companyYearFounded ?? '', data.companyDBA ?? '',
        data.companyBusinessModel ?? '', data.companyRevenue ?? '', data.companyTeamSize ?? '', data.companyHQ ?? '', data.companyOneSentence ?? '',
        data.goal90Day ?? '', data.threeOutcomes ?? '', data.bottleneck ?? '', data.successMetric ?? '',
        data.websiteURL ?? '', data.websiteTraffic ?? '', data.websiteCMS ?? '', data.websiteTopTraffic ?? '',
        data.websiteHosting ?? '', data.websiteDomainRegistrar ?? '', data.websiteConversionRate ?? '', data.websiteOtherDomains ?? '',
        data.websiteLikes ?? '', data.websiteHates ?? '',
        data.competitor1Name ?? '', data.competitor1URL ?? '', data.competitor1Threats ?? '', data.competitor1Weakness ?? '',
        data.competitor2Name ?? '', data.competitor2URL ?? '', data.competitor2Threats ?? '', data.competitor2Weakness ?? '',
        data.competitor3Name ?? '', data.competitor3URL ?? '', data.competitor3Threats ?? '', data.competitor3Weakness ?? '',
        data.marketingStack ?? '', data.marketingStackOther ?? '', data.additionalInfo ?? '', data.signoffName ?? '',
        data.websiteAccess ?? '', data.analyticsAccess ?? '', data.adsAccess ?? '', data.marTechAccess ?? '',
        data.socialAccess ?? '', data.accessNotes ?? '',
      ]],
    },
  });

  // ── Client Contacts tab (quick-reference for follow-ups) ─────────────────
  await ensureTab(sheets, spreadsheetId, 'Client Contacts', [
    'Date Added', 'Company Name', 'Contact Name', 'Email', 'Phone',
    'Website', 'Industry', 'HQ Location',
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Client Contacts!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        submittedAt,
        data.companyLegalName || data.clientCompany || '',
        data.contactName || data.clientContact || '',
        data.contactEmail || data.clientEmail || '',
        safeCell(data.contactPhone || ''),
        data.websiteURL || '',
        data.companyIndustry || '',
        data.companyHQ || '',
      ]],
    },
  });
}

// ─── Google Docs ──────────────────────────────────────────────────────────────

async function createSignedAgreementDoc(data: Record<string, string>) {
  const auth = makeAuth();
  const drive = google.drive({ version: 'v3', auth });
  const docs  = google.docs({ version: 'v1', auth });

  const OWNER_EMAIL = 'danoble4800@gmail.com';
  const FOLDER_NAME = 'N1 Marketing — Signed Agreements';

  // Find or create the shared folder
  const folderSearch = await drive.files.list({
    q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
  });

  let folderId: string;
  if (folderSearch.data.files && folderSearch.data.files.length > 0) {
    folderId = folderSearch.data.files[0].id!;
  } else {
    const folder = await drive.files.create({
      requestBody: {
        name: FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });
    folderId = folder.data.id!;
    // Share folder with the owner's Gmail account
    await drive.permissions.create({
      fileId: folderId,
      requestBody: { role: 'writer', type: 'user', emailAddress: OWNER_EMAIL },
      sendNotificationEmail: false,
    });
  }

  // Build the document text
  const lines = [
    'NUMBER 1 DIGITAL MARKETING',
    'SERVICE AGREEMENT — SIGNED COPY',
    '',
    `Date Signed:      ${data.effectiveDate}`,
    `Submitted At:     ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
    '',
    '─────────────────────────────────────────',
    'CLIENT INFORMATION',
    '─────────────────────────────────────────',
    `Company:          ${data.clientCompany}`,
    `Address:          ${data.clientAddress || '—'}`,
    `Contact:          ${data.clientContact}`,
    `Email:            ${data.clientEmail}`,
    '',
    '─────────────────────────────────────────',
    'DIGITAL SIGNATURE',
    '─────────────────────────────────────────',
    `Signed by:        ${data.signatureName}`,
    `Agreed to terms:  ${data.agreedToTerms === 'true' ? 'YES — agreement accepted' : 'NO'}`,
    `IP / Timestamp:   ${new Date().toISOString()}`,
    '',
    '─────────────────────────────────────────',
    'ENGAGEMENT SUMMARY',
    '─────────────────────────────────────────',
    `Company Legal:    ${data.companyLegalName || data.clientCompany}`,
    `Industry:         ${data.companyIndustry || '—'}`,
    `Website:          ${data.websiteURL || '—'}`,
    `90-Day Goal:      ${data.goal90Day || '—'}`,
    '',
    '─────────────────────────────────────────',
    'AGREEMENT',
    '─────────────────────────────────────────',
    'This Service Agreement was entered into between Number 1 Digital Marketing',
    '(Service Provider) and the Client identified above. By typing their name and',
    'checking the acceptance box on the onboarding portal, the Client agreed to all',
    'terms of the Number 1 Digital Marketing Service Agreement, including sections on',
    'Services & Scope, Fees & Payment, Intellectual Property, Confidentiality,',
    'Limitation of Liability, and Termination.',
    '',
    'This constitutes a legally binding electronic signature under applicable law.',
    '',
    'Service Provider: Number 1 Digital Marketing',
    'number1digitalmarketing.com · hello@number1digitalmarketing.com',
  ].join('\n');

  // Create the Google Doc
  const doc = await docs.documents.create({
    requestBody: {
      title: `Service Agreement — ${data.clientCompany} — ${data.effectiveDate}`,
    },
  });
  const docId = doc.data.documentId!;

  // Insert text content
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [{ insertText: { location: { index: 1 }, text: lines } }],
    },
  });

  // Move doc into the folder
  const file = await drive.files.get({ fileId: docId, fields: 'parents' });
  const previousParents = (file.data.parents ?? []).join(',');
  await drive.files.update({
    fileId: docId,
    addParents: folderId,
    removeParents: previousParents,
    fields: 'id, parents',
  });

  // Share the doc with the owner
  await drive.permissions.create({
    fileId: docId,
    requestBody: { role: 'writer', type: 'user', emailAddress: OWNER_EMAIL },
    sendNotificationEmail: false,
  });
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, string> = await req.json();

    if (!body.clientCompany || !body.signatureName || !body.agreedToTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sheets — required
    await appendToOnboardingSheet(body);

    // Google Docs — best-effort (won't break submission if Drive API isn't enabled yet)
    try {
      await createSignedAgreementDoc(body);
    } catch (docErr) {
      console.error('Google Docs creation failed (non-fatal):', docErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding submission error:', err);
    return NextResponse.json({ error: 'Failed to submit onboarding' }, { status: 500 });
  }
}
