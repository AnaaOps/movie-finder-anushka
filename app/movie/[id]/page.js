import Link from "next/link";
import { getMovieDetails } from "@/lib/omdb";
import FavoriteButton from "@/components/FavoriteButton";

export default async function MovieDetailPage({ params }) {
  let movie = null;
  let errorMessage = "";

  try {
    movie = await getMovieDetails(params.id);
  } catch (err) {
    errorMessage = err.message || "Could not load this movie. Please try again.";
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-velvet/30 bg-velvet/5 px-6 py-16 text-center">
        <p className="font-display text-lg tracking-marquee text-velvet">
          SOMETHING CUT THE FEED
        </p>
        <p className="max-w-sm text-sm text-muted">{errorMessage}</p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-velvet px-5 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="font-display text-lg tracking-marquee text-ink">
          MOVIE NOT FOUND
        </p>
        <Link href="/" className="mt-2 text-sm text-marquee underline">
          Back to Browse
        </Link>
      </div>
    );
  }

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const genres = (movie.genres || []).map((g) => g.name).join(" · ");

  const favoritePayload = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };

  return (
    <div>
      <Link href="/" className="mb-6 inline-block text-sm text-muted transition hover:text-ink">
        ← Back to Browse
      </Link>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface2">
          {movie.poster_path ? (
            <img
              src={movie.poster_path}
              alt={`${movie.title} poster`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-muted">
              No poster available
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl tracking-marquee text-ink sm:text-4xl">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="mt-1 italic text-muted">{movie.tagline}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{year}</span>
            {runtime && (
              <>
                <span aria-hidden="true">•</span>
                <span>{runtime}</span>
              </>
            )}
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1 font-semibold text-marquee">
              ★ {rating}
            </span>
          </div>

          {genres && <p className="mt-3 text-sm text-muted">{genres}</p>}

          <p className="mt-6 max-w-2xl leading-relaxed text-ink/90">
            {movie.overview || "No overview available for this title."}
          </p>

          <div className="mt-8">
            <FavoriteButton movie={favoritePayload} />
          </div>
        </div>
      </div>
    </div>
  );
}
