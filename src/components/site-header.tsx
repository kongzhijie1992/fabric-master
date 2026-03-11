'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {AppLocale} from '@/i18n/routing';
import {Link, usePathname, useRouter} from '@/i18n/navigation';

const navItems = [
  {key: 'home', href: '/'},
  {key: 'capabilities', href: '/capabilities'},
  {key: 'quality', href: '/quality-compliance'},
  {key: 'products', href: '/products'},
  {key: 'about', href: '/about'},
  {key: 'contact', href: '/contact'},
  {key: 'legal', href: '/legal/privacy'}
] as const;

export function SiteHeader() {
  const tNav = useTranslations('Navigation');
  const tCta = useTranslations('CTA');
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nextLocale: AppLocale = locale === 'zh' ? 'en' : 'zh';

  function handleToggleLocale() {
    router.replace(pathname, {locale: nextLocale});
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">德州市第二职业中等专业学校服装加工厂</p>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className="text-sm text-slate-700 transition hover:text-brand-700">
              {tNav(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={handleToggleLocale}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </button>
          <Link
            href="/contact"
            className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            {tCta('requestQuote')}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          MENU
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleToggleLocale}
              className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              {locale === 'zh' ? 'EN' : '中文'}
            </button>
            <Link
              href="/contact"
              className="rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {tCta('requestQuote')}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
