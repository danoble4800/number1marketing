import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle, Download, FileText } from 'lucide-react';
import { PRODUCT_TAG, isAssistantPlan, orderIdFor, type AssistantPlan } from '@/lib/macAssistant';
import { stripeConfigured, stripeGet } from '@/lib/shop/stripe';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'macAssistant.success' });
  return { title: t('metaTitle'), robots: { index: false } };
}

async function orderInfo(sessionId?: string): Promise<{ orderId: string; plan: AssistantPlan } | null> {
  if (!sessionId || !stripeConfigured() || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const s = await stripeGet<{ id: string; payment_status: string; metadata: Record<string, string> }>(
      `checkout/sessions/${sessionId}`
    );
    if (s.payment_status !== 'paid' || s.metadata.product !== PRODUCT_TAG) return null;
    return { orderId: orderIdFor(s.id), plan: isAssistantPlan(s.metadata.plan) ? s.metadata.plan : 'diy' };
  } catch {
    return null;
  }
}

export default async function MacAssistantSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; demo?: string }>;
}) {
  const { locale } = await params;
  const { session_id, demo } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'macAssistant.success' });
  const order = await orderInfo(session_id);
  // ?demo=diy|setup comes from local previews without Stripe keys.
  const plan: AssistantPlan | null = order?.plan ?? (isAssistantPlan(demo) ? demo : null);
  const steps = plan ? (t.raw(`steps.${plan}`) as string[]) : [];
  const link = (file: 'zip' | 'guide') =>
    order ? `/api/mac-assistant/download?session_id=${session_id}&file=${file}` : '#';

  return (
    <div className="min-h-screen bg-brand-near-black">
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        {demo && (
          <p className="mb-6 inline-block border border-brand-dark2 px-3 py-1.5 text-xs uppercase tracking-widest text-brand-light1">
            {t('demo')}
          </p>
        )}
        <CheckCircle size={40} className="mb-6 text-emerald-500" />
        <h1 className="font-display text-4xl uppercase leading-tight text-brand-white sm:text-5xl">
          {plan ? t('headline') : t('notFoundHeadline')}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-light1">
          {order ? t('orderLine', { orderId: order.orderId }) : plan ? t('subheading') : t('notFound')}
        </p>

        {plan && (
          <>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={link('zip')}
                className="inline-flex flex-1 items-center justify-center gap-2 bg-brand-white px-6 py-4 text-sm font-semibold uppercase tracking-widest text-brand-black transition-opacity hover:opacity-90"
              >
                <Download size={16} /> {t('zip')}
              </a>
              <a
                href={link('guide')}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-brand-white px-6 py-4 text-sm font-semibold uppercase tracking-widest text-brand-white transition-colors hover:bg-brand-white hover:text-brand-black"
              >
                <FileText size={16} /> {t('guide')}
              </a>
            </div>
            <p className="mt-3 text-sm text-brand-mid">{t('emailed')}</p>

            <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-widest text-brand-mid">{t('nextHeading')}</p>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-4 text-brand-light2">
                  <span className="w-8 shrink-0 font-display text-2xl leading-none text-brand-dark2">0{i + 1}</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        <Link
          href={`/${locale}`}
          className="mt-12 inline-block text-sm font-semibold text-brand-light1 underline-offset-4 hover:text-brand-white hover:underline"
        >
          {t('home')} →
        </Link>
      </div>
    </div>
  );
}
