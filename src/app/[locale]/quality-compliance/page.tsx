import {SectionHeading} from '@/components/section-heading';
import {getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';
import {redirect} from 'next/navigation';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  
  // Redirect to capabilities page since quality & compliance is now merged
  redirect(`/${locale}/capabilities`);
  
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '质量与合规' : 'Quality & Compliance',
    description: content.quality.intro,
    path: '/quality-compliance'
  });
}

export default async function QualityPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  
  // Redirect to capabilities page
  redirect(`/${locale}/capabilities`);
}
