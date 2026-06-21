"use client";

import { useFavorites } from "@/context/FavoritesContext";
import MovieGrid from "@/components/MovieGrid";
import { LoadingState } from "@/components/States";

export default function FavoritesPage() {
  const { favorites, hydrated } = useFavorites();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl tracking-marquee text-ink sm:text-4xl">
        YOUR FAVORITES
      </h1>

      {!hydrated && <LoadingState />}

      {hydrated && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="font-display text-lg tracking-marquee text-ink">
            NO FAVORITES YET
          </p>
          <p className="max-w-sm text-sm text-muted">
            Tap the ♡ on any movie to save it here. It stays saved even after
            you reload the page.
          </p>
        </div>
      )}

      {hydrated && favorites.length > 0 && <MovieGrid movies={favorites} />}
    </div>
  );
}
