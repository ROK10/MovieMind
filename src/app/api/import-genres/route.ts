import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/app/server/db";

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

    // Insert movie genres using Prisma
    for (const genre of movieGenresData) {
      await db.movieGenres.upsert({
        where: { id: genre.id },
        update: { name: genre.name },
        create: { id: genre.id, name: genre.name },
      });
    }

    // Insert TV show genres using Prisma
    for (const genre of tvGenresData) {
      await db.tvShowGenres.upsert({
        where: { id: genre.id },
        update: { name: genre.name },
        create: { id: genre.id, name: genre.name },
      });
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
