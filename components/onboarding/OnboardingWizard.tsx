'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import { FormData, initialFormData } from './types';
import StepAgreement from './StepAgreement';
import StepOnboarding1 from './StepOnboarding1';
import StepOnboarding2 from './StepOnboarding2';
import StepAccess from './StepAccess';
import StepComplete from './StepComplete';

const STEPS = [
  { num: 1, label: 'Agreement' },
  { num: 2, label: 'About You' },
  { num: 3, label: 'Website & Stack' },
  { num: 4, label: 'Access' },
];

type Errors = Partial<Record<keyof FormData, string>>;

function validateStep(step: number, data: FormData): Errors {
  const errors: Errors = {};

  if (step === 1) {
    if (!data.clientCompany.trim()) errors.clientCompany = 'Company name is required.';
    if (!data.clientContact.trim()) errors.clientContact = 'Contact name is required.';
    if (!data.clientEmail.trim()) {
      errors.clientEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
      errors.clientEmail = 'Enter a valid email address.';
    }
    if (!data.signatureName.trim()) errors.signatureName = 'Your signature is required.';
    if (!data.agreedToTerms) errors.agreedToTerms = 'You must agree to the terms to continue.';
  }

  if (step === 2) {
    if (!data.contactName.trim()) errors.contactName = 'Contact name is required.';
    if (!data.contactEmail.trim()) {
      errors.contactEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.contactEmail = 'Enter a valid email address.';
    }
    if (!data.companyLegalName.trim()) errors.companyLegalName = 'Legal company name is required.';
    if (!data.goal90Day.trim()) errors.goal90Day = 'Please share your #1 goal for the next 90 days.';
  }

  return errors;
}

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
    field: keyof FormData,
    value: string | boolean | string[],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const goNext = () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitStatus('submitting');
    try {
      const payload: Record<string, string> = {};
      for (const [k, v] of Object.entries(data)) {
        payload[k] = Array.isArray(v) ? v.join(', ') : String(v);
      }
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="min-h-[60vh] flex items-center justify-center px-4 py-16"
      >
        <div className="w-full max-w-2xl">
          <StepComplete clientName={data.contactName || data.clientContact} />
        </div>
      </motion.div>
    );
  }

  const progress = ((step - 1) / STEPS.length) * 100;

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-5">
          {STEPS.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center border text-xs font-semibold tracking-widest transition-all duration-300 ${
                  step > s.num
                    ? 'bg-brand-white border-brand-white text-brand-black'
                    : step === s.num
                    ? 'border-brand-white text-brand-white'
                    : 'border-brand-dark2 text-brand-mid'
                }`}
              >
                {step > s.num ? (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="#0E0E10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs uppercase tracking-widest hidden sm:block transition-colors duration-300 ${
                  step === s.num ? 'text-brand-offwhite' : 'text-brand-mid'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        {/* Track */}
        <div className="h-px bg-brand-dark2 relative">
          <motion.div
            className="absolute top-0 left-0 h-px bg-brand-white"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mb-12"
        >
          {step === 1 && (
            <StepAgreement
              data={data}
              errors={errors}
              onChange={handleChange as (field: keyof FormData, value: string | boolean) => void}
            />
          )}
          {step === 2 && (
            <StepOnboarding1
              data={data}
              errors={errors}
              onChange={handleChange as (field: keyof FormData, value: string) => void}
            />
          )}
          {step === 3 && (
            <StepOnboarding2
              data={data}
              errors={errors}
              onChange={handleChange as (field: keyof FormData, value: string | string[]) => void}
            />
          )}
          {step === 4 && (
            <StepAccess
              data={data}
              onChange={handleChange as (field: keyof FormData, value: string | string[]) => void}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-brand-dark2 pt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={goBack} className="gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Button>
        ) : (
          <div />
        )}

        <div className="flex flex-col items-end gap-2">
          {submitStatus === 'error' && (
            <p className="text-xs text-red-400 text-right">
              Something went wrong. Please try again or email hello@number1digitalmarketing.com
            </p>
          )}
          {step < 4 ? (
            <Button variant="primary" onClick={goNext} className="gap-2">
              Continue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitStatus === 'submitting'}
              className="gap-2"
            >
              {submitStatus === 'submitting' ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Onboarding
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
