"use client";

import { useEffect, useState } from "react";

export default function SearchBar({ initialValue = "", onSearch, debounceMs = 400 }) {
  const [value, setValue] = useState(initialValue);

  // Debounce: only fire onSearch after the user pauses typing.
  useEffect(() => {
    const handle = setTimeout(() => {
      onSearch(value.trim());
    }, debounceMs);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a movie title…"
        aria-label="Search for a movie title"
        className="w-full rounded-full border border-white/10 bg-surface px-5 py-3 text-ink placeholder:text-muted focus:border-marquee focus:outline-none focus:ring-1 focus:ring-marquee"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
        >
          ✕
        </button>
      )}
    </div>
  );
}
