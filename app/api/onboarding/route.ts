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

  // ── Signed Agreements tab (formatted agreement record per client) ────────
  await ensureTab(sheets, spreadsheetId, 'Signed Agreements', ['Agreement', 'Detail']);

  // Find the sheetId for Signed Agreements so we can apply formatting
  const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
  const agreementSheetId = spreadsheetMeta.data.sheets
    ?.find((s) => s.properties?.title === 'Signed Agreements')
    ?.properties?.sheetId;

  // Build the agreement rows
  const agreementRows = [
    ['NUMBER 1 DIGITAL MARKETING — SERVICE AGREEMENT (SIGNED)', ''],
    ['', ''],
    ['DATE SIGNED', data.effectiveDate || submittedAt],
    ['SUBMITTED AT', submittedAt],
    ['AGREEMENT #', `N1-${Date.now().toString().slice(-6)}`],
    ['', ''],
    ['CLIENT INFORMATION', ''],
    ['Company', data.companyLegalName || data.clientCompany],
    ['Address', data.clientAddress || '—'],
    ['Contact', data.clientContact],
    ['Email', data.clientEmail],
    ['Phone', data.contactPhone || '—'],
    ['Industry', data.companyIndustry || '—'],
    ['Website', data.websiteURL || '—'],
    ['', ''],
    ['DIGITAL SIGNATURE', ''],
    ['Signed By', data.signatureName],
    ['Agreement Accepted', data.agreedToTerms === 'true' ? 'YES — Terms accepted in full' : 'NO'],
    ['Timestamp (UTC)', new Date().toISOString()],
    ['Method', 'Electronic signature via Number 1 Digital Marketing onboarding portal'],
    ['', ''],
    ['ENGAGEMENT SUMMARY', ''],
    ['90-Day Goal', data.goal90Day || '—'],
    ['', ''],
    ['LEGAL STATEMENT', ''],
    ['', 'This Service Agreement was entered into between Number 1 Digital Marketing (Service Provider) and the Client above.'],
    ['', 'By typing their full legal name and checking the acceptance checkbox on the onboarding portal, the Client electronically'],
    ['', 'agreed to all terms of the Service Agreement — with the same legal effect as a handwritten signature.'],
    ['', ''],
    ['SERVICE PROVIDER', 'Number 1 Digital Marketing'],
    ['Website', 'number1digitalmarketing.com'],
    ['Email', 'hello@number1digitalmarketing.com'],
  ];

  // Append a blank separator row then the agreement block
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Signed Agreements!A:B',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: agreementRows },
  });

  // Bold label column
  if (agreementSheetId !== undefined) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId: agreementSheetId, startRowIndex: 0, endRowIndex: 200, startColumnIndex: 0, endColumnIndex: 1 },
              cell: { userEnteredFormat: { textFormat: { bold: true } } },
              fields: 'userEnteredFormat.textFormat.bold',
            },
          },
          {
            updateDimensionProperties: {
              range: { sheetId: agreementSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
              properties: { pixelSize: 220 },
              fields: 'pixelSize',
            },
          },
          {
            updateDimensionProperties: {
              range: { sheetId: agreementSheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 },
              properties: { pixelSize: 520 },
              fields: 'pixelSize',
            },
          },
          {
            repeatCell: {
              range: { sheetId: agreementSheetId, startRowIndex: 0, endRowIndex: 200, startColumnIndex: 1, endColumnIndex: 2 },
              cell: { userEnteredFormat: { wrapStrategy: 'WRAP' } },
              fields: 'userEnteredFormat.wrapStrategy',
            },
          },
        ],
      },
    });
  }

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

// ─── Google Doc creation via Google Apps Script ──────────────────────────────
// The service account has 0 GB Drive quota, so it can't own new files.
// A Google Apps Script web app (running as danoble4800@gmail.com) creates the
// doc instead — files are owned by the real user and live in their Drive.

