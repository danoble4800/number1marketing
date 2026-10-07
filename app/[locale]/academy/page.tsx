import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BookOpen, Award, Clock, Check, Quote, Users, Sparkles, User, Store, MessageSquareText, Timer, ListChecks, ArrowRight } from 'lucide-react';
import { getModule, isHandsOn, isStarter, TRACKS } from '@/content/academy/lessons';
import { GLOSSARY } from '@/content/academy/glossary';
import { getQuiz } from '@/content/academy/quizzes';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import SampleCertificate from '@/components/academy/SampleCertificate';
import ModuleGlyph from '@/components/illustrations/ModuleGlyph';
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
    title: `N°1 AI Starter Guide: Learn What AI Can Do`,
    description:
      'AI can do more than you think. Free, plain-English lessons on what AI can do for you and your business, with a 5-minute try-it in every lesson. No tech background needed.',
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
  const courseModules = modules.filter((m) => !isStarter(m.number));
  const lessonsCount = (number: string) => getModule(number, locale)?.lessons.length ?? 0;
  const howItems = t.raw('how.items') as OverviewItem[];
  const glossaryLocale = (['en', 'es', 'pt'] as const).find((l) => l === locale) ?? 'en';
  const sampleTerms = ['ai-assistant', 'prompt', 'hallucination', 'ai-agent']
    .map((id) => GLOSSARY.find((g) => g.id === id))
    .filter((g) => g !== undefined)
    .map((g) => g[glossaryLocale]);
  const overviewItems = t.raw('overview.items') as OverviewItem[];
  const tiers = t.raw('coaching.tiers') as Record<'free' | 'group' | 'oneOnOne', Tier>;
  const plans = [
    { tier: tiers.free, price: t('coaching.free'), per: '', href: `/${locale}/academy/login?role=student`, featured: false },
    { tier: tiers.group, price: `$${COACHING_PRICES.group}`, per: t('coaching.perMonth'), href: coachingHref('group', locale), featured: true },
    { tier: tiers.oneOnOne, price: `$${COACHING_PRICES.oneOnOne}`, per: t('coaching.perSession'), href: coachingHref('oneOnOne', locale), featured: false },
  ];
  const dwy = t.raw('coaching.dwy') as Record<'one' | 'both', Tier>;
  const dwyPlans = [
    { tier: dwy.one, price: `$${COACHING_PRICES.dwyOne}`, per: t('coaching.perOneTime'), href: coachingHref('dwyOne', locale), featured: false },
    { tier: dwy.both, price: `$${COACHING_PRICES.dwyBoth}`, per: t('coaching.perOneTime'), href: coachingHref('dwyBoth', locale), featured: false },
  ];

  const planCard = ({ tier, price, per, href, featured }: (typeof plans)[number]) => (
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
  );

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
            <Sparkles size={14} className="text-brand-light2" />
            <span className="text-xs uppercase tracking-widest text-brand-light2">{t('hero.badge')}</span>
          </div>
          <Heading as="h1" size="xl" className="mb-6">
            {t('hero.headline')}
          </Heading>
          <p className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-brand-light2">
            {t('hero.tagline')}
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-brand-light1 text-xl leading-relaxed">
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

      {/* Starter Guide: pick a starting point */}
      <Section className="bg-brand-black">
        <Container>
          <div className="text-center mb-16">
            <Heading as="h2" size="lg">{t('tracks.heading')}</Heading>
            <p className="mt-4 text-brand-light1 max-w-2xl mx-auto">{t('tracks.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {(['forYou', 'forBusiness'] as const).map((id) => {
              const Icon = id === 'forYou' ? User : Store;
              return (
                <div key={id}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className="text-brand-light2" />
                    <h3 className="font-display text-xl text-brand-white uppercase tracking-tight">{t(`tracks.${id}.title`)}</h3>
                  </div>
                  <p className="text-sm text-brand-light1 mb-6">{t(`tracks.${id}.desc`)}</p>
                  <div className="space-y-3">
                    {TRACKS[id].map((number) => {
                      const mod = modules.find((m) => m.number === number);
                      if (!mod) return null;
                      return (
                        <div key={number} className="bg-brand-dark1 border border-brand-dark2 p-5 flex gap-4">
                          <div className="font-display text-3xl leading-none text-brand-dark2 flex-shrink-0 w-10">{number}</div>
                          <div className="min-w-0">
                            <h4 className="font-display text-base text-brand-white uppercase tracking-tight">{mod.title}</h4>
                            <p className="mt-1 text-sm text-brand-light1 leading-relaxed">{getModule(number, locale)?.summary}</p>
                            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-mid">
                              <span className="flex items-center gap-1.5"><Clock size={12} />{mod.time}</span>
                              <span className="flex items-center gap-1.5">
                                <BookOpen size={12} />
                                {t('modules.contents', { lessons: lessonsCount(number), questions: getQuiz(number, locale)?.length ?? 0 })}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button href={`/${locale}/academy/login?role=student`} variant="primary">
              {t('hero.enrollCta')}
            </Button>
            <p className="mt-3 text-xs text-brand-mid">{t('tracks.note')}</p>
          </div>
        </Container>
      </Section>

      {/* How every lesson works */}
      <Section className="bg-brand-near-black border-t border-brand-dark2">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" size="lg">{t('how.heading')}</Heading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItems.map((item, i) => {
              const Icon = [MessageSquareText, Timer, ListChecks, BookOpen][i] ?? Check;
              return (
                <div key={item.title} className="bg-brand-dark1 border border-brand-dark2 p-6">
                  <Icon size={22} className="text-brand-light2 mb-4" />
                  <h3 className="font-display text-lg text-brand-white uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="text-brand-light1 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* AI Marketing Course overview */}
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
                <div className="flex items-start justify-between gap-4 mb-5">
                  <ModuleGlyph index={i} />
                  <div className="font-display text-4xl leading-none text-brand-dark2">
                    {String(i + 1).padStart(2, '0')}
                  </div>
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
            {courseModules.map((mod, i) => (
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
                      lessons: lessonsCount(mod.number),
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
        </Container>
      </Section>

      {/* Plain-English glossary */}
      <Section className="bg-brand-black border-t border-brand-dark2">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
            <div className="text-center lg:text-left">
              <Heading as="h2" size="lg">{t('glossaryPromo.heading')}</Heading>
              <p className="mt-4 text-brand-light1 leading-relaxed">{t('glossaryPromo.desc', { count: GLOSSARY.length })}</p>
              <div className="mt-8">
                <Button href={`/${locale}/academy/glossary`} variant="outline">
                  {t('glossary.openGlossary')} <ArrowRight size={14} />
                </Button>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleTerms.map(([term, definition]) => (
                <div key={term} className="bg-brand-dark1 border border-brand-dark2 p-5">
                  <dt className="font-display text-base text-brand-white uppercase tracking-tight">{term}</dt>
                  <dd className="mt-2 text-sm text-brand-light1 leading-relaxed">{definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {/* Certificate CTA */}
      <Section className="bg-brand-dark1 border-t border-brand-dark2">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex w-11 h-11 border border-brand-dark2 items-center justify-center">
                <Award size={20} className="text-brand-light2" />
              </div>
              <Heading as="h2" size="md">{t('overview.certificate.heading')}</Heading>
              <p className="mt-4 text-brand-light1 leading-relaxed max-w-xl mx-auto lg:mx-0">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{plans.map(planCard)}</div>

          <div className="text-center mt-20 mb-12">
            <Heading as="h3" size="md">{t('coaching.dwy.heading')}</Heading>
            <p className="mt-4 text-brand-light1 max-w-2xl mx-auto">{t('coaching.dwy.subheading')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">{dwyPlans.map(planCard)}</div>
          <p className="mt-4 text-center text-xs text-brand-mid max-w-2xl mx-auto">{t('coaching.dwy.note')}</p>

          <div className="mt-12 max-w-4xl mx-auto bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
            <Users size={28} className="text-brand-light2 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-display text-lg text-brand-white uppercase tracking-tight">{t('coaching.team.heading')}</h3>
              <p className="mt-2 text-sm text-brand-light1">{t('coaching.team.desc')}</p>
            </div>
            <Button href={coachingHref('team', locale)} variant="outline" className="flex-shrink-0">
              {t('coaching.team.cta')}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-brand-mid">{t('coaching.note')}</p>
        </Container>
      </Section>
    </>
  );
}
