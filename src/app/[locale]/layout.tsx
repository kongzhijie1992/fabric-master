import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import type {ReactNode} from 'react';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {BaiduTongji} from '@/components/baidu-tongji';
import {RoutePrefetcher} from '@/components/route-prefetcher';
import {companyFacts} from '@/content/site';
import {routing, type AppLocale} from '@/i18n/routing';
import {env} from '@/lib/env';
import {toAbsoluteUrl} from '@/lib/url';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const resolvedLocale = routing.locales.includes(locale as AppLocale) ? (locale as AppLocale) : routing.defaultLocale;

  return {
    title: {
      default: companyFacts.nameCn,
      template: `%s | ${companyFacts.nameCn}`
    },
    description:
      resolvedLocale === 'zh'
        ? '面向品牌客户的服装OEM/ODM生产合作网站。'
        : 'B2B garment OEM/ODM manufacturing partner website for brand clients.',
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    openGraph: {
      title: companyFacts.nameCn,
      description:
        resolvedLocale === 'zh'
          ? '服装制造及相关产品，支持打样与大货。'
          : 'Garment manufacturing and related apparel/textile products.',
      url: toAbsoluteUrl(`/${resolvedLocale}`),
      siteName: companyFacts.nameCn,
      locale: resolvedLocale === 'zh' ? 'zh_CN' : 'en_US',
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

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  const resolvedLocale = locale as AppLocale;
  unstable_setRequestLocale(resolvedLocale);
  const messages = await getMessages({locale: resolvedLocale});

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyFacts.nameCn,
    alternateName: companyFacts.nameEn,
    url: env.NEXT_PUBLIC_SITE_URL,
    identifier: companyFacts.unifiedSocialCreditCode,
    foundingDate: companyFacts.establishedDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyFacts.addressCn,
      addressCountry: 'CN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-158-0681-2960',
      contactType: 'sales',
      availableLanguage: ['Chinese', 'English']
    },
    sameAs: []
  };

  return (
    <NextIntlClientProvider messages={messages} locale={resolvedLocale}>
      {env.BAIDU_TONGJI_ID ? <BaiduTongji siteId={env.BAIDU_TONGJI_ID} /> : null}
      <RoutePrefetcher locale={resolvedLocale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}} />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={resolvedLocale} />
      </div>
    </NextIntlClientProvider>
  );
}
