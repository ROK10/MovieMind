import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/app/server/db";

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

export async function GET() {
  try {
    const [movieGenresResponse, tvGenresResponse] = await Promise.all([
      axios.get("https://api.themoviedb.org/3/genre/movie/list?language=en", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      }),
      axios.get("https://api.themoviedb.org/3/genre/tv/list?language=en", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      }),
    ]);

    const movieGenresData = movieGenresResponse.data.genres;
    const tvGenresData = tvGenresResponse.data.genres;

    // Combine movie and TV genres to ensure uniqueness
    const allGenresData = [...movieGenresData, ...tvGenresData];

    // Create a map to store unique genres by ID
    const uniqueGenresMap = new Map<number, string>();

    // Populate the map with genres
    allGenresData.forEach((genre: { id: number; name: string }) => {
      uniqueGenresMap.set(genre.id, genre.name);
    });

    // Convert the map back to an array
    const uniqueGenresData = Array.from(uniqueGenresMap, ([id, name]) => ({
      id,
      name,
    }));

    // Check if db.genre is defined
    if (!db.genre) {
      console.error(
        "db.genre is undefined. Available models are:",
        Object.keys(db)
      );
      throw new Error("Model 'genre' is undefined in Prisma Client.");
    }

    // Insert genres using Prisma
    await Promise.all(
      uniqueGenresData.map((genre: { id: number; name: string }) =>
        db.genre.upsert({
          where: { id: genre.id },
          update: { name: genre.name },
          create: { id: genre.id, name: genre.name },
        })
      )
    );

    console.log("Genres import completed.");
    return NextResponse.json({
      message: "Genres import completed successfully",
    });
  } catch (error) {
    console.error("Error importing genres:", error);
    return NextResponse.json(
      {
        message: "Error importing genres",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
