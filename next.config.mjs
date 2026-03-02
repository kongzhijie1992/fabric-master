import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const remotePatterns = [];

if (process.env.ASSET_BASE_URL) {
  try {
    const url = new URL(process.env.ASSET_BASE_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port,
      pathname: '/**'
    });
  } catch (error) {
    console.warn('Invalid ASSET_BASE_URL. Remote image optimization for CDN assets is disabled.', error);
  }
}

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns
  }
};

export default withNextIntl(nextConfig);
