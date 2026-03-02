import type {MetadataRoute} from 'next';
import {env} from '@/lib/env';

const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
const locales = ['zh', 'en'] as const;
const paths = ['', '/capabilities', '/quality-compliance', '/products', '/about', '/contact', '/legal/privacy', '/legal/terms'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : 0.7
    }))
  );
}
