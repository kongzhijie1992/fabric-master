'use client';

import {useState} from 'react';

export function FaqAccordion({items}: {items: Array<{q: string; a: string}>}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft">
      {items.map((item, index) => (
        <article key={item.q} className="p-5">
          <button
            type="button"
            onClick={() => setOpen((value) => (value === index ? null : index))}
            className="flex w-full items-center justify-between gap-6 text-left"
          >
            <span className="text-base font-semibold text-slate-900">{item.q}</span>
            <span className="text-xl text-brand-700">{open === index ? '−' : '+'}</span>
          </button>
          {open === index ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p> : null}
        </article>
      ))}
    </div>
  );
}
