// app/api/movies/[id]/route.js
import { NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/omdb";

export async function GET(_request, { params }) {
  try {
    const movie = await getMovieDetails(params.id);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    }
    return NextResponse.json(movie);
  } catch (err) {
    console.error("[/api/movies/[id]] error:", err.message);
    return NextResponse.json(
      { error: "Could not reach the movie database. Please try again." },
      { status: 502 }
    );
  }
}
