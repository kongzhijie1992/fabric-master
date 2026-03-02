export function Stats({
  items
}: {
  items: Array<{label: string; value: string; note: string}>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
          <p className="mt-2 text-sm text-slate-600">{item.note}</p>
        </article>
      ))}
    </div>
  );
}
