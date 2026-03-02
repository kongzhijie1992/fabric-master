import Image from 'next/image';
import {LicenseInfoCard} from '@/components/license-info-card';
import {SectionHeading} from '@/components/section-heading';
import {companyFacts, getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {toAssetUrl} from '@/lib/asset';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '关于我们' : 'About Us',
    description: content.about.paragraphs.join(' '),
    path: '/about'
  });
}

export default async function AboutPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return (
    <div className="section-gap">
      <div className="container-shell space-y-12">
        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading title={content.about.title} />
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="text-xs text-slate-500">{content.about.scopeNote}</p>
            </div>
          </div>
          <LicenseInfoCard />
        </section>

        <section>
          <SectionHeading title={locale === 'zh' ? '工厂照片（占位，后续可替换）' : 'Factory Photos (Placeholders, Replace Later)'} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {['/factory/workshop-1.svg', '/factory/workshop-2.svg', '/factory/workshop-3.svg'].map((image) => (
              <Image
                key={image}
                src={toAssetUrl(image)}
                alt={companyFacts.nameCn}
                width={900}
                height={680}
                className="h-auto w-full rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
