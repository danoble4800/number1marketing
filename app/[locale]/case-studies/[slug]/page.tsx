import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import StatBlock from '@/components/StatBlock';
import CaseStudyCard from '@/components/CaseStudyCard';

export function generateStaticParams() {
  const slugs = ['lead-qualifier', 'workflow-automation', 'ai-agent-team'];
  const locales = ['en', 'es', 'pt'];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

type CaseStudyData = {
  slug: string;
  stat: string;
  statValue: number;
  statSuffix: string;
  statPrefix: string;
  statLabel: string;
  title: string;
  client: string;
  industry: string;
  timeframe: string;
  overview: string;
  challenge: string;
  approach: string[];
  results: { value: number; suffix: string; prefix: string; label: string }[];
  quote: string;
  quoteAuthor: string;
};

const caseStudyData: Record<string, CaseStudyData> = {
  'lead-qualifier': {
    slug: 'lead-qualifier',
    stat: '+312%',
    statValue: 312,
    statSuffix: '%',
    statPrefix: '+',
    statLabel: 'Qualified Leads',
    title: '+312% Qualified Leads in 90 Days',
    client: 'Confidential — B2B SaaS, Series A',
    industry: 'Software / Sales Automation',
    timeframe: '90 Days',
    overview:
      'A Series A B2B SaaS company with a 6-person sales team was spending over 40% of their time manually qualifying inbound leads. Deal cycle times were long, pipeline was murky, and the cost per acquisition was climbing.',
    challenge:
      'Their CRM was full of leads, but no system existed to score, prioritize, or route them automatically. Sales reps were spending hours on unqualified calls. Marketing was generating volume — sales couldn\'t process it fast enough.',
    approach: [
      'Built a custom AI lead qualification agent integrated directly with HubSpot',
      'Trained the model on 18 months of historical closed/won data to learn what a real buyer looks like',
      'Implemented automated 2-minute lead scoring with multi-signal enrichment (LinkedIn, company data, intent signals)',
      'Built routing logic to instantly assign hot leads to senior AEs, warm leads to SDRs, and cold leads to nurture sequences',
      'Deployed 24/7 AI-powered first-touch outreach for new inbound leads',
    ],
    results: [
      { value: 312, suffix: '%', prefix: '+', label: 'Qualified Leads' },
      { value: 67, suffix: '%', prefix: '', label: 'Reduction in Sales Cycle' },
      { value: 3, suffix: 'x', prefix: '', label: 'Pipeline Value in 90 Days' },
    ],
    quote:
      'We went from drowning in leads to actually closing them. The AI agent does in 90 seconds what used to take my team half a day. This wasn\'t a nice-to-have — it became mission critical.',
    quoteAuthor: 'VP of Sales, B2B SaaS Client',
  },
  'workflow-automation': {
    slug: 'workflow-automation',
    stat: '15hrs→12min',
    statValue: 12,
    statSuffix: 'min',
    statPrefix: '',
    statLabel: 'Weekly Manual Work',
    title: 'From 15 hrs/week to 12 min/week',
    client: 'Confidential — Marketing Agency, 30 Employees',
    industry: 'Marketing Services',
    timeframe: '6 Weeks',
    overview:
      'A 30-person marketing agency was drowning in internal operations — client reporting, onboarding, invoicing, and weekly performance summaries were consuming 15+ hours of senior staff time per week.',
    challenge:
      'Every client report was manually pulled from 4 different platforms, formatted in Google Slides, and emailed out. Onboarding new clients took 3 days of back-and-forth. There was no automation anywhere in their operations stack.',
    approach: [
      'Mapped every manual process across the agency\'s entire operations workflow',
      'Built automated client reporting pipelines pulling from Google Analytics, Meta Ads, and HubSpot',
      'Created an AI-powered report generator that writes narrative summaries in the agency\'s voice',
      'Automated client onboarding — from signed contract to kickoff doc in under 4 hours with zero manual touch',
      'Built invoice generation, approval routing, and payment follow-up automations using Make + Stripe',
    ],
    results: [
      { value: 98, suffix: '%', prefix: '', label: 'Reduction in Manual Time' },
      { value: 15, suffix: 'hrs', prefix: '', label: 'Saved Per Week' },
      { value: 6, suffix: '', prefix: '', label: 'Weeks to Full Deployment' },
    ],
    quote:
      'We got 15 hours a week back. For a 30-person agency, that\'s like hiring two full-time people. The reporting alone used to ruin every Friday — now it sends itself.',
    quoteAuthor: 'Founder, Marketing Agency Client',
  },
  'ai-agent-team': {
    slug: 'ai-agent-team',
    stat: '$10K→$5K',
    statValue: 5,
    statSuffix: 'K/mo',
    statPrefix: '$',
    statLabel: 'Monthly Marketing Spend',
    title: '$10K/mo Marketing Team Replaced by $5K AI Agent Stack',
    client: 'Confidential — DTC Brand, $2M ARR',
    industry: 'E-commerce / Consumer Goods',
    timeframe: '45 Days',
    overview:
      'A $2M ARR DTC brand was spending $10K/month on a fractional marketing team producing inconsistent content, slow ad creative, and manual email campaigns. Growth had stalled. CAC was rising. The founder was frustrated.',
    challenge:
      'Their content output was 4–6 pieces per month, taking weeks to produce. Email sequences were generic. Ad creative was recycled. The team couldn\'t keep up with the pace required to compete against well-funded competitors.',
    approach: [
      'Replaced fractional copywriter and social media manager with a custom AI content system',
      'Built a brand-voice model trained on the founder\'s top-performing posts and product copy',
      'Automated 30-piece monthly content calendar across Instagram, email, and product pages',
      'Deployed AI-generated A/B test variations for every ad creative — tested 12 variants per week',
      'Built automated email flows triggered by purchase behavior, browse abandonment, and lifecycle events',
    ],
    results: [
      { value: 50, suffix: '%', prefix: '', label: 'Reduction in Marketing Spend' },
      { value: 30, suffix: 'x', prefix: '', label: 'Content Volume Increase' },
      { value: 2.8, suffix: 'x', prefix: '', label: 'Return on Ad Spend' },
    ],
    quote:
      'I was skeptical. I thought AI content would feel robotic. It doesn\'t — it sounds exactly like us, just faster and cheaper. We cut costs in half and output went through the roof.',
    quoteAuthor: 'Founder, DTC Brand Client',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = caseStudyData[slug];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';

  if (!cs) return { title: 'Case Study Not Found' };

  return {
    title: `${cs.title} | Number 1 Digital Marketing`,
    description: cs.overview.slice(0, 160),
    alternates: {
      canonical: `${siteUrl}/${locale}/case-studies/${slug}`,
      languages: {
        en: `${siteUrl}/en/case-studies/${slug}`,
        es: `${siteUrl}/es/case-studies/${slug}`,
        pt: `${siteUrl}/pt/case-studies/${slug}`,
        'x-default': `${siteUrl}/en/case-studies/${slug}`,
      },
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cs = caseStudyData[slug];
  if (!cs) notFound();

  const t = await getTranslations({ locale, namespace: 'caseStudies' });
  const allCases = t.raw('items') as Array<{
    slug: string; stat: string; statLabel: string; title: string; client: string; industry: string;
  }>;
  const related = allCases.filter((c) => c.slug !== slug).slice(0, 2);

  const isNonEnglish = locale !== 'en';

  return (
    <>
      {/* Hero */}
      <Section className="bg-brand-near-black pt-32 grain-overlay relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
          }}
        />
        <Container className="relative">
          <p className="text-xs uppercase tracking-widest text-brand-mid mb-4">{cs.industry}</p>
          <div className="font-display text-7xl lg:text-[10rem] text-brand-white tracking-tighter leading-none">
            {cs.stat}
          </div>
          <Heading as="h1" size="md" className="mt-4">{cs.title}</Heading>
          <div className="mt-4 flex flex-wrap gap-4">
            <span className="text-xs uppercase tracking-widest text-brand-mid px-3 py-1.5 border border-brand-dark2">
              {cs.client}
            </span>
            <span className="text-xs uppercase tracking-widest text-brand-mid px-3 py-1.5 border border-brand-dark2">
              {cs.timeframe}
            </span>
          </div>
        </Container>
      </Section>

      {isNonEnglish && (
        <div className="bg-brand-dark2 border-b border-brand-dark2">
          <Container className="py-3">
            <p className="text-brand-light1 text-sm">
              Full case study available in English below.
            </p>
          </Container>
        </div>
      )}

      {/* Overview */}
      <Section className="bg-brand-black">
        <Container className="max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-4">Overview</h2>
              <p className="text-brand-light1 text-lg leading-relaxed">{cs.overview}</p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-4">Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-brand-mid">Industry</dt>
                  <dd className="text-brand-light2">{cs.industry}</dd>
                </div>
                <div>
                  <dt className="text-xs text-brand-mid">Client</dt>
                  <dd className="text-brand-light2">{cs.client}</dd>
                </div>
                <div>
                  <dt className="text-xs text-brand-mid">Timeframe</dt>
                  <dd className="text-brand-light2">{cs.timeframe}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* Challenge */}
      <Section className="bg-brand-dark1">
        <Container className="max-w-4xl">
          <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-4">The Challenge</h2>
          <p className="text-brand-offwhite text-xl leading-relaxed">{cs.challenge}</p>
        </Container>
      </Section>

      {/* Approach */}
      <Section className="bg-brand-black">
        <Container className="max-w-4xl">
          <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-8">Our Approach</h2>
          <ol className="space-y-4">
            {cs.approach.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="font-display text-2xl text-brand-dark2 flex-shrink-0 w-8">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-brand-light1 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Results */}
      <Section className="bg-brand-near-black">
        <Container>
          <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-12 text-center">Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {cs.results.map((result, i) => (
              <StatBlock
                key={i}
                value={result.value}
                suffix={result.suffix}
                prefix={result.prefix}
                label={result.label}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Quote */}
      <Section className="bg-brand-dark1">
        <Container className="max-w-3xl text-center">
          <blockquote>
            <p className="text-brand-offwhite text-2xl leading-relaxed font-light italic">
              &ldquo;{cs.quote}&rdquo;
            </p>
            <footer className="mt-6 text-brand-mid text-sm uppercase tracking-widest">
              — {cs.quoteAuthor}
            </footer>
          </blockquote>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="bg-brand-black">
          <Container>
            <h2 className="text-xs uppercase tracking-widest text-brand-mid mb-8">Related Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel, i) => (
                <CaseStudyCard
                  key={rel.slug}
                  stat={rel.stat}
                  statLabel={rel.statLabel}
                  title={rel.title}
                  client={rel.client}
                  industry={rel.industry}
                  href={`/${locale}/case-studies/${rel.slug}`}
                  index={i}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section className="bg-brand-near-black">
        <Container className="text-center">
          <Heading as="h2" size="lg">WANT RESULTS LIKE THIS?</Heading>
          <p className="mt-4 text-brand-light1 max-w-xl mx-auto">
            Book a free strategy call. We&apos;ll identify your top AI opportunity in 30 minutes.
          </p>
          <div className="mt-8">
            <Button href={`/${locale}/contact`} variant="primary">
              Book Your Free Strategy Call
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
