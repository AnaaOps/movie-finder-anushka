export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-white/10 bg-surface px-5 py-2 text-sm font-medium text-ink transition hover:border-marquee disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Previous
      </button>

      <span className="font-display tracking-marquee text-muted">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border border-white/10 bg-surface px-5 py-2 text-sm font-medium text-ink transition hover:border-marquee disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}
