import { NextResponse } from "next/server";
import axios from "axios";
import { AppDataSource } from "../../../db/data-source";
import { Genre } from "@/db/entities/Genre";

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

    const genresData = [
      ...movieGenresResponse.data.genres,
      ...tvGenresResponse.data.genres,
    ];

    await AppDataSource.initialize();

    for (const genre of genresData) {
      const existingGenre = await AppDataSource.getRepository(Genre).findOne({
        where: { id: genre.id },
      });

      if (!existingGenre) {
        const newGenre = AppDataSource.getRepository(Genre).create({
          id: genre.id,
          name: genre.name,
        });
        await AppDataSource.getRepository(Genre).save(newGenre);
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
