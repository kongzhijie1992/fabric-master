import {SectionHeading} from '@/components/section-heading';
import {getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
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
  const content = getContent(locale);

  return (
    <div className="section-gap">
      <div className="container-shell space-y-14">
        <section>
          <SectionHeading title={content.quality.title} description={content.quality.intro} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.quality.checkpoints.map((checkpoint) => (
              <article key={checkpoint.stage} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h3 className="text-lg font-semibold text-slate-900">{checkpoint.stage}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{checkpoint.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-900">{content.quality.certificationTitle}</h3>
          <ul className="mt-4 space-y-3">
            {content.quality.certifications.map((item) => (
              <li key={item.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-slate-700">{item.status}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">{content.quality.disclaimer}</p>
        </section>
      </div>
    </div>
  );
}
