'use client';

import Link from 'next/link';

interface Props {
  clientName: string;
}

const NEXT_STEPS = [
  {
    num: '01',
    title: 'Review',
    desc: "We'll review your onboarding within 24 hours and confirm receipt.",
  },
  {
    num: '02',
    title: 'Access Setup',
    desc: "We'll send a 1Password vault link for any credentials you need to share.",
  },
  {
    num: '03',
    title: 'Strategy Call',
    desc: "We'll schedule your kickoff call to align on goals and timelines.",
  },
  {
    num: '04',
    title: 'We Build',
    desc: "Your AI-powered marketing engine goes live. Let's grow.",
  },
];

export default function StepComplete({ clientName }: Props) {
  return (
    <div className="flex flex-col items-center gap-10 py-8 text-center">
      {/* Icon */}
      <div className="w-20 h-20 border border-brand-dark2 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-white">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Heading */}
      <div>
        <p className="text-xs uppercase tracking-widest text-brand-mid mb-3">Onboarding Complete</p>
        <h2 className="font-display text-4xl lg:text-5xl text-brand-white uppercase tracking-tight">
          {clientName ? `Welcome, ${clientName.split(' ')[0]}.` : "You're In."}
        </h2>
        <p className="mt-4 text-brand-light1 max-w-md mx-auto leading-relaxed">
          Your onboarding has been submitted to Number 1 Digital Marketing.
          We'll be in touch within 24 hours to kick things off.
        </p>
      </div>

      {/* What's Next */}
      <div className="w-full max-w-2xl border border-brand-dark2">
        <div className="bg-brand-dark1 px-6 py-4 border-b border-brand-dark2">
          <p className="text-xs uppercase tracking-widest text-brand-light1">What Happens Next</p>
        </div>
        <div className="divide-y divide-brand-dark2">
          {NEXT_STEPS.map((step) => (
            <div key={step.num} className="flex items-start gap-5 px-6 py-5">
              <span className="font-display text-3xl text-brand-dark2 leading-none flex-shrink-0">{step.num}</span>
              <div className="text-left">
                <p className="text-brand-white font-semibold text-sm uppercase tracking-wider">{step.title}</p>
                <p className="text-brand-light1 text-sm mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="mailto:hello@number1digitalmarketing.com"
          className="inline-flex items-center justify-center gap-2 border border-brand-dark2 text-brand-light2 px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:border-brand-light1 hover:text-brand-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Email Us
        </a>
        <Link
          href="/en/contact"
          className="inline-flex items-center justify-center gap-2 bg-brand-white text-brand-black px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-brand-offwhite transition-colors"
        >
          Book a Strategy Call
        </Link>
      </div>

      <p className="text-brand-mid text-xs">
        number1digitalmarketing.com · hello@number1digitalmarketing.com · @number1marketing
      </p>
    </div>
  );
}
