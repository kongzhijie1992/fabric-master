import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import {toAssetUrl} from '@/lib/asset';

export async function CtaBand({locale}: {locale: AppLocale}) {
  const tCta = await getTranslations({locale, namespace: 'CTA'});

  return (
    <section className="section-gap">
      <div className="container-shell">
        <div className="rounded-3xl bg-brand-800 px-6 py-12 text-white sm:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-200">OEM / ODM</p>
          <h3 className="mt-3 text-3xl font-semibold">Ready to discuss your bulk order?</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-50">
            Share your tech pack and quantity targets. We can review feasibility and provide a practical quotation path.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-800">
              {tCta('requestQuote')}
            </Link>
            <a
              href={toAssetUrl('/capability-deck.pdf')}
              className="rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-white"
              target="_blank"
              rel="noreferrer"
            >
              {tCta('downloadDeck')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
