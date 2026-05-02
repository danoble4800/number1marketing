'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  services: string[];
  consent: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  services?: string;
  consent?: string;
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  services: [],
  consent: false,
};

const SERVICE_KEYS = ['simpleAI', 'professionalAI', 'webDesign', 'consulting'] as const;

export default function ContactForm() {
  const t = useTranslations('contactForm');
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = t('validation.firstNameRequired');
    if (!form.lastName.trim()) e.lastName = t('validation.lastNameRequired');
    if (!form.phone.trim()) e.phone = t('validation.phoneRequired');
    if (!form.email.trim()) {
      e.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t('validation.emailInvalid');
    }
    if (form.services.length === 0) e.services = t('validation.servicesRequired');
    if (!form.consent) e.consent = t('validation.consentRequired');
    return e;
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleService = (key: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(key);
      const next = exists ? prev.services.filter((s) => s !== key) : [...prev.services, key];
      return { ...prev, services: next };
    });
    if (errors.services) setErrors((prev) => ({ ...prev, services: undefined }));
  };

  const handleConsent = () => {
    setForm((prev) => ({ ...prev, consent: !prev.consent }));
    if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm(initialState);
    } catch {
      setStatus('error');
    }
  };

  const inputClass = (error?: string) =>
    `w-full bg-brand-dark2 border ${
      error ? 'border-brand-light1' : 'border-brand-dark2'
    } text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors`;

  const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <CheckCircle size={40} className="text-brand-light2" />
        <p className="text-brand-offwhite text-lg font-semibold">{t('success')}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-brand-white uppercase tracking-tight">
        {t('heading')}
      </h2>

      {/* First + Last name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            {t('firstName')} <span className="text-brand-light1">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleText}
            placeholder={t('firstNamePlaceholder')}
            className={inputClass(errors.firstName)}
          />
          {errors.firstName && <p className="mt-1 text-xs text-brand-light1">{errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass}>
            {t('lastName')} <span className="text-brand-light1">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleText}
            placeholder={t('lastNamePlaceholder')}
            className={inputClass(errors.lastName)}
          />
          {errors.lastName && <p className="mt-1 text-xs text-brand-light1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>
          {t('phone')} <span className="text-brand-light1">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleText}
          placeholder={t('phonePlaceholder')}
          className={inputClass(errors.phone)}
        />
        {errors.phone && <p className="mt-1 text-xs text-brand-light1">{errors.phone}</p>}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>
          {t('email')} <span className="text-brand-light1">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleText}
          placeholder={t('emailPlaceholder')}
          className={inputClass(errors.email)}
        />
        {errors.email && <p className="mt-1 text-xs text-brand-light1">{errors.email}</p>}
      </div>

      {/* Services checkboxes */}
      <div>
        <label className={labelClass}>
          {t('services')} <span className="text-brand-light1">*</span>
        </label>
        <div className="flex flex-col gap-2 mt-1">
          {SERVICE_KEYS.map((key) => {
            const checked = form.services.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleService(key)}
                className={`flex items-center gap-3 px-4 py-3 text-sm text-left border transition-colors ${
                  checked
                    ? 'border-brand-light2 bg-brand-dark2 text-brand-white'
                    : 'border-brand-dark2 bg-brand-dark2 text-brand-light1 hover:border-brand-light1'
                }`}
              >
                <span
                  className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${
                    checked ? 'border-brand-white bg-brand-white' : 'border-brand-mid'
                  }`}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#0E0E10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {t(`servicesOptions.${key}`)}
              </button>
            );
          })}
        </div>
        {errors.services && <p className="mt-1 text-xs text-brand-light1">{errors.services}</p>}
      </div>

      {/* Consent */}
      <div>
        <button
          type="button"
          onClick={handleConsent}
          className={`flex items-start gap-3 text-left w-full ${errors.consent ? 'opacity-100' : ''}`}
        >
          <span
            className={`mt-0.5 w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${
              form.consent ? 'border-brand-white bg-brand-white' : 'border-brand-mid bg-brand-dark2'
            }`}
          >
            {form.consent && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#0E0E10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-xs text-brand-light1 leading-relaxed">{t('consent')}</span>
        </button>
        {errors.consent && <p className="mt-1 text-xs text-brand-light1">{errors.consent}</p>}
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-brand-light2 text-sm">
          <AlertCircle size={16} />
          {t('error')}
        </div>
      )}

      <Button type="submit" variant="primary" disabled={status === 'submitting'} className="mt-2">
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
