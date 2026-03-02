import {Link} from '@/i18n/navigation';
import {getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '提交成功' : 'Submission Success',
    description: content.contact.successMessage,
    path: '/contact/success'
  });
}

export default async function ContactSuccessPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return (
    <div className="section-gap">
      <div className="container-shell max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-soft">
          <h1 className="text-3xl font-semibold text-slate-900">{content.contact.successTitle}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{content.contact.successMessage}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/" className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
              {locale === 'zh' ? '返回首页' : 'Back to Home'}
            </Link>
            <Link href="/products" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">
              {locale === 'zh' ? '浏览产品' : 'Browse Products'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
