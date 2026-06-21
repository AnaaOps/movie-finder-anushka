// lib/omdb.js
// Server-only helper for the OMDb API (https://www.omdbapi.com).
//
// OMDb is shaped very differently from TMDB, so this file normalizes
// everything into the same movie shape the rest of the app already uses:
//   { id, title, poster_path (absolute URL or null), release_date ("YYYY-01-01"),
//     vote_average (number or null), runtime, genres, overview, tagline }
//
// Key differences from TMDB this file works around:
// 1. OMDb has no "popular/trending" endpoint — it's search-only. We fake a
//    browse feed by searching a broad default term ("movie").
// 2. OMDb's search endpoint returns 10 results per page (fixed) and does
//    NOT include a rating — only Title/Year/Poster/imdbID. To show a rating
//    on the browse grid (required by the spec), we fetch full details for
//    each of the 12 items in the window and merge the rating in.
// 3. OMDb returns Year only (no month/day), and an absolute Poster URL
//    (or the string "N/A") instead of a relative path.

const OMDB_BASE = "https://www.omdbapi.com/";
const OMDB_PAGE_SIZE = 10; // fixed by OMDb, not configurable
export const PAGE_SIZE = 12; // required by the assignment spec (R1)
const DEFAULT_BROWSE_QUERY = "movie"; // stand-in for "popular" — OMDb has no such endpoint

function getApiKey() {
  const key = process.env.OMDB_API_KEY;
  if (!key) {
    throw new Error(
      "Missing OMDB_API_KEY. Add it to .env.local (see .env.local.example)."
    );
  }
  return key;
}

async function fetchOmdbSearchPage(query, omdbPage) {
  const url = new URL(OMDB_BASE);
  url.searchParams.set("apikey", getApiKey());
  url.searchParams.set("s", query);
  url.searchParams.set("type", "movie");
  url.searchParams.set("page", String(omdbPage));

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 30 } });
  if (!res.ok) {
    throw new Error(`OMDb request failed (${res.status} ${res.statusText})`);
  }
  const data = await res.json();

  if (data.Response === "False") {
    // "Movie not found!" just means zero matches — that's a valid empty
    // result, not an error. Anything else (bad key, etc.) is a real error.
    if (data.Error === "Movie not found!") {
      return { Search: [], totalResults: "0" };
    }
    throw new Error(data.Error || "OMDb request failed.");
  }

  return data;
}

async function fetchOmdbDetails(imdbID) {
  const url = new URL(OMDB_BASE);
  url.searchParams.set("apikey", getApiKey());
  url.searchParams.set("i", imdbID);
  url.searchParams.set("plot", "full");

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 } });
  if (!res.ok) {
    throw new Error(`OMDb request failed (${res.status} ${res.statusText})`);
  }
  const data = await res.json();
  if (data.Response === "False") return null;
  return data;
}

function normalizePoster(poster) {
  return poster && poster !== "N/A" ? poster : null;
}

function normalizeYear(year) {
  // OMDb years can come as "2014" or sometimes a range like "2014–2016".
  const clean = (year || "").toString().slice(0, 4);
  return /^\d{4}$/.test(clean) ? `${clean}-01-01` : null;
}

function normalizeRating(imdbRating) {
  const n = parseFloat(imdbRating);
  return Number.isFinite(n) ? n : null;
}

function normalizeSearchItem(item) {
  return {
    id: item.imdbID,
    title: item.Title,
    poster_path: normalizePoster(item.Poster),
    release_date: normalizeYear(item.Year),
    vote_average: null, // not available from search; filled in below
  };
}

function normalizeDetail(item) {
  const runtimeMatch = /(\d+)/.exec(item.Runtime || "");
  return {
    id: item.imdbID,
    title: item.Title,
    poster_path: normalizePoster(item.Poster),
    release_date: normalizeYear(item.Year),
    vote_average: normalizeRating(item.imdbRating),
    runtime: runtimeMatch ? parseInt(runtimeMatch[1], 10) : null,
    genres: item.Genre ? item.Genre.split(",").map((g) => g.trim()) : [],
    overview: item.Plot && item.Plot !== "N/A" ? item.Plot : "",
    tagline: null,
  };
}

/**
 * Returns exactly PAGE_SIZE (12) results for the given 1-indexed "our page",
 * regardless of OMDb's fixed 10-per-page response size, by fetching the one
 * or two underlying OMDb pages that overlap our window and slicing — same
 * approach used for TMDB, just with a 10-item page size instead of 20.
 */
async function getPagedResults(query, ourPage) {
  const page = Math.max(1, parseInt(ourPage, 10) || 1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndexExclusive = startIndex + PAGE_SIZE;

  const omdbPageStart = Math.floor(startIndex / OMDB_PAGE_SIZE) + 1;
  const omdbPageEnd = Math.floor((endIndexExclusive - 1) / OMDB_PAGE_SIZE) + 1;

  const omdbPagesToFetch = [];
  for (let p = omdbPageStart; p <= omdbPageEnd; p++) omdbPagesToFetch.push(p);

  const responses = await Promise.all(
    omdbPagesToFetch.map((p) => fetchOmdbSearchPage(query, p))
  );

  const combined = responses.flatMap((r) => r.Search || []);
  const windowOffset = startIndex - (omdbPageStart - 1) * OMDB_PAGE_SIZE;
  const windowItems = combined.slice(windowOffset, windowOffset + PAGE_SIZE);

  const totalResults = parseInt(responses[0]?.totalResults || "0", 10) || 0;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  // OMDb's search endpoint doesn't include a rating, but the grid needs
  // one — so fetch full details for just this page's 12 items in parallel
  // and merge the rating (and a couple of other fields) in.
  const detailed = await Promise.all(
    windowItems.map(async (item) => {
      const base = normalizeSearchItem(item);
      try {
        const full = await fetchOmdbDetails(item.imdbID);
        return full ? { ...base, vote_average: normalizeRating(full.imdbRating) } : base;
      } catch {
        return base; // rating stays null if one lookup fails; don't fail the whole page
      }
    })
  );

  return { results: detailed, page, totalPages, totalResults };
}

export function getPopular(ourPage) {
  return getPagedResults(DEFAULT_BROWSE_QUERY, ourPage);
}

export function searchMovies(query, ourPage) {
  return getPagedResults(query, ourPage);
}

export async function getMovieDetails(id) {
  const data = await fetchOmdbDetails(id);
  return data ? normalizeDetail(data) : null;
}
