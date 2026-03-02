import {SectionHeading} from '@/components/section-heading';
import {companyFacts, getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: content.legal.termsTitle,
    description: locale === 'zh' ? '使用条款模板页面。' : 'Terms of use template page.',
    path: '/legal/terms'
  });
}

export default async function TermsPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;

  return (
    <div className="section-gap">
      <div className="container-shell max-w-4xl space-y-8">
        <SectionHeading
          title={locale === 'zh' ? '使用条款（模板）' : 'Terms of Use (Template)'}
          description={
            locale === 'zh'
              ? '本页面为模板，请在上线前由法务或顾问审核。'
              : 'This is a template. Review with legal counsel before production launch.'
          }
        />

        <article className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 shadow-soft">
          <p>
            {locale === 'zh'
              ? `本网站内容由 ${companyFacts.nameCn} 提供，仅用于商业信息展示与B2B询盘沟通。`
              : `This website is provided by ${companyFacts.nameCn} for business information and B2B inquiry communication.`}
          </p>
          <p className="mt-4">
            {locale === 'zh'
              ? '用户应确保提交信息真实、合法，不得上传侵权或违法内容。'
              : 'Users must provide lawful and accurate information and must not upload infringing or illegal materials.'}
          </p>
          <p className="mt-4">
            {locale === 'zh'
              ? '除非另有书面约定，网站展示内容不构成最终报价或合同承诺。'
              : 'Unless otherwise agreed in writing, website content does not constitute final quotation or contractual commitment.'}
          </p>
        </article>
      </div>
    </div>
  );
}
