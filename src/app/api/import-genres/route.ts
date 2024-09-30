import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/db"; // Ensure this is the instance of your Drizzle ORM
import { eq } from "drizzle-orm";
import { movieGenres, tvGenres } from "@/db/schema"; // Import the correct schema

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

export async function GET() {
  try {
    const movieGenresResponse = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const tvGenresResponse = await axios.get(
      "https://api.themoviedb.org/3/genre/tv/list?language=en",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const movieGenresData = movieGenresResponse.data.genres;
    const tvGenresData = tvGenresResponse.data.genres;

    // Insert movie genres using Drizzle ORM
    for (const genre of movieGenresData) {
      const existingGenre = await db
        .select()
        .from(movieGenres as any)
        .where(eq(movieGenres.id, genre.id) as any)
        .execute();

      if (!existingGenre) {
        await db
          .insert(movieGenres as any)
          .values({ id: genre.id, name: genre.name })
          .execute();
      }
    }

    for (const genre of tvGenresData) {
      const existingGenre = await db
        .select()
        .from(tvGenres as any)
        .where(eq(tvGenres.id, genre.id) as any)
        .execute();

      if (!existingGenre) {
        await db
          .insert(tvGenres as any)
          .values({ id: genre.id, name: genre.name })
          .execute();
      }
    }

    console.log("Genres import completed.");
    return NextResponse.json({
      message: "Genres import completed successfully",
    });
  } catch (error) {
    console.error("Error importing genres:", error);
    return NextResponse.json(
      { message: "Error importing genres", error },
      { status: 500 }
    );
  }
}
