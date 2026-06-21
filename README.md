# Reel Find — Movie Discovery App

A movie discovery app built with Next.js (App Router) and the [OMDb API](https://www.omdbapi.com/).
Browse movies, search by title, view full details, and save favorites
that persist in `localStorage`.

## Features

- **Browse** — responsive grid showing poster, title, release year, and rating.
- **Search** — debounced search-as-you-type by title.
- **Details** — dedicated detail page with overview, genres, runtime, and rating.
- **Favorites** — add/remove favorites, persisted in `localStorage` across reloads.
- **States** — loading spinner, error message with retry, and an empty-results message.
- **Pagination** — manual Previous/Next buttons, exactly 12 results per page (no infinite scroll).

## Tech stack

- Next.js 14 (App Router), React 18
- Tailwind CSS
- OMDb API, called through two small Next.js API routes (`/api/movies`,
  `/api/movies/[id]`) so the API key stays server-side and never reaches the browser.

## Run it locally

**1. Install dependencies**

```bash
npm install
```

**2. Get a free OMDb API key**

1. Go to https://www.omdbapi.com/apikey.aspx
2. Select the **FREE** tier (1,000 requests/day) and enter your email.
3. OMDb emails you a key within a couple of minutes (check spam if it's slow).
4. Click the activation link in that email — the key won't work until activated.

**3. Add the key**

Copy the example env file and paste your key in:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` so it looks like:

```
OMDB_API_KEY=your_real_key_here
```

**4. Run the dev server**

```bash
npm run dev
```

Open http://localhost:3000.

## Deploying (Vercel)

1. Push this repo to GitHub (see naming note below).
2. Go to https://vercel.com/new and import the repo.
3. In **Project Settings → Environment Variables**, add:
   - `OMDB_API_KEY` = your OMDb key
4. Deploy. Vercel auto-detects Next.js, no build config needed.

(Netlify works the same way — add `OMDB_API_KEY` as an environment variable
in Site settings → Environment variables, and use the Next.js Netlify
plugin if prompted.)

## Project structure

```
app/
  page.js                 Home page: browse, search, pagination
  movie/[id]/page.js       Movie detail page
  favorites/page.js        Saved favorites
  api/movies/route.js      Server route: browse / search, 12-per-page
  api/movies/[id]/route.js Server route: movie details
  layout.js                 Root layout, fonts, providers, nav, footer
components/                 UI components (cards, grid, pagination, states...)
context/FavoritesContext.js localStorage-backed favorites state
lib/omdb.js                  Server-only OMDb fetch, normalization, and pagination logic
lib/api.js                   Client-side fetch helpers for our own API routes
```

## Notes on the pagination logic

OMDb's search endpoint always returns 10 results per page and that page size
can't be changed. Since this app must show exactly 12 per page, `lib/omdb.js`
works out which one or two underlying OMDb pages overlap the requested
12-item window, fetches those, concatenates them, and slices out exactly 12
items. This keeps pagination accurate at every boundary.

## Why OMDb instead of TMDB

This app originally targeted TMDB, but TMDB was unreachable during
development, so it was switched to OMDb instead — both are free public
movie APIs and the brief allows either. A few things had to be worked around
because OMDb's API shape is different from TMDB's:

- OMDb has no "popular/trending" endpoint — it's search-only. The browse
  grid is powered by a broad default search term (`"movie"`) instead of a
  curated popular list.
- OMDb's search results don't include a rating — only the detail lookup
  does. To show a rating on the browse grid, each page fetches full details
  for its 12 items in parallel and merges the rating in.
- OMDb returns a release year only (no month/day) and an absolute poster
  URL (instead of a relative path you build yourself), which is handled in
  the normalization layer in `lib/omdb.js`.

## Data source

This app uses the [OMDb API](https://www.omdbapi.com/). Data is sourced
from IMDb via OMDb's free tier.
# movie-finder-anushka
