'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GraduationCap, Shield, Eye, EyeOff } from 'lucide-react';

const STUDENT_STORE_KEY = 'academy_students';
const AUTH_KEY = 'academy_authed';
const ROLE_KEY = 'academy_role';
const NAME_KEY = 'academy_name';

type Tab = 'student' | 'admin';
type StudentMode = 'login' | 'register';

interface Student {
  name: string;
  email: string;
  password: string;
  joinedAt: string;
}

function getStudents(): Student[] {
  try {
    return JSON.parse(sessionStorage.getItem(STUDENT_STORE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStudent(s: Student) {
  const students = getStudents();
  students.push(s);
  sessionStorage.setItem(STUDENT_STORE_KEY, JSON.stringify(students));
}

function LoginInner({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('academy.login');

  const initialRole = (searchParams.get('role') as Tab) === 'admin' ? 'admin' : 'student';
  const [tab, setTab] = useState<Tab>(initialRole);
  const [mode, setMode] = useState<StudentMode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Clear error on field change
  useEffect(() => { setError(''); }, [email, password, name, tab, mode]);

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setMode('login');
    setError('');
    setSuccessMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // UX delay

    if (tab === 'admin') {
      const adminPass = process.env.NEXT_PUBLIC_ACADEMY_ADMIN_PASSWORD || '';
      if (!adminPass || password !== adminPass) {
        setError(t('adminError'));
        setLoading(false);
        return;
      }
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(ROLE_KEY, 'admin');
      sessionStorage.setItem(NAME_KEY, 'Admin');
      router.push(`/${locale}/academy/admin`);
      return;
    }

    // Student
    if (mode === 'login') {
      const students = getStudents();
      const found = students.find(
        (s) => s.email.toLowerCase() === email.toLowerCase() && s.password === password
      );
      if (!found) {
        setError(t('studentLoginError'));
        setLoading(false);
        return;
      }
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(ROLE_KEY, 'student');
      sessionStorage.setItem(NAME_KEY, found.name);
      router.push(`/${locale}/academy/dashboard`);
    } else {
      // Register
      const students = getStudents();
      const exists = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email already exists. Please log in.');
        setLoading(false);
        return;
      }
      const newStudent: Student = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        joinedAt: new Date().toISOString(),
      };
      saveStudent(newStudent);
      setSuccessMsg(t('registerSuccess'));
      await new Promise((r) => setTimeout(r, 800));
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(ROLE_KEY, 'student');
      sessionStorage.setItem(NAME_KEY, newStudent.name);
      router.push(`/${locale}/academy/dashboard`);
    }
  }

  return (
    <div className="min-h-screen bg-brand-near-black flex flex-col items-center justify-center px-4 pt-24 pb-12">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <GraduationCap size={20} className="text-brand-light2" />
          <span className="font-display text-lg text-brand-white uppercase tracking-wider">
            N°1 Academy
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-brand-white uppercase tracking-tight">
          {t('heading')}
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-brand-dark1 border border-brand-dark2">
        {/* Tabs */}
        <div className="flex border-b border-brand-dark2">
          {(['student', 'admin'] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest transition-colors ${
                tab === tabKey
                  ? 'text-brand-white border-b-2 border-brand-white bg-brand-dark2'
                  : 'text-brand-light1 hover:text-brand-white'
              }`}
            >
              {tabKey === 'admin' ? <Shield size={13} /> : <GraduationCap size={13} />}
              {tabKey === 'student' ? t('studentTab') : t('adminTab')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Name field (register mode only) */}
          {tab === 'student' && mode === 'register' && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                required
                className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
              {t('emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-mid mb-2">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                required
                className="w-full bg-brand-black border border-brand-dark2 text-brand-offwhite px-4 py-3 pr-11 text-sm placeholder:text-brand-mid focus:outline-none focus:border-brand-light1 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid hover:text-brand-light1 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/40 px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="bg-brand-dark2 border border-brand-dark2 px-4 py-3">
              <p className="text-brand-light2 text-sm">{successMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-white text-brand-black text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-brand-offwhite transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? tab === 'student' && mode === 'register'
                ? t('registering')
                : t('loggingIn')
              : tab === 'student' && mode === 'register'
              ? t('registerButton')
              : t('loginButton')}
          </button>

          {/* Toggle login/register (students only) */}
          {tab === 'student' && (
            <p className="text-center text-xs text-brand-mid">
              {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-brand-light2 hover:text-brand-white underline transition-colors"
              >
                {mode === 'login' ? t('switchToRegister') : t('switchToLogin')}
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function AcademyLoginClient({ locale }: { locale: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-near-black" />}>
      <LoginInner locale={locale} />
    </Suspense>
  );
}
