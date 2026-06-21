# AI Log

## Tools Used

* **Claude** (Anthropic) used to build the Next.js app. It also used to write the API routes and components. also used to test the production build for errors before submitting it.

## Best Prompts

1. **"Build a Movie Discovery App in Next.js using a public movie API. Pagination must be manual Previous/Next with 12 results per page; no infinite scroll. and please try i will be getting no errors while running this app."**

I think this prompt worked well. It clearly stated that we need 12 results per page. This is a detail to miss. Usually these APIs return a fixed page size of 20 or 10.. Mentioning this upfront helped. It ensured that the pagination logic was created with this constraint in mind from the start. So we did not have to rewrite it

2. **"Keep the movie API key server-side; don’t expose it to the browser."**

This prompt guided the design. We created two Next.js API routes (`/api/movies` `/api/movies/[id]`). These routes act as proxies for the movie API. They do not call it directly from client components. This approach keeps things cleaner. It prevents including a key in client-side JavaScript. The Movie Discovery App uses these routes to get movie data.

3. **"Run a production build. Fix whatever breaks before handing this off."**

This prompt identified two issues. These issues could have turned into problems during deployment. The pinned Next.js version had a known security issue. We updated it to the patched 14.x. Also `/font/google`’s font fetch at build time depends on network access. It fails in environments. We changed this to a <link>` tag. Now the build does not rely on reaching Google Fonts during the build process. The Movie Discovery App uses this updated version.

## What I Fixed Manually

* The Movie Discovery App was using TMDB.. Tmdb was unreachable partway through. So we had to redirect the app to OMDb. OMDb has an API structure. It does not have a /trending endpoint. It does not have a rating in search results. It returns 10 results per page of 20. It returns a year instead of a full date. We had to account for each of these differences. We had to change the default browse query. We had to change the rating lookup per item. We had to normalize the date/poster. The Movie Discovery App uses OMDb now.

* The initial pagination method was simple. It passed the page number to the providers `page` parameter.. This would have returned the provider’s default page size. We needed 12 results per page. So we fixed this. We created a windowing function (`lib/omdb.js`). This function determines which provider page(s) overlap our 12-item window. It fetches them. fetches exactly 12 items. The Movie Discovery App uses this function now.

* I tested the completed Movie Discovery App by myself. I verified browse, search, pagination, movie details, favorites, loading/error states and the deployed build. I configured my own OMDb API key. I updated the footer marker, with my name. 