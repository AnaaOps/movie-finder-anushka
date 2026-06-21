// lib/api.js
// Client-side helper. Calls our own /api/movies routes (same-origin, no key
// needed in the browser, no CORS issues).

export async function fetchMovies({ query = "", page = 1 } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("page", String(page));

  const res = await fetch(`/api/movies?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong fetching movies.");
  }
  return data; // { results, page, totalPages, totalResults }
}

export async function fetchMovieDetails(id) {
  const res = await fetch(`/api/movies/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong fetching this movie.");
  }
  return data;
}
