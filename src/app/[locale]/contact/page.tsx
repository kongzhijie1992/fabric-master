import {RfqForm} from '@/components/rfq-form';
import {SectionHeading} from '@/components/section-heading';
import {contactConfig, getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {env} from '@/lib/env';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '联系与询盘' : 'Contact / RFQ',
    description: content.contact.subtitle,
    path: '/contact'
  });
}

export default async function ContactPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);
  const whatsapp = (contactConfig as {whatsapp?: string}).whatsapp;

  return (
    <div className="section-gap">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <SectionHeading title={content.contact.title} description={content.contact.subtitle} />
          <dl className="mt-6 space-y-4 text-sm text-slate-700">
            <div>
              <dt className="font-semibold text-slate-900">Email</dt>
              <dd>{contactConfig.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Phone</dt>
              <dd>{contactConfig.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">WeChat</dt>
              <dd>{contactConfig.wechat}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">WhatsApp</dt>
              <dd>{whatsapp || '-'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Address</dt>
              <dd>{contactConfig.address}</dd>
            </div>
          </dl>
        </section>

        <section>
          <RfqForm
            locale={locale}
            labels={content.contact.formLabels}
            placeholders={content.contact.placeholders}
            captchaAppId={env.TENCENT_CAPTCHA_APP_ID}
            rfqEndpoint={env.NEXT_PUBLIC_RFQ_ENDPOINT}
            fallbackEmail={env.NEXT_PUBLIC_RFQ_EMAIL}
          />
        </section>
      </div>
    </div>
  );
}
