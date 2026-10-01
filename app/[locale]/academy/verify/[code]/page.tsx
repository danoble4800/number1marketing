import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@supabase/supabase-js';
import { noStoreFetch } from '@/lib/noStoreFetch';
import { Award, XCircle } from 'lucide-react';
import VerifyLookupForm from '@/components/academy/VerifyLookupForm';

// Looked up on every request so newly issued certificates verify immediately.
export const dynamic = 'force-dynamic';

type VerifiedCertificate = { id: string; full_name: string; issued_at: string };

async function lookup(code: string): Promise<VerifiedCertificate | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  const supabase = createClient(url, anonKey, { auth: { persistSession: false }, global: { fetch: noStoreFetch } });
  const { data } = await supabase.rpc('verify_certificate', { p_code: code });
  return (data as VerifiedCertificate[] | null)?.[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const cert = await lookup(decodeURIComponent(code));
  return {
    title: cert
      ? `${cert.full_name} — AI Marketing Certificate | N°1 Academy`
      : 'Certificate Verification | N°1 Academy',
    robots: { index: false, follow: false },
  };
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'academy.certificate.verify' });
  const cleanCode = decodeURIComponent(code).trim().toUpperCase();
  const cert = await lookup(cleanCode);

  return (
    <div className="min-h-screen bg-brand-near-black flex flex-col items-center justify-center px-4 pt-28 pb-16">
      <div className="w-full max-w-xl bg-brand-dark1 border border-brand-dark2 p-8 sm:p-12 text-center">
        {cert ? (
          <>
            <div className="mx-auto mb-6 w-20 h-20 border-2 border-brand-light2 flex items-center justify-center">
              <Award size={36} className="text-brand-light2" />
            </div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-3">{t('valid')}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-brand-white uppercase tracking-tight">
              {cert.full_name}
            </h1>
            <p className="text-brand-light1 mt-4 leading-relaxed">{t('earned')}</p>
            <dl className="mt-8 grid grid-cols-2 gap-4 text-left border-t border-brand-dark2 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-mid">{t('issued')}</dt>
                <dd className="text-brand-offwhite mt-1">
                  {new Date(cert.issued_at).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-brand-mid">{t('id')}</dt>
                <dd className="text-brand-offwhite mt-1 font-mono">{cert.id}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <XCircle size={40} className="text-red-400 mx-auto mb-5" />
            <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase tracking-tight">
              {t('notFoundHeading')}
            </h1>
            <p className="text-brand-light1 mt-4">{t('notFound', { code: cleanCode })}</p>
            <div className="mt-8">
              <VerifyLookupForm locale={locale} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
