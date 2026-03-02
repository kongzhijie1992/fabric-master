export function Timeline({items}: {items: string[]}) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {items.map((item, index) => (
        <li key={item} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Step {index + 1}</p>
          <p className="mt-2 text-sm font-medium text-slate-800">{item}</p>
        </li>
      ))}
    </ol>
  );
}
