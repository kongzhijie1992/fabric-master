import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/i18n/routing';
import {contactConfig} from '@/content/site';
import {Link} from '@/i18n/navigation';

export async function SiteFooter({locale}: {locale: AppLocale}) {
  const tFooter = await getTranslations({locale, namespace: 'Footer'});

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">德州市第二职业中等专业学校服装加工厂</p>
          <p className="mt-2 text-sm text-slate-600">{contactConfig.address}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Contact</p>
          <p className="mt-2 text-sm text-slate-600">Email: {contactConfig.email}</p>
          <p className="text-sm text-slate-600">Phone: {contactConfig.phone}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Legal</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600">
            <Link href="/legal/privacy" className="hover:text-brand-700">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-brand-700">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4">
        <div className="container-shell flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} 德州市第二职业中等专业学校服装加工厂. {tFooter('rights')}
          </p>
          <p>{tFooter('scopeNote')}</p>
        </div>
      </div>
    </footer>
  );
}
