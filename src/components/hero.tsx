import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import {toAssetUrl} from '@/lib/asset';

export async function Hero({
  locale,
  badge,
  title,
  subtitle,
  bullets
}: {
  locale: AppLocale;
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  const tCta = await getTranslations({locale, namespace: 'CTA'});

  return (
    <section className="section-gap pt-14">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {badge}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{subtitle}</p>
          <ul className="mt-6 space-y-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="h-2 w-2 rounded-full bg-brand-600" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800">
              {tCta('requestQuote')}
            </Link>
            <a
              href={toAssetUrl('/capability-deck.pdf')}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              {tCta('downloadDeck')}
            </a>
          </div>
        </div>

        <div className="relative rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
          <Image
            src={toAssetUrl('/factory/hero-placeholder.svg')}
            alt="Factory placeholder"
            width={960}
            height={720}
            priority
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
