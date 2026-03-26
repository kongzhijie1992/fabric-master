'use client';

import {useEffect} from 'react';
import {useRouter} from '@/i18n/navigation';
import type {AppLocale} from '@/i18n/routing';

const ROUTE_PATHS = [
  '/',
  '/capabilities',
  '/products',
  '/about',
  '/contact',
  '/legal/privacy',
  '/legal/terms'
] as const;

export function RoutePrefetcher({locale}: {locale: AppLocale}) {
  const router = useRouter();

  useEffect(() => {
    const prefetch = () => {
      for (const path of ROUTE_PATHS) {
        router.prefetch(path, {locale});
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(prefetch, {timeout: 1500});
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(prefetch, 250);
    return () => clearTimeout(timeoutId);
  }, [locale, router]);

  return null;
}
