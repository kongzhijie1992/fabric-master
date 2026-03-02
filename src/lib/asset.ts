import 'server-only';
import {env} from '@/lib/env';

export function toAssetUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!env.ASSET_BASE_URL) {
    return normalizedPath;
  }

  return `${env.ASSET_BASE_URL}${normalizedPath}`;
}
