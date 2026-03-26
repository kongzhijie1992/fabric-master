import Image from 'next/image';
import {getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';
import {Hero} from '@/components/hero';
import {SectionHeading} from '@/components/section-heading';
import {Stats} from '@/components/stats';
import {FeatureGrid} from '@/components/feature-grid';
import {FaqAccordion} from '@/components/faq-accordion';
import {CtaBand} from '@/components/cta-band';
import {StitchShowcase} from '@/components/stitch-showcase';
import {ErrorBoundary} from '@/components/error-boundary';
import {toAssetUrl} from '@/lib/asset';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '首页' : 'Home',
    description: content.metaDescription,
    path: ''
  });
}

export default async function HomePage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return (
    <>
      <Hero
        locale={locale}
        badge={content.hero.badge}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        bullets={content.hero.bullets}
      />

      {/* Visual Showcase Section - New premium visual element */}
      <ErrorBoundary>
        <StitchShowcase locale={locale} />
      </ErrorBoundary>

      <section className="section-gap pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading title={content.factoryAtGlance.title} description={content.factoryAtGlance.description} />
          <Stats items={content.factoryAtGlance.stats} />
        </div>
      </section>

      <section className="section-gap pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading title={content.whyUs.title} />
          <FeatureGrid items={content.whyUs.items.map((item) => ({title: item.title, description: item.description}))} />
        </div>
      </section>

      <section className="section-gap pt-0">
        <div className="container-shell">
          <SectionHeading title={locale === 'zh' ? '信任信息模块' : 'Trust Blocks'} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.trustBlocks.map((block) => (
              <article key={block.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h3 className="text-base font-semibold text-slate-900">{block.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap pt-0">
        <div className="container-shell">
          <SectionHeading
            title={locale === 'zh' ? 'What We Make（可编辑）' : 'What We Make (Editable)'}
            description={content.products.subtitle}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {content.products.categories.map((category) => (
              <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <Image
                  src={toAssetUrl(category.image)}
                  alt={category.label}
                  width={800}
                  height={620}
                  className="h-auto w-full"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{category.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap pt-0">
        <div className="container-shell">
          <SectionHeading title={content.faq.title} />
          <div className="mt-8">
            <FaqAccordion items={content.faq.items} />
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