function buildAgreementHtml(data: Record<string, string>, submittedAt: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #111;">

  <h1 style="font-size:22px; letter-spacing:2px; text-transform:uppercase; border-bottom:3px solid #111; padding-bottom:12px;">
    Number 1 Digital Marketing
  </h1>
  <h2 style="font-size:16px; letter-spacing:1px; text-transform:uppercase; color:#444;">
    Service Agreement — Signed Copy
  </h2>

  <table style="width:100%; margin:24px 0; border-collapse:collapse;">
    <tr><td style="padding:4px 0; color:#666; width:160px;">Date Signed</td><td><strong>${data.effectiveDate}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#666;">Submitted At</td><td>${submittedAt}</td></tr>
  </table>

  <hr style="border:none; border-top:1px solid #ddd; margin:24px 0;">

  <h3 style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#666;">Client Information</h3>
  <table style="width:100%; margin:12px 0; border-collapse:collapse;">
    <tr><td style="padding:4px 0; color:#666; width:160px;">Company</td><td><strong>${data.clientCompany}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#666;">Legal Name</td><td>${data.companyLegalName || data.clientCompany}</td></tr>
    <tr><td style="padding:4px 0; color:#666;">Address</td><td>${data.clientAddress || '—'}</td></tr>
    <tr><td style="padding:4px 0; color:#666;">Contact</td><td>${data.clientContact}</td></tr>
    <tr><td style="padding:4px 0; color:#666;">Email</td><td>${data.clientEmail}</td></tr>
    <tr><td style="padding:4px 0; color:#666;">Industry</td><td>${data.companyIndustry || '—'}</td></tr>
    <tr><td style="padding:4px 0; color:#666;">Website</td><td>${data.websiteURL || '—'}</td></tr>
  </table>

  <hr style="border:none; border-top:1px solid #ddd; margin:24px 0;">

  <h3 style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#666;">Digital Signature</h3>
  <table style="width:100%; margin:12px 0; border-collapse:collapse;">
    <tr><td style="padding:4px 0; color:#666; width:160px;">Signed By</td><td><strong style="font-size:18px; font-style:italic;">${data.signatureName}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#666;">Agreement Accepted</td><td><strong style="color:#1a7f3c;">${data.agreedToTerms === 'true' ? '✓ YES — Terms accepted in full' : 'NO'}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#666;">Timestamp (UTC)</td><td style="font-family:monospace; font-size:12px;">${new Date().toISOString()}</td></tr>
  </table>

  <hr style="border:none; border-top:1px solid #ddd; margin:24px 0;">

  <h3 style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#666;">Engagement Summary</h3>
  <table style="width:100%; margin:12px 0; border-collapse:collapse;">
    <tr><td style="padding:4px 0; color:#666; width:160px;">90-Day Goal</td><td>${data.goal90Day || '—'}</td></tr>
  </table>

  <hr style="border:none; border-top:1px solid #ddd; margin:24px 0;">

  <h3 style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#666;">Agreement</h3>
  <p style="color:#444; line-height:1.7; font-size:13px;">
    This Service Agreement was entered into between <strong>Number 1 Digital Marketing</strong>
    (Service Provider) and the Client identified above. By typing their full legal name and
    checking the acceptance checkbox on the Number 1 Digital Marketing onboarding portal,
    the Client electronically agreed to all terms of the Service Agreement — including
    Services &amp; Scope, Fees &amp; Payment, Intellectual Property, Confidentiality,
    Limitation of Liability, and Termination — with the same legal effect as a handwritten signature.
  </p>
  <p style="color:#444; line-height:1.7; font-size:13px;">
    <strong>This constitutes a legally binding electronic signature under applicable law.</strong>
  </p>

  <hr style="border:none; border-top:1px solid #ddd; margin:24px 0;">

  <p style="color:#888; font-size:11px;">
    Number 1 Digital Marketing &nbsp;·&nbsp; number1digitalmarketing.com &nbsp;·&nbsp;
    hello@number1digitalmarketing.com &nbsp;·&nbsp; @number1marketing
  </p>

</body>
</html>`;
}

async function createSignedAgreementDoc(data: Record<string, string>) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const scriptSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!scriptUrl) {
    throw new Error('GOOGLE_APPS_SCRIPT_URL not configured — see setup instructions');
  }

  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const docName = `Service Agreement — ${data.clientCompany} — ${data.effectiveDate || submittedAt}`;
  const html = buildAgreementHtml(data, submittedAt);

  const res = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: scriptSecret, name: docName, html }),
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`Apps Script responded with HTTP ${res.status}`);
  }

  const result = await res.json() as { success?: boolean; url?: string; error?: string };

  if (!result.success) {
    throw new Error(`Apps Script error: ${result.error}`);
  }

  console.log(`Signed agreement created: ${docName} — ${result.url}`);
  return result.url;
}

// ─── Route handler ────────────────────────────────────────────────────────────

function joinField(val: string | string[] | undefined): string {
  if (!val) return '';
  return Array.isArray(val) ? val.join(', ') : val;
}

export async function POST(req: NextRequest) {
  try {
    const raw: Record<string, string | string[]> = await req.json();

    if (!raw.clientCompany || !raw.signatureName || !raw.agreedToTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Flatten arrays to comma-joined strings so Sheets gets plain string values
    const body: Record<string, string> = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, joinField(v)])
    );

    // Sheets — required
    await appendToOnboardingSheet(body);

    // Google Doc — best-effort
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
