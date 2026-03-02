'use client';

import {FormEvent, useState} from 'react';
import Script from 'next/script';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import type {AppLocale} from '@/i18n/routing';

declare global {
  interface Window {
    TencentCaptcha?: new (
      appId: string,
      callback: (payload: {ret: number; ticket?: string; randstr?: string}) => void
    ) => {show: () => void};
  }
}

type FormLabels = {
  name: string;
  company: string;
  email: string;
  whatsappWechat: string;
  productType: string;
  targetQuantity: string;
  targetPrice: string;
  deliveryDate: string;
  techPack: string;
  message: string;
};

type Placeholders = {
  productType: string;
  targetQuantity: string;
  targetPrice: string;
  message: string;
};

export function RfqForm({
  locale,
  labels,
  placeholders,
  captchaAppId
}: {
  locale: AppLocale;
  labels: FormLabels;
  placeholders: Placeholders;
  captchaAppId?: string;
}) {
  const tCta = useTranslations('CTA');
  const tForm = useTranslations('Form');
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [captchaTicket, setCaptchaTicket] = useState('');
  const [captchaRandstr, setCaptchaRandstr] = useState('');

  const captchaEnabled = Boolean(captchaAppId);

  function runCaptcha() {
    if (!captchaAppId || !window.TencentCaptcha) {
      setError(tForm('captchaRequired'));
      return;
    }

    const captcha = new window.TencentCaptcha(captchaAppId, (payload) => {
      if (payload.ret === 0) {
        setCaptchaTicket(payload.ticket || '');
        setCaptchaRandstr(payload.randstr || '');
        setError('');
      }
    });

    captcha.show();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    formData.set('locale', locale);
    formData.set('sourcePage', `/${locale}/contact`);

    if (captchaEnabled) {
      formData.set('captchaTicket', captchaTicket);
      formData.set('captchaRandstr', captchaRandstr);

      if (!captchaTicket || !captchaRandstr) {
        setSubmitting(false);
        setError(tForm('captchaRequired'));
        return;
      }
    }

    const response = await fetch('/api/rfq', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {message?: string};
      setSubmitting(false);
      setError(payload.message || 'Request failed.');
      return;
    }

    formElement.reset();
    setSubmitting(false);
    router.push(`/${locale}/contact/success`);
  }

  return (
    <>
      {captchaEnabled ? <Script src="https://ssl.captcha.qq.com/TCaptcha.js" strategy="afterInteractive" /> : null}
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            {labels.name}
            <input name="name" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.company}
            <input name="company" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.email}
            <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.whatsappWechat}
            <input name="whatsappWechat" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.productType}
            <input
              name="productType"
              required
              placeholder={placeholders.productType}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.targetQuantity}
            <input
              name="targetQuantity"
              required
              placeholder={placeholders.targetQuantity}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.targetPrice}
            <input
              name="targetPrice"
              placeholder={placeholders.targetPrice}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.deliveryDate}
            <input name="targetDeliveryDate" type="date" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          {labels.techPack}
          <input
            name="techPack"
            type="file"
            accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          {labels.message}
          <textarea
            name="message"
            required
            rows={5}
            placeholder={placeholders.message}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          placeholder="Leave this field empty"
        />

        {captchaEnabled ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <button
              type="button"
              onClick={runCaptcha}
              className="rounded-full border border-brand-600 px-3 py-2 text-xs font-semibold text-brand-700"
            >
              {captchaTicket ? tForm('captchaVerified') : tForm('captchaVerify')}
            </button>
          </div>
        ) : null}

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? tForm('sending') : tCta('submit')}
        </button>
      </form>
    </>
  );
}
