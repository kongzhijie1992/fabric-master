import {SectionHeading} from '@/components/section-heading';
import {Timeline} from '@/components/timeline';
import {getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '生产能力' : 'Capabilities',
    description: content.capabilities.introText,
    path: '/capabilities'
  });
}

export default async function CapabilitiesPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return (
    <div className="section-gap">
      <div className="container-shell space-y-16">
        <section>
          <SectionHeading
            eyebrow="OEM / ODM"
            title={content.capabilities.introTitle}
            description={content.capabilities.introText}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {content.capabilities.items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading title={content.capabilities.timelineTitle} />
          <div className="mt-8">
            <Timeline items={content.capabilities.timeline} />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-900">{content.capabilities.equipmentTitle}</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4 font-medium">Item</th>
                    <th className="py-2 pr-4 font-medium">Spec</th>
                    <th className="py-2 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {content.capabilities.equipmentTable.map((row) => (
                    <tr key={row.item} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-medium text-slate-900">{row.item}</td>
                      <td className="py-2 pr-4 text-slate-700">{row.placeholderSpec}</td>
                      <td className="py-2 text-slate-600">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-900">{content.capabilities.moqLeadTitle}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {content.capabilities.moqLeadItems.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <dt className="font-semibold text-slate-900">{item.label}</dt>
                  <dd className="mt-1 text-slate-700">{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </section>
      </div>
    </div>
  );
}
