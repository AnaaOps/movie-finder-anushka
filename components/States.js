export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-marquee" />
      <p className="font-body text-sm">Rolling the film…</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-velvet/30 bg-velvet/5 px-6 py-16 text-center">
      <p className="font-display text-lg tracking-marquee text-velvet">
        SOMETHING CUT THE FEED
      </p>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full bg-velvet px-5 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="font-display text-lg tracking-marquee text-ink">
        NO RESULTS
      </p>
      <p className="max-w-sm text-sm text-muted">
        {query
          ? `Nothing matched "${query}". Try a different title or check the spelling.`
          : "No movies to show right now."}
      </p>
    </div>
  );
}
