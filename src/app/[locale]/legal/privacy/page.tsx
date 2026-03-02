import {SectionHeading} from '@/components/section-heading';
import {companyFacts, contactConfig, getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: content.legal.privacyTitle,
    description: locale === 'zh' ? '隐私政策模板页面。' : 'Privacy policy template page.',
    path: '/legal/privacy'
  });
}

export default async function PrivacyPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;

  return (
    <div className="section-gap">
      <div className="container-shell max-w-4xl space-y-8">
        <SectionHeading
          title={locale === 'zh' ? '隐私政策（模板）' : 'Privacy Policy (Template)'}
          description={
            locale === 'zh'
              ? '本页面为模板，请在上线前根据实际数据处理流程补充。'
              : 'This is a template. Update it based on your actual data handling workflow before launch.'
          }
        />

        <article className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 shadow-soft">
          <p>
            {locale === 'zh'
              ? `${companyFacts.nameCn}（以下简称“我们”）在您通过网站提交询盘时可能收集姓名、公司、联系方式、需求信息及附件资料。`
              : `${companyFacts.nameCn} ("we") may collect your name, company, contact details, inquiry information and uploaded files when you submit RFQ requests.`}
          </p>
          <p className="mt-4">
            {locale === 'zh'
              ? '该等信息用于报价评估、订单沟通与服务改进。未经授权，我们不会向无关第三方出售您的信息。'
              : 'The data is used for quotation review, order communication and service improvement. We do not sell your data to unrelated third parties.'}
          </p>
          <p className="mt-4">
            {locale === 'zh'
              ? `如需查询、更新或删除信息，请通过 ${contactConfig.email} 联系我们。`
              : `To request access, updates or deletion of your data, contact us at ${contactConfig.email}.`}
          </p>
        </article>
      </div>
    </div>
  );
}
