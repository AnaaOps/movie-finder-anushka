// app/api/movies/route.js
import { NextResponse } from "next/server";
import { getPopular, searchMovies } from "@/lib/omdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || "";
  const page = searchParams.get("page") || "1";

  try {
    const data = query
      ? await searchMovies(query, page)
      : await getPopular(page);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/movies] error:", err.message);
    return NextResponse.json(
      { error: "Could not reach the movie database. Please try again." },
      { status: 502 }
    );
  }
}
