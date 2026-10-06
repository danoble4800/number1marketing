import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BookOpen, Award, Clock, Check, Quote } from 'lucide-react';
import { getModule, isHandsOn } from '@/content/academy/lessons';
import { getQuiz } from '@/content/academy/quizzes';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import SampleCertificate from '@/components/academy/SampleCertificate';
import type { CertificateText } from '@/lib/certificatePdf';
import { testimonials, quoteFor } from '@/content/academy/testimonials';
import { COACHING_PRICES, coachingHref } from '@/content/academy/coaching';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com';

  return {
    title: `Get AI Certified | Number 1 Digital Marketing`,
    description:
      'Master AI marketing and automation. Earn your AI Marketing Certificate with Number 1 Digital Marketing Academy.',
    alternates: {
      canonical: `${siteUrl}/${locale}/academy`,
      languages: {
        en: `${siteUrl}/en/academy`,
        es: `${siteUrl}/es/academy`,
        pt: `${siteUrl}/pt/academy`,
        'x-default': `${siteUrl}/en/academy`,
      },
    },
  };
}

type ModuleItem = { number: string; title: string; time: string };
type OverviewItem = { title: string; desc: string };
type Tier = { name: string; features: string[]; cta: string };

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'academy' });
  const modules = t.raw('modules.items') as ModuleItem[];
  const overviewItems = t.raw('overview.items') as OverviewItem[];
  const tiers = t.raw('coaching.tiers') as Record<'free' | 'group' | 'oneOnOne', Tier>;
  const plans = [
    { tier: tiers.free, price: t('coaching.free'), per: '', href: `/${locale}/academy/login?role=student`, featured: false },
    { tier: tiers.group, price: `$${COACHING_PRICES.group}`, per: t('coaching.perMonth'), href: coachingHref('group', locale), featured: true },
    { tier: tiers.oneOnOne, price: `$${COACHING_PRICES.oneOnOne}`, per: t('coaching.perSession'), href: coachingHref('oneOnOne', locale), featured: false },
  ];

  return (
    <>
      {/* Hero */}
      <Section className="bg-brand-near-black pt-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
          }}
        />
        <Container className="relative text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-brand-dark2 bg-brand-dark1">
            <Award size={14} className="text-brand-light2" />
            <span className="text-xs uppercase tracking-widest text-brand-light2">Number 1 Digital Marketing Academy</span>
          </div>
          <Heading as="h1" size="xl" className="mb-6">
            {t('hero.headline')}
          </Heading>
          <p className="mt-4 max-w-2xl mx-auto text-brand-light1 text-xl leading-relaxed">
            {t('hero.subheadline')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={`/${locale}/academy/login?role=student`} variant="primary">
              {t('hero.enrollCta')}
            </Button>
            <Button href={`/${locale}/academy/login?role=admin`} variant="outline">
              {t('hero.adminCta')}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Program Overview */}
      <Section className="bg-brand-black">
        <Container>
          <div className="text-center mb-16">
            <Heading as="h2" size="lg">{t('overview.heading')}</Heading>
            <p className="mt-4 text-brand-light1 max-w-2xl mx-auto">
              {t('overview.subheading')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {overviewItems.map((item, i) => (
              <div key={i} className="bg-brand-dark1 border border-brand-dark2 p-6">
                <div className="font-display text-4xl text-brand-dark2 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-lg text-brand-white uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-brand-light1 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Course Modules */}
      <Section className="bg-brand-near-black">
        <Container>
          <div className="text-center mb-16">
            <Heading as="h2" size="lg">{t('modules.heading')}</Heading>
            <p className="mt-4 text-brand-light1">{t('modules.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <div
                key={i}
                className="relative bg-brand-dark1 border border-brand-dark2 p-6 group"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs uppercase tracking-widest text-brand-light2 border border-brand-light2/40 px-2 py-0.5">
                    {isHandsOn(mod.number) ? t('modules.handsOn') : t('modules.available')}
                  </span>
                </div>

                {/* Module number */}
                <div className="font-display text-5xl text-brand-dark2 mb-4 leading-none">
                  {mod.number}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-brand-mid flex-shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-brand-mid">
                    {t('modules.contents', {
                      lessons: getModule(mod.number, locale)?.lessons.length ?? 0,
                      questions: getQuiz(mod.number, locale)?.length ?? 0,
                    })}
                  </span>
                </div>

                <h3 className="font-display text-lg text-brand-light1 uppercase tracking-tight mb-4">
                  {mod.title}
                </h3>

                <div className="flex items-center gap-1.5 text-brand-mid">
                  <Clock size={12} />
                  <span className="text-xs">{t('modules.estTime')}: {mod.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href={`/${locale}/academy/glossary`} variant="outline">
              {t('glossary.openGlossary')}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Certificate CTA */}
      <Section className="bg-brand-dark1 border-t border-brand-dark2">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex w-14 h-14 border-2 border-brand-dark2 items-center justify-center">
                <Award size={26} className="text-brand-light2" />
              </div>
              <Heading as="h2" size="lg">{t('overview.certificate.heading')}</Heading>
              <p className="mt-6 text-brand-light1 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('overview.certificate.description')}
              </p>
              <div className="mt-10">
                <Button href={`/${locale}/academy/login?role=student`} variant="primary">
                  {t('hero.enrollCta')}
                </Button>
              </div>
            </div>
            <figure>
              <SampleCertificate
                text={t.raw('certificate.pdf') as CertificateText}
                name={t('sampleCertificate.name')}
                watermark={t('sampleCertificate.watermark')}
                date={new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              />
              <figcaption className="mt-4 text-sm text-brand-mid text-center">
                <a href={`/${locale}/academy/verify`} className="hover:text-brand-light1 transition-colors">
                  {t('sampleCertificate.caption')}
                </a>
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* Student quotes: hidden until real ones are added in content/academy/testimonials.ts */}
      {testimonials.length > 0 && (
        <Section className="bg-brand-black">
          <Container>
            <div className="text-center mb-12">
              <Heading as="h2" size="lg">{t('testimonials.heading')}</Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <figure key={item.name} className="bg-brand-dark1 border border-brand-dark2 p-6 flex flex-col">
                  <Quote size={20} className="text-brand-mid mb-4" />
                  <blockquote className="text-brand-offwhite leading-relaxed flex-1">{quoteFor(item, locale)}</blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="block text-brand-white font-semibold">{item.name}</span>
                    <span className="block text-brand-mid">{item.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Paid add-ons */}
      <Section id="coaching" className="bg-brand-near-black border-t border-brand-dark2">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="lg">{t('coaching.heading')}</Heading>
            <p className="mt-4 text-brand-light1 max-w-2xl mx-auto">{t('coaching.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ tier, price, per, href, featured }) => (
              <div
                key={tier.name}
                className={`bg-brand-dark1 border p-6 sm:p-8 flex flex-col ${featured ? 'border-brand-light1' : 'border-brand-dark2'}`}
              >
                <h3 className="font-display text-lg text-brand-white uppercase tracking-tight">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-brand-white">{price}</span>
                  {per && <span className="text-sm text-brand-mid">{per}</span>}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-brand-light1">
                      <Check size={15} className="text-brand-light2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href={href} external={href.startsWith('http')} variant={featured ? 'primary' : 'outline'} className="w-full justify-center">
                    {tier.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-brand-mid">{t('coaching.note')}</p>
        </Container>
      </Section>
    </>
  );
}
