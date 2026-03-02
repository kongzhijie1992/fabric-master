import {ProductGallery} from '@/components/product-gallery';
import {SectionHeading} from '@/components/section-heading';
import {getContent} from '@/content/site';
import type {AppLocale} from '@/i18n/routing';
import {toAssetUrl} from '@/lib/asset';
import {buildPageMetadata} from '@/lib/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  return buildPageMetadata({
    locale,
    title: locale === 'zh' ? '产品中心' : 'Products',
    description: content.products.subtitle,
    path: '/products'
  });
}

export default async function ProductsPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const content = getContent(locale);

  const products = content.products.categories.map((item) => ({
    ...item,
    image: toAssetUrl(item.image)
  }));

  return (
    <div className="section-gap">
      <div className="container-shell">
        <SectionHeading title={content.products.title} description={content.products.subtitle} />
        <div className="mt-8">
          <ProductGallery allLabel={content.products.allFilter} products={products} />
        </div>
      </div>
    </div>
  );
}
