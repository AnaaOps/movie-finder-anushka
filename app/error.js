"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-velvet/30 bg-velvet/5 px-6 py-16 text-center">
      <p className="font-display text-lg tracking-marquee text-velvet">
        SOMETHING CUT THE FEED
      </p>
      <p className="max-w-sm text-sm text-muted">
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-full bg-velvet px-5 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
