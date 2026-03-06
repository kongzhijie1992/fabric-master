import Link from 'next/link';

export default function RootPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Select Language / 选择语言</h1>
        <p className="mt-3 text-sm text-slate-600">
          This static website is available in Chinese and English.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/zh" className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white">
            中文
          </Link>
          <Link href="/en" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800">
            English
          </Link>
        </div>
      </div>
    </main>
  );
}
