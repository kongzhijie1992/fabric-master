import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  ...(process.env.NEXT_OUTPUT_MODE === 'export' ? {output: 'export'} : {})
};

export default withNextIntl(nextConfig);
