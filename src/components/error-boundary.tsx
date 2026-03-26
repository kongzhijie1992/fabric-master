'use client';

import {Component, type ErrorInfo, type ReactNode} from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to monitoring service here (e.g., Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-red-800">Something went wrong</h2>
            <p className="mb-4 text-sm text-red-600">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-red-700 px-6 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error ? (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-red-700">Error Details</summary>
                <pre className="mt-2 overflow-auto rounded bg-red-900 p-3 text-xs text-red-100">
                  {this.state.error.toString()}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
