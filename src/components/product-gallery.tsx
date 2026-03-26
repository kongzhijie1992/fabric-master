'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';

type ProductItem = {
  id: string;
  label: string;
  description: string;
  image: string;
  materials: string;
  moq: string;
  leadTime: string;
  customization: string;
};

type LocaleLabels = {
  materials: string;
  moq: string;
  leadTime: string;
  customization: string;
};

const enLabels: LocaleLabels = {
  materials: 'Materials',
  moq: 'MOQ',
  leadTime: 'Lead time',
  customization: 'Customization'
};

const zhLabels: LocaleLabels = {
  materials: '面料',
  moq: '最小起订量',
  leadTime: '交期',
  customization: '定制'
};

function detectLocale(products: ProductItem[]): boolean {
  if (products.length === 0) return false;
  return /[\u4e00-\u9fa5]/.test(products[0].label);
}

export function ProductGallery({
  allLabel,
  products
}: {
  allLabel: string;
  products: ProductItem[];
}) {
  const [active, setActive] = useState<string>('all');

  const filters = useMemo(() => [{id: 'all', label: allLabel}, ...products.map((item) => ({id: item.id, label: item.label}))], [allLabel, products]);

  const visible = active === 'all' ? products : products.filter((item) => item.id === active);

  const isZh = detectLocale(products);
  const labels: LocaleLabels = isZh ? zhLabels : enLabels;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActive(filter.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter.id === active ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <Image src={item.image} alt={item.label} width={700} height={520} className="h-auto w-full" />
            <div className="space-y-2 p-5">
              <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{labels.materials}:</span> {item.materials}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{labels.moq}:</span> {item.moq}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{labels.leadTime}:</span> {item.leadTime}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{labels.customization}:</span> {item.customization}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
