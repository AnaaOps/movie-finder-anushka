"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function FavoriteButton({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(movie)}
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        fav
          ? "bg-velvet text-ink hover:opacity-90"
          : "bg-surface text-ink ring-1 ring-white/15 hover:ring-marquee"
      }`}
    >
      <span>{fav ? "♥" : "♡"}</span>
      {fav ? "Saved to Favorites" : "Add to Favorites"}
    </button>
  );
}
