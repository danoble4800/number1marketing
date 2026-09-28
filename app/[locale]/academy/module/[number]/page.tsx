import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import AcademyModuleClient from '@/components/academy/AcademyModuleClient';
import { course, getModule } from '@/content/academy/lessons';
import { quizzes } from '@/content/academy/quizzes';

type ModuleItem = { number: string; title: string; time: string };

export function generateStaticParams() {
  const locales = ['en', 'es', 'pt'];
  return locales.flatMap((locale) => course.map((m) => ({ locale, number: m.number })));
}

export const metadata: Metadata = {
  title: 'Academy Module | Number 1 Digital Marketing',
  robots: { index: false, follow: false },
};

export default async function AcademyModulePage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale, number } = await params;
  setRequestLocale(locale);

  const courseModule = getModule(number);
  const quiz = quizzes[number];
  if (!courseModule || !quiz) notFound();

  const t = await getTranslations({ locale, namespace: 'academy' });
  const items = t.raw('modules.items') as ModuleItem[];
  const item = items.find((m) => m.number === number);
  const index = course.findIndex((m) => m.number === number);
  const nextNumber = course[index + 1]?.number ?? null;

  return (
    <AcademyModuleClient
      locale={locale}
      courseModule={courseModule}
      title={item?.title ?? ''}
      time={item?.time ?? ''}
      quiz={quiz}
      nextNumber={nextNumber}
    />
  );
}
