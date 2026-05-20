import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/Container';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export const metadata: Metadata = {
  title: 'Client Onboarding | Number 1 Digital Marketing',
  description:
    'Complete your onboarding to kick off your engagement with Number 1 Digital Marketing — service agreement, intake form, and platform access in one place.',
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-brand-near-black">
      {/* Page header — matches site section style */}
      <div className="border-b border-brand-dark2 bg-brand-black pt-24 pb-12">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-xs text-brand-mid tracking-widest uppercase">N°1</span>
              <span className="w-px h-4 bg-brand-dark2" />
              <span className="text-xs text-brand-mid tracking-widest uppercase">Client Onboarding</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brand-white uppercase tracking-tight leading-none">
              Welcome<br />Aboard.
            </h1>
            <p className="mt-5 text-brand-light1 text-lg max-w-xl leading-relaxed">
              Four steps. About{' '}
              <span className="text-brand-offwhite font-semibold">15–20 minutes.</span>{' '}
              We review everything within 24 hours and follow up with next steps.
            </p>
            <p className="mt-3 text-brand-mid text-sm">
              Questions?{' '}
              <a
                href="mailto:hello@number1digitalmarketing.com"
                className="text-brand-light2 hover:text-brand-white transition-colors underline underline-offset-2"
              >
                hello@number1digitalmarketing.com
              </a>
            </p>
          </div>
        </Container>
      </div>

      {/* Wizard — uses its own internal max-w-3xl centering */}
      <Container>
        <OnboardingWizard />
      </Container>
    </div>
  );
}
