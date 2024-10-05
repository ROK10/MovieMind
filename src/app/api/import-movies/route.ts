import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/app/server/db";

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const START_PAGE = 1; // Define the start page
const END_PAGE = 5; // Define the end page

export async function GET() {
  try {
    for (let page = START_PAGE; page <= END_PAGE; page++) {
      const moviesResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=en&page=${page}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          },
        }
      );

      const moviesData = moviesResponse.data.results;

      for (const movie of moviesData) {
        console.log("movie", movie.id);
        // Check if the movie already exists in the database
        const existingMovie = await db.movie.findUnique({
          where: { tmdbId: movie.id },
        });

        if (!existingMovie) {
          // Insert the movie if it doesn't exist
          const createdMovie = await db.movie.create({
            data: {
              tmdbId: movie.id,
              title: movie.title,
              overview: movie.overview,
              original_language: movie.original_language,
              original_title: movie.original_title,
              popularity: movie.popularity,
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              release_date: movie.release_date
                ? new Date(movie.release_date)
                : new Date(0),
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path || null,
              adult: movie.adult,
              video: movie.video,
            },
          });

          // Associate genres with the movie
          await Promise.all(
            movie.genre_ids.map(async (genreId: number) => {
              // Ensure the genre exists
              const genre = await db.genre.findUnique({
                where: { id: genreId },
              });

              if (genre) {
                await db.movie_genre.create({
                  data: {
                    movie_id: createdMovie.id,
                    genre_id: genre.id,
                  },
                });
              } else {
                console.warn(
                  `Genre with ID ${genreId} not found in the database.`
                );
              }
            })
          );
        }
      }
    }

    console.log("Movies import completed.");
    return NextResponse.json({
      message: "Movies import completed successfully",
    });
  } catch (error) {
    console.error("Error importing movies:", error);
    return NextResponse.json(
      {
        message: "Error importing movies",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
