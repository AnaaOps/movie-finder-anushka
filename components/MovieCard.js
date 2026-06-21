"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

function toFavoritePayload(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };
}

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";

  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface ring-1 ring-white/5 transition hover:ring-marquee/60">
      {/* film-strip perforations */}
      <div className="absolute inset-x-0 top-0 z-10 flex justify-between px-2 pt-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-bg/70" />
        ))}
      </div>

      <Link href={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] w-full bg-surface2">
          {movie.poster_path ? (
            <img
              src={movie.poster_path}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-muted">
              No poster available
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(toFavoritePayload(movie))}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        className={`absolute right-2 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-base shadow transition ${
          fav ? "bg-velvet text-ink" : "bg-bg/70 text-ink hover:bg-velvet/80"
        }`}
      >
        {fav ? "♥" : "♡"}
      </button>

      <Link href={`/movie/${movie.id}`} className="block p-3">
        <h3 className="line-clamp-1 font-body text-sm font-semibold text-ink" title={movie.title}>
          {movie.title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>{year}</span>
          <span className="flex items-center gap-1 font-semibold text-marquee">
            ★ {rating}
          </span>
        </div>
      </Link>
    </div>
  );
}
