export function FeatureGrid({items}: {items: Array<{title: string; description: string}>}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
