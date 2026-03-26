import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-300">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-800">Page not found</h2>
        <p className="mt-2 text-slate-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
