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
  captchaAppId,
  rfqEndpoint,
  fallbackEmail
}: {
  locale: AppLocale;
  labels: FormLabels;
  placeholders: Placeholders;
  captchaAppId?: string;
  rfqEndpoint?: string;
  fallbackEmail: string;
}) {
  const tCta = useTranslations('CTA');
  const tForm = useTranslations('Form');
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [captchaTicket, setCaptchaTicket] = useState('');
  const [captchaRandstr, setCaptchaRandstr] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const captchaEnabled = Boolean(captchaAppId);
  const endpointEnabled = Boolean(rfqEndpoint);

  function validateField(name: string, value: string): string {
    switch (name) {
      case 'email':
        if (!value) return tForm('required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return tForm('invalidEmail');
        return '';
      case 'name':
      case 'company':
      case 'whatsappWechat':
      case 'productType':
      case 'targetQuantity':
      case 'targetDeliveryDate':
      case 'message':
        if (!value) return tForm('required');
        return '';
      default:
        return '';
    }
  }

  function handleBlur(field: string, value: string) {
    setTouched((prev) => ({...prev, [field]: true}));
    const error = validateField(field, value);
    setFormErrors((prev) => ({...prev, [field]: error}));
  }

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

  function buildMailBody(formData: FormData) {
    const rows = [
      `Name: ${String(formData.get('name') || '')}`,
      `Company: ${String(formData.get('company') || '')}`,
      `Email: ${String(formData.get('email') || '')}`,
      `WhatsApp/WeChat: ${String(formData.get('whatsappWechat') || '')}`,
      `Product Type: ${String(formData.get('productType') || '')}`,
      `Target Quantity: ${String(formData.get('targetQuantity') || '')}`,
      `Target Price: ${String(formData.get('targetPrice') || '')}`,
      `Target Delivery Date: ${String(formData.get('targetDeliveryDate') || '')}`,
      '',
      'Message:',
      `${String(formData.get('message') || '')}`,
      '',
      'Note: If you selected a tech pack file in the website form, please attach it in this email manually.'
    ];

    return rows.join('\n');
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Validate all required fields before submission
    const formData = new FormData(event.currentTarget);
    const errors: Record<string, string> = {};
    
    ['name', 'company', 'email', 'whatsappWechat', 'productType', 'targetQuantity', 'targetDeliveryDate', 'message'].forEach((field) => {
      const value = String(formData.get(field) || '');
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouched({
        name: true,
        company: true,
        email: true,
        whatsappWechat: true,
        productType: true,
        targetQuantity: true,
        targetDeliveryDate: true,
        message: true
      });
      setError(tForm('pleaseFixErrors'));
      return;
    }

    setSubmitting(true);
    setError('');

    const formElement = event.currentTarget;
    formData.set('locale', locale);
    formData.set('sourcePage', `/${locale}/contact`);

    const honeypot = String(formData.get('website') || '').trim();
    if (honeypot) {
      setSubmitting(false);
      return;
    }

    if (captchaEnabled) {
      formData.set('captchaTicket', captchaTicket);
      formData.set('captchaRandstr', captchaRandstr);

      if (!captchaTicket || !captchaRandstr) {
        setSubmitting(false);
        setError(tForm('captchaRequired'));
        return;
      }
    }

    try {
      if (endpointEnabled) {
        const response = await fetch(rfqEndpoint!, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        
        if (!response.ok || !result.ok) {
          setSubmitting(false);
          setError(result.message ? tForm(result.message) : tForm('requestFailed'));
          return;
        }
      } else {
        try {
          const subject = encodeURIComponent('RFQ Inquiry');
          const body = encodeURIComponent(buildMailBody(formData));
          window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
        } catch {
          setSubmitting(false);
          setError(tForm('mailClientError'));
          return;
        }
      }

      formElement.reset();
      setCaptchaTicket('');
      setCaptchaRandstr('');
      setFormErrors({});
      setTouched({});
      setSubmitting(false);
      router.push(`/${locale}/contact/success`);
    } catch (err) {
      console.error('Form submission error:', err);
      setSubmitting(false);
      setError(tForm('unexpectedError'));
    }
  }

  return (
    <>
      {captchaEnabled ? <Script src="https://ssl.captcha.qq.com/TCaptcha.js" strategy="afterInteractive" /> : null}
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          {endpointEnabled ? tForm('endpointModeNote') : tForm('staticModeNote')}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            {labels.name}
            <input 
              name="name" 
              required 
              onBlur={(e) => handleBlur('name', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" 
            />
            {touched.name && formErrors.name && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.name}</span>
            )}
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.company}
            <input 
              name="company" 
              required 
              onBlur={(e) => handleBlur('company', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" 
            />
            {touched.company && formErrors.company && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.company}</span>
            )}
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.email}
            <input 
              name="email" 
              type="email" 
              required 
              onBlur={(e) => handleBlur('email', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" 
            />
            {touched.email && formErrors.email && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.email}</span>
            )}
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.whatsappWechat}
            <input 
              name="whatsappWechat" 
              required 
              onBlur={(e) => handleBlur('whatsappWechat', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" 
            />
            {touched.whatsappWechat && formErrors.whatsappWechat && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.whatsappWechat}</span>
            )}
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.productType}
            <input
              name="productType"
              required
              placeholder={placeholders.productType}
              onBlur={(e) => handleBlur('productType', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            {touched.productType && formErrors.productType && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.productType}</span>
            )}
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.targetQuantity}
            <input
              name="targetQuantity"
              required
              placeholder={placeholders.targetQuantity}
              onBlur={(e) => handleBlur('targetQuantity', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            {touched.targetQuantity && formErrors.targetQuantity && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.targetQuantity}</span>
            )}
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.targetPrice}
            <input
              name="targetPrice"
              placeholder={placeholders.targetPrice}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {labels.deliveryDate}
            <input 
              name="targetDeliveryDate" 
              type="date" 
              required 
              onBlur={(e) => handleBlur('targetDeliveryDate', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" 
            />
            {touched.targetDeliveryDate && formErrors.targetDeliveryDate && (
              <span className="mt-1 block text-xs text-red-600">{formErrors.targetDeliveryDate}</span>
            )}
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          {labels.techPack}
          <input
            name="techPack"
            type="file"
            accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          {labels.message}
          <textarea
            name="message"
            required
            rows={5}
            placeholder={placeholders.message}
            onBlur={(e) => handleBlur('message', e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {touched.message && formErrors.message && (
            <span className="mt-1 block text-xs text-red-600">{formErrors.message}</span>
          )}
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

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="relative rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {tForm('sending')}
            </span>
          ) : (
            tCta('submit')
          )}
        </button>
      </form>
    </>
  );
}
