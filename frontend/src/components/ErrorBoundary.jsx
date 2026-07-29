import { Component } from "react";

/**
 * ErrorBoundary — catches unhandled rendering errors and displays a
 * studio-themed fallback screen instead of crashing the entire UI.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <Routes>...</Routes>
 *   </ErrorBoundary>
 *
 * Props:
 *   - fallbackTitle: Custom title for the error card (default: "Unexpected Cut!")
 *   - onError:       Optional callback fired with (error, errorInfo)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log full details for debugging (visible to devs / open-source contributors)
    console.error("[ErrorBoundary] Unhandled rendering error:", error);
    if (errorInfo?.componentStack) {
      console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackCard
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onReload={this.handleReload}
        title={this.props.fallbackTitle}
      />;
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Fallback UI
// ---------------------------------------------------------------------------

const ErrorFallbackCard = ({ error, errorInfo, onReload, title }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-[#020617] p-6"
    >
      <div className="w-full max-w-lg rounded-2xl border border-red-800/40 bg-[#111827] p-8 text-center shadow-2xl shadow-red-900/10">
        {/* Clapperboard icon */}
        <div className="mb-5 flex justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-900/20 text-5xl" aria-hidden="true">
            🎬
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-bold text-red-400">
          {title || "Unexpected Cut!"}
        </h2>

        {/* Subtitle */}
        <p className="mb-2 text-sm text-slate-400">
          A critical scene failed to load and the projector stopped.
        </p>
        <p className="mb-6 text-xs text-slate-500">
          Don&apos;t worry — your game data is safe. Reload to resume.
        </p>

        {/* Dev-only error details */}
        {isDev && error && (
          <div className="mb-6 overflow-auto rounded-lg border border-slate-700/50 bg-slate-900/80 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-semibold text-red-400">
              {error.name}: {error.message}
            </p>
            {errorInfo?.componentStack && (
              <details className="group mt-2">
                <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-300">
                  Component stack
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-slate-500">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {onReload && (
            <button
              onClick={onReload}
              className="w-full rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto"
            >
              Reload Game Session
            </button>
          )}
          <a
            href="/"
            className="w-full rounded-xl border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
