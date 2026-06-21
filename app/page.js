"use client";

import { useEffect, useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { fetchMovies } from "@/lib/api";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async (currentQuery, currentPage) => {
    setStatus("loading");
    try {
      const data = await fetchMovies({ query: currentQuery, page: currentPage });
      setMovies(data.results || []);
      setTotalPages(data.totalPages || 1);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message || "Could not load movies. Please try again.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load(query, page);
  }, [query, page, load]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1); // reset to page 1 whenever the search term changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-display text-3xl tracking-marquee text-ink sm:text-4xl">
          {query ? "SEARCH RESULTS" : "NOW SHOWING"}
        </h1>
        <SearchBar initialValue={query} onSearch={handleSearch} />
      </div>

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={() => load(query, page)} />
      )}

      {status === "success" && movies.length === 0 && <EmptyState query={query} />}

      {status === "success" && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
