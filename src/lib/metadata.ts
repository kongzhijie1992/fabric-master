import 'server-only';
import type {Metadata} from 'next';
import {companyFacts} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {toAbsoluteUrl} from '@/lib/url';

export function buildPageMetadata({
  locale,
  title,
  description,
  path
}: {
  locale: AppLocale;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const localizedPath = `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
  const canonical = toAbsoluteUrl(localizedPath);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'zh-CN': toAbsoluteUrl(`/zh${path}`),
        en: toAbsoluteUrl(`/en${path}`)
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: companyFacts.nameCn,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: toAbsoluteUrl('/factory/og-placeholder.svg'),
          width: 1200,
          height: 630,
          alt: companyFacts.nameCn
        }
      ]
    }
  };
}
