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
                <span className="font-semibold">Materials:</span> {item.materials}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">MOQ:</span> {item.moq}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Lead time:</span> {item.leadTime}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Customization:</span> {item.customization}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
