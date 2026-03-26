'use client';

import {useEffect} from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
    
    // Log to monitoring service
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">500</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-800">Something went wrong</h2>
        <p className="mt-2 text-slate-600">
          We apologize for the inconvenience. Our team has been notified.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Go home
        </a>
      </div>
      {process.env.NODE_ENV === 'development' ? (
        <details className="max-w-2xl rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">Error Details</summary>
          <pre className="mt-2 overflow-auto text-xs text-slate-600">
            {error.toString()}
            {error.digest && `\n\nDigest: ${error.digest}`}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
