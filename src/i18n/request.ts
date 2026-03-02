import {routing} from '@/i18n/routing';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const resolvedLocale = routing.locales.includes(requested as (typeof routing.locales)[number])
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
