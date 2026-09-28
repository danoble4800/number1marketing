import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle } from 'lucide-react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import { stripeConfigured, stripeGet } from '@/lib/shop/stripe';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shop.success' });
  return { title: t('metaTitle'), robots: { index: false } };
}

async function orderInfo(sessionId?: string) {
  if (!sessionId || !stripeConfigured() || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const s = await stripeGet<{ id: string; payment_status: string; metadata: Record<string, string> }>(
      `checkout/sessions/${sessionId}`
    );
    if (s.payment_status !== 'paid') return null;
    return { orderId: `N1-${s.id.slice(-6).toUpperCase()}`, business: s.metadata.business ?? '' };
  } catch {
    return null;
  }
}

export default async function ShopSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; demo?: string }>;
}) {
  const { locale } = await params;
  const { session_id, demo } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'shop.success' });
  const steps = t.raw('steps') as string[];
  const order = await orderInfo(session_id);

  return (
    <Section className="bg-brand-near-black pt-28 lg:pt-36 min-h-[80vh]">
      <Container>
        <div className="max-w-2xl">
          {demo && (
            <p className="mb-6 inline-block border border-brand-dark2 px-3 py-1.5 text-xs uppercase tracking-widest text-brand-light1">
              {t('demo')}
            </p>
          )}
          <CheckCircle size={40} className="text-brand-light2 mb-6" />
          <Heading as="h1" size="lg" animate={false}>
            {t('headline')}
          </Heading>
          <p className="mt-6 text-brand-light1 text-lg leading-relaxed">
            {order ? t('orderLine', { orderId: order.orderId, business: order.business }) : t('subheading')}
          </p>

          <p className="mt-10 text-xs uppercase tracking-widest text-brand-mid font-semibold mb-4">
            {t('nextHeading')}
          </p>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4 text-brand-light2">
                <span className="font-display text-2xl text-brand-dark2 leading-none w-8 shrink-0">0{i + 1}</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-12 bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8">
            <Heading as="h2" size="sm" animate={false}>
              {t('auditHeading')}
            </Heading>
            <p className="mt-3 text-brand-light1 text-sm leading-relaxed">{t('auditText')}</p>
            <div className="mt-6">
              <Button href={`/${locale}/audit?utm_source=shop&utm_campaign=order-thank-you`} variant="primary">
                {t('auditCta')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
