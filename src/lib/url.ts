import 'server-only';
import {env} from '@/lib/env';

export function toAbsoluteUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}${normalizedPath}`;
}
